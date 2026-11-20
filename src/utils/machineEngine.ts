import {
  DriveCategory,
  MachineConfigRow,
  TRACTION_MACHINES,
  TractionMachine,
} from '../data/machines';

export interface ShaftRequirements {
  driveType: 'all' | DriveCategory;
  dutyLoadKg: number;
  speedMs: number;
  travelHeightM: number;
  roping: 'any' | '1:1' | '2:1';
}

export interface MachineRecommendation {
  machine: TractionMachine;
  matchedConfig: MachineConfigRow;
  loadHeadroomPct: number;
  netLoadAfterRopeKg: number;
  estimatedRopeWeightKg: number;
  sheaveRpm: number;
  fitScore: number;
}

export interface EnergyComparison {
  gearedAnnualKwh: number;
  gearlessAnnualKwh: number;
  annualSavingsKwh: number;
  savingsPercent: number;
  co2ReductionKg: number;
}

export interface SimulatorMetrics {
  sheaveRpm: number;
  ropeSpeedMs: number;
  estimatedPowerKw: number;
  estimatedNoiseDb: number;
  efficiencyPct: number;
  motorTorqueNm: number;
  ropingLabel: '1:1' | '2:1';
  machineRoomNeeded: boolean;
}

export interface RfqPayload {
  fullName: string;
  company: string;
  email: string;
  phone: string;
  city: string;
  selectedModels: string[];
  dutyLoadKg: string;
  travelHeightM: string;
  notes: string;
}

export interface RfqValidationResult {
  valid: boolean;
  errors: Partial<Record<keyof RfqPayload, string>>;
}

/**
 * Estimates suspension steel rope weight based on rope diameter, groove count,
 * travel height, and roping factor (per PDF Page 4 guidance: subtract rope weight
 * from listed loads to determine net payload).
 */
export function estimateRopeWeightKg(
  ropeSpec: string,
  grooves: string,
  travelHeightM: number,
  roping: '1:1' | '2:1'
): number {
  const ropeDiaMm = ropeSpec.includes('13') ? 13 : ropeSpec.includes('10') ? 10 : 8;
  // Standard steel wire rope linear mass (kg/m)
  const kgPerMeter = ropeDiaMm === 13 ? 0.62 : ropeDiaMm === 10 ? 0.37 : 0.24;
  const grooveMatch = grooves.match(/\d+/);
  const grooveCount = grooveMatch ? parseInt(grooveMatch[0], 10) : 4;
  const ropingMultiplier = roping === '2:1' ? 2 : 1;
  // Active hanging rope length approximates travel + overhead (~4m)
  const effectiveLengthM = Math.max(6, travelHeightM) + 4;
  return Math.round(kgPerMeter * grooveCount * effectiveLengthM * ropingMultiplier * 0.5);
}

/**
 * Computes traction sheave angular speed (RPM) from cabin speed, roping ratio,
 * and traction sheave diameter in millimeters.
 */
export function computeSheaveRpm(
  cabinSpeedMs: number,
  sheaveMm: number,
  roping: '1:1' | '2:1'
): number {
  if (sheaveMm <= 0 || cabinSpeedMs <= 0) return 0;
  const ropingFactor = roping === '2:1' ? 2 : 1;
  const ropeLinearSpeedMs = cabinSpeedMs * ropingFactor;
  const circumferenceM = Math.PI * (sheaveMm / 1000);
  return Math.round((ropeLinearSpeedMs / circumferenceM) * 60 * 10) / 10;
}

/**
 * Matches and ranks KAYNOXX traction machines against elevator shaft specifications.
 */
