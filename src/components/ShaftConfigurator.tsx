import React, { useMemo, useState } from 'react';
import { ArrowUpRight, Check, RotateCcw, Scale } from 'lucide-react';
import { DriveCategory, TractionMachine } from '../data/machines';
import {
  calculateEnergyComparison,
  recommendMachines,
} from '../utils/machineEngine';

interface ShaftConfiguratorProps {
  compareIds: string[];
  onToggleCompare: (machineId: string) => void;
  onInspectMachine: (machine: TractionMachine) => void;
  onAddToQuote: (modelName: string, loadKg?: number, travelM?: number) => void;
}

const PASSENGER_PRESETS = [
  { label: '4P · 272 kg', load: 272 },
  { label: '6P · 408 kg', load: 408 },
  { label: '8P · 544 kg', load: 544 },
  { label: '10P · 680 kg', load: 680 },
  { label: '16P · 1088 kg', load: 1088 },
  { label: '20P · 1360 kg', load: 1360 },
  { label: '29P · 2000 kg', load: 2000 },
  { label: 'Freight · 3000 kg', load: 3000 },
];

const TARGET_SPEEDS = [0.5, 0.65, 1.0, 1.5, 1.75];

export const ShaftConfigurator: React.FC<ShaftConfiguratorProps> = ({
  compareIds,
  onToggleCompare,
  onInspectMachine,
  onAddToQuote,
}) => {
  const [driveType, setDriveType] = useState<'all' | DriveCategory>('all');
  const [dutyLoadKg, setDutyLoadKg] = useState<number>(680);
  const [speedMs, setSpeedMs] = useState<number>(1.0);
  const [travelHeightM, setTravelHeightM] = useState<number>(30);
  const [roping, setRoping] = useState<'any' | '1:1' | '2:1'>('any');

  const recommendations = useMemo(
    () =>
      recommendMachines({
        driveType,
        dutyLoadKg,
        speedMs,
        travelHeightM,
        roping,
      }),
    [driveType, dutyLoadKg, speedMs, travelHeightM, roping]
  );

  const energy = useMemo(
    () => calculateEnergyComparison(dutyLoadKg, speedMs, 360, Math.max(10, Math.round(travelHeightM * 0.55))),
    [dutyLoadKg, speedMs, travelHeightM]
  );

  const handleReset = () => {
    setDriveType('all');
    setDutyLoadKg(680);
    setSpeedMs(1.0);
    setTravelHeightM(30);
    setRoping('any');
  };

  return (
    <section id="configurator" className="scroll-mt-16 bg-white py-14 sm:py-16 lg:py-20 border-b border-[#D8DCE3]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 pb-8 border-b border-[#E2E5EA]">
          <div>
            <p className="text-xs font-semibold text-[#5A606B] tracking-wide">
              Shaft Engineering Tool · Net Load &amp; Energy Analysis
            </p>
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-[#1F2124] tracking-tight mt-1">
              Interactive <span className="text-[#B5121B]">Machine Selector</span>
            </h2>
          </div>
          <p className="text-sm text-[#5A606B] max-w-lg leading-relaxed">
            Specify your hoistway duty load, rated speed, and travel rise to match verified KAYNOXX
            models, calculate net capacity after rope weight, and estimate annual PMSM energy savings.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Left Engineering Parameters Panel */}
          <div className="lg:col-span-5 bg-[#F4F5F7] border border-[#D8DCE3] rounded-[2px] p-4 sm:p-6 space-y-5 sm:space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-2xl font-bold text-[#1F2124]">
                Shaft Parameters
              </h3>
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#5A606B] hover:text-[#B5121B] cursor-pointer py-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            </div>

            {/* Drive Architecture */}
            <div>
              <span className="block text-xs font-semibold text-[#3A3F47] mb-2">
                Drive Type
              </span>
              <div className="grid grid-cols-3 gap-1 p-1 bg-white border border-[#D8DCE3] rounded-[2px]">
                {(
                  [
                    { id: 'all', label: 'Any Drive' },
                    { id: 'gearless', label: 'Gearless' },
                    { id: 'geared', label: 'Geared' },
                  ] as const
                ).map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setDriveType(opt.id)}
                    className={`py-2 px-1 text-xs font-semibold rounded-[2px] transition-colors cursor-pointer whitespace-nowrap ${
                      driveType === opt.id
                        ? 'bg-[#B5121B] text-white'
                        : 'text-[#3A3F47] hover:bg-[#F4F5F7]'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Duty Load Slider + Presets */}
            <div>
              <div className="flex items-baseline justify-between mb-2">
                <label htmlFor="selector-load-slider" className="text-xs font-semibold text-[#3A3F47]">
                  Required Duty Load
                </label>
                <span className="font-mono text-base font-bold text-[#B5121B] tabular-nums">
                  {dutyLoadKg.toLocaleString()} kg
                </span>
              </div>
              <input
                id="selector-load-slider"
                type="range"
                min={250}
                max={4000}
                step={25}
                value={dutyLoadKg}
                onChange={(e) => setDutyLoadKg(Number(e.target.value))}
                className="w-full accent-[#B5121B] cursor-pointer"
              />
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {PASSENGER_PRESETS.map((preset) => (
                  <button
                    key={preset.load}
                    type="button"
                    onClick={() => setDutyLoadKg(preset.load)}
                    className={`px-2.5 py-1 text-[11px] font-mono rounded border transition-colors cursor-pointer ${
                      dutyLoadKg === preset.load
                        ? 'bg-[#1F2124] text-white border-[#1F2124]'
                        : 'bg-white text-[#3A3F47] border-[#D4D8DF] hover:border-[#B5121B]'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Rated Speed Selector */}
            <div>
              <span className="block text-xs font-semibold text-[#3A3F47] mb-2">
                Minimum Rated Speed (m/s)
              </span>
              <div className="grid grid-cols-5 gap-1.5">
                {TARGET_SPEEDS.map((spd) => (
                  <button
                    key={spd}
                    type="button"
                    onClick={() => setSpeedMs(spd)}
                    className={`py-2 text-xs font-mono font-medium rounded border transition-colors tabular-nums cursor-pointer ${
                      speedMs === spd
                        ? 'bg-[#1F2124] text-white border-[#1F2124]'
                        : 'bg-white text-[#1F2124] border-[#D4D8DF] hover:border-[#B5121B]'
                    }`}
                  >
                    {spd.toFixed(2)}
                  </button>
                ))}
              </div>
            </div>

            {/* Travel Height + Roping Ratio */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="flex items-baseline justify-between mb-2">
                  <label htmlFor="selector-travel-slider" className="text-xs font-semibold text-[#3A3F47]">
                    Travel Height
                  </label>
                  <span className="font-mono text-sm font-semibold text-[#1F2124] tabular-nums">
                    {travelHeightM} m
                  </span>
                </div>
                <input
                  id="selector-travel-slider"
                  type="range"
                  min={10}
                  max={80}
                  step={5}
                  value={travelHeightM}
                  onChange={(e) => setTravelHeightM(Number(e.target.value))}
                  className="w-full accent-[#B5121B] cursor-pointer"
                />
                <div className="flex justify-between text-[11px] font-mono text-[#6B7280] mt-1">
                  <span>10 m (3F)</span>
                  <span>80 m (26F)</span>
                </div>
              </div>

              <div>
                <label htmlFor="selector-roping" className="block text-xs font-semibold text-[#3A3F47] mb-2">
                  Roping Factor
                </label>
                <select
                  id="selector-roping"
                  value={roping}
                  onChange={(e) => setRoping(e.target.value as 'any' | '1:1' | '2:1')}
                  className="w-full px-3 py-2 text-sm bg-white border border-[#D4D8DF] rounded-md text-[#1F2124] focus:outline-none focus:border-[#B5121B]"
                >
                  <option value="any">Any (1:1 or 2:1)</option>
                  <option value="2:1">2:1 Roping (Compact MRL / Heavy)</option>
                  <option value="1:1">1:1 Direct Roping (Geared)</option>
                </select>
              </div>
            </div>

            {/* Geared vs Gearless Annual Energy Savings Box */}
            <div className="pt-5 border-t border-[#D4D8DF]">
              <div className="flex items-baseline justify-between">
                <h4 className="font-display text-lg font-bold text-[#1F2124]">
                  Gearless PMSM Energy Advantage
                </h4>
                <span className="font-mono text-xs font-semibold text-[#B5121B] tabular-nums">
                  −{energy.savingsPercent}% kWh / yr
                </span>
              </div>
              <p className="text-xs text-[#5A606B] mt-1">
                Estimated annual electricity usage for a {dutyLoadKg} kg shaft at {speedMs.toFixed(2)} m/s (~360 trips/day):
              </p>

              <div className="mt-3 space-y-2.5 text-xs font-mono tabular-nums">
                <div>
                  <div className="flex justify-between gap-2 text-[#3A3F47] mb-1">
                    <span>Worm Geared (KING)</span>
                    <span>{energy.gearedAnnualKwh.toLocaleString()} kWh/yr</span>
                  </div>
                  <div className="h-2 bg-[#E2E5EA] overflow-hidden">
                    <div className="h-full bg-[#4B5563] w-full" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between gap-2 text-[#1F2124] font-semibold mb-1">
                    <span>Gearless PMSM (PRINCE)</span>
                    <span>{energy.gearlessAnnualKwh.toLocaleString()} kWh/yr</span>
                  </div>
                  <div className="h-2 bg-[#E2E5EA] overflow-hidden">
                    <div
                      className="h-full bg-[#B5121B] transition-all duration-300"
                      style={{
                        width: `${Math.max(15, Math.round((energy.gearlessAnnualKwh / Math.max(1, energy.gearedAnnualKwh)) * 100))}%`,
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-[#5A606B]">
                <span>Annual Savings: <strong className="text-[#1F2124] font-mono">{energy.annualSavingsKwh.toLocaleString()} kWh</strong></span>
                <span>CO₂ Cut: <strong className="text-[#1F2124] font-mono">{energy.co2ReductionKg.toLocaleString()} kg</strong></span>
              </div>
            </div>
          </div>

          {/* Right Live Engineering Matches */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#E2E5EA]">
              <h3 className="font-display text-2xl font-bold text-[#1F2124]">
                Recommended Models
              </h3>
              <span
                data-testid="configurator-match-count"
                className="font-mono text-xs text-[#5A606B] tabular-nums"
              >
                {recommendations.length} compatible configuration{recommendations.length === 1 ? '' : 's'} found
              </span>
            </div>

            {recommendations.length === 0 ? (
              <div className="bg-[#F4F5F7] border border-[#E2E5EA] rounded-lg p-8 text-center">
                <h4 className="font-display text-xl font-bold text-[#1F2124]">
                  No single standard configuration covers this exact combination
                </h4>
                <p className="text-sm text-[#5A606B] mt-2 max-w-md mx-auto">
                  For heavy loads above 2500 kg at speeds over 1.00 m/s or travel above 30 m on geared units,
                  relax the speed/drive filter or request a custom engineering proposal from our Ahmedabad plant.
                </p>
                <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="px-4 py-2 text-xs font-semibold text-white bg-[#1F2124] hover:bg-[#B5121B] rounded-md cursor-pointer"
                  >
                    Reset Parameters
                  </button>
                  <button
                    type="button"
                    onClick={() => onAddToQuote('Custom Engineering Spec', dutyLoadKg, travelHeightM)}
                    className="px-4 py-2 text-xs font-semibold text-[#B5121B] border border-[#B5121B] hover:bg-[#FEF2F2] rounded-md cursor-pointer"
                  >
                    Request Custom Spec
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {recommendations.slice(0, 5).map((rec, idx) => {
                  const isCompared = compareIds.includes(rec.machine.id);
                  const compareDisabled = !isCompared && compareIds.length >= 3;

                  return (
                    <div
                      key={rec.machine.id}
                      data-testid={`recommendation-${rec.machine.id}`}
                      className={`bg-white border rounded-[2px] p-4 sm:p-5 transition-colors ${
                        idx === 0 ? 'border-[#B5121B]' : 'border-[#D8DCE3]'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 items-start sm:items-center">
                        <div className="w-24 h-20 sm:w-28 sm:h-24 shrink-0 flex items-center justify-center">
                          <img
                            src={rec.machine.imageUrl}
                            alt={`KAYNOXX ${rec.machine.model}`}
                            referrerPolicy="no-referrer"
                            className="max-h-full max-w-full object-contain"
                          />
                        </div>

                        <div className="flex-1 min-w-0 w-full">
                          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[#5A606B]">
                            {idx === 0 && (
                              <>
                                <span className="font-semibold text-[#B5121B]">Best Fit</span>
                                <span aria-hidden="true">·</span>
                              </>
                            )}
                            <span>{rec.machine.category === 'geared' ? 'Geared KING' : 'Gearless PRINCE'}</span>
                            <span aria-hidden="true">·</span>
                            <span className="font-mono tabular-nums">Roping {rec.matchedConfig.roping}</span>
                            <span aria-hidden="true">·</span>
                            <span className="font-mono tabular-nums">+{rec.loadHeadroomPct}% load margin</span>
                          </div>

                          <h4 className="font-display text-2xl font-bold mt-0.5 leading-tight">
                            <span className="text-[#1F2124]">{rec.machine.series} </span>
                            <span className="text-[#B5121B]">{rec.machine.modelNumber}</span>
                          </h4>

                          {/* Engineering Metrics Grid */}
                          <dl className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                            <div>
                              <dt className="text-[#6B7280]">Rated / Net Load</dt>
                              <dd className="font-mono font-semibold text-[#1F2124] tabular-nums mt-0.5">
                                {rec.matchedConfig.loadKg} / {rec.netLoadAfterRopeKg} kg
                              </dd>
                            </div>
                            <div>
                              <dt className="text-[#6B7280]">Power / Speed</dt>
                              <dd className="font-mono font-semibold text-[#1F2124] tabular-nums mt-0.5">
                                {rec.matchedConfig.powerKw} kW · {rec.matchedConfig.speedMs.toFixed(2)} m/s
                              </dd>
                            </div>
                            <div>
                              <dt className="text-[#6B7280]">Sheave &amp; RPM</dt>
                              <dd className="font-mono font-semibold text-[#1F2124] tabular-nums mt-0.5">
                                Φ{rec.matchedConfig.sheaveMm} · {rec.sheaveRpm} RPM
                              </dd>
                            </div>
                            <div>
                              <dt className="text-[#6B7280]">Rope &amp; Est. Wt.</dt>
                              <dd className="font-mono font-semibold text-[#1F2124] tabular-nums mt-0.5">
                                {rec.matchedConfig.ropeSpec}×{rec.matchedConfig.grooves} (~{rec.estimatedRopeWeightKg} kg)
                              </dd>
                            </div>
                          </dl>
                        </div>
                      </div>

                      {/* Row Actions */}
                      <div className="mt-4 pt-3.5 border-t border-[#ECEEF2] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <span className="text-[11px] text-[#6B7280]">
                          Dimensions: <span className="font-mono text-[#3A3F47]">{rec.machine.dimensionsMm} mm</span> · Weight: <span className="font-mono text-[#3A3F47]">{rec.machine.weightKg} kg</span>
                        </span>

                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            type="button"
                            disabled={compareDisabled}
                            onClick={() => onToggleCompare(rec.machine.id)}
                            className={`inline-flex items-center gap-1 px-3 py-2 text-xs font-medium rounded-[2px] border transition-colors cursor-pointer ${
                              isCompared
                                ? 'bg-[#FEF2F2] border-[#B5121B] text-[#B5121B]'
                                : compareDisabled
                                ? 'border-[#E2E5EA] text-[#9CA3AF] cursor-not-allowed'
                                : 'border-[#C8CDD6] text-[#3A3F47] hover:border-[#1F2124]'
                            }`}
                          >
                            {isCompared ? <Check className="w-3.5 h-3.5" /> : <Scale className="w-3.5 h-3.5" />}
                            <span>{isCompared ? 'Compared' : 'Compare'}</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => onInspectMachine(rec.machine)}
                            className="inline-flex items-center gap-1 px-3 py-2 text-xs font-semibold text-[#1F2124] bg-[#F4F5F7] hover:bg-[#E2E5EA] rounded-[2px] transition-colors cursor-pointer"
                          >
                            <span>Inspect CAD</span>
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => onAddToQuote(rec.machine.model, dutyLoadKg, travelHeightM)}
                            className="px-3.5 py-2 text-xs font-semibold text-white bg-[#B5121B] hover:bg-[#8F0D14] rounded-[2px] transition-colors cursor-pointer"
                          >
                            Add to Quote
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
                {recommendations.length > 5 && (
                  <p className="text-xs text-[#5A606B] text-center pt-1">
                    Showing top 5 closest fits out of {recommendations.length} matching machines. Adjust load or drive filter to narrow further.
                  </p>
                )}
              </div>
            )}

            <p className="text-[11px] text-[#6B7280] leading-relaxed pt-2">
              Engineering Note (per KAYNOXX Technical Catalog): Listed duty loads do not include suspension rope weight.
              Net cabin capacity above accounts for estimated steel rope mass at 50% counterweight balance.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
