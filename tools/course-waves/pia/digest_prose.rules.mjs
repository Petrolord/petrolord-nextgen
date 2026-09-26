// EC7 Petroleum Industry Act 2021 & Nigerian Fiscal Terms: the wave's own
// claims, cleared phrases and engine pins for /root/dc-wavekit/digestprose.mjs.
//
//   node /root/dc-wavekit/digestprose.mjs /root/cat-wip-pia/digest.txt \
//        --rules /root/cat-wip-pia
//
// THIS WAVE'S HISTORY POSITION. The course teaches no repair history: the
// engine was brought into line with the gazetted texts before any lesson was
// written, and that is provenance.
//
// THIS FILE REFUSES RATHER THAN PASSING. Everything it declares about the
// digest is checked against digest.txt when the module loads, and a claim it
// cannot check makes it print REFUSED and exit 2.
import fs from 'node:fs';
import path from 'node:path';

const WAVE = process.env.EC7_WAVE_DIR || '/root/cat-wip-pia';
const DIGEST = path.join(WAVE, 'digest.txt');
const ENGINES = process.env.EC7_ENGINES || '/root/wt-ec7-nextgen/packages/engines';

const refuse = (msg) => {
  console.log(`REFUSED by digest_prose.rules.mjs (EC7): ${msg}`);
  console.log('   A rules file that cannot check its own declarations is a rules file that '
    + 'reports a clean sweep for a check that never ran.');
  process.exit(2);
};

let DIGEST_LINES = [];
try {
  DIGEST_LINES = fs.readFileSync(DIGEST, 'utf8').replace(/\n$/, '').split('\n');
} catch (e) {
  refuse(`${DIGEST} could not be read (${e.code}), so every declaration below is unchecked`);
}
if (DIGEST_LINES.length < 600) refuse(`${DIGEST} has ${DIGEST_LINES.length} lines, which is too few to be the whole digest`);