export function recommendMachines(
  req: ShaftRequirements,
  catalog: TractionMachine[] = TRACTION_MACHINES
): MachineRecommendation[] {
  const results: MachineRecommendation[] = [];

  for (const machine of catalog) {
    if (req.driveType !== 'all' && machine.category !== req.driveType) {
      continue;
    }

    // Find all configurations on this machine that satisfy duty load, speed, travel, and roping
    const viableConfigs = machine.configs.filter((cfg) => {
      const meetsLoad = cfg.loadKg >= req.dutyLoadKg;
      const meetsSpeed = cfg.speedMs >= req.speedMs - 0.01;
      const meetsTravel = cfg.maxTravelM >= req.travelHeightM;
      const meetsRoping = req.roping === 'any' || cfg.roping === req.roping;
      return meetsLoad && meetsSpeed && meetsTravel && meetsRoping;
    });

    if (viableConfigs.length === 0) continue;

    // Pick the tightest / most energy-efficient viable configuration on this machine
    viableConfigs.sort((a, b) => {
      const loadDiff = a.loadKg - b.loadKg;
      if (loadDiff !== 0) return loadDiff;
      const speedDiff = a.speedMs - b.speedMs;
      if (speedDiff !== 0) return speedDiff;
      return a.powerKw - b.powerKw;
    });

    const best = viableConfigs[0];
    const headroomPct = Math.round(((best.loadKg - req.dutyLoadKg) / Math.max(1, req.dutyLoadKg)) * 100);
    const ropeWt = estimateRopeWeightKg(best.ropeSpec, best.grooves, req.travelHeightM, best.roping);
    const netLoad = Math.max(0, best.loadKg - ropeWt);
    const rpm = computeSheaveRpm(best.speedMs, best.sheaveMm, best.roping);

    // Lower score = closer, more economical match (penalize extreme oversizing)
    const oversizePenalty = Math.abs(best.loadKg - req.dutyLoadKg) / Math.max(1, req.dutyLoadKg);
    const speedPenalty = Math.abs(best.speedMs - req.speedMs) * 0.4;
    const gearlessBonus = machine.category === 'gearless' ? -0.05 : 0;
    const fitScore = Math.max(0, Math.round((100 - oversizePenalty * 40 - speedPenalty * 25 - gearlessBonus * 100) * 10) / 10);

    results.push({
      machine,
      matchedConfig: best,
      loadHeadroomPct: headroomPct,
      netLoadAfterRopeKg: netLoad,
      estimatedRopeWeightKg: ropeWt,
      sheaveRpm: rpm,
      fitScore,
    });
  }

  return results.sort((a, b) => {
    // Primary sort: smallest load headroom that still covers duty load, then power
    if (a.matchedConfig.loadKg !== b.matchedConfig.loadKg) {
      return a.matchedConfig.loadKg - b.matchedConfig.loadKg;
    }
    return a.matchedConfig.powerKw - b.matchedConfig.powerKw;
  });
}

/**
 * Estimates annual energy consumption & savings switching from Worm-Geared
 * (efficiency ~0.62–0.70 incl. gearbox) to Gearless PMSM (~0.88–0.92).
 */
export function calculateEnergyComparison(
  dutyLoadKg: number,
  speedMs: number,
  tripsPerDay: number = 350,
  avgTravelM: number = 15
): EnergyComparison {
  const gravity = 9.81;
  // Counterweight = 50% (per PDF Page 4) -> average unbalanced load ~ 0.35 * Q across mixed trips
  const avgUnbalancedKg = dutyLoadKg * 0.35;
  const mechanicalWorkJ = avgUnbalancedKg * gravity * avgTravelM;
  const mechanicalKwhPerTrip = mechanicalWorkJ / 3_600_000;

  // Geared worm gearbox + AC induction motor combined efficiency ~ 0.58; Gearless PMSM ~ 0.88
  const gearedEfficiency = 0.58;
  const gearlessEfficiency = 0.88;
  const speedMultiplier = 0.85 + speedMs * 0.15;

  const annualTrips = tripsPerDay * 365;
  // Include standby + acceleration overhead factor (1.35x)
  const gearedAnnualKwh = Math.round((mechanicalKwhPerTrip / gearedEfficiency) * annualTrips * 1.35 * speedMultiplier + 620);
  const gearlessAnnualKwh = Math.round((mechanicalKwhPerTrip / gearlessEfficiency) * annualTrips * 1.18 * speedMultiplier + 240);
  const annualSavingsKwh = Math.max(0, gearedAnnualKwh - gearlessAnnualKwh);
  const savingsPercent = gearedAnnualKwh > 0 ? Math.round((annualSavingsKwh / gearedAnnualKwh) * 100) : 0;
  // India grid emission factor ~0.71 kg CO2/kWh
  const co2ReductionKg = Math.round(annualSavingsKwh * 0.71);

  return {
    gearedAnnualKwh,
    gearlessAnnualKwh,
    annualSavingsKwh,
    savingsPercent,
    co2ReductionKg,
  };
}

/**
 * Computes real-time physics telemetry for the interactive SVG Elevator Traction Simulator.
 */
export function computeSimulatorMetrics(
  mode: DriveCategory,
  dutyLoadKg: number,
  speedMs: number
): SimulatorMetrics {
  const ropingLabel: '1:1' | '2:1' = mode === 'gearless' ? '2:1' : '1:1';
  const sheaveMm = mode === 'gearless' ? 320 : 530;
  const sheaveRpm = computeSheaveRpm(speedMs, sheaveMm, ropingLabel);
  const ropeSpeedMs = Math.round(speedMs * (ropingLabel === '2:1' ? 2 : 1) * 100) / 100;

  // Mechanical shaft power P = (0.5 * Q * g * v) / (1000 * eta)
  const eta = mode === 'gearless' ? 0.90 : 0.72;
  const estimatedPowerKw = Math.round(((0.5 * dutyLoadKg * 9.81 * speedMs) / (1000 * eta)) * 10) / 10;

  // Torque at sheave: T = P_watts / omega
  const omega = (sheaveRpm * 2 * Math.PI) / 60;
  const motorTorqueNm = omega > 0 ? Math.round((estimatedPowerKw * 1000) / omega) : 0;

  // Typical operating acoustic levels (dBA at 1m)
  const estimatedNoiseDb = mode === 'gearless'
    ? Math.round(48 + speedMs * 4)
    : Math.round(61 + speedMs * 6);

  return {
    sheaveRpm,
    ropeSpeedMs,
    estimatedPowerKw: Math.max(1.2, estimatedPowerKw),
    estimatedNoiseDb,
    efficiencyPct: Math.round(eta * 100),
    motorTorqueNm,
    ropingLabel,
    machineRoomNeeded: mode === 'geared',
  };
}

