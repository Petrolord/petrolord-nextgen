# QI Professional (qii) key-truth audit, second reader

Scope: qii_m01..m06 (15 each) and qii_exam (42), 132 questions; the 26 lessons under
`src/content/courses/qi/intermediate`. Truth: `digest.txt` only (sections 1 to 6, 22 to 41, 60;
sections 24, 27 and 38 re-read in their current wording).

## Engine calls

Every keyed figure was reproduced through the shipped Professional lab, never by restating a formula:

- `node keytruth_probe_intermediate.mjs` registers `qi_loader.mjs`, imports `qi_engine_p.mjs` (export
  `LABP`, the NextGen `qiLabPro.js`) and `qi_engine.mjs`, and calls `synthetic`, `wellStatWavelet`,
  `waveletSpectrum`, `rickerOf`, `wellWavelet` (half lengths 15, 5, 3), `phaseMatch`, `rotate`,
  `bulkShift` (four wells and the moved checkshots), `tieWarp` (designed pair, single anchor, folding
  pair), `checkshotTwt`, `compare` (plain, Ekene-3 at 90 and 180, all four at 60), `resample`,
  `packGather`, `offsetBins`, `foldOf`, `pickEvent`, `velocityAt` (1292 ms and past the table),
  `stretch`, `muteOffset`, `rmo` (all 12 gathers), `angles`, `usable`, `dix` and its refusal,
  `walden` (Ekene table, the teaching earth, a sine above one), `layered`, `rayTrace`, `stackOf`,
  `traceWindow`, `shueyFit` (two terms, three terms, nine bins, a far gap), `trend`, `off`,
  `contrasts` (Vs/Vp 0.4, 0.5, 0.6 and unscaled), `chi`, `classOf` and `packAvoAtWells`.
  Every Professional figure in sections 23 to 41 came back equal to the digest at six decimals.
- Explorer checks (`QiPrestackExplorer.jsx` startState): the default event and sample time are
  1289 ms (round of the checkshot top), which reads sample 1288 ms in the angle and AVO views (fold
  3, 4, 4) and Walden 31.973199 at 1500 m in the Dix and Walden view; every lesson exercise that
  reads a 1292 ms figure sets Sample time or Time to 1292 ms first (checked). The scale control
  starts at 1; m05 l04 sets 1882.216944. The explorer has no well wavelet, no anchors and no added
  phase; the lessons that touch these say so and work them by hand.
- Lesson checks through the engine: fitShuey with the far amplitude lowered by 100 moves A by about
  30 and B by about 480, and one scale on every stack keeps B/A (m05 l05 claims kept); the qi
  avoClass and the rockphysics avoClass differ at both band edges (`classOf(0.02,-0.1)` I against
  II; `classOf(-0.1,0)` IV against III), so m06 l02's rule was the wrong engine's.

## Verdict per question

Key: section the key rests on; engine = probe field that reproduced it.

### qii_m01
| Q | verdict | key rests on | engine |
|---|---|---|---|
| 1 | OK | s22 bookkeeping, 8 ms pick | pickEvent |
| 2 | OK | s22 units, trace units | n/a |
| 3 | OK | s23 (m/s)(g/cc); s4 6639.018603 | n/a (convention) |
| 4 | OK | s23 gaps | syn1.live 26 |
| 5 | OK | s23 26 live samples | syn1.live |
| 6 | OK | s23 -0.190340 at 1312 | syn1.rcMax, rcMaxMs |
| 7 | OK | s25 Ekene-1 phase | phase.E1 |
| 8 | OK | s24 measured phase | n/a |
| 9 | OK | s24 120 ms, 5 Hz | stat.* |
| 10 | REWRITTEN (class 6 / unprinted "why": "no trace sample qualifies" was learner arithmetic) now keys the half-length table: 3 samples, 7-sample wavelet from 20, 0.946989 | s24 well-wavelet table | wellWavelet.h15/h5/h3 |
| 11 | FIXED key (classes 6/10: "well above", "close to" judgements) now the four printed figures | s24 table + Ricker | stat.Ekene-1, ricker25 |
| 12 | OK | s24 table | stat.Ekene-4 |
| 13 | OK | s25 designed 90 | phase.add90 |
| 14 | OK | s25 reason printed | n/a |
| 15 | OK | s25 rotation | rotate.0and180 |

