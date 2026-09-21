# H4 Expert tier, key-truth audit

Read in full on 2026-09-21: `KEY_TRUTH_TASK.md`, `BRIEF.md`, `digest.txt` (md5
`16c4d6346dded7324bf7bd8ed35f3b88`, 1065 lines), all 26 lessons under
`src/content/courses/consequence/advanced/` (worktree `/root/wt-h4-nextgen`) and
all 132 questions in `banks/h4a_m01` to `h4a_m06` and `h4a_exam` (the .py
sources), prompt, key, every distractor and explanation. The three panels'
fields were read against every lesson Exercise: `HarmExplorer.jsx` in full,
`consequenceLab.js` in full (the `typed()` wrapper drops a blank box so the
engine applies its own default), and the field lists of `ReleaseExplorer.jsx`
and `FireExplorer.jsx` for the exercises that send the learner there.

## What was recomputed through the engine

Every figure was re-run by calling the vendored engine
`packages/engines/engines/hse/consequence.js` directly with node, inputs from
`h4_fields.mjs` and the golden `consequence_cases.json`:

- TNT: the yield ladder (596.086957, 1192.173913, 2980.434783, 5960.869565) and
  both refusals (blast energy typed as 4600, yield typed as 10) with their fields.
- Kinney and Graham: the Z ladder (ratio and Pa), BONGA's five distances, eight
  times the charge at 200 m (7457.699887), the range refusal at Z 60 and Z 0.04,
  the basis model, source and `validRange` strings verbatim.
- The inverse: the five targets (Z and distance), the basis method string, the
  1000 Pa and 2000 Pa refusals on `overpressurePa`, the far edge distance for
  500 kg (Z 40 falls at 317.48 m, so "beyond 300 m" holds), and each round trip
  both with the exact distance and with the distance typed at six decimals.
- The conference column: all five cases in kPa, their Z, and the five relative
  differences (6.47e-5, 1.70e-4, 3.34e-5, 5.73e-5, 3.09e-6).
- Probits: the ladder 2 to 8; the inverse at 0.01, 0.05, 0.1, 0.12, 0.25, 0.5,
  0.75, 0.88, 0.9, 0.99; 97 of 97 Table 5.1 cells reproduce to the printed two
  decimals; the refusal at a probability of 1.
- Thermal: all 12 exposures under all four presets (probit, probability,
  thermal dose and its unit string), the W/m2 Eisenberg golden case 1.666556, the
  'tno' refusal, the three OSD/30 lethal doses, -12.8 - 2.56 ln(1e4) = -36.378.
- Overpressure probit: the psig ladder (Pa, probit, probability), the three
  printed points and their relative differences, the offset 1.37 ln(PA_PER_PSI)
  = 12.108768 that a Pa-for-psig slip adds, and BONGA at 50 m through the probit.
- Toxic: the chlorine table under both sources (loads, unit strings, mg/m3,
  probabilities), 200 ppm for 20 min, hydrogen sulphide at 293.15 K and at the
  default, the mg/m3 retype, the refusal with and without a conversion, the
  toxic history (211500.000000), the mean held exactly (144642.857143) and as
  typed at six decimals, the history reordered, n = 1, the empty history refusal,
  every ppm to mg/m3 cell and the three molar volumes.
- The inverse approximation: engine minus golden exact probit at the five
  probabilities (8.59e-7, -3.91e-7, -1.78e-14, 3.91e-7, -8.59e-7) and the
  lees-chlorine one percent toxic load (149793.673220 against 149793.533322,
  0.139897).
- The chain: AMENAM gas at 2e6 Pa (1.032722, CHOKED), the class F plume at 200 m
  (4582.243793), the pb-carbon-monoxide probit and probability (4.431141,
  0.284726), the same with the rate and concentration typed at six decimals,
  class D at 200 m, the Purple Book CO case (5.967660, 0.833393).
- Cross references the Expert banks reach back to: UBIT by class and crosswind,
  the F over D ratio 6.519887, the no-class refusal, the gas ladder, the three
  ERHA surface emissive powers, still air against wind form at no wind, Bagster
  at 30 m, Mackay and Matsugu on the hexane-like pool.

A sweep of every decimal literal in the seven banks and 26 lessons against the
engine output left only stated inputs, printed source values, relative
differences and golden exact values, each confirmed separately.

## Engine and digest observations

1. **TNO row lethal doses are golden values, not engine values.** Digest
   section 27 prints 384.344943 and 830.355817 for the OSD/30 TNO row. They are
   the golden's `computed1`/`computed50`, from the oracle's exact normal
   inverse. Through the engine's `probitDoseForProbability` the one percent
   figure is **384.345053** (fifty percent agrees, 830.355817). The gap,
   1.1e-4, is section 30's approximate inverse at work (8.59e-7 / 3.02 times the
   toxic load). Not an engine defect. The digest labels the row "(golden)"; the
   lesson and bank now attribute the figures to the golden (defects L10, K1).
2. No engine defect found. Every other digest figure the Expert tier uses
   reproduces through the engine to the printed decimals.
