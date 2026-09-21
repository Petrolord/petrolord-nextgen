# H4 Professional tier (h4i), key-truth audit

Read in full on 2026-09-21: `KEY_TRUTH_TASK.md`, `BRIEF.md`, `digest.txt`
(sections 1 to 4, 14 to 22, 32 to 34 line by line; the rest for ownership), all
26 lessons under
`/root/wt-h4-nextgen/src/content/courses/consequence/intermediate/`, all 132
questions in `banks/h4i_m01.py` to `h4i_m06.py` and `h4i_exam.py` (prompt,
every option, key and explanation), the panel
`src/components/course/panels/consequence/FireExplorer.jsx` with the lab
helpers it calls (`consequenceLab.js`: `parseNumber`, `typed`, `erhaArgs`,
`flameTeaching`, `yellowBookPoolFire`), and the engine's fire section
(`packages/engines/engines/hse/consequence.js` lines 560 to 968).

No capstone file was opened (`fields.json`, `h4_capstone.mjs` untouched); no
git command was run.

## What was recomputed through the engine

One node script called the vendored engine directly on the teaching streams in
`h4_fields.mjs` and the golden `consequence_cases.json`. Every figure below
matched the digest to the printed precision:

- Section 14: the 7 x 6 Babrauskas table; every fuel at 50 m on its asymptote;
  heptane 0.5 m = 42.305019 percent of 0.101 (prints 42.31); Burgess n-hexane
  0.100300 (Cp 2270, the digest's stream; the golden's own case uses 2260 and
  0.100410, a different case); Burgess with Tb below Ta refused `boilingPointK`.
- Section 15: ERHA burning flux 0.101000; still air 37.101102 m, L/D 1.855055;
  uc 2.546226; the five-wind table (u*, L/D, length). Probed 2.5, 2.546, 2.547
  and 2.6 m/s: u* is exactly 1 and the length 35.746382 up to uc, and falls
  continuously above it (no jump).
- Section 16: Froude, Reynolds, c and tilt for all five winds; no viscosity
  refused `airKinematicViscosityM2S`; ERHA 4 m/s with the printed 7.5133e-6
  gives 50.614791 degrees (a move of 1.44 degrees for a halved viscosity).
- Section 17: Mudan at six diameters; SEPmax 180128.456236 and SEPact
  52025.691247; soot fraction 1 returns 20000 exactly; radiative fraction 30
  refused `radiativeFraction`.
- Section 18: all 18 cells of the three tilt tables (Fv, Fh, Fmax at twelve
  decimals, the four `tiltDeg` refusals); X 5 and 10 m refused
  `distanceFromAxisM`; the 20 degree overhang line at X = 20.260604 m (20.26
  refused, 20.3 accepted), 40 degree line 29.283628 m; VF_OVERHANG refused
  `tiltDeg`; the three overhang probes and nine golden route B cases read from
  the golden; the 303 `rajTable` rows and the 2 misprint rows.
- Section 19: pw x and tau for the five paths; band edges probed (6.667 and
  66.66 m accepted, 6.6 and 66.67 m refused); tau reaches one at pw x =
  2470.5 N/m ("about 2.5e3" holds).
- Section 20: the five-row ERHA chain; the three distance searches (NOT_REACHED
  returns maxHeatFluxWM2 13687.914563 at the overhang edge); no transmissivity
  refused `transmissivity` by the search and `waterVapourPartialPressurePa` by
  the chain; view factor 1.2 refused `viewFactor`; heat flux monotone in
  distance past the overhang at 2, 4, 8 and 12 m/s (bisection assumption holds).
- Section 21: `poolFireSolidFlame(gold.fires.ybPoolFire.args)` gives flame
  length, tilt, SEPact, Fv, Fh, Fmax and heat flux 4582.518673 exactly as
  tabled; D from Fr 0.060060 is 42.445730 m (golden 42.445659), whose tilt at
  the printed viscosity is 50.828691.
- Hand products in exercises: 52025.691247 x 0.088888022627 x 0.8 =
  3699.568657; 66484.316572 x 0.096435502269 x 0.71474 = 4582.518673; Mudan at
  60 m on ERHA = 2196.327353 (engine and by hand agree); Fh/Fv ratios 0.671,
  0.313, 0.131; vector sum at 50 m = 0.073136774631.
