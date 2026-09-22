// HD fluid (engines #235): the figures the re-cut advanced quiz rows print,
// computed from the vendored engine through the lab the panels call. Printed
// as one JSON object {figures}; hd_quiz.py substitutes {{name}} from it, so no
// figure in docs/graded-field-audit/hd/quiz/fluid.json is typed by hand.
//
//   npx vite-node --config vitest.config.js docs/graded-field-audit/hd/fluid/figures.mjs
import { goodOilTuned, tuningLedger } from '../../../../src/components/course/panels/fluid/fluidLab.js';

const fit = goodOilTuned();
const t = Object.fromEntries(tuningLedger().map((r) => [r.name, r]));
const ONES = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
const ORD = ['', 'first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth'];
const TENS = { 1: 'ten', 2: 'twenty', 3: 'thirty', 4: 'forty' };
const n = Math.round(fit.ssrReduction);
if (n < 21 || n > 49 || n % 10 === 0) throw new Error(`residual factor ${n} is outside the words this script spells`);
const words = `${TENS[Math.floor(n / 10)]} ${ONES[n % 10]}`;
const crit = Math.round(Math.max(Math.abs(fit.knobs.fTc - 1), Math.abs(fit.knobs.fPc - 1)) * 100);
const shift = Math.abs(fit.knobs.sPlus / fit.startKnobs.sPlus - 1);
if (!(shift > 0.2 && shift < 0.3)) throw new Error(`the volume shift moved ${shift}, which "about a quarter" does not describe`);

const figures = {
  bo_ue_out: Math.abs(t.bo.untunedErr).toFixed(2),
  bo_te_out: Math.abs(t.bo.tunedErr).toFixed(2),
  gor_ue_out: Math.abs(t.totalGor.untunedErr).toFixed(1),
  gor_te_out: Math.abs(t.totalGor.tunedErr).toFixed(2),
  api_te_out: Math.abs(t.stoApi.tunedErr).toFixed(1),
  red_full: String(fit.ssrReduction),
  red_words: words,
  red_words_hyphen: words.replace(' ', '-'),
  red_ordinal: `${TENS[Math.floor(n / 10)]}-${ORD[n % 10]}`,
  ftc_3dp: fit.knobs.fTc.toFixed(3),
  crit_pct_words: ONES[crit],
  shift_fraction: 'a quarter',
};
console.log(JSON.stringify({ figures }));
