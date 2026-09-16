// PD6 SECTION 30: one need, four fluids, one mole fraction, one check. Runs the
// SHIPPED engine. Opens neither fields.json nor pd6_fields.mjs.
import { INHIBITORS, weightPctForDepression, weightPctToMoleFraction,
         nielsenBucklinDepression, hammerschmidtDepression, depression }
  from '/opt/petrolord-studio/workspaces/dev1/projects/petrolord-nextgen/packages/engines/engines/production/hydrateInhibition.js';

const f = (v, n = 10) => Number(v).toFixed(n);
const out = [];
const NEED = 36.0;

out.push('');
out.push('# SECTION 30: ONE NEED, FOUR FLUIDS, ONE MOLE FRACTION, ONE CHECK');
out.push('# derived on the shipped engine. The catalog sets nielsenBucklin true on');
out.push('# methanol and FALSE on all three glycols, so `depression` returns a null');
out.push('# check for three of the four fluids and a glycol design has no cross');
out.push('# relation at all. The stated reason is that Nielsen-Bucklin was developed');
out.push('# for methanol. THE ARITHMETIC DOES NOT SUPPORT THAT REASON.');
out.push('# Hammerschmidt is dT = k w / (MW (100 - w)), so its inverse fixes the group');
out.push('# r = w / (MW (100 - w)) at dT / k. The mole fraction is r / (r + 1/18.015),');
out.push('# WHICH CONTAINS NO MOLECULAR WEIGHT. Every inhibitor in the catalog carries');
out.push('# the same k of 2335. So any two fluids sized to one need land on one mole');
out.push('# fraction, and Nielsen-Bucklin, which is -129.6 ln(1 - x), returns one');
out.push('# number for all of them. Expert m04 owns this section.');
out.push(`derived, the need every row below is sized to = ${f(NEED, 1)} degF`);
for (const inh of INHIBITORS) {
  const w = weightPctForDepression({ depressionF: NEED, molecularWeight: inh.molecularWeight, k: inh.k });
  const x = weightPctToMoleFraction({ weightPct: w, molecularWeight: inh.molecularWeight });
  const nb = nielsenBucklinDepression({ weightPct: w, molecularWeight: inh.molecularWeight });
  const hs = hammerschmidtDepression({ weightPct: w, molecularWeight: inh.molecularWeight, k: inh.k });
  const chk = depression({ weightPct: w, inhibitorId: inh.id });
  out.push(`engine, ${inh.id}: k = ${f(inh.k, 1)}, molecular weight = ${f(inh.molecularWeight, 3)}, design = ${f(w, 10)} weight percent, mole fraction = ${x.toPrecision(17)}, Hammerschmidt back = ${f(hs, 10)} degF, Nielsen-Bucklin = ${f(nb, 10)} degF, what depression() RETURNS as its check = ${chk.nielsenBucklinF === null || chk.nielsenBucklinF === undefined ? 'null' : f(chk.nielsenBucklinF, 10)}`);
}
out.push('# FOUR DIFFERENT CONCENTRATIONS, ONE MOLE FRACTION TO WITHIN A SINGLE ULP,');
out.push('# ONE IDENTICAL NIELSEN-BUCKLIN. The check that is suppressed for three of');
out.push('# these fluids is the SAME NUMBER it computes for the fourth. Suppressing it');
out.push('# removes a check and changes no answer, and a reader who sees a glycol');
out.push('# design come back with a null check should not conclude it was validated');
out.push('# some other way. It was not validated at all.');
console.log(out.join('\n'));