- Claims probed beyond the digest: tilt outweighing the shorter flame (ERHA at
  40 m: Fmax 0.115840 with no wind against 0.250188 at 4 m/s, heat flux 4556
  against 10413; also higher at 60 and 100 m), so m02 l05's "can outweigh" is
  true. The vector sum of the printed Fh and Fv in the two misprint cells gives
  200.88 and 177.12, which print as 201 and 177, so m04 l03's "one who takes the
  vector sum of the printed Fh and Fv gets the right one" holds to the printed
  digits.

## Bank defects found and repaired

No question was mis-keyed. Every key is the correct option and every
distractor is wrong. Six repairs:

1. **KEY PROVENANCE MISSTATED, m04 Q11.** Prompt asked what "the computation
   from the cell's own Fh and Fv" gives, keyed 201.303914. That figure is the
   engine's Fmax from X/R and L/R (golden `rajTableMisprints.computed1e3`); the
   vector sum of the cell's printed Fh 44 and Fv 196 is 200.878. Prompt now
   "What does the engine compute for that cell, times 1000?"
2. **FALSE CLAIM IN AN EXPLANATION, m04 Q6.** "No fixed L/R or tilt limit
   exists": the engine refuses any |tilt| at or above 90 degrees with `tiltDeg`.
   Now "Neither a fixed L/R nor a 40 degree tilt draws the line ... the condition
   turns on L/R, X/R and the tilt together."
3. **UNMEASURED ATTRIBUTION, m05 Q2.** "below about 2.5e3 N/m the fit would
   exceed one, which is part of why the band exists": the digest gives the band
   as the Yellow Book's advice; the refused case (7500 N/m) has tau 0.905, below
   one. Now "the band is where the Yellow Book advises the fit, and below about
   2.5e3 N/m the fit would even exceed one."
4. **DISTRACTOR NOT REFUTED, m05 Q10.** "Bagster needs a humidity input the
   distance search has no argument for" was left unanswered. The search passes
   every chain argument through (`...args`), `waterVapourPartialPressurePa`
   included; the explanation now says so.
5. **DISTRACTOR NOT REFUTED, m06 Q6.** "Changing it would move the printed heat
   flux by more than the tolerance": measured through the engine it would not
   (physical viscosity gives 4581.632481, relative 1.38e-4, inside 0.001; the
   tilt is what leaves its tolerance, off by 2.8e-2). The explanation now states
   that the heat flux would stay inside its 0.001 and the tilt is the step that
   needs the printed viscosity.
6. **OVERSTATED EXPLANATION, m01 Q6.** "all fuels whose small pools burn well
   below their asymptotes": kerosene at 0.5 m burns at 82.6 percent of its own.
   Now "burn below their asymptotes".

Each changed bank (m01, m04, m05, m06) re-emitted with "all banks in this batch
passed every gate"; m02, m03 and exam JSON are byte-identical to before.

## Lesson defects found and repaired (edited in place)

Content:

- **m02 l03, FALSE:** "Every quantity under the cube root raises uc as it
  grows": the air density is in the denominator and lowers uc. Rewritten.
- **m02 l03, FALSE:** units section listed the wind, `windSpeed10mMS`, as an
  input to uc. Now names `burningFluxKgM2S`, `poolDiameterM`, `airDensityKgM3`
  and the output `characteristicWindSpeedMS`; the wind is divided by uc
  afterwards.
- **m02 l03, FALSE:** "every later step inherits it" (uc): the tilt and the
  Mudan power do not read uc. Now "the flame length steps inherit it".
- **m02 l03, UNMEASURED:** "Physically it is the speed of the buoyant plume"
  and "A wind well below uc barely disturbs that plume" (in the form it has no
  effect at all). Now a velocity scale, and a wind below uc leaves the length
  untouched.
- **m06 l01, FALSE:** "A mistake early in the chain would show up in every
  later row" and the heat flux's 3.32e-4 as "the strongest single piece of
  evidence". The tilt and Mudan rows read no flame length, and the end heat
  flux is insensitive to a real input error (the viscosity erratum leaves it
  inside tolerance, see bank repair 5). Now: later rows that read it, and
  agreement at the end alone would prove little, which is why every step is
  checked against its own printed value.
- **m06 l01, INCOMPLETE:** "both radiative fraction powers" omitted Mudan,
  which the example also checks and the capstone grades. Now "the surface
  emissive powers".
- **m04 l05, WRONG GEOMETRY:** "the top lies downwind ... by L sin(tilt), and
  the base edge lies one radius out". The condition R + L sin(t) >= X is the
  top's far edge, one radius beyond the top centre. Rewritten.
- **m05 l03, OVERREACH:** NOT_REACHED "cannot deliver that heat flux to a
  ground target anywhere downwind": the search starts just past the overhang,
  and targets under the flame are refused, never assessed. Now "to no ground
  target the closed form can assess, from just beyond the flame's reach
  outward."
