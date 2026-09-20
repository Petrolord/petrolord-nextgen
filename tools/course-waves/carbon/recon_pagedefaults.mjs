// RECON F1 reproduction: the Carbon Studio's page defaults run through the MD5-0 Suite
// context logic (Suite origin/main 60871c1e8, src/contexts/CarbonAbatementContext.jsx) on engines f0aef14.
const E = `${process.env.MD_ENGINES || '/root/wt-et-carbon-nextgen/packages/engines'}/engines/downstream`;
const CA = await import(`${E}/carbonAbatement.js`);
const g = CA.makeGwpSet({ label: null, values: {} });
const comb = CA.combustionCo2FromCarbon({ fuelKmolPerYear: 620000, carbonPerKmolFuel: 1.12, destructionEfficiencyFraction: 1 });
const flare = CA.combustionCo2FromCarbon({ fuelKmolPerYear: 45000, carbonPerKmolFuel: 1.4, destructionEfficiencyFraction: null });
const atom = (label, r, gas, t) => (!r || r.error || !Number.isFinite(t) || t === 0) ? [] : [CA.emissionLine({ label, scope: 1, activity: t, activityUnit: `t ${gas}`, factor: CA.makeFactor({ label: 'x', value: 1, unit: 'x', gas, source: 'Atom balance', version: 'n/a' }), gwpSet: g })];
const lines = [...atom('heat CO2', comb, 'CO2', comb.co2Tonnes), ...atom('heat CH4', comb, 'CH4', comb.ch4Tonnes), ...atom('flare CO2', flare, 'CO2', flare.co2Tonnes), ...atom('flare CH4', flare, 'CH4', flare.ch4Tonnes),
  CA.emissionLine({ label: 'Vented', scope: 1, activity: 180, factor: CA.makeFactor({ label: 'v', value: 1, unit: 'tCH4/t', gas: 'CH4' }), gwpSet: g }),
  CA.emissionLine({ label: 'Power', scope: 2, activity: 42000, factor: CA.makeFactor({ label: 'p', value: null, unit: 'tCO2e/MWh', gas: 'CO2' }), gwpSet: g })];
const inv = CA.buildInventory({ lines, gwpSet: g });
const M = [['Tune', 20000, 150000, 0, 900, 5, 'heaters'], ['Traps', 60000, 240000, 0, 1400, 3, 'steam'], ['HI', 3200000, 480000, 0, 4000, 15, 'heaters'], ['FGR', 5500000, 300000, 120000, 9000, 15, 'flare']]
  .map(([label, capitalCost, annualSavings, annualCost, tonnesAbatedPerYear, lifeYears, a]) => CA.abatementCost({ label, capitalCost, annualSavings, annualCost, tonnesAbatedPerYear, lifeYears, discountRate: 0.1, actsOn: [a] }));
const co2e = (r) => (!r || r.error) ? null : r.co2Tonnes + (r.ch4Tonnes > 0 ? NaN : 0);
const src = {}; const h = co2e(comb); if (h !== null) src.heaters = h; const f = co2e(flare); if (f !== null) src.flare = f;
const target = inv.totalTonnes > 0 ? inv.totalTonnes * 30 / 100 : null;
const cv = CA.abatementCurve({ measures: M, sourceEmissions: src, targetTonnes: target });
console.log(JSON.stringify({ flareError: flare.error, inventoryTotal: inv.totalTonnes, reportable: inv.reportable, sourceEmissions: src, target, total: cv.totalAbatementTonnes, meetsTarget: cv.meetsTarget, targetBasis: cv.targetBasis, overClaims: cv.overClaims, interactions: cv.interactions.map(i => i.sourceId) }, null, 1));
