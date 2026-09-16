# FC5. Relief & Flare Systems. The writing brief.

The fifth Facilities course. Module `facilities`, `path_order` 43, slug
`relief`, no prerequisite. Engine, as repaired before this course in FC5-0
(petrolord-engines #200, merged 3bac13cd):
`packages/engines/engines/facilities/relief.js`, the Relief & Flare Studio's
whole calculation surface. API 520 Part I sizing in its published USC forms for
gas and vapour in both flow regimes, liquid with the published viscosity
correction, and steam with the Napier correction; the API 521 fire case from
wetted geometry to a relief load; the flare side, droplet settling, a
horizontal knockout drum, and point-source radiation solved in both
directions; and an adiabatic vessel blowdown march. Its sibling
`packages/engines/engines/facilities/spacing.js` is vendored with it because the
repaired suite asserts the two published radiation tables stay equal. Golden:
`packages/engines/test-data/facilities/goldens/relief_cases.json`, 49 rows
across 11 blocks. Repair record:
`packages/engines/tools/validation/facilities/FINDINGS-relief.md`, with its
controls in `negcontrol_relief.sh` beside it.

Teaching digest: `digest.txt`, 982 lines and 29 sections, built by
`build_digest.sh` from `fc5_dump.mjs` and NEVER hand edited. Committed copy:
`tools/course-waves/relief/digest.txt` in the NextGen repository, pinned by
sha256 in `tools/course-waves/waves.json`. Teaching lab, to be built:
`src/components/course/panels/relief/reliefLab.js`.

## EVERY NUMBER IN THIS BRIEF IS QUOTED FROM THE DIGEST

This sentence is here because of what it cost once. Two figures in a sibling
wave's Expert brief came out of that wave's RECON REPORT rather than its
digest, and both were wrong. The writer was right to refuse to use them. So:
every figure below was copied out of `digest.txt` at the precision the digest
prints it at, and the section it came from is named. A RECON-REPORT NUMBER IS
NOT DIGEST TRUTH. If a number you want is not in the digest, the lesson does
not get that number, and you say so in your hand-back so the digest can be
extended instead of the lesson invented.

## The one-sentence thesis

A relief system is sized by choosing the case, because every number this
engine returns is the size that one chosen case demands, and the engine never
chooses the case.

Every sizing route in this module takes a relief load as an INPUT. The one
route that computes its own load is the fire case, and it computes it from
geometry, a drainage answer and an environment factor the caller states. The
discipline of the subject is picking the governing scenario and then knowing,
of every number the answer rests on, whether the engine worked it out or
somebody copied it off a chart.

## What each tier OWNS

- **Associate, THE DEVICE AND THE THREE FLUIDS IT PASSES.** What this engine
  sizes and what it refuses; set pressure, overpressure, relieving pressure
  and the three different quantities this platform calls back pressure; gas
  and vapour with the branch the back pressure decides; liquid with the
  viscosity loop that needs the answer to find the correction that sets the
  answer; steam with the Napier correction and both of its crossings of unity;
  and the API 526 ladder from a required area to a letter. The tier ends able
  to say, of any route, which correction the engine COMPUTED and which one it
  TYPED.
- **Professional, WHERE THE LOAD COMES FROM AND WHERE THE LIQUID GOES.** The
  wetted area of a vessel in a pool fire, exactly, in both orientations; the
  pool fire duty, its two constants, its exponent and its credit; the fire
  case end to end from geometry to a letter; droplet settling as the third
  answer this academy gives to one question; and the flare knockout drum,
  where the same circular segment decides both how much vapour space there is
  and how far a droplet has to fall. The tier ends able to say what a stated
  fraction is a fraction OF.
- **Expert, A VESSEL EMPTYING ITSELF AND WHAT THE ANSWER RESTS ON.** The
  blowdown march, mass out through a choked orifice and isentropic inside;
  reading a depressuring time off a curve and the orifice that buys it; a step
  size as part of the answer; the point source asked both ways and the two
  tables with the same numbers; then the audit, which on this engine is
  unusually rich, and the one section whose subject is what this engine used
  to do.

## The results the course is built on (digest section in brackets)

Every figure is quoted from the digest.

1. **In critical flow the required area does not move with the back pressure
   at all** [4]. ORUBIRI carries 68000.000000 lb/hr at a set pressure of
   420.000000 psig and 10.000000 percent overpressure, which is a relieving
   pressure of 476.700000 psia, against a back pressure of 49.700000 psia. The
   branch is critical, the critical ratio is 0.551208, the required area is
   2.223779 in2 and the orifice is L at 2.853000 in2 with a margin of
   1.282951. Walk the back pressure as a ratio and the first five rows are
   identical.
2. **Kb is ignored in subcritical flow, and the engine says so** [4]. The same
   call at two different bellows factors above the critical ratio returns
   2.658695041098 in2 and 2.658695041098 in2, one figure to twelve decimals,
   with a warning on the second.
3. **The viscosity loop is worth something and a single pass is not enough**
   [6]. AKASO inviscid is 1.839323 in2 at a Kv of 1.000000 with a Reynolds
   number of null. Viscous it is 1.867758 in2 at a Kv of 0.984776 and a
   Reynolds number of 17412.317969, converged in 6 passes. The ratio of the
   two areas is 1.015459516779, and the ratio of the converged area to what
   ONE pass would have given is 1.000083905751.
4. **The Napier correction steps rather than sliding** [2, 8]. The threshold
   measured by bisection is 1500.000000000007 psia. A millionth of a psi below
   it KN is 1.000000000000 and a millionth above it KN is 0.995677635301. It
   returns through unity at 1580.310880829016 psia, which the engine also
   exports, and between those two pressures the correction makes the required
   area LARGER. TEBIDABA at 1928.700000 psia has a KN of 1.021727 and needs
   0.949984 in2, orifice J.
5. **The fire case computes its own load, and the whole chain is visible**
   [16]. BENISEDE gives a wetted area of 683.6960 ft2, a duty of
   4434115.2612 Btu/hr, a relief load of 34641.5255 lb/hr, a relieving
   pressure of 347.450000 psia, a required area of 1.578271 in2 and orifice K
   at 1.838000 in2 with a margin of 1.164566.
6. **Half full is the one case with an analytic answer** [12]. At a level of
   exactly 6.000000 ft on a twelve foot vessel the wetted area is 848.2300 ft2
   and half the lateral surface is 848.2300 ft2, a ratio of 1.000000000000.
   Any geometry that is wrong away from half full can still be exactly right
   there.
7. **At half depth the area fraction is a half, and only there** [18]. The
   segment area fraction at a depth fraction of 0.5 is 0.500000000000. Read
   the table at 0.1 and at 0.75 to see how far apart the two get.
8. **The holdup moves the drum** [18]. Across its whole range the ODIDI drum's
   required length runs from 6.997154 ft to 44.344927 ft, a spread of
   37.347773 ft, while the vapour velocity runs from 3.340002 ft/s to
   1973.354184 ft/s. The stated drum is 9.000000 ft across at a holdup of
   0.300000, with a vapour velocity of 4.467129 ft/s, a required length of
   7.026927 ft and an L over D of 0.780770.
9. **The march has a closed form and the digest uses it** [21]. AFIESERE
   reaches its end pressure in 268.419002 s at a final temperature of
   340.807983 degR. The closed-form integral of the same balance gives
   268.418973 s, a ratio of 0.999999894249.
10. **Refining the step converges** [23]. Across a sixty-four-fold refinement
    the time moves by 0.002015907907 s in total, which is smaller than the
    precision the digest prints a time at.
11. **The fifteen-minute question is answered by bisection rather than asserted**
    [22]. The orifice at which the AFIESERE vessel takes exactly fifteen
    minutes is 0.682646 in, where the march returns 900.000000 s.
12. **The point source, on the flare AFIESERE discharges to** [25]. The heat
    release derived from the two stated figures is 1193971.5392 kW, and at the
    stated 140.000000 m the intensity is 1.427138 kW/m2.
13. **Every route keeps one contract** [1, 26]. The module has 22 exports: 7
    return a bare number and signal a refusal with NaN, 12 return an object,
    2 are published tables and 1 is a derived constant. 42 refusals are run in
    the digest across 12 of the routes, every one reached by ONE bad input
    with everything else sound.
14. **The published set is 49 rows across 11 blocks** [28]: blowdown 5,
    dropout 4, drum 6, fire 4, gas 5, liquid 5, load 3, radiation 3, setback
    2, steam 5, wetted 7.

## The nine HELD items, taught as stated limits and NEVER as answers

Section 27 is the standing form of this list and section 2 MEASURES every
figure in it.

1. **The Kv viscosity fit's three coefficients.** An empirical fit no route in
   this package can derive. Shared with the validation oracle on purpose.
   Section 6 prints what each of its three terms is worth as a fraction of the
   sum across a Reynolds sweep, which is how the band is computed rather than
   asserted. The unclamped fit asymptotes to 1.006542523506 and the clamp holds
   the correction at one above a Reynolds number of 196282.561354814417.
2. **The sphere-drag correlation and its low-Reynolds cap of 240.000000000000.**
   Same class, same reason.
3. **The API 526 orifice table.** A published table. Checked as BEHAVIOUR: the
   ladder, both selection boundaries and the refusal past the largest.
4. **Kb, Kw and KSH.** Published charts and tables, so typed inputs with their
   references named.
5. **The four customary allowable radiant intensities and their labels.**
   Customary values with wording this package wrote. Two engines export the
   same table and a test asserts they stay equal.
6. **The pool fire constants 21000.000000000000 and 34500.000000000000 and the
   exponent 0.820000000000.** The oracle checks the USC pair against the
   published SI pair, which checks the unit packaging and not the physics.
7. **The Napier boundaries 1500.000000000007 psia and 3200.000000000003 psia.**
   Published boundaries, pinned as behaviour.
8. **The 25 ft wetted-height limit.** The truncation is the caller's job and
   arrives as a note on every duty.
9. **Whether API 521 prints 1.15 or the exact 4/3.** No copy of the standard
   is here. The engine evaluates the BALANCE, which is the derivation both
   forms come from, and section 17 measures the coefficient out of the
   returned pair.

## Hard rules for every lesson

- The word band is in `structure.py`: a twelve-minute lesson clears 420 prose
  words, a thirteen-minute one 460 and a fourteen-minute one 500, and the
  ceiling is 560 for all of them. The measure is PROSE WORDS as `lengths.py`
  counts them, with front matter, table rows, headings and `{{panel:...}}`
  lines excluded. A raw `wc -w` is NOT this measure.
- Every number is copied from the digest at the digest's precision, or is
  arithmetic on digest numbers stated in the lesson.
- Quote a published case's NUMBERS, never a published case's description.
- Owner copy rule: no em dashes, no en dashes, no "X, not Y" contrastives
  anywhere a learner reads, H1s included.
- A lesson title carries counts only, never a measurement.
- The panel line `{{panel:<id>}}` appears exactly as `structure.py` lists it.
- FOUR NAMING COLLISIONS, legislated before a word is written. Bare "relief"
  already means a relief WELL in the drilling courses, so always write
  "pressure relief" or "relief valve". Bare "safety valve" already means the
  downhole SCSSV across about twenty lessons, so always write "pressure safety
  valve (PSV)". Bare "back pressure" already means the MPD choke and the
  Rawlins and Schellhardt equation, so always qualify it as back pressure at
  the relief valve outlet. Bare "critical flow" collides with a critical
  FLOWING pressure, so write "critical flow through the valve" or "choked".
- FIVE SCOPE SEAMS. The flare setback and the four allowable intensities
  belong to `separation`, which is merged and GRADES a setback. Critical
  against subcritical flow through a port belongs to `gaslift`. The droplet
  terminal velocity balance belongs twice over, to `gaswell` and to
  `separation`. Cooldown and no-touch time belong to `flowassurance`, whose
  own lesson names no depressurisation as its exclusion, which is the one
  place the live catalogue points AT this course. What a knockout drum is
  belongs to `gasprocessing`, which already wrote the deferral to copy.
- Teach the engine as repaired. Digest SECTION 29 is the ONE place whose
  subject is what it used to do, and it says so in its own title and first
  line.

## LEAKAGE BAN

The capstone runs its own plants, written in `fc5_fields_capstone.mjs` and
`fields.json`. They are called KOLO CREEK, OGBAINBIRI and GBARAN. Lesson
writers never read those files, never name those three plants, never guess a
capstone value, and never print a number that is not in the digest. Nothing
about any of them is in the digest, which is how it stays: `gate_capstone_leak.py`
checks 38 conditions against the digest and the generator, 18 graded values at
three renderings each, 11 recorded engine calls against all 49 published golden
rows, and all 18 against the graded answer key of the merged `separation`
course, because that course grades a setback off the same point source.

## Section map of the digest (the headers read "SECTION n:")

| section | content | owned by |
| --- | --- | --- |
| 1 | what this engine sizes, the export contract, the refusal contract | Associate m01 |
| 2 | every constant MEASURED, and every threshold bisected | Associate m01 l04, Expert m05 l01 |
| 3 | set, overpressure, relieving, and three things called back pressure | Associate m01 l02, l03 |
| 4 | gas and vapour, and the branch the back pressure decides | Associate m02 |
| 5 | the published gas cases | Associate m02 l05 |
| 6 | liquid, the Kv loop, and what each fit term is worth where | Associate m03 |
| 7 | the published liquid cases | Associate m03 l05 |
| 8 | steam, Napier, and both crossings of unity | Associate m04 |
| 9 | the published steam cases | Associate m04 l04 |
| 10 | from a required area to a standard orifice | Associate m05 |
| 11 | one Associate scenario, end to end | Associate m06 |
| 12 | the wetted area in both orientations, exactly | Professional m02 |
| 13 | the published wetted-area cases | Professional m02 |
| 14 | the pool fire duty, its constants, its exponent, its credit | Professional m03 |
| 15 | the published fire and relief-load cases | Professional m03, m04 |
| 16 | the fire case end to end, geometry to letter | Professional m04 |
| 17 | droplet settling, drag against weight, iterated | Professional m05 l02, l03 |
| 18 | the knockout drum, a level, a segment and a length | Professional m05 l04, l05 |
| 19 | the published dropout and drum cases | Professional m05 |
| 20 | one Professional scenario, end to end | Professional m06 |
| 21 | the blowdown march, and its closed form | Expert m01 |
| 22 | reading a time off a curve, and the orifice that buys it | Expert m02 |
| 23 | a step size is an answer | Expert m03 |
| 24 | the published blowdown cases | Expert m01, m02, m03 |
| 25 | the point source both ways, and two tables with the same numbers | Expert m04 |
| 26 | every refusal, and the contract behind them | Expert m05 l04 |
| 27 | what is computed, what is typed, what is never checked | Expert m05 l01, l03 |
| 28 | what the published cases can and cannot discriminate | Expert m05 l02, l05 |
| 29 | WHAT THIS ENGINE USED TO DO, and nothing follows it | Expert m06 |

A lesson does not reach forward into a later tier's sections. Professional m01
is the entry module and draws on sections 1, 2 and 12; Associate m06 and
Professional m06 and Expert m06 are the reading modules and draw on 11, 20 and
29 respectively.