- **m02 l04, ILLOGICAL:** without the floor a light wind would give "the flame
  longer than in no wind at all", yet no wind would then be unbounded. Now
  "longer than the held length, growing without limit as the wind fell toward
  zero."
- **m01 l02, UNMEASURED:** "A clean flame of this kind has no sooty core to
  build up as the pool grows." Replaced with what the table says.
- **m01 l03, UNMEASURED:** "A small pool loses heat at its rim and its flame is
  thin ..." mechanism, and "for most pools a process plant would worry about".
  Replaced with the correlation's own statement (smaller k beta D, further
  below m"inf; heptane at 0.5 m leaves more than half unreached, 42.31 percent
  reached).
- **m02 l01, UNMEASURED:** "typical of a large hydrocarbon bund fire". Now
  about ERHA only.
- **m05 l04, OVERREACH:** risk measures "computed and graded there, together
  with the ALARP argument that weighs them". Now "all belong there" (the
  digest's words). Seam words stay in this lesson only.
- **m06 l03, OVERCLAIM:** "each one guards a place where a formula would
  otherwise return a plausible number" (the viscosity and fuel refusals guard
  missing inputs). Now "most of them".

Exercises the FireExplorer cannot do. The panel has three views: flame
(Babrauskas only, wind form only, shows u* but not uc), view (view factor and
Bagster) and heat (ERHA fixed: soot method, 4 m/s; state and centre distance
only; the YB table read-only). Rewritten so every step is doable on the panel
or on a calculator:

- m01 l04: Burgess is not on the panel. Now by calculator, set beside the
  panel's hexane Babrauskas at 50 m, with the refusal reasoned from the
  denominator.
- m02 l01: no still air form on the panel. Now by calculator; the wind form at
  zero wind on the panel.
- m02 l03: uc is not shown. Now recovered as wind / u* (valid while u* > 1:
  u* is 1.979, 1.571 and 1.247 at 10, 20 and 40 m).
- m05 l02: the heat view cannot switch method. Mudan power read in the flame
  view and multiplied by hand.
- m05 l03: the panel does not show the NOT_REACHED largest heat flux. Now
  records the state (the blank-transmissivity refusal is reachable: a blank box
  becomes undefined and the search refuses `transmissivity`).
- m06 l02: the Yellow Book view has no viscosity input. Now the flame view with
  the diameter the learner derived, 5 m/s and each viscosity.
- m06 l03: `boilingPointK` (no Burgess) and `fuel` (a select list) cannot be
  drawn on the panel. Now four refusals on the panel and the call for the other
  two written down.
- m01 l01: "Name the one factor ... you supplied" was ambiguous (the analyst
  also states Fs, soot and viscosity). Now "the one of the three factors".

m02 l03 went over the 560 word ceiling after its repairs and was trimmed to 556.

## Checked and found clean

- Every other number in every lesson and question recomputes as above.
- Rounded-word claims: 4 m/s "more than one and a half times uc" (1.571);
  "several times" Mudan (5.83); "nearly twice as tall" (1.855); tripling the
  wind shortens by "much less than two thirds" (20.6 percent); 4 to 8 m/s loses
  more than 8 to 12 (4.404 against 2.294 m); Froude "fourfold" per doubling;
  Mudan "largest gaps" (1.26e-2, 7.34e-3 above all others); Reynolds largest
  gap among the tilt steps; "the horizontal factor responds most" at 30 m (x3.08
  against Fv x1.60); gasoline closer to its asymptote at 2 m (98.5 against 88.9
  percent).
- Physics claims kept as sound: SEPmax denominator as top disc plus side area
  (algebra checks: pool area over pi D L + pi D^2/4 = 1/(1 + 4 L/D)); Fmax as
  the vector length; tilt never reaching the horizontal; the rise of tilt with
  wind ever more slowly; Fh falling faster than Fv; a/b scale invariance;
  feeding the centre distance to Bagster understates tau.
- Tier reach: no TNT, overpressure or probit in any h4i lesson or question.
- Vocabulary and seams: point source, setback, individual risk, PLL, F-N,
  ALARP, risk matrix and emissions only in m05 l04 and banks h4i_m05/h4i_exam;
  no API 521 figure.
- Every question's distractors checked for a defensible reading; the "lpg and
  xylene" and "lng and heptane" pairs (exam Q7) do share a k beta, just not
  2.7, and the prompt asks for 2.7.

## The six Professional key truths, against the engine

