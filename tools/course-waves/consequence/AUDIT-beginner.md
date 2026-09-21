# H4 consequence Associate tier (h4b), key-truth audit

Read in full on 2026-09-21: `KEY_TRUTH_TASK.md`, `BRIEF.md` and `digest.txt`
(1066 lines, md5 `304fb44e8c1a006c3d7e4784930f5111`), all 26 lessons under
`src/content/courses/consequence/beginner/` in the nextgen worktree
`/root/wt-h4-nextgen`, all 132 questions in the seven bank sources
`banks/h4b_m01..m06.py` and `banks/h4b_exam.py`, the panel
`ReleaseExplorer.jsx` with its wrappers in `consequenceLab.js` and
`panelBits.jsx`, and lines 1 to 570 of the vendored engine
`packages/engines/engines/hse/consequence.js` (source terms and dispersion).

## What was recomputed through the engine

One node script called the vendored engine directly on the teaching streams of
`h4_fields.mjs` and printed every Associate table of the digest, sections 5 to
13, at the digest's precision. Every figure matched the digest to the printed
digit:

- Section 5: the AMENAM liquid line (area, pressure at the hole, driving
  pressure, 19.354651 kg/s, 18.704445 m/s), the head ladder, the ullage ladder
  (11.225132 at ambient), Torricelli 10.848032, the Cd and hole ladders, the
  Yellow Book acrylonitrile 58.429567 and its time-zero erratum 58.639369, and
  a `holeAreaM2` call in place of the diameter.
- Section 6 and 7: all seven pressure rows (ratio, regime, psi, density, rate),
  the five gamma rows and choking pressures, hydrogen at 1.405 and 1.4
  (15.311760, 15.292930), the boundary 186284.176006 Pa (CHOKED, psi
  1.000000000000; one part in a billion lower SUBSONIC, psi 1.000000000000,
  1.00e-9 relative), and a choked rate unchanged when ambient is lowered to
  50000 Pa.
- Section 8: the 400 m2 bund, the 50 m2 overtopping refusal (depth 0.600000),
  all four thicknesses, the no-bund refusal and the Yellow Book pool
  (42.445659 m, 1415.000000 m2).
- Section 9: the hexane-like pool, the wind ladder and the diameter ladder, and
  both refusals.
- Section 10: all 84 sigma cells with their warning flags, the sz2 misprint
  55.950288, the class G refusal.
- Section 11: the UBIT distance table, the class table, F over D 6.519887, the
  basis source string at 500 m in class D, the halving at a doubled wind
  (119.856420), the Purple Book 21.260627 g/m3, the three plume refusals.
  Q / (pi sy sz u) at 500 m, class D, evaluated by hand: 239.71284 mg/m3.
- Section 12: the three molar volumes and all 18 conversions, the molar mass
  refusal.
- Section 13: all six ground level distances, the round trip (100.000000), all
  four stack rows, BEYOND_SEARCH_RANGE at a 2000 m cap, the crosswind ladder,
  the target-zero refusal and the method string.
- Every refusal a bank or lesson quotes was provoked and its `error` and
  `field` compared verbatim (15 distinct refusals).

Every lesson exercise was run on the panel's own route (the `consequenceLab`
wrappers the panel calls, blank box = undefined): the boundary pressure typed
as 186284.176006 comes back CHOKED and a few pascals lower SUBSONIC; gamma 1.67
at 200000 Pa is SUBSONIC and 1.1 CHOKED; a 78.539816 m2 bund returns the 10 m
pool and 0.451595 / 0.970521 kg/s; a 60 m2 bund just confines the spill; the
stack at 100 m and 500 m reads 0.220101 and 130.556073 mg/m3; mg/m3 over ppm
times 24.465404 recovers 28.01.

## Key verdicts

No key sat on the wrong option. Every numeric key matches the engine. The
defects were in what distractors, keys and explanations claim.

## Defects found and repaired in the banks

1. **h4b_m03 Q9, a distractor true at printed precision (swap roles).** "They
   are identical to every printed digit, and the regime flag is the one
   difference": both rates print 0.096190 at six decimals, so a learner could
   defend it. Replaced with "A step of its own, since just below the boundary
   psi takes the 0.999177 printed for the last subsonic row"; the explanation
   now rebuts it (0.999177 is psi at 180000 Pa). Key and length rank unchanged.