const historyish = DIGEST_LINES.filter((l) => /^# SECTION \d+:/.test(l) && /USED TO|NO LONGER|REPAIR HISTORY|LEGACY/i.test(l));
if (historyish.length) refuse(`a section heading frames repair history in a wave that teaches none: ${historyish[0]}`);

// Every heading claim below must match a real heading, or it clears nothing.
// Each `body` returns TRUE WHEN THE HEADING IS FALSE over its block.
const HEADINGS = [
  {
    id: 'ec7-tranches',
    heading: /Royalty by terrain and daily rate: the small-field tranches/i,
    body: (b) => !/^\| 5000 \| 0\.050000 \| 0\.050000 \| 0\.050000 \| 0\.075000 \|$/m.test(b) || !/^\| 10000 \| 0\.062500 \| 0\.062500 \| 0\.050000 \| 0\.075000 \|$/m.test(b) || !/^\| 50000 \| [0-9.]+ \| [0-9.]+ \| 0\.050000 \| 0\.075000 \|$/m.test(b),
    why: 'the tranche section no longer shows the boundary table at 5,000, 10,000 and 50,000 bopd',
  },
  {
    id: 'ec7-price-two-bases',
    heading: /Royalty by price and its escalated benchmarks/i,
    body: (b) => !/THE BASE YEAR IS AN OPEN QUESTION/.test(b) || !/\| 2021 \| 50\.000000 \| 100\.000000 \| 150\.000000 \| 51\.000000 \| 102\.000000 \| 153\.000000 \|/.test(b),
    why: 'the price section no longer shows both bases side by side as an open question',
  },
  {
    id: 'ec7-framework-per-year',
    heading: /The framework read year by year/i,
    body: (b) => !/\| 2025 \| pia_only \|/.test(b) || !/\| 2026 \| nta_2025 \|/.test(b) || !/pia_only_then_nta_2025/.test(b),
    why: 'the framework section no longer shows one ledger crossing 1 January 2026',
  },
  {
    id: 'ec7-deep-three-readings',
    heading: /What the Nigeria Tax Act 2025 changed at the edges, and what it did not/i,
    body: (b) => !/conservative_zero/.test(b) || !/aggressive_pml_30/.test(b) || !/custom 20/.test(b) || !/WHAT DID NOT CHANGE/.test(b),
    why: 'the edges section no longer shows the three deep offshore readings and what did not change',
  },
  {
    id: 'ec7-provision-map',
    heading: /Every provision this course teaches, computed or concept-only/i,
    body: (b) => !/\| computed \|/.test(b) || !/\| concept-only \|/.test(b) || !/^\d+ provisions: \d+ computed, \d+ concept-only\.$/m.test(b),
    why: 'the provision map no longer states which provisions are computed and which are concept-only',
  },
];
for (const h of HEADINGS) {
  if (!DIGEST_LINES.some((l) => /^# SECTION \d+:/.test(l) && h.heading.test(l))) {
    refuse(`the heading rule ${h.id} matches no section heading, so it checks nothing`);
  }
}

// A CLEARED PHRASE THAT MATCHES NOTHING IS A ROW CLAIMING WORK IT NEVER DID.
// This wave clears no phrase. The list is empty by decision and checked as empty.
export const CLEARED = [];
for (const re of CLEARED) {
  if (!DIGEST_LINES.some((l) => re.test(l))) {
    refuse(`the cleared phrase ${re} matches no line of the digest, so it clears nothing`);
  }
}

// EVERY ENGINE STRING THIS DIGEST QUOTES, pinned by exact fragment to the
// engine source that writes it. If the engine's wording changes, the pin breaks
// and the quote is re-read rather than silently kept. Each pin is also checked
// to be QUOTED in the digest, so a pin that guards nothing refuses.
const CASHFLOW = [
  'is not a terrain under the Petroleum Industry Act 2021: a marginal field is onshore or in shallow water',
  'needs pia_new_pml_hct_rate_pct set to 15 or 30',
  'does not say which applies to a lease granted after the Act out of new acreage, so the rate is a stated user choice with no default.',
  'NTA s.65(1) applies hydrocarbon tax to deep offshore operations but s.72 states rates only for onshore and shallow water, so the rate is a stated user choice with no default.',
  'fix the capital allowance at five years (20, 20, 20, 20, 19 percent under the PIA; 20 percent a year under the NTA).',
  'NTA s.86 allows the deduction only when at least 30% of the fund is deposited in an escrow account with a Nigerian bank',
  'pia_gas_in_country_share_pct must be a number from 0 to 100; got',
  'pia_price_royalty_base must be "regulations_2021" or "act_2020"; got',
  'pia_under_nta_2025_override must be "auto", "force_pia" or "force_nta"; got',
  'pia_nddc_levy_base must be "total_budget" or "opex"; got',
  'No production data found. Upload and process a CSV first.',
  'The crude oil and condensate daily rate must be a finite number of 0 or more; got',
  'Royalty by price uses the Petroleum Royalty Regulations 2022 Schedule',
  'reading (PIA Seventh Schedule para 11(1)): 50, 100 and 150 USD/bbl apply to 2020',
  'which does not follow its own 2% rule; the engine applies the rule (104.04 in 2023).',
  'crude oil plus condensate divided by the calendar days of the year; the Regulations (r.12(2))',
  'the engine cannot tell the two gases apart.',
  'The wording in force before 1 May 2023 was not read; the engine applies the same restriction to every year before 2026.',
  'no Certified True Copy was read.',
  'The minimum effective tax rate top-up is a project-level approximation of NTA s.57',
  'so the additional tax at the fiscal price (PIA s.268; NTA s.73) is not computed.',
  'leave pia_tet_rate_pct unset to apply it.',
  'Petroleum Industry Act 2021 (Act No. 6), Official Gazette No. 142, Vol. 108, 27 August 2021',
].map((frag) => ({ frag, src: 'engines/economics/cashflow.ts' }));
const CONVENTIONS = [
  "Government cash flow divided by the project's pre-take net cash flow, which is revenue less opex less capex, over the project life.",
  'Royalty plus the government share of profit oil plus tax.',
].map((frag) => ({ frag, src: 'engines/economics/fiscalConventions.js' }));
const PINNED = [...CASHFLOW, ...CONVENTIONS];
for (const p of PINNED) {
  if (!DIGEST_LINES.some((l) => l.includes(p.frag))) refuse(`the pinned engine fragment "${p.frag}" is not quoted in the digest, so the pin guards nothing`);
  if (!fs.readFileSync(path.join(ENGINES, p.src), 'utf8').includes(p.frag)) refuse(`the pinned engine fragment "${p.frag}" is not in ${p.src}, so the quote is stale`);
}

export default {
  enginesRoot: ENGINES,
  pinned: PINNED,
  cleared: CLEARED,
  headings: HEADINGS,
};
