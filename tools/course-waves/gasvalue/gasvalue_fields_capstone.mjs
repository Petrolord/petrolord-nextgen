// THE GASVALUE CAPSTONE CONDITIONS. Three records, one a tier, none of them a
// teaching case:
//
//   ERIEMU   an invented flow station in Delta State flaring associated gas,
//            whose laboratory sheet sums to 0.992 (Associate: the gas by the
//            mole, its liquids, and the flare under the rule's two
//            efficiencies).
//   ADIBAWA  an invented gas parcel in Rivers State offered to a CNG developer,
//            with its reference plant, its costs, a declared counterfactual and
//            a credit test (Professional: the route's year, the capital, the
//            recovered share, the net abatement and the breakeven credit
//            price).
//   ASABA    an invented energy hub at Asaba, Delta State: an LPG vessel whose
//            fill limit is a filling density on water capacity, a vaporizer, a
//            bottling carousel, a CNG bank and cascade read on gauges, and a
//            taxi operator's switch to CNG (Expert).
//
// Nothing here is imported by gasvalue_dump.mjs, and nothing in
// gasvalue_fields.mjs is imported here. gate_capstone_leak.py sweeps both
// directions on every rebuild. Every figure is INVENTED and illustrative; no
// analysis, efficiency, GWP, price, cost, fill limit or vehicle figure is a
// published figure, a measured value or a regulation.
//
// EVERY GRADED FIELD IS A RETURN VALUE OF THE ENGINE (gasvalue_capstone.mjs),
// and an independent oracle reproduces every one of them (oracle_check.py).
// Nothing graded is a FINDINGS HELD item: the flare efficiencies (H1), the GWP
// (H4), the credit prices (H4) and the fill limit (H3) are each stated in the
// prompt as the record's own figure, never looked up; the unlit flare (H2) is
// not modelled and nothing graded depends on it. No compressor power is graded
// (FC3 owns it), and no NPV, IRR or Monte Carlo figure is graded.

/* ------------------------------------------------------------------ *
 * ERIEMU (Associate)
 * ------------------------------------------------------------------ */
/** The laboratory sheet, mole fractions as typed. It sums to 0.992. */
export const ERIEMU_GAS = [
  ['C1', 0.7215], ['C2', 0.0968], ['C3', 0.0634], ['IC4', 0.0142],
  ['NC4', 0.0236], ['C5', 0.0127], ['N2', 0.0231], ['CO2', 0.0367],
];
export const ERIEMU_FLARE = {
  volumeMMscfd: 12.4, onstreamDays: 347,
  flareDestructionEfficiency: 0.976, flareCombustionEfficiency: 0.961,
  gwpMethane: 28.7,
};

/* ------------------------------------------------------------------ *
 * ADIBAWA (Professional)
 * ------------------------------------------------------------------ */
export const ADIBAWA_GAS = [
  ['C1', 0.801], ['C2', 0.071], ['C3', 0.041], ['IC4', 0.009],
  ['NC4', 0.015], ['C5', 0.008], ['N2', 0.027], ['CO2', 0.028],
];
export const ADIBAWA_FLARE = {
  volumeMMscfd: 16.8, onstreamDays: 342,
  flareDestructionEfficiency: 0.968, flareCombustionEfficiency: 0.952,
  gwpMethane: 27.9,
};
/** The CNG route the developer bids. */
export const ADIBAWA_ROUTE = {
  id: 'cng', productUnitPerMscf: 17.2, productUnitLabel: 'kg CNG', recoveryFraction: 0.87,
  pricePerProductUnit: 0.43, referenceCapitalCost: 27000000, referenceCapacityMMscfd: 7,
  fixedOpexPerYear: 2100000, variableOpexPerMscf: 0.38,
};
export const ADIBAWA_COUNTERFACTUAL = {
  counterfactualLabel: 'CNG displacing diesel in Port Harcourt haulage',
  productCombustionTonnesCo2ePerYear: 236000, displacedFuelTonnesCo2ePerYear: 281000,
};
/** Credit prices in the order the bid team typed them, and the hurdle margin. */
export const ADIBAWA_CREDITS = { creditPrices: [30, 10, 20, 15], hurdleMarginPerYear: 39500000 };

/* ------------------------------------------------------------------ *
 * ASABA (Expert)
 * ------------------------------------------------------------------ */