### qii_m02
| Q | verdict | key rests on | engine |
|---|---|---|---|
| 1 | OK | s26 sign | bulk.moved-8 |
| 2 | FIXED expl. (class 6 gloss) | s26 table | bulk.* |
| 3 | OK | s26 search | bulk.* |
| 4 | FIXED expl. (unprinted "because") | s26 designed | bulk.moved-8 |
| 5 | OK | s26 anchors | warp2 |
| 6 | OK | s26 single anchor | warp1.shift-4 |
| 7 | FIXED expl. ("stretch or squeeze" gloss) | s26 fold | warp.fold REFUSED |
| 8 | OK | s27 record | n/a |
| 9 | OK | s27 top | topTwt.Ekene-1 |
| 10 | REWRITTEN prompt and key (garbled "times below the shift"; now s27's current bulk-shift wording); distractor lengthened (rank gate) | s27 bulk shift paragraph | warp1.shift-4 |
| 11 | OK | s28 | compare |
| 12 | OK | s28 matrix | compare.matrix |
| 13 | OK | s29 average | average |
| 14 | OK | s30 designed | compare.E3rot90/180 |
| 15 | OK | s30 rules | n/a (app rule) |

### qii_m03
| Q | verdict | key rests on | engine |
|---|---|---|---|
| 1 | OK | s31 gather 5 | g5 |
| 2 | OK | s31 bins | bins200 |
| 3 | OK | s31 centre | bins200.summary |
| 4 | OK | s31 pick; s22 rule | pick.g5 |
| 5 | FIXED expl. ("climbing faster" unprinted) | s32 | stretch |
| 6 | OK | s32 velocity | vel.1292 |
| 7 | FIXED expl. ("carry almost all" judgement) | s32 table | stretch |
| 8 | OK | s32 mute | mute |
| 9 | OK | s33 fit rule | rmo.g5 |
| 10 | OK | s33 lags | rmo.g5.lagsLast3 |
| 11 | OK | s33 condition | rmo.g5.method |
| 12 | OK | s33 table | rmo.all |
| 13 | OK | s34 fold | angle.g5.fold |
| 14 | OK | s32 table, limit | stretch, mute |
| 15 | OK | s31 mute | n/a |

### qii_m04
| Q | verdict | key rests on | engine |
|---|---|---|---|
| 1 | FIXED key ("thin interval" unprinted) | s35 table | dix |
| 2 | OK | s35 refusal | dix.refusal |
| 3 | OK | s35 on a trace | vel.1292 |
| 4 | FIXED expl. ("silently decides every angle" uncomputed) | s35 flat outside | vel.beyond 2328.6 |
| 5 | OK | s36 Ekene table | walden.ekene |
| 6 | FIXED expl. ("margin no field measurement could resolve" unprinted) | s36 teaching earth | earth.rows |
| 7 | OK | s36 sine above one | walden.sinAbove1 90 |
| 8 | FIXED expl. (class 6/2: "farthest offsets carry the mute" ties Walden to the kit's unmeasured angle) | s36, s31 | walden.ekene |
| 9 | OK | s37 mute zeros | n/a |
| 10 | OK | s37 table | angle.g5 |
| 11 | OK | s38 | n/a |
| 12 | OK | s38 table | stacks |
| 13 | OK | s34 usable | usable |
| 14 | OK | s34/s38 | usable |
| 15 | OK | s35 first row | dix[0] |

### qii_m05
| Q | verdict | key rests on | engine |
|---|---|---|---|
| 1 | OK | s39 table | shuey2 |
| 2 | FIXED expl. (gloss) | s39 exactly determined | shuey3 |
| 3 | FIXED expl. (class 6: "part of the fall split off into C"; C is positive) | s39 | shuey3 |
| 4 | OK | s39 finite amplitudes | shuey2.farGap n 2 |
| 5 | OK | s39/s41 units | n/a |
| 6 | OK | s39 volumes | n/a |
| 7 | FIXED expl. (OLS gloss) | s40 trend | trend |
| 8 | OK | s40 176, m | trend |
| 9 | OK | s40 off-trend | offTop |
| 10 | OK | s40/s60 sign | n/a |
| 11 | FIXED expl. (FALSE: "each moves with the stated Vs/Vp"; dVp/Vp and drho/rho do not) | s40 | contrasts.0.4/0.5/0.6 |
| 12 | FIXED expl. (gloss) | s40 Gardner | contrasts.0.5 |
| 13 | FIXED expl. (gloss; then de-duplicated from exam Q37) | s40 | contrasts.unscaled (distractor "scale cancels" false) |
| 14 | OK | s40 chi | chi |
| 15 | OK | s40 conditioning | n/a |

### qii_m06
| Q | verdict | key rests on | engine |
|---|---|---|---|
| 1 | FIXED expl. (unprinted rationale) | s41 scale | avoWells.scale |
| 2 | OK | s41 | avoWells.scale |
| 3 | FIXED expl. wording | s41 issues | n/a (app rule) |
| 4 | OK | s3 rule, s41 | avoWells Ekene-2 layer net sand |
| 5 | OK | s41 pick | avoWells Ekene-2 pickMs 1304 |
| 6 | OK | s41 fit | n/a |
| 7 | OK | s41 / s39 | avoWells, shuey2 |
| 8 | OK | s41 residual | avoWells |
| 9 | FIXED expl. (gloss; then de-duplicated from exam Q40) | s41 table | avoWells residuals |
| 10 | OK | s41 table | avoWells Ekene-1 scaled |
| 11 | FIXED expl. ("the easy kind" judgement) | s41 | avoWells agree 4 |
| 12 | OK | s41/s6 | n/a |
| 13 | OK | s41 capstone | n/a |
| 14 | OK | s6 | n/a |
| 15 | OK | s41 six figures | n/a |

### qii_exam
| Q | verdict | key rests on | engine |
|---|---|---|---|
| 1 | OK | s23/s26 | bulk.Ekene-1 |
| 2 | OK | s22 table | n/a |
| 3 | OK | s24 | n/a |
| 4 | OK | s24 | ricker25, stat.Ekene-4 |
| 5 | OK | s22 units | n/a |
| 6 | OK | s22 table, s32 | mute |
| 7 | OK | s24 last line | wellWavelet.h15 |
| 8 | FIXED distractor (unprinted "the base of the sand") | s4, s37 | angle.g5 |
| 9 | OK | s28, s24 | compare, stat.* |
| 10 | OK | s3 selections | n/a (Associate probe counts) |
| 11 | OK | s6 | n/a |
| 12 | OK | s26 | bulk.* |
| 13 | OK | s27, s41 | topTwt.Ekene-4, avoWells pickMs |
| 14 | OK | s30 | n/a |
| 15 | OK | s29 | average |
| 16 | OK | s30 | compare.E3rot90 |
| 17 | OK | s30 | compare.E3rot180 |
| 18 | OK | s31, s41 | pick.g5, avoWells Ekene-1 |
| 19 | OK | s33 settings | rmo.g5 |
| 20 | OK | s36 | walden.ekene |
| 21 | OK | s33 | rmo.g5 |
| 22 | OK | s33 table | rmo.all |
| 23 | OK | s34 | usable |
| 24 | OK | s35, s32 | vel.1292 |
| 25 | FIXED prompt ("two mutes reach the gathers": the stretch mute is not in the pack) | s31, s32 | mute |
| 26 | OK | s35 table | dix |
| 27 | OK | s36 | walden.ekene |
| 28 | OK | s36 | earth.base3 |
| 29 | OK | s39, s41 | shuey2, avoWells |
| 30 | OK | s39, s38 | n/a |
| 31 | OK | s39 | shuey2.fine |
| 32 | OK | s40 | offTop |
| 33 | OK | s40 | contrasts.0.5 |
| 34 | OK | s32, s36, s39, s40 refs | n/a |
| 35 | OK | s40 | chi |
| 36 | FIXED distractor (class 1: "the bulk shift between the stacks" was defensibly trim statics / matching in shift) | s40 | n/a |
| 37 | OK | s40, s41 | contrasts.0.5, avoWells.scale |
| 38 | OK | s40/s41 | n/a |
| 39 | OK | s41 table | avoWells scaled B |
| 40 | REWRITTEN (class 5: joined 0.50 with m06 Q9) now keys Ekene-3's modelled point from its oil leg | s3, s41 | avoWells Ekene-3 |
| 41 | FIXED expl. ("agree in sign" reading) | s41 | avoWells.scale |
| 42 | OK | s41 | walden.ekene, stretch |

Wrong keys found: none graded a false answer. Two keys were replaced because they rested on an
unprinted derivation or judgement (m01 Q10 "no sample qualifies", m01 Q11 "well above / close
to"), one key and prompt were rewritten to the current section 27 wording (m02 Q10), and one key
dropped an unprinted word (m04 Q1 "thin"). One explanation was false by the engine (m05 Q11:
`contrasts` at Vs/Vp 0.4, 0.5, 0.6 returns dVp/Vp 0.426623 and drho/rho 0.106656 every time).

## Defects per class (banks)

1 distractor true under another input: 1 (exam Q36). 2 choice keyed as fact: 0 (m04 Q8 expl. tied
Walden to the kit's mute, counted under 6). 3 refusal gloss: 0. 4 false superlative: 0. 5 near
duplicates: 1 found (exam Q40 vs m06 Q9) + 2 introduced by explanation edits and cleared (exam Q37
vs m05 Q13, exam Q40 vs m06 Q9 explanation). 6 unprinted relationships: 19 explanations trimmed
(m02 Q2 Q4 Q7; m03 Q5 Q7; m04 Q4 Q6 Q8; m05 Q2 Q3 Q7 Q11 Q12 Q13; m06 Q1 Q3 Q9 Q11; exam
Q41) plus keys m01 Q10, Q11, m04 Q1. 7 answer in prompt: 0. 8 capstone leak: 0.
9 length tell: m02 rank-0 share at 0.33 after the Q10 rewrite, fixed by lengthening a distractor;
worst strategy now 33.3. 10 printed alike keyed equal: 0. 11 inexact quote: 0. 12 to 15: 0.
Garbled prompt: 1 (m02 Q10).

## Lesson defects fixed

- m06 l02 stated the rockphysics class rule ("A above 0.02 ... class III when B is at or below
  zero") for the comparison, which runs engines/qi/avo.js avoClass; the two differ at both band
  edges (engine call above). The rule is gone; the lesson names the qi engine and the band.
- m05 l04 said every contrast moves with the stated Vs/Vp: false for dVp/Vp and drho/rho
  (engine call). Now says only dVs/Vs and the fluid factor move with Vs/Vp, all four with the scale.
- m05 l01 said the three-term fit "takes some of the fall with angle into C": C is positive
  (467.947963). Now prints the A, B, C change; the unprinted noise claim is gone.
- m04 l01 named the Dix intervals as "the sand" and "the slower shale" and claimed picking-error
  sensitivity; now sets the rows beside Ekene-1's checkshot times and prints the RMS and interval
  figures. Its exercise asked "which rock it is"; now compares with the checkshot times.
- m01 l01 heading "Six engine files": the tier calls eight; wellWavelet.js and avoWells.js rows added.
- m01 l02 said the 26-sample correlations describe "the reservoir interval alone": the logs cover
  the sand and the shale above it.
- Unprinted judgements removed or made factual: m01 l03 (Ricker "well above", "close to"), m01 l04
  ("close to unrelated", "recovers ... together"), m02 l01 ("all high", whole-sample reasoning),
  m02 l03 (alignment cause, "one story", frequency lowers the figure), m02 l04 ("the order of the
  spectra", "close to identical"), m02 l05 (generalised similarity rule, leaving a well out
  "restores their figures", "pattern of one well spoiling the mean"), m03 l01 ("evenly spread"),
  m03 l02 ("negligible", "almost all", gradient dependence), m03 l03 ("within a sample of flat",
  "unlike the near ones"), m03 l04 ("can trust"), m04 l02 ("matters most for the gradient", causal
  Vrms t0 claim), m04 l03 ("one noisy trace moves it far"), m04 l04 (section 38 rewritten wording:
  "agree in shape far better than one sample suggests", "intercept leans on the near stack"),
  m05 l02 ("close together", "much further"), m05 l03 ("most reflectors share a ratio"), m05 l05
  (wavelet-position mechanism, "fragile"), m06 l01 ("agree in sign", per-well rationale), m06 l02
  ("reads harder than the logs predict", "the easy kind").
- Explorer claims checked: every exercise reading a 1292 ms figure sets the time first; the
  rotation, anchors and well wavelet are worked by hand where the explorer lacks them.
- Length: per-minute means 12:490 13:505 14:533 (each lower than before the audit), all in band.

## Gates (final)

bank .py: all seven wrote; lengthtails worst 33.3; dupaxes 0 pairs; numsweep banks 361 checked,
0 unresolved; bankleak 0 within 10 tolerances of a graded answer; gate_copy_rule VIOLATIONS 0;
gate_vocabulary BREACHES 0; gate_capstone_leak FINDINGS 0; lengths 0 out of band, no rank problem;
numsweep lessons intermediate 213 checked, 0 unresolved; litsweep lessons 0 not in the digest,
0 forward; leakage 0 fatal; scaffold 0 drift; vitest 25 passed.
