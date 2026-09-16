// PD6 SECTION 29: the ceiling that never fails on a SHORTFALL, and the missing
// input that answers "no inhibitor needed". Runs the SHIPPED engine. Opens
// neither fields.json nor pd6_fields.mjs, so no capstone value is reachable.
import { inhibitionRequirement, nielsenBucklinDepression, hammerschmidtDepression,
         MAX_PRACTICAL_WT_PCT, HAMMERSCHMIDT_RELIABLE_WT_PCT }
  from '/opt/petrolord-studio/workspaces/dev1/projects/petrolord-nextgen/packages/engines/engines/production/hydrateInhibition.js';

const f = (v, n = 10) => Number(v).toFixed(n);
const MEOH_MW = 32.04;
const out = [];

out.push('');
out.push('# SECTION 29: THE CEILING REFUSES ON CONCENTRATION AND NEVER ON SHORTFALL');
out.push('# derived sweep on the shipped engine. Every row calls inhibitionRequirement');
out.push('# with methanol and reads its OWN depressionCheck back. The refusal branch');
out.push('# in the function compares weightPct against maxWtPct and NOTHING compares');
out.push('# the delivered depression against the need, so the shortfall below grows');
out.push('# monotonically while ok stays true, and the one row that IS refused is');
out.push('# refused for exceeding the concentration ceiling rather than for being the');
out.push('# worst answer in the table. Expert m05 owns this section.');
out.push(`engine, the Hammerschmidt reliability limit = ${f(HAMMERSCHMIDT_RELIABLE_WT_PCT, 1)} weight percent, the practical ceiling = ${f(MAX_PRACTICAL_WT_PCT, 1)} weight percent`);
out.push(`derived, Hammerschmidt at the ${f(MAX_PRACTICAL_WT_PCT, 1)} weight percent ceiling, methanol = ${f(hammerschmidtDepression({ weightPct: MAX_PRACTICAL_WT_PCT, molecularWeight: MEOH_MW }), 10)} degF`);
out.push(`derived, Nielsen-Bucklin at the same ${f(MAX_PRACTICAL_WT_PCT, 1)} weight percent, methanol = ${f(nielsenBucklinDepression({ weightPct: MAX_PRACTICAL_WT_PCT, molecularWeight: MEOH_MW }), 10)} degF`);
out.push('');
for (const sc of [60, 80, 100, 120, 140, 160, 170, 180]) {
  const r = inhibitionRequirement({ subcoolingF: sc, waterRateBpd: 420.0,
                                    inhibitorId: 'methanol', leanWtPct: 96.0 });
  const w = r.weightPct;
  const nb = nielsenBucklinDepression({ weightPct: w, molecularWeight: MEOH_MW });
  const state = r.error ? 'REFUSED on concentration' : 'ACCEPTED';
  out.push(`derived sweep point, subcooling ${f(sc, 1)} degF: ok = ${r.ok}, design = ${f(w, 10)} weight percent, Nielsen-Bucklin delivers = ${f(nb, 10)} degF, short by = ${f(sc - nb, 10)} degF, ${state}`);
}
out.push('# THE SHORTFALL IS MONOTONE IN THE NEED AND ok IS TRUE FOR ALL BUT THE LAST');
out.push('# ROW. The last row is not refused for being short by the most; it is refused');
out.push('# for asking for a concentration above the ceiling. Sort this table by');
out.push('# shortfall and the refusal is still in the same place.');
out.push('');
out.push('# THE INPUT THAT IS NOT THERE, and it is the same NaN-is-falsy habit as the');
out.push('# swallowed trench and the swallowed mass, in the one place where the');
out.push('# fails-open answer is the dangerous one.');
const missing = inhibitionRequirement({ waterRateBpd: 420.0, inhibitorId: 'methanol', leanWtPct: 96.0 });
out.push(`engine, inhibitionRequirement called with NO subcoolingF at all: ok = ${missing.ok}, required = ${missing.required}, neededDepressionF = ${missing.neededDepressionF}, weightPct = none, note = "${missing.note}"`);
out.push('# The guard is !(need > 0), which is TRUE for a NaN, so the branch meant for');
out.push('# "the fluid is already outside the hydrate region" also catches "nobody said');
out.push('# where the fluid is". The caller is told NO INHIBITOR IS NEEDED, with ok');
out.push('# true, and the note prints the words NaN F to a user.');
console.log(out.join('\n'));
