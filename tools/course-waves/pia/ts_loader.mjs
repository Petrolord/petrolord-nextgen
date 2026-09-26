// A NODE 18 LOADER HOOK FOR THE ONE TYPESCRIPT ENGINE THIS COURSE RUNS, AND
// FOR THE NAMED WRONG-METHOD VARIANTS OF IT THAT discriminate.mjs CALLS.
//
// engines/economics/cashflow.ts is TypeScript (it is deployed as a Supabase
// edge function). Jest and Vite compile .ts; plain node 18 does not, so every
// EC7 wave script that runs the engine registers this hook first (through
// pia_engine.mjs). It strips the types with the esbuild the NextGen
// repository already installs and changes no behaviour.
//
// A URL carrying ?variant=<name> loads the SAME source with ONE named textual
// substitution from VARIANTS below (a plausible wrong method a learner might
// use, such as a flat terrain royalty). Each substitution must match EXACTLY
// ONCE, or the load throws naming the variant, so a variant can never
// silently run the true engine. The true engine is loaded with no query and
// is never patched. Variants exist only for the discrimination sweep and the
// negative controls; no digest line and no graded field is computed from one.
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const ENG = process.env.EC7_ENGINES || '/root/wt-ec7-nextgen/packages/engines';
const REPO = process.env.EC7_REPO || path.resolve(ENG, '..', '..');
const esbuild = createRequire(`${REPO}/package.json`)('esbuild');

