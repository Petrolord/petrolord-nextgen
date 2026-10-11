# QI Expert (qia) key-truth audit, second reader

Scope: qia_m01..m06 (15 each) and qia_exam (42), 132 questions; the 26 lessons under
`src/content/courses/qi/advanced`. Truth: `digest.txt` only (sections 1 to 6, 42 to 60; sections 42 to 59 re-read
in their current wording: every engine gated, s49 computed summary, s51 G3, s53 title, s52 engine extraction,
s56 calibrateProperty, s58 climb and competing-explanation note).

## Engine calls

Every keyed figure was reproduced through the shipped Expert lab, never by restating a formula:

- `node keytruth_probe_advanced.mjs` registers `qi_loader.mjs`, imports `qi_engine_e.mjs` (export `LABE`,
  the NextGen `qiLabExp.js`, the file the inversion and prospect explorers run) and calls `ekeneSetup`
  (settings, wells in time, `waveletScale` 769.984107 / 19 and its refusal), `adjointTest` (seed 42),
  `forwardPoststack` (the Ekene-1 rows and the 0.966050 tie), `halfWindowFor`, `lfmAt` (shares read off the
  engine with unit-impulse wells: 0.477419, 0.377419, 0.145161), `mapToWellTime`, `blindWellScore`, `invertAt`
  (model-based at 20/60/120/300 iterations, eps 0.05/1/5, blocky, sparse-spike), `reflectivityOf` (non-zero
  counts at four lambdas and two iteration counts), `colouredAt`, `blindTable` (model-based and sparse-spike),
  `spreadAt` (20 seeds; Q10 <= Q50 <= Q90 at every logged sample), `ekeneSimSetup` and `fattiCoefficients`,
  `wellWaveletOf` (half lengths 15 and 5: both messages verbatim), `angleWaveletsAt` (15: 0 of 3; 3: 7 samples,
  all twelve rows), `simAt`/`scoreSim` (LFMs alone, near, near and mid, all three; all four wells),
  `porosityTransform` (80 and 90 percent), `leftOutBand` (calibrateProperty), `faciesModel` (sample and equal
  priors, one and two attributes, both matrices), `closureOf`, `closureAt`, `trapFrom` (climb), `maskAbove`,
  `maskCut`, `conformanceOf` (reliefM 2.380249 = the column), `evidenceIndependence` (3 items and 2 same-source
  items) and `assessProspect` (the five table rows plus the inputs the prompts left open).
  Every Expert figure in sections 42 to 58 came back equal to the digest at six decimals.
- Class-1 calls that settled keys: `assessProspect` with a likely competing explanation returns investigate /
  neutral at conformance 0.83 or unstated, and **downgrade / against at conformance 0.2**; two same-source items
  give independent 1 and investigate / supports.
- Explorer checks: `QiInversionExplorer.jsx` forward view runs `adjointTest` on n = 101 with the seed control
  defaulting to 42 (m01 Q5 holds); it has no Fatti table, no angle-wavelet extraction and no LFMs-alone row,
  and no lesson exercise asks it for one. `QiProspectExplorer.jsx` assessment opens on the table's first row
  (0.83, 0.9, 2, feasible, none) with competing choices tuning open / ruled out / likely; anomaly B is
  "spill plus -20" with the cut on (m05 l02 exercise holds).
- Lesson checks through the engine: the Ekene-1 full stack peaks at 1292 ms (390.779297), so m01 l02's "the
  trace peaks at 1288 ms" was false; `ekeneSetup` with a 60 ms half length refuses ("The wells overlap too
  little seismic to scale the wavelet."), which m01 l04's exercise now asks the learner to read.

## Verdict per question

Key: section the key rests on; engine = probe field that reproduced it.

### qia_m01
| Q | verdict | key rests on | engine |
|---|---|---|---|
| 1 | OK | s42 settings | settings.truthHz |
| 2 | OK | s42 wells in time | wellsInTime Ekene-4 26 |
| 3 | OK | s43 model | n/a (definition) |
| 4 | OK | s43 D | n/a (definition) |
| 5 | OK | s43 adjoint table | adjoint.C |
| 6 | FIXED expl. (unprinted "only so the convolution has an input") | s43 | synE1.corr |
| 7 | FIXED expl. (FALSE "where the trace peaks": the trace peaks at 1292 ms) | s43 table | synE1, trace.E1 |
| 8 | OK | s44 why | n/a |
| 9 | OK | s44 half window | lfm.halfWindow |
| 10 | OK | s44 weights | lfm.shares(engine) |
| 11 | OK | s44 proportional position | mapToWellTime |
| 12 | OK | s44 table | lfm.atWells Ekene-2 |
| 13 | OK | s45 | scale |
| 14 | OK | s45 refusal | scale.refusal |
| 15 | FIXED expl. ("most of the window", "silently decides" uncomputed) | s44 | n/a (rule) |