/**
 * Filters the catalog for the main product showcase grid.
 */
export function filterCatalog(
  catalog: TractionMachine[],
  category: 'all' | DriveCategory,
  searchQuery: string,
  applicationFilter: string
): TractionMachine[] {
  const q = searchQuery.trim().toLowerCase();
  return catalog.filter((m) => {
    if (category !== 'all' && m.category !== category) return false;
    if (applicationFilter !== 'all' && m.applicationClass !== applicationFilter) return false;
    if (!q) return true;
    return (
      m.model.toLowerCase().includes(q) ||
      m.tagline.toLowerCase().includes(q) ||
      m.powerRangeLabel.toLowerCase().includes(q) ||
      String(m.dutyLoadMaxKg).includes(q) ||
      String(m.maxStaticLoadKg).includes(q)
    );
  });
}

/**
 * Validates B2B Request-For-Quote inquiries before submission.
 */
export function validateRfqForm(payload: RfqPayload): RfqValidationResult {
  const errors: Partial<Record<keyof RfqPayload, string>> = {};

  if (!payload.fullName.trim() || payload.fullName.trim().length < 2) {
    errors.fullName = 'Please enter your full name.';
  }
  if (!payload.company.trim()) {
    errors.company = 'Please enter your company or elevator contractor name.';
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(payload.email.trim())) {
    errors.email = 'Please enter a valid business email address.';
  }
  const digits = payload.phone.replace(/\D/g, '');
  if (digits.length < 8 || digits.length > 15) {
    errors.phone = 'Please enter a valid phone or WhatsApp number (8–15 digits).';
  }
  if (!payload.city.trim()) {
    errors.city = 'Please enter your city or project location.';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Generates a plain-text technical specification sheet for quick download.
 */
export function formatSpecSheetText(machine: TractionMachine): string {
  const header = [
    `KARMA ENTERPRISES — KAYNOXX ELEVATOR TRACTION MACHINE DATASHEET`,
    `===============================================================`,
    `Model:             ${machine.model} (${machine.category === 'geared' ? 'Geared Worm Traction' : 'Gearless MRL PMSM'})`,
    `Application:       ${machine.applicationClass}`,
    `Max Static Load:   ${machine.maxStaticLoadKg} kg`,
    `Duty Load Range:   ${machine.dutyLoadMinKg}${machine.dutyLoadMaxKg !== machine.dutyLoadMinKg ? `–${machine.dutyLoadMaxKg}` : ''} kg`,
    `Rated Speed:       ${machine.speedMinMs}${machine.speedMaxMs !== machine.speedMinMs ? `–${machine.speedMaxMs}` : ''} m/s`,
    `Power Range:       ${machine.powerRangeLabel}`,
    `Supply Voltage:    ${machine.voltage}`,
    `Brake Voltage:     ${machine.brakeVoltage}`,
    `Sheave Options:    ${machine.sheaveOptionsMm.map((s) => `Φ${s} mm`).join(', ')}`,
    machine.oilCapacityLtr ? `Oil Capacity:      ${machine.oilCapacityLtr} Ltr` : `Lubrication:       Oil-Free Sealed Bearings`,
    `Machine Weight:    ${machine.weightKg} kg (Approx)`,
    `Dimensions (L×W×H):${machine.dimensionsMm} mm`,
    ``,
    `PERFORMANCE CONFIGURATIONS`,
    `------------------------------------------------------`,
  ];

  const rows = machine.configs.map(
    (c, idx) =>
      `${idx + 1}. Load: ${c.loadKg} kg | Roping: ${c.roping} | Speed: ${c.speedMs.toFixed(2)} m/s | Travel: <=${c.maxTravelM} m | Sheave: Φ${c.sheaveMm} mm | Rope: ${c.ropeSpec} × ${c.grooves} grv | Power: ${c.powerKw} kW${c.amp ? ` | Amp: ${c.amp} A` : ''} | ${c.rating} | ${c.ipClass}`
  );

  const footer = [
    ``,
    `Notes: Listed loads do not include rope weight. Counterweight: 50%.`,
    `Manufacturer: Karma Enterprises (KAYNOXX Elevator Traction Machine)`,
    `Address: 177/7, Shed-B, Phase 1, Opp. Ingersoll Rand, GIDC, Naroda, Ahmedabad - 382330, Gujarat, India`,
    `Phone: +91 9925577565 | Email: kaynoxx-karma@gmail.com`,
  ];

  return [...header, ...rows, ...footer].join('\n');
}