// [find, replace]: find is an exact string that must occur exactly once.
export const VARIANTS = {
  // Royalty at the terrain's full rate on every barrel (no small-field tranches).
  flat_royalty: [
    "export function deriveOilRoyaltyRate(terrain: string, liquidsBopd: number): number {\n  checkTerrain(terrain);",
    "export function deriveOilRoyaltyRate(terrain: string, liquidsBopd: number): number {\n  checkTerrain(terrain);\n  return ({ onshore: 0.15, shallow_water: 0.125, deep_offshore: 0.075, frontier: 0.075 } as any)[terrain];",
  ],
  // Deep offshore: the whole volume at 7.5% once the rate passes 50,000 bopd (a step).
  deep_offshore_step: [
    'return (50000 * 0.05 + (liquidsBopd - 50000) * 0.075) / liquidsBopd;',
    'return 0.075;',
  ],
  // Gas royalty at the unconverted-lease rates (7% onshore and shallow water, 5% offshore).
  old_gas_rates: [
    '  return 0.05 * (1 - s / 100) + 0.025 * (s / 100);',
    "  return terrain === 'onshore' || terrain === 'shallow_water' ? 0.07 : 0.05;",
  ],
  // The in-country share ignored: all gas at 5%.
  gas_in_country_ignored: [
    '  return 0.05 * (1 - s / 100) + 0.025 * (s / 100);',
    '  return 0.05;',
  ],
  // The price benchmarks never escalated: 50, 100 and 150 USD/bbl in every year.
  unescalated_benchmarks: [
    'for (let y = baseYear + 1; y <= Math.floor(year); y++) {',
    'for (let y = baseYear + 1; y <= Math.floor(year) && false; y++) {',
  ],
  // NDDC left out of the hydrocarbon tax base.
  nddc_outside_hct_base: [
    '- operatingClaimed - share * (hcdt + nddc);',
    '- operatingClaimed - share * hcdt;',
  ],
  // HCDT on the current year's opex instead of the preceding year's.
  hcdt_current_year: [
    "// s.240(2)); NDDC is computed by the caller from its stated base.\n  const hcdt = state.prior_year_opex_usd > 0 ? 0.03 * state.prior_year_opex_usd : 0;",
    '// s.240(2)); NDDC is computed by the caller from its stated base.\n  const hcdt = 0.03 * inputs.opex_inflated;',
  ],
  // Tertiary education tax at 2.5% in every year (the Finance Act 2023 rise missed).
  tet_25_after_2023: [
    'export const statutoryTetRatePct = (year: number): number => (year >= 2023 ? 3 : 2.5);',
    'export const statutoryTetRatePct = (year: number): number => 2.5;',
  ],
  // One framework for the whole ledger, read from the base year.
  one_framework_per_ledger: [
    'const frameworkOf = (year: number): FiscalFramework => (compliantPIA ? fiscalFrameworkForYear(cfg, year) : framework);',
    'const frameworkOf = (year: number): FiscalFramework => framework;',
  ],
  // The cost price ratio cap on gross revenue, gas included.
  cpr_on_gross_revenue: [
    'const cprCap = Math.max(0, liquidsRev * cprPct / 100);',
    'const cprCap = Math.max(0, grossRev * cprPct / 100);',
  ],
  // No production allowance once the new-lease volume cap is reached.
  no_allowance_after_cap: [
    'const perAfter = Math.min(Number(cfg.pia_production_allowance_per_bbl_new_after_cap ?? 4), pct * fiscalPrice);',
    'const perAfter = 0;',
  ],
  // The deep offshore and frontier new-lease allowance kept in NTA years.
  nta_deep_allowance_kept: [
    "if ((terrain === 'deep_offshore' || terrain === 'frontier') && framework === 'nta_2025') return none;",
    '',
  ],
  // Capital allowance at 20% in every year of the five (no 19% and 1% retention in PIA years).
  flat_20_capital_allowance: [
    'return [0.20, 0.20, 0.20, 0.20, 0.19][yearOfLife];',
    'return 0.20;',
  ],
  // The CITA two-thirds restriction applied in every year, NTA years included.
  cita_restriction_every_year: [
    "const restricted = framework === 'pia_only' && cfg.pia_cit_company_gas_operations !== true;",
    'const restricted = cfg.pia_cit_company_gas_operations !== true;',
  ],
  // The CITA two-thirds restriction never applied.
  cita_restriction_never: [
    "const restricted = framework === 'pia_only' && cfg.pia_cit_company_gas_operations !== true;",
    'const restricted = false;',
  ],
  // The royalty daily rate read on crude oil alone, condensate left out.
  daily_rate_crude_only: [
    'const liquidsBopd = liquidsBbl / calendarDays(inputs.year);',
    'const liquidsBopd = inputs.oil_bbl / calendarDays(inputs.year);',
  ],
  // The royalty daily rate over 365 days in every year, leap years included.
  daily_rate_365_days: [
    'const liquidsBopd = liquidsBbl / calendarDays(inputs.year);',
    'const liquidsBopd = liquidsBbl / 365;',
  ],
  // The development levy charged in PIA years as well (the levy read as the TET).
  levy_in_pia_years: [
    "    tetTax = Math.max(0, citAssessableProfit * tetRatePct / 100);\n  } else {",
    "    tetRatePct = 0; tetTax = 0; devLevyTax = Math.max(0, citAssessableProfit * 4 / 100);\n  } else {",
  ],
  // Royalty by price charged on the gas revenue as well.
  price_royalty_on_gas: [
    'const priceRoyalty = oilRev * priceRateOil + condRev * priceRateCond;',
    'const priceRoyalty = oilRev * priceRateOil + condRev * priceRateCond + gasRev * priceRateOil;',
  ],
  // Shared costs entered in the cost price ratio in full (no crude-plus-condensate share).
  cpr_costs_not_apportioned: [
    'const hctOperatingCosts = share * (inputs.opex_inflated + decomDeduction);\n  const hctAllowanceCosts = share * inputs.capital_allowance_this_year;',
    'const hctOperatingCosts = (inputs.opex_inflated + decomDeduction);\n  const hctAllowanceCosts = inputs.capital_allowance_this_year;',
  ],
  // The cost the cap deferred never brought into the next year.
  cpr_carry_dropped: [
    'const recoverable = state.cpr_carryforward + hctOperatingCosts + hctAllowanceCosts;',
    'const recoverable = hctOperatingCosts + hctAllowanceCosts;',
  ],
};

export async function resolve(specifier, context, nextResolve) {
  return nextResolve(specifier, context);
}

export async function load(url, context, nextLoad) {
  const u = new URL(url);
  if (u.protocol === 'file:' && u.pathname.endsWith('.ts')) {
    let src = fs.readFileSync(fileURLToPath(`file://${u.pathname}`), 'utf8');
    const variant = u.searchParams.get('variant');
    if (variant) {
      const v = VARIANTS[variant];
      if (!v) throw new Error(`ts_loader: no variant named ${variant}`);
      const n = src.split(v[0]).length - 1;
      if (n !== 1) throw new Error(`ts_loader: variant ${variant} matched ${n} times; it must match exactly once`);
      src = src.replace(v[0], () => v[1]);
    }
    const out = esbuild.transformSync(src, { loader: 'ts', format: 'esm', target: 'node18' });
    return { format: 'module', source: out.code, shortCircuit: true };
  }
  return nextLoad(url, context);
}