/** The LPG blend by liquid volume, with the supplier's certificate figures. */
export const ASABA_LPG = [
  { code: 'propane', volumeFraction: 0.32, liquidDensityKgM3: 506, molarMassKgKmol: 44.096, latentHeatKJkg: 428 },
  { code: 'butane', volumeFraction: 0.68, liquidDensityKgM3: 581, molarMassKgKmol: 58.122, latentHeatKJkg: 383 },
];
/** The vessel: its fill limit is a filling density on water capacity, by weight. */
export const ASABA_VESSEL = {
  vesselCapacityM3: 220, maxFillRatio: 0.43, fillRatioBasis: 'water_capacity_mass',
  demandTonnesPerDay: 11, deliveryTonnes: 25, leadTimeDays: 4, safetyDays: 2,
};
export const ASABA_VAPORIZER = {
  massFlowKgHr: 780, liquidCpKJkgK: 2.5, inletTempC: 21, boilingPointC: 41,
  vapourCpKJkgK: 1.7, outletTempC: 58, designMarginPercent: 12,
};
export const ASABA_BOTTLING = {
  cylindersPerDay: 4100, fillMinutesPerCylinder: 2.3, positions: 20,
  shiftHoursPerDay: 11, availabilityFraction: 0.93,
};
/** CNG: every pressure is read on a gauge; the site's atmosphere is stated. */
export const ASABA_CNG = { gasSg: 0.63, temperatureC: 34, atmosphereBar: 1.013 };
export const ASABA_STORAGE_BANK = { volumeM3: 3, gaugeBar: 245 };
export const ASABA_CASCADE = {
  banks: [
    { label: 'Low', volumeM3: 2.5, gaugeBar: 180 },
    { label: 'Mid', volumeM3: 2.5, gaugeBar: 225 },
    { label: 'High', volumeM3: 2.5, gaugeBar: 260 },
  ],
  vehicleTankM3: 0.075, vehicleStartGaugeBar: 15, vehicleTargetGaugeBar: 200,
};
export const ASABA_CONVERSION = {
  annualDistanceKm: 62000,
  baseFuel: { label: 'PMS', consumptionPer100Km: 11, pricePerUnit: 820, energyPerUnitMJ: 32.2 },
  newFuel: { label: 'CNG', pricePerUnit: 410, energyPerUnitMJ: 47.1, efficiencyRatio: 0.9 },
  conversionCost: 1350000, annualExtraMaintenance: 72000,
};

/** The engine return behind each graded key, stated once. */
export const FIELD_SOURCES = {
  eriemu_ghv_btu_scf: 'ERIEMU: flareToValue.characteriseGas(the sheet).ghvBtuScf (on moles, after scaling to one)',
  eriemu_gpm_c3plus: 'ERIEMU: flareToValue.characteriseGas(...).gpmC3Plus (gal/Mscf of propane and heavier)',
  eriemu_c3plus_kg_per_mscf: 'ERIEMU: flareToValue.characteriseGas(...).c3PlusKgPerMscf',
  eriemu_flare_co2_t: 'ERIEMU: flareToValue.abatement({...both efficiencies}).flareCo2Tonnes',
  eriemu_flare_ch4_t: 'ERIEMU: flareToValue.abatement({...}).flareCh4Tonnes',
  eriemu_flare_co2e_t: 'ERIEMU: flareToValue.abatement({...}).flareCo2eTonnes',
  adibawa_capital_usd: 'ADIBAWA: flareToValue.routeEconomics({CNG}).capitalCost (the modular power law)',
  adibawa_cng_kg_per_year: 'ADIBAWA: flareToValue.routeEconomics({CNG}).productPerYear',
  adibawa_value_per_mscf: 'ADIBAWA: flareToValue.routeEconomics({CNG}).valuePerMscf',
  adibawa_avoided_co2e_t: 'ADIBAWA: flareToValue.abatement({...recoveryFraction of the CNG route}).avoidedFlareCo2eTonnes',
  adibawa_net_abatement_t: 'ADIBAWA: flareToValue.abatement({...counterfactual}).netAbatementTonnesCo2ePerYear',
  adibawa_breakeven_credit_usd_per_t: 'ADIBAWA: flareToValue.creditSensitivity({...}).breakevenCreditPrice',
  asaba_usable_lpg_t: 'ASABA: lpgCng.lpgStorageSizing({water_capacity_mass}).usableTonnes',
  asaba_vaporizer_design_kw: 'ASABA: lpgCng.vaporizerDuty({latent heat of the blend on mass}).designDutyKW',
  asaba_carousel_wait_min: 'ASABA: lpgCng.bottlingPlant({...}).queue.averageWaitMinutes',
  asaba_bank_mass_kg: 'ASABA: lpgCng.gasMassInVessel({gauge plus atmosphere}).massKg',
  asaba_left_in_banks_kg: 'ASABA: lpgCng.cascadeFills({gauge plus atmosphere}).leftInBanksKg',
  asaba_payback_years: 'ASABA: lpgCng.conversionEconomics({...}).simplePaybackYears',
};