3. Gate note: `gate_capstone_leak.mjs` first reported 18 findings, the course's
   own capstone fields matching themselves in `migrations/20261006_h4_consequence_course.sql`.
   The gate was edited by another hand at 04:23:58 to exclude the course's own
   migrations by name, and re-runs with 0 findings. Not caused by this audit.
4. `migrations/20261006_h4_consequence_advanced_deep.sql` already exists in the
   worktree. It was cut from the pre-audit bank json, so it must be regenerated
   from the repaired `h4a_*.json` before any apply.

## The six Expert key truths, checked against the engine

| # | key truth | verdict |
| --- | --- | --- |
| 13 | eight times the charge at twice the distance gives the same overpressure | CONFIRMED: 500 kg at 100 m and 4000 kg at 200 m both give 7457.699887 Pa; the fit only receives Z |
| 14 | the 0.05 to 40 range is a judgement the validation record names as one | CONFIRMED: the basis carries `validRange` "Z in [0.05, 40] m/kg^(1/3) (judgement; see findings)"; Z 0.04 and Z 60 both refuse on `scaledDistanceMKg13` |
| 15 | a probit of 5 is 0.500000, and the logarithm is natural | CONFIRMED: `probitToProbability(5)` 0.500000; `probit` uses `Math.log`; Eisenberg at 20000 W/m2 for 20 s reproduces 2.994507 only with ln |
| 16 | two presets read one exposure as 0.022455 and 0.537647 | CONFIRMED: Eisenberg 2.994507 / 0.022455, Tsao and Perry 5.094507 / 0.537647, gap 2.100000 |
| 17 | a toxic history weighs its peaks: 211500.000000 against 144642.857143 at n = 2 | CONFIRMED: `toxicDose` 211500.000000 (order independent); the exact mean 450/7 held 35 min gives 144642.857143. Typed at six decimals (64.285714) it gives 144642.855857, which is why the m04 l04 exercise was repaired |
| 18 | the inverse probit departs in the seventh decimal and moves a lethal toxic load by 0.139897 | CONFIRMED: engine 2.673653 against golden exact 2.673652 (8.59e-7); lees-chlorine one percent 149793.673220 against 149793.533322 |

## Defects found and repaired in the banks

No key was wrong on the engine. Every numeric key, and every numeric distractor's
stated provenance, reproduces.

- **K1. h4a_m03 Q11 (TNO row), key and explanation.** The key said the row's
  coefficients give 384.344943; through the engine they give 384.345053. The key
  and explanation now say the golden computes 384.344943 and 830.355817 from the
  coefficients. Verdict unchanged.
- **D1. h4a_m05 Q9, a defensible distractor.** "The Facilities courses grade jet
  fires through their point source model": a flare flame is a jet flame and the
  Facilities courses grade flare heat radiation by the point source model, so the
  statement is arguably true. Replaced by a false reason (a jet fire too brief to
  harm anyone, left out as negligible); the explanation says the validation
  record calls no jet fire negligible.
- **D2. h4a_exam Q30, a defensible distractor.** "The spill is refused" is true
  when neither a bund nor a thickness is given. Replaced by a false claim (a
  default bund floor of 400 m2); the explanation says the engine carries no
  default bund.
- **D3. h4a_exam Q38, a defensible distractor.** "The note records every input"
  is close to section 33. Replaced by a false reason (the yield sets the ambient
  pressure); the explanation says the ambient is its own input, 101325 Pa unless
  stated.
- **E1. h4a_m04 Q11, a false claim.** "The Purple Book toxic coefficients are
  ungraded apart from this one case" implied the CO case is graded; section 32
  says the Purple Book toxic coefficients are never graded. Rewritten.
- **E2. h4a_m04 Q12, an unmeasured claim.** "none was dropped" (the engine
  source says Lees presets were kept only where the columns reproduce, so the
  digest cannot back it). Now "all 52 values reproduce", which section 29 says.
- **E3. h4a_m05 Q4, an unmeasured claim.** "OSD/30 prints values without any
  rule for rounding". Now: its printed figures are the evidence the engine is
  checked against and set no rounding for a read-back value.
- **E4. h4a_m02 Q4, round trip overstated.** 30.090623 m typed back returns
  49999.999806 Pa, not 50000. The explanation now says "to within the rounding
  of the printed distance".
- **E5. h4a_m06 Q7, an overclaim.** "every call names its method" is not true of
  `thermalProbit`, which defaults to eisenberg. Now "every result names its method
  in its basis".
- The explanations of K1, D1, D2 and D3 were rewritten with their items.

Checked and found clean. All 132 keys are correct. Every distractor is wrong for
the reason its explanation gives, and no explanation supports a distractor
beyond D1 to D3. All seven .py banks re-run with no FAIL.

## Defects found and repaired in the lessons

Exercises that the panel could not do as written:

- **L1. m04 l03 exercise.** It asked the learner to remove the molar mass after
  switching to mg/m3 on the mg/m3 preset. The engine needs no conversion there
  and returns a probit (4.570702) with no refusal. Reordered: remove the molar
  mass while the unit is ppm, where the engine refuses on `molarMassGMol`, then
  restore it and retype in mg/m3.
