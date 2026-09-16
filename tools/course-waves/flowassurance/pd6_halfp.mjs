// PD6 SECTION 31: the half specified pressure input. Runs the SHIPPED engine on
// the TEACHING LINE. Opens neither fields.json nor pd6_fields.mjs.
import { steadyStateProfile, overallU }
  from '/opt/petrolord-studio/workspaces/dev1/projects/petrolord-nextgen/packages/engines/engines/production/flowlineThermal.js';

const f = (v, n = 10) => Number(v).toFixed(n);
const STACK = overallU({
  layers: [
    { idIn: 9.562,  odIn: 10.750, k: 26.00 },
    { idIn: 10.750, odIn: 13.750, k: 0.070 },
    { idIn: 13.750, odIn: 16.750, k: 0.90 },
  ],
  insideFilmH: 200.0, outsideFilmH: 200.0, burialFt: 3.00, kSoil: 1.20, referenceIdIn: 9.562,
});
const L = { lengthFt: 60000.0, inletTempF: 195.00, ambientTempF: 45.00,
            massRateLbHr: 90000.0, cpBtuLbF: 0.620,
            uBtuHrFt2F: STACK.uBtuHrFt2F, idIn: 9.562, nStations: 5,
            jtCoeffFPerPsi: 0.0280 };

const out = [];
out.push('');
out.push('# SECTION 31: A HALF SPECIFIED PRESSURE INPUT, AND THE TELL IT DESTROYS');
out.push('# engine, on the teaching line. The pressure drop is computed only when BOTH');
out.push('# inletPsia and outletPsia are finite, and dp falls back to zero otherwise,');
out.push('# which is the right default. But the station pressure column is written as');
out.push('# pPsia = Number.isFinite(inletPsia) ? inletPsia - dp * frac : NaN, and that');
out.push('# guard reads the INLET ALONE. Supply an inlet and forget the outlet and the');
out.push('# column comes back fully populated and FLAT at the inlet pressure, while the');
out.push('# Joule-Thomson term is silently zero. THE n/a COLUMN IS HOW A READER KNOWS');
out.push('# THE TERM WAS NOT APPLIED, and a half specified input replaces that tell');
out.push('# with a plausible one. The failure is ASYMMETRIC: forget the INLET instead');
out.push('# and the column is honestly n/a. Expert m01 and m02 may both cite it.');
const cases = [
  ['BOTH pressures, the correct call', { inletPsia: 2400.0, outletPsia: 1500.0 }],
  ['NEITHER pressure, heat loss only', {}],
  ['INLET ONLY, the outlet forgotten', { inletPsia: 2400.0 }],
  ['OUTLET ONLY, the inlet forgotten', { outletPsia: 1500.0 }],
];
for (const [lab, p] of cases) {
  const r = steadyStateProfile({ ...L, ...p });
  const col = r.stations.map((s) => (Number.isFinite(s.pPsia) ? f(s.pPsia, 1) : 'n/a')).join(', ');
  out.push(`engine, ${lab}: ok = ${r.ok}, arrival = ${f(r.arrivalTempF, 10)} degF, pressure column = [${col}], note = none, error = none`);
}
out.push('# THE TWO MIDDLE ROWS RETURN THE SAME ARRIVAL AND DIFFERENT PRESSURE COLUMNS.');
out.push('# One says plainly that no pressure was known. The other shows a pressure at');
out.push('# every station, none of which the line ever had, and neither carries a note.');
console.log(out.join('\n'));