7. **Confirmed.** Heptane at 0.5 m: 0.042728 / 0.101 = 42.305019 percent,
   prints 42.31.
8. **Confirmed.** uc 2.546226; every wind below it (0, 2, 2.5, 2.546) gives
   35.746382 m, and the length falls continuously above it.
9. **Corrected (carries no number, which job 1 requires).** Suggest: "The three
   surface emissive power methods disagree for one fire, so a heat flux is
   quoted with its method: ERHA at 4 m/s gives 30886.154395 by Mudan,
   180128.456236 clear and 52025.691247 with soot." All three recomputed.
10. **Confirmed.** Fmax at 50 m 0.073136774631 upright, 0.118733812581 at 40
    degrees.
11. **Confirmed; suggest adding the number.** "A flame over the target is
    refused, because the closed form's Fv is wrong there: at a 60 degree probe
    it gives 0.303765 where the surface integral gives 0.374215." (golden
    `overhangDeparture`.)
12. **Confirmed.** 4582.518673 against 4581, relative 3.32e-4. Note for the
    writer: the agreement at the end is insensitive to the viscosity erratum (at
    the physical value the heat flux is still within tolerance); the "step by
    step" in the truth is what carries the weight.

KEY_TRUTH_TASK.md was not edited (outside this audit's file set); 9 and 11 are
offered to its owner.

## Engine doubts (reported, nothing changed)

- **E1, Bagster band endpoints.** The model string says "valid 1e4 < pw x <
  1e5" (strict); the code refuses only `p < 1e4 || p > 1e5`, so both endpoints
  are accepted. Harmless; the string and the code disagree at two points.
- **E2, Bagster path in the chain ignores tilt.** `poolFireSolidFlame` computes
  the Bagster path as X - D/2 (base edge to target along the ground). The
  digest and the engine's own comment define x from the FLAME SURFACE; for a
  tilted flame leaning toward the target the surface is nearer than the base
  edge. Only the ungraded Bagster route is affected (every graded heat flux
  states tau), but a caller using Bagster in the chain gets a transmissivity
  that is low for a leaning flame.
- **E3, redundant call.** `solidFlameDistanceForHeatFlux` evaluates
  `at(maxDistanceM)` twice (`far` and `L0`). No effect on results.
- **E4, panel coverage.** FireExplorer offers no Burgess, no still air, no uc
  tile, no NOT_REACHED maximum, no edge distance and no method or viscosity
  input in the heat and Yellow Book views. The lessons were rewritten to fit;
  extending the panel would let the original exercises stand (owner choice).

## Gates, after the repairs

| gate | result |
| --- | --- |
| lengths.py --tier intermediate | 26/26, 0 out of band (m02 l03 556 of 560) |
| lengthtails --prefix h4i --refuse 40 | worst single strategy 38.3 pct (m02 2nd-longest, untouched bank) |
| dupaxes --prefix h4i | 34584 comparisons, 0 pairs at or above 0.45 |
| gate_copy_rule.py | 0 violations |
| gate_vocabulary.py | 0 breaches |
| gate_capstone_leak.mjs | lesson and bank directions (3, 10) clean; 18 findings, all direction 7 "[7 siblings]": the course's own capstone fields matched against its own live migration `20261006_h4_consequence_course.sql`, independent of any lesson or bank |
| numsweep --banks | 1190 checked, 0 unresolved |
| numsweep --content | 590 checked, 0 unresolved |
| litsweep --prefix h4i | 1337 literals, 0 not in digest, 0 forward, 0 back; 13 human-read flags, all section references or formula constants (0.117, 0.12, 1.5e-5, 12 m/s), benign |
| bankleak --tier intermediate | 132 questions, 1410 literals, 0 within 10 tolerances |
| leakage.mjs --banks --tier intermediate | 0 fatal downward leaks, 0 same-tier answer prints |

## Files changed

- Banks: `banks/h4i_m01.py`, `h4i_m04.py`, `h4i_m05.py`, `h4i_m06.py` and their
  re-emitted `.json`.
- Lessons (14): m01 l01, l02, l03, l04; m02 l01, l03, l04; m04 l05; m05 l02,
  l03, l04; m06 l01, l02, l03.

## Verdict

FIT TO SEED for the Professional tier. No mis-keyed question: 1 key-prompt
provenance repair, 5 explanation repairs; 14 lesson content defects (5 false,
9 unmeasured, overreaching, incomplete or illogical) and 8 exercises that the FireExplorer
could not carry, all repaired in place. Four engine doubts reported, none
touching a graded quantity.