- **L2. m04 l04 exercise.** "confirm 144642.857143" from a typed mean of
  64.285714. The panel returns 144642.855857. The exercise now says the load
  matches to about two decimals because the typed mean is rounded.
- **L3. m05 l04 exercise.** The release panel's pool view feeds evaporation from
  the spill's equivalent diameter, which is 22.567583 m by default, so 0.451595
  kg/s could not be reached. The exercise now sets the bund floor to 78.539816
  m2, a pool 10 m across; the engine then returns 0.451595 (confined, 0.38 m deep
  under a 0.5 m wall).
- **L4. m06 l01 exercise.** The rate typed at six decimals, 1.032722, gives
  4582.244802 mg/m3 at 200 m, not 4582.243793. Now "to within the rounding of the
  typed rate". Typing 4582.243793 on the toxic view still gives 0.284726.
- **L5. m02 l02 exercise.** The round trip at 79.281907 m returns 9999.999984 Pa.
  Now "to within the rounding of the typed distance".

False, unmeasured or meta claims:

- **L6. m01 l01.** "the most common units slip" is unmeasured. Now "the units slip
  the band is there to catch".
- **L7. m01 l02.** "The engine's own check of the relation" named a test the
  digest does not cite. Now "The relation, run through the engine". Also "Two
  slips are common" is unmeasured. Now "easy to make".
- **L8. m01 l04.** "the limit works mostly as a guard against a mistyped distance
  or a charge typed in grams" is unmeasured. Now the near edge is "enforced the
  same way". Also "returns nothing at all" became "returns no overpressure",
  because the engine does return a refusal.
- **L9. m02 l02.** "The fit has no closed form inverse" is unmeasured. Now "The
  engine inverts the fit by searching". Also "What is checked is the pair"
  described grading that the brief does not describe. Now "A capstone grades the
  distance itself, at the six decimals this course prints".
- **L10. m03 l04.** The TNO row figures are now attributed to the golden (see
  engine observation 1). "They come from different studies of different data"
  was false: the same lesson shows purple-book is Tsao and Perry rewritten. Now
  "Each is transcribed from a named published source". Also "information about
  the data" became "about the sources".
- **L11. m02 l04.** "In the words of the engine's own account" quoted a digest
  sentence as engine words. The attribution was dropped.
- **L12. m04 l01.** "n is different for every substance and every source" was
  false: many presets share n = 1 or n = 2. Now "set by each preset, so it can
  differ".
- **L13. m04 l03.** "more often than not" is unmeasured. Now "can arrive".
- **L14. m05 l01.** "Each reason has the same shape" was false: the spreading and
  two phase reasons are about numerical or differential-equation models, not a
  missing source. The line now lists the three kinds of reason. Also "the one
  most likely to catch an analyst out" is unmeasured. Now "the absence to watch
  most closely".
- **L15. m06 l01.** "from the digest's own worked example" named the digest to
  learners. Now "on the teaching streams".

Checked and found clean. No section 31 item is taught as computed: m02 l04, m05
l01 to l03 and m06 l02 name each one as out of the engine. The seam words
appear only in m05 l02, m05 l03, m06 l02 and m06 l03, with no API 521 level
figure. Every refusal is quoted verbatim. Every other exercise was walked
against the panel fields and the engine: m01 l01 to l04, m02 l01, l03 and l04,
m03 l01 to l05 (the probit view takes psig and converts with `PA_PER_PSI`;
BONGA at 50 m is 2.846606 psig, probability 0.018005), m04 l01 and l02, m05 l03
and l05, m06 l03 and l04.

## Files changed

- banks: `h4a_m02.py`, `h4a_m03.py`, `h4a_m04.py`, `h4a_m05.py`, `h4a_m06.py`,
  `h4a_exam.py`, each re-emitted to its .json with no FAIL (`h4a_m01` unchanged).
- lessons (advanced): m01 l01, l02, l04; m02 l02, l04; m03 l04; m04 l01, l03,
  l04; m05 l01, l04; m06 l01.

## Gates after repair

| gate | result |
| --- | --- |
| lengths.py --tier advanced | 26/26, out of band 0 (max 554, m05 l04) |
| lengthtails --prefix h4a --refuse 40 | worst single strategy 33.3 pct |
| dupaxes --prefix h4a | 0 pairs at or above 0.45 |
| gate_copy_rule.py | VIOLATIONS 0 |
| gate_vocabulary.py | BREACHES 0 |
| gate_capstone_leak.mjs | FINDINGS 0 (after the concurrent own-migration exclusion) |
| numsweep --banks | 1190 checked, unresolved 0 |
| numsweep --content | 590 checked, unresolved 0 |
| litsweep --prefix h4a | 0 forward; 49 reach-backs (allowed without --strict-range); 21 REVIEW resolves are section-number coincidences |
| bankleak --tier advanced | 0 within 10 tolerances |
| leakage --banks --tier advanced | 0 fatal, 0 same-tier prints |
| digestprose | 0 failing |