2. **h4b_m03 Q2, a half-true distractor.** "It grows by 40.000000 in the
   upstream density alone": the density does grow by exactly 40.000000.
   Replaced with "It grows by 40.000000 squared, as density and speed both
   rise"; the explanation says the density grows by 40.000000 while the choked
   speed is fixed by the temperature and the gas.
3. **h4b_exam Q23, a distractor numerically identical to the key.** "The
   diameter the spill would reach if it spread with no bund at the stated
   thickness of 0.075000 m": 30 m3 at 0.075 m is 400 m2 and 22.567583 m, the
   keyed figure. Replaced with a run-length distractor; explanation reworded.
4. **h4b_exam Q40 key, an incomplete cause.** The stack peak was "set by the
   release, the stack height and the class"; it goes as one over the wind too.
   Key now names the release rate, the wind, the stack height and the class.
5. **h4b_m05 Q12 key and explanation, h4b_exam Q35 explanation: "24.45 is its
   rounding".** 24.465404 rounds to 24.47, never to 24.45 (24.45 is 6.30e-4
   low). Now "the printed 24.45 lies within one part in a thousand of it" /
   "approximates it" / "a published approximation". See the digest note below.
6. **h4b_m01 Q14 stem, an imprecise premise.** "The course writes a quantity
   per square metre four ways": the surface emissive power is also per square
   metre and is not one of the four. The stem now asks for the one word that
   is always qualified four ways (without writing it bare).
7. **h4b_exam Q31 explanation, a claim from one point.** "37.947332 m, which is
   far from linear": now compares 5.595029 m at 100 m with 37.947332 m at
   1000 m, less than seven times as much.
8. **Contrastive phrasing (copy rule spirit, the gate passes them):** m01 Q9
   "rather than winds", m01 Q11 "and not its source", m02 Q13 "a result, never
   an input", m03 Q10 "never the methane line's", m03 Q13 "never a default",
   m04 Q3 "never a bund", m04 Q11 "never its constant", m05 Q1 "mixing and not
   stability", exam Q23 "never a diameter", exam Q36 "added, never subtracted".
   Each reworded as a plain statement. Engine quotations ("its form and not
   physics") left verbatim.

Counts: keys 2 (exam Q40, m05 Q12), distractors 3 (m03 Q2, m03 Q9, exam Q23),
explanations and stems 4 plus 10 contrastive rewordings.

## Defects found and repaired in the lessons

1. **m04 l01, a false statement about the engine.** "The engine asks for the
   bund floor area and the wall height together." The wall height is
   optional; `poolFromSpill` with 50 m2 and no wall returns CONFINED at
   0.6 m deep. Now tells the analyst to give both and says the check runs only
   when a wall height is given.
2. **m04 l03, the same, stated as always.** "The engine performs it on every
   confined call. A bund result always means the liquid stayed below the
   wall." Now "every confined call that states a wall height" and "stood at or
   below the wall" (a depth equal to the wall is confined).
3. **m01 l04 and m05 l04, "24.45 is its rounding".** As bank defect 5.
4. **m01 l01, a false attribution.** "In its own words it turns..." quoted
   digest prose as the engine's words. Now "It turns...". The exercise asked
   for "every quantity the engine returns"; the panel shows three of the five,
   so it now says "every quantity the panel shows".
5. **m01 l02, a false attribution.** "The engine's own table of suffixes": the
   table is the course's, not an engine export. Now "The suffixes, for...".
6. **m02 l01 exercise not doable as written.** It asked why density raises
   "the pressure at the hole"; the panel does not show that quantity. Now "the
   driving pressure", which the panel shows.
7. **m02 l03, an unmeasured comparison.** "moves a result more than almost any
   other input" is now "for the same fractional change, moves a result faster
   than any other input on this line" (area goes as d squared, Cd linear, the
   rest under a square root).
8. **m02 l04, an unmeasured motive.** "names `pressureAboveLiquidPa` because
   that is the input most often mistyped": now "and that is the input to check
   first".
9. **m03 l03, two overclaims.** "most often a temperature or a molar mass"
   now "such as"; "agree to the last digit a double precision number carries"
   (the differences are 2e-16 to 6e-16, a few units in the last place) now
   "agree to within the rounding of double precision arithmetic".
10. **m05 l03, an unclear claim.** "without ever writing the plume formula the
    same way twice" (the integral does integrate the plume) now "checks the
    reflected plume against conservation of mass, which the formula must
    satisfy however it is written".