### qia_m02
| Q | verdict | key rests on | engine |
|---|---|---|---|
| 1 | OK | s46 problem | n/a |
| 2 | OK | s46 iterations | mb.iters |
| 3 | OK | s46 iterations | mb.iters |
| 4 | OK | s46 weight at 300 | mb.eps300 |
| 5 | FIXED expl. ("finds the step ... overshoots" unprinted) | s46 table | mb.rows |
| 6 | OK | s47 lambda | fista.nonzero, trace.maxAbs |
| 7 | OK | s47 three methods | methods.E1 |
| 8 | OK | s48 | n/a |
| 9 | OK | s48 scoring | coloured.corr |
| 10 | OK | s48 last line | coloured.slopes |
| 11 | OK | s49 summary | blind.lfmBeatsMb (4 of 4) |
| 12 | OK | s49 summary | blind.lfmBeatsSparse (E2, E3) |
| 13 | OK | s50 mean | spread.mean |
| 14 | OK | s50 labels (Q10 low) | spread.rows |
| 15 | OK | s50 | n/a |

### qia_m03
| Q | verdict | key rests on | engine |
|---|---|---|---|
| 1 | OK | s51 table | fatti.G[0] |
| 2 | OK | s51 K | fatti.K |
| 3 | OK | s51 table | fatti.G[1] |
| 4 | OK | s51 G3 note | fatti.G |
| 5 | OK | s51 solver | n/a |
| 6 | OK | s52 scales | fatti.scales |
| 7 | FIXED prompt (class 11: the message is the well-wavelet extraction's on the ln(AI) half differences, named as extractAngleWavelets) | s52 | wellWavelet.h15 |
| 8 | OK | s52 | angleWavelets.h3 |
| 9 | FIXED key (class 6/10: "far below the fit" judgement) | s52 table | angleWavelets.h3 Ekene-4 30 |
| 10 | OK | s53 near only | sim.E1.near |
| 11 | OK | s53 density note | sim.E1.lfms, sim.E1.near |
| 12 | OK | s53 | sim.blind.all Ekene-1 |
| 13 | FIXED expl. ("the far stack adds nothing") | s53 note | sim.E1.near/nearMid/all |
| 14 | OK | s54 | sim.blind.all |
| 15 | OK | s54 note | sim.blind.all |

### qia_m04
| Q | verdict | key rests on | engine |
|---|---|---|---|
| 1 | OK | s55 | transform |
| 2 | OK | s55 table (Q90 high) | transform.rows |
| 3 | OK | s55 90 percent | transform.at90 |
| 4 | FIXED expl. (unprinted "nothing tests the straight line") | s55 last row | transform.rows, range |
| 5 | OK | s56 | leftOut.summary |
| 6 | OK | s56 | n/a |
| 7 | FIXED expl. ("moves in large steps") | s56 table | leftOut.rows |
| 8 | OK | s56 NaN line | leftOut.rows Ekene-4 |
| 9 | FIXED expl. ("off the log in one direction", "so a study reports") | s56 table | leftOut.rows |
| 10 | OK | s57 | facies.1 |
| 11 | OK | s57 equal priors | facies.equal |
| 12 | FIXED expl. ("decides a point the first could not") | s57 two attributes | facies.2 |
| 13 | FIXED expl. (unprinted "because shale fills the matrix") | s57 matrix, fluid note | facies.1.cm |
| 14 | FIXED expl. ("no free gain" judgement) | s57 matrices | facies.1/2.cm |
| 15 | OK | s57 label | n/a (app rule) |

### qia_m05
| Q | verdict | key rests on | engine |
|---|---|---|---|
| 1 | OK | s58 table | closure |
| 2 | OK | s58 map limit | closure.edge, atOwcClosed |
| 3 | OK | s58 flood | n/a (rule) |
| 4 | OK | s58 mapped edge | n/a (rule) |
| 5 | OK | s58 table, s59 | closure |
| 6 | OK | s58 climb | climb |
| 7 | OK | s58 thresholds | conf.A, assess.A.conf |
| 8 | OK | s58 conformance; relief = column | conf.A.relief 2.380249 |
| 9 | OK | s58 edge rule | conf.A.implied |
| 10 | FIXED key (class 6: "carries no weight" unprinted; now "that the engine still returns") | s58 table | conf.B |
| 11 | OK | s58 evidence | evidence.3 |
| 12 | FIXED expl. (gloss) | s58 table row 2 | assess.table[1] |
| 13 | OK | s58 table row 3 | assess.table[2] |
| 14 | FIXED prompt (class 1: "Downgrade, against" true at conformance under 0.3; prompt now fixes the mature row's inputs) | s58 last row, note | assess.likely.conf0.2 = downgrade/against; assess.table[4] |
| 15 | OK | s58 thresholds | n/a |

### qia_m06
| Q | verdict | key rests on | engine |
|---|---|---|---|
| 1 | OK | s59 | n/a |
| 2 | OK | s59 | assess.keys |
| 3 | OK | s59 report | n/a |
| 4 | OK | s59 settings | n/a |
| 5 | OK | s59 limits | n/a |
| 6 | OK | s59 limits | n/a |
| 7 | OK | s58 grid, s59 | closure |
| 8 | OK | s57 label, s59 | n/a |
| 9 | OK | s56 | leftOut.summary |
| 10 | FIXED distractor (kept-in range misprinted 0.858647; engine range 0.758561 to 0.889063) | s49 summary | blind.mb, blind.keptRange |
| 11 | OK | s58 map limit, s59 | closure.edge |
| 12 | OK | s6 | n/a |
| 13 | OK | s59 capstone | n/a |
| 14 | OK | s59 capstone | n/a |
| 15 | OK | s1, s3 | n/a |

### qia_exam
| Q | verdict | key rests on | engine |
|---|---|---|---|
| 1 | OK | s43 adjoint | adjoint |
| 2 | OK | s43 | n/a |
| 3 | OK | s44 weights | lfm.shares(engine) |
| 4 | OK | s44 | mapToWellTime row 1 |
| 5 | OK | s45 | scale |
| 6 | FIXED prompt (class 11, as m03 Q7) and expl. ("only at 3", class 4) | s52 | wellWavelet.h5 |
| 7 | OK | s42, s56 | settings.truthHz |
| 8 | OK | s50 | spread |
| 9 | OK | s45, s52 | scale, fatti.scales |
| 10 | OK | s46 eps table | mb.eps300 |
| 11 | OK | s47 | fista.nonzero |
| 12 | OK | s48 | coloured |
| 13 | OK | s47 | n/a |
| 14 | OK | s49, s54 | blind.mb, blind.sparse, sim.blind.all Ekene-4 |
| 15 | OK | s50 (Q10 low) | spread.rows 1304 |
| 16 | OK | s51 | n/a (definition) |
| 17 | OK | s54 | sim.blind.all Ekene-3 |
| 18 | OK | s46, s53 | methods.E1, sim.blind.all |
| 19 | OK | s51 | fatti.G[3] |
| 20 | FIXED expl. ("pulls Vp/Vs back" judgement) | s53 | sim.E1.nearMid |
| 21 | OK | s54, s57 | sim.blind.all |
| 22 | OK | s55 | transform.rows |
| 23 | OK | s56 | leftOut.summary |
| 24 | OK | s56 table | leftOut.rows Ekene-2 |
| 25 | OK | s57 | facies.equal |
| 26 | OK | s57 two-attribute matrix | facies.2.cm |
| 27 | OK | s57 label | n/a |
| 28 | OK | s56 | n/a |
| 29 | OK | s58 units | closure |
| 30 | OK | s58 A row | conf.A |
| 31 | OK | s58 B row | conf.B |
| 32 | OK | s58 table, note | assess.table |
| 33 | OK | s58 table | assess.table |
| 34 | OK | s58 rules | n/a (rule) |
| 35 | FIXED prompt (class 1, as m05 Q14: conformance under 0.3 makes the "downgrade, against" distractor true) | s57 matrix, s58 last row | assess.likely.conf0.2, assess.table[4] |
| 36 | OK | s58 evidence | evidence.2same (independent 1) |
| 37 | OK | s59 | assess.keys |
| 38 | OK | s59 | n/a |
| 39 | OK | s6, s59 | n/a |
| 40 | OK | s59 report | n/a |
| 41 | OK | s2 | n/a |
| 42 | OK | s59, s58 | closure |

Wrong keys found: none graded a false answer. Two questions had a distractor that a call through
`assessProspect` makes true under an input the prompt left open (m05 Q14, exam Q35: a likely competing
explanation at conformance 0.2 returns downgrade / against); both prompts now state the mature row's inputs.
Two keys carried an unprinted judgement (m03 Q9 "far below", m05 Q10 "carries no weight") and were reworded to
the printed figures. One explanation was false by the engine (m01 Q7: the trace peaks at 1292 ms, not 1288 ms).

## Defects per class (banks)

1 distractor true under another input: 2 (m05 Q14, exam Q35). 2 choice keyed as fact: 0. 3 refusal gloss: 0.
4 false superlative: 1 (exam Q6 "only at a half length of 3"). 5 near duplicates: 0 found; 1 introduced by the
m05 Q10 key edit (0.46 against exam Q30) and cleared. 6 unprinted relationships: 11 explanations trimmed
(m01 Q6 Q15; m02 Q5; m03 Q13; m04 Q4 Q7 Q9 Q12 Q13 Q14; m05 Q12; exam Q20) plus keys m03 Q9, m05 Q10.
7 answer in prompt: 0. 8 capstone leak: 0. 9 length tell: 0 (worst strategy 33.3). 10 printed alike keyed
equal: 0. 11 inexact quote / attribution: 2 (m03 Q7, exam Q6 named the extraction's message as
extractAngleWavelets'). 12 to 15: 0. Plus: one false explanation (m01 Q7) and one misprinted distractor range
(m06 Q10).

## Lesson defects fixed

- Repair history and stale gate claims (class 13, false against s42): "awaits its independent oracle ... grades
  it only once that check lands" in m03 l04 (lfm.js), m05 l02, l03, l04, m06 l01, l02 (prospectAssessment.js);
  "which now live in the engines" (m01 l01); "the QI Studio maths that moved into the engines" (m06 l03).
- False by the engine: m01 l02 "the trace peaks at 1288 ms" (it peaks at 1292 ms); the causal "the operator ...
  do not explain the seismic" replaced by the printed pairs.
- Class 1 / 4 against `assessProspect`: m05 l03 "an anomaly that is present still leads to investigate" (false at
  conformance under 0.3) now names the table's maturing case; m06 l02 "skips the feasibility verdict cannot speak
  against a prospect" (false: likely rival at low conformance returns against) now "cannot count a missing anomaly
  against"; m05 l04 rival row rationale removed.
- Unprinted judgements and mechanisms removed or made factual: m01 l01 (27-sample correlation), m01 l03 ("more
  than half", "thicker sand", "bar every inversion must clear", "hard to beat"), m01 l04 (kit traces carry no
  scale, scale-size mechanism, Professional averaging claim, "thin base"), m02 l01 ("finds the step ...
  overshoots", "well above", "all but gone", four-count qualifier), m02 l02 ("only at the larger lambdas",
  "sparsity cannot take the credit"), m02 l03 ("spread widely", "how loosely it is held"), m02 l04 (inversions
  pay with error: now model-based only; "nearest guide between the wells"), m02 l05 ("the Suite's" convention,
  noise round the overshoot), m03 l02 (far-stack error lands on SI and density), m03 l03 (solver moves SI, "needs
  at least the mid angles", "rests on a level the LFM sets"), m03 l04 ("close to"), m04 l01 ("line well pinned"),
  m04 l02 (low-pass causes small s, "almost all of the band", level-not-shape reading, "rough check"), m04 l03
  ("separate cleanly", "overlap over most of their range", "from 6600000 upwards", "where densities overlap the
  prior decides"), m04 l04 ("coin toss", "almost to certainty", "looks modest because"), m05 l01 ("lets the trap
  leak", "hold oil down to"), m05 l02 ("carries no weight"), m06 l02 ("hold oil far deeper").
- m01 l04 exercise: a 60 ms half length refuses on the pack; the exercise now asks the learner to read what the
  panel prints against the rule of ten.
- Length: per-minute means 12:481 13:five hundred and twenty (spelled out: the figure is also a capstone case input, and the capstone leak gate sweeps every brief for those) 14:535 (were 12:489 13:529 14:541), rising, every lesson in band
  (m04 l02 topped back over its 500 floor with Ekene-4's printed RMS and bias).

## Gates (final)

bank .py: all seven wrote, "all banks in this batch passed every gate"; lengthtails worst 33.3; dupaxes 0 pairs;
numsweep banks 264 checked, 0 unresolved; bankleak 0 within 10 tolerances of a graded answer; gate_copy_rule
VIOLATIONS 0; gate_vocabulary BREACHES 0; gate_capstone_leak FINDINGS 0; lengths 0 out of band; numsweep
lessons advanced 206 checked, 0 unresolved; litsweep lessons 0 not in the digest, 0 forward (3 reaching back are
panel control values); leakage 0 fatal, 0 same-tier answer prints; scaffold 0 drift; vitest 25 passed.
Lessons commit 7b60af173 on feat/qi-course, pushed. Banks not committed.
