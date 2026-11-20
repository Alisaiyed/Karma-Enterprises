import test from 'node:test';
import assert from 'node:assert/strict';
import { TRACTION_MACHINES } from '../data/machines';
import {
  calculateEnergyComparison,
  computeSheaveRpm,
  computeSimulatorMetrics,
  estimateRopeWeightKg,
  filterCatalog,
  formatSpecSheetText,
  recommendMachines,
  validateRfqForm,
} from './machineEngine';

test('catalog contains all 18 authentic KAYNOXX machines (6 KING + 12 PRINCE)', () => {
  assert.equal(TRACTION_MACHINES.length, 18);
  const geared = TRACTION_MACHINES.filter((m) => m.category === 'geared');
  const gearless = TRACTION_MACHINES.filter((m) => m.category === 'gearless');
  assert.equal(geared.length, 6);
  assert.equal(gearless.length, 12);

  for (const m of TRACTION_MACHINES) {
    assert.ok(m.configs.length >= 1, `${m.model} must have at least one config row`);
    assert.ok(m.maxStaticLoadKg >= 2000, `${m.model} static load should be realistic`);
    assert.ok(m.weightKg >= 100, `${m.model} weight should be realistic`);
  }
});

test('computeSheaveRpm accurately converts speed, roping, and sheave diameter to RPM', () => {
  // 1.0 m/s, 2:1 roping -> 2.0 m/s rope speed; sheave 320mm (circ = 1.0053m) -> ~119.4 RPM
  const rpm = computeSheaveRpm(1.0, 320, '2:1');
  assert.ok(rpm >= 119 && rpm <= 120, `Expected ~119.4 RPM, got ${rpm}`);

  // 1.0 m/s, 1:1 roping, sheave 530mm (circ = 1.665m) -> ~36.0 RPM
  const gearedRpm = computeSheaveRpm(1.0, 530, '1:1');
  assert.ok(gearedRpm >= 35.5 && gearedRpm <= 36.5, `Expected ~36.0 RPM, got ${gearedRpm}`);
});

test('recommendMachines returns accurate ranked matches for 1000kg @ 1.50 m/s gearless', () => {
  const matches = recommendMachines({
    driveType: 'gearless',
    dutyLoadKg: 1000,
    speedMs: 1.5,
    travelHeightM: 45,
    roping: '2:1',
  });

  assert.ok(matches.length >= 4, 'Should match PRINCE 2500 and higher models');
  assert.equal(matches[0].machine.id, 'prince-2500');
  assert.equal(matches[0].matchedConfig.loadKg, 1088);
  assert.equal(matches[0].matchedConfig.speedMs, 1.5);
  assert.ok(matches[0].netLoadAfterRopeKg < matches[0].matchedConfig.loadKg);
});

test('recommendMachines matches heavy 4000kg freight lift to KING 225', () => {
  const matches = recommendMachines({
    driveType: 'all',
    dutyLoadKg: 3500,
    speedMs: 0.5,
    travelHeightM: 25,
    roping: '2:1',
  });

  assert.equal(matches.length, 1);
  assert.equal(matches[0].machine.id, 'king-225');
});

test('calculateEnergyComparison demonstrates lower energy usage for gearless PMSM', () => {
  const cmp = calculateEnergyComparison(1000, 1.0, 400, 18);
  assert.ok(cmp.gearlessAnnualKwh < cmp.gearedAnnualKwh);
  assert.ok(cmp.annualSavingsKwh > 0);
  assert.ok(cmp.savingsPercent >= 25 && cmp.savingsPercent <= 60);
  assert.ok(cmp.co2ReductionKg > 0);
});

test('computeSimulatorMetrics reflects mechanical differences between geared and gearless', () => {
  const geared = computeSimulatorMetrics('geared', 680, 1.0);
  const gearless = computeSimulatorMetrics('gearless', 680, 1.0);

  assert.equal(geared.machineRoomNeeded, true);
  assert.equal(gearless.machineRoomNeeded, false);
  assert.equal(geared.ropingLabel, '1:1');
  assert.equal(gearless.ropingLabel, '2:1');
  assert.ok(gearless.estimatedNoiseDb < geared.estimatedNoiseDb);
  assert.ok(gearless.efficiencyPct > geared.efficiencyPct);
  assert.ok(gearless.estimatedPowerKw < geared.estimatedPowerKw);
});

test('estimateRopeWeightKg increases proportionally with travel height and roping', () => {
  const w1 = estimateRopeWeightKg('8 mm', '6', 30, '1:1');
  const w2 = estimateRopeWeightKg('8 mm', '6', 30, '2:1');
  assert.ok(Math.abs(w2 - w1 * 2) <= 1, `Expected 2:1 rope weight (${w2}) to be ~2x 1:1 (${w1})`);
  const wTall = estimateRopeWeightKg('8 mm', '6', 60, '2:1');
  assert.ok(wTall > w2);
});

test('filterCatalog filters by drive category, application, and search query', () => {
  const gearedOnly = filterCatalog(TRACTION_MACHINES, 'geared', '', 'all');
  assert.equal(gearedOnly.length, 6);

  const searchPrince2500 = filterCatalog(TRACTION_MACHINES, 'all', 'PRINCE 2500', 'all');
  assert.equal(searchPrince2500.length, 1);
  assert.equal(searchPrince2500[0].id, 'prince-2500');

  // Searching numeric capacity '2500' matches both PRINCE 2500 and PRINCE 3700 (2500 kg duty load)
  const searchCapacity = filterCatalog(TRACTION_MACHINES, 'all', '2500', 'all');
  assert.equal(searchCapacity.length, 2);

  const freight = filterCatalog(TRACTION_MACHINES, 'all', '', 'Heavy Freight');
  assert.ok(freight.length >= 4);
});

test('validateRfqForm rejects empty/invalid inputs and accepts valid engineering RFQ', () => {
  const bad = validateRfqForm({
    fullName: '',
    company: '',
    email: 'invalid-email',
    phone: '123',
    city: '',
    selectedModels: [],
    dutyLoadKg: '680',
    travelHeightM: '30',
    notes: '',
  });
  assert.equal(bad.valid, false);
  assert.ok(bad.errors.fullName);
  assert.ok(bad.errors.company);
  assert.ok(bad.errors.email);
  assert.ok(bad.errors.phone);
  assert.ok(bad.errors.city);

  const good = validateRfqForm({
    fullName: 'Rajesh Patel',
    company: 'Apex Elevators Pvt Ltd',
    email: 'rajesh@apexelevators.in',
    phone: '+91 9825012345',
    city: 'Ahmedabad',
    selectedModels: ['PRINCE 2000'],
    dutyLoadKg: '680',
    travelHeightM: '42',
    notes: 'Require 4 units for commercial tower.',
  });
  assert.equal(good.valid, true);
  assert.deepEqual(good.errors, {});
});

test('formatSpecSheetText includes official Karma Enterprises brand, model, and Ahmedabad contact details', () => {
  const king = TRACTION_MACHINES[0];
  const txt = formatSpecSheetText(king);
  assert.ok(txt.includes('KARMA ENTERPRISES'));
  assert.ok(txt.includes('KING 125'));
  assert.ok(txt.includes('Ahmedabad'));
  assert.ok(txt.includes('+91 9925577565'));
});