All lessons stay inside their word bands (lengths.py: 0 out of band).

## Checked and found clean

- Every other key, distractor and explanation in all 132 questions: the
  numbers match their rows, each distractor is wrong for the reason given.
- litsweep REVIEW items are deliberate: engine figures placed in a distractor
  under the wrong unit or role (11.225132 as m/s, 9.80665 as m/s, 21.260627 as
  mg/m3, 0.543927 as a relative gap, 0.999177 as a boundary psi), or small
  whole numbers in prose.
- The m01 l01 seam passage (point source, setbacks, individual risk, F-N, PLL
  words, risk matrices, emissions) is the declared seam lesson; no seam word in
  any h4b bank (gate_vocabulary 0 breaches).
- No capstone name, input or answer in any beginner lesson or bank.
- Every lesson exercise is doable on the ReleaseExplorer after the m01 l01 and
  m02 l01 edits. No beginner exercise asks for something the panel cannot do
  (class G, explicit sigmas, a search cap, an ambient pressure or a hole area
  are taught in prose only).

## The six Associate key truths, against the engine

1. CONFIRMED. 19.354651 kg/s, and 11.225132 with the ullage at ambient; the
   rate follows the square root of the driving pressure (head ladder: 6 to
   12 m moves the driving pressure 148688.915 to 198702.83 Pa and the rate
   19.354651 to 22.374228).
2. CONFIRMED. Choked from 250000 to 10000000 Pa the rate grows by 40.000000,
   the pressure ratio; the critical pressure ratio is 0.543927.
3. CONFIRMED. At 186284.176006 Pa the engine reports CHOKED with psi
   1.000000000000; one part in a billion lower SUBSONIC, psi 1.000000000000,
   rates 1.00e-9 relative apart.
4. CONFIRMED WITH A CONDITION. 30 m3 on 400 m2 stands 0.075000 m; in a 50 m2
   bund it stands 0.600000 m and is refused, because the 0.5 m wall is stated.
   The same call without a wall height returns CONFINED at 0.6 m (engine note
   1). The key truth should keep "behind its 0.5 m wall" in its sentence.
5. CONFIRMED. At z = h = y = 0 both exponentials are one and the kernel is
   Q / (pi sy sz u): 239.712839 mg/m3 at 500 m, class D.
6. CONFIRMED. Class F reaches 100 mg/m3 at 2564.337939 m, class D at
   830.322126 m.

## Engine doubts (no engine file touched)

1. **`poolFromSpill` fails open without a wall height.** `bundWallHeightM` is
   optional; when it is omitted the overtopping test is skipped and any depth
   is returned CONFINED (50 m2 bund: 0.6 m deep, no warning). A result, not a
   refusal, for a pool the engine cannot know is confined.
2. **`plumeDistanceToConcentration` drops the Briggs range warning.** Roots
   outside 100 m to 10 km come back with no extrapolation warning, and from a
   ground release the reported `peakConcentrationMgM3` is the value at the 1 m
   search floor (44245063.356826 mg/m3 in class D, 331688853.146475 in class
   F), far outside the curves' range, unflagged. The digest prints neither.
3. **"24.45 is its rounding" is wrong in the digest (section 12, line 440) and
   in the engine source comments** (header and `ppmToMgM3`). 24.465404 rounds
   to 24.47; 24.45 is 6.30e-4 low. The golden's one-part-in-a-thousand gate is
   correct. Suggest the digest say "approximates it".

## Gates after the repairs

- lengths.py --tier beginner: 0 out of band.
- lengthtails h4b --refuse 40: worst single strategy 33.3 pct.
- dupaxes h4b: 0 pairs at or above 0.45.
- gate_copy_rule: 0 violations. gate_vocabulary: 0 breaches.
- gate_capstone_leak: 18 findings, all of the form "[7 siblings]
  live:20261006_h4_consequence_course.sql/<capstone field>": the gate reads
  this course's own applied migration as a sibling. None in a bank or a
  lesson; the same 18 were reported before any edit.
- numsweep --banks: 1190 checked, 0 unresolved. numsweep --content: 590
  checked, 0 unresolved.
- litsweep h4b: 0 not in the digest, 0 forward, 0 back; REVIEW items above.
- bankleak beginner: 0. leakage --banks beginner: 0 fatal, 0 same-tier.
- Every changed bank re-emitted its json with no FAIL.
