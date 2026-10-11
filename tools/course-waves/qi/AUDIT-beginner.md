# QI Associate (qib) key-truth audit, second reader

Scope: qib_m01..m06 (15 each) and qib_exam (42), 132 questions; the 26 lessons under
`src/content/courses/qi/beginner`. Truth: `digest.txt` only.

## Engine calls

Every keyed figure was reproduced through the shipped lab, never by restating a formula:

- `node keytruth_probe_beginner.mjs` registers `qi_loader.mjs`, imports `qi_engine.mjs` (the
  NextGen `qiLab.js`) and calls `zoneSamples`, `fluidsAt`, `poreFluid`, `spectrum`, `traceSpectrum`,
  `ricker`, `snr`, `stripe`, `withStripe`, `shearAgainstGc`, `shearTrend`, `layerMeans`, `elastic`,
  `substituteZone`, `wetTrend`, `interfaceAB`, `distance`, `modelledAvo`, plus each refusal through
  the vendored engine functions. Every Associate figure in sections 3 to 21 came back equal to the
  digest at six decimals (the oil-leg Wood modulus prints 1.398868 from the four-decimal Sw
  0.574254; the lab's exact Sw gives the digest's 1.398867).
- `node keytruth_probe_beginner_usability.mjs` calls QI Studio's `usabilityMatrix` and
  `suggestedIssues` on Ekene-1's header and on hypothetical wells: Ekene-1 plus PHIT/VSH/SW reads
  good; no shear reads limited with one medium "Shear sonic (Vs)" issue; one checkshot reads
  limited; one checkshot plus an unset elevation reads missing; no survey reads limited. `avoClass`
  (0.000627, -0.001871) is II, (0.170742, -0.563558) is I, (-0.05, 0.1) is IV.
- `qi_dump_a.mjs` `sectionsA()` (the digest generator, engine-backed) for the checkshot TWT
  (OWT 644.398189, TWT 1288.796378) and the matrix counts, 31 issues and remedy.
- Panel facts the exercises rely on were checked in `QiFeasibilityExplorer.jsx` and the lab:
  Ekene-2 and Ekene-4 have no oil leg (`layerMeans` of their oil leg: "No samples to average."),
  a 150 ft block refuses with the three-interface message, cut-off moves leave the cap rock at 130.

## Verdict per question

Key: section of the digest the key rests on; engine = probe field that reproduced it.

### qib_m01
| Q | verdict | key rests on | engine |
|---|---|---|---|
| 1 | OK | s1 "do not decide whether a QI study should go ahead" | n/a (statement) |
| 2 | OK | s1 "hold no Ekene figure"; s3 conditions | fluidsAt(conditions) |
| 3 | OK | s3 "THE DATA IS SYNTHETIC" | n/a |
| 4 | OK | s3 selections table, Ekene-2 0/187 | count.Ekene-2.oil = 0 |
| 5 | OK | s60 distance, negative hydrocarbon side | dist.inFit -0.072091, brFit -0.004519 |
| 6 | OK | s5 predictVs level 1.2 | ref.lvl |
| 7 | OK | s3 cap rock 65 ft, 130 | count.*.shale = 130 |
| 8 | OK | s5 two gassmann.js messages | ref.svNeg, ref.svPhi0 |
| 9 | OK | s4 AI three ways | el.oil.ai 6639018.603084 |
| 10 | OK | s4 OWT/TWT | sectionsA s4 |
| 11 | OK | s4 polarity; s15 AI | el.cap.ai, el.oil.ai |
| 12 | OK | s4 top 5078.740157 ft | top.Ekene-1 |
| 13 | OK | s6 what is graded | n/a |
| 14 | OK | s2 Hatton et al. | n/a |
| 15 | OK | s2 rule | n/a |

### qib_m02
All 15 OK. Keys rest on s7 (needs, inventory, Ekene-9 curves, 9 density), s8 (rule, worst item,
counts 0/9/1, 31 issues 1 high 30 medium, remedy, keep/edit/dismiss, IN PRACTICE line). Engine:
`usabilityMatrix`/`suggestedIssues` via sectionsA and the hypothetical-well probe (Q7 no survey:
medium; Q9 unset elevation: missing; Q10 one checkshot: limited).

### qib_m03
| Q | verdict | key rests on | engine |
|---|---|---|---|
| 1 | OK | s9 frequency step | spec.800-1600.df 0.488281 |
| 2 | OK | s9 averageSpectrum power | spec peak 31.374887 |
| 3 | OK | s5 footprint 3 by 3 | ref.fp3 |
| 4 | FIXED expl. (class 6: "how an engine figure earns trust" removed) | s9 Ricker check | ricker30 |
| 5 | OK | s10 definition | spec.lo6/hi6 |
| 6 | OK | s10 centroid | spec.cen 26.656573 |
| 7 | OK | s10 windows | spec.1600-2400 |
| 8 | REWRITTEN (classes 6/2: "least steady" judgement and "band and centroid are the steadier figures to quote" not printed) now keys the 0.500000 peak 22.305063 | s10 taper table | taper.0.5 |
| 9 | OK | s10, s21 verdict band | one.trace, spec |
| 10 | OK | s11 dB form | snr.800-1600 |
| 11 | OK | s11 clamp | n/a (0.999999 ratio printed) |
| 12 | OK | s11 lag reason | snrlag.* |
| 13 | OK | s11 median, 20 pairs | snr pairs 20, perPair |
| 14 | OK | s12 rule | footprint, isStripe via sectionsA |
| 15 | OK | s12 RMS | n/a |

### qib_m04
| Q | verdict | key rests on | engine |
|---|---|---|---|
| 1 | FIXED expl. (class 6 "a data problem") | s5 NaN result | nanPoint all NaN |
| 2 | FIXED expl. (unprinted "why") | s5 three pairs | ref.vs3 |
| 3 | FIXED expl. (panel gloss) | s3 rules | zoneSamples at cut 0.25/0.35/0.45: shale 130 throughout |
| 4 | OK | s13 1.036576 | gc.water.mean |
| 5 | OK | s13 1.151143 | gc.oil.mean |
| 6 | OK | s13 coefficients, mix | n/a (coefficients printed from lab GC_COEFF) |
| 7 | OK | s14 c1 | trend.coef |
| 8 | FIXED expl. (class 4 "never equals s alone") | s14 3700 row | trend.predictions[3] |
| 9 | FIXED expl. (gloss "weaker promise") | s14 level | trend80 |
| 10 | OK | s5 singular | ref.sing |
| 11 | OK | s14 form | trendQuad |
| 12 | OK | s14 sigma | trend.predictions[1].sigma |
| 13 | OK | s15 AI | el.oil.ai |
| 14 | OK | s4/s15 polarity | el.* |
| 15 | OK | s15 legs differ | el.oil/el.water phit, vsh |

### qib_m05
| Q | verdict | key rests on | engine |
|---|---|---|---|
| 1 | OK | s16 live oil K | fluids.oil.k |
| 2 | FIXED expl. (unprinted "rises fastest") | s16 Wood | wood.0.5 |
| 3 | OK | s16 conversion | fluids.pMPa |
| 4 | FIXED distractor length (rank gate) | s5 brine refusal | ref.brineP0 |
| 5 | OK | s17 shear modulus | subMeans / table |
| 6 | OK | s17 mineral K | substituteZone rows |
| 7 | OK | s5 porosity 0 | ref.svPhi0 |
| 8 | OK | s17 means | subMeans aiBefore/aiAfter |
| 9 | OK | s17 against the water leg | el.water.ai |
| 10 | FIXED expl. (unprinted "a study states which mean") | s15 vs s17 | el.oil.ai vs subMeans.aiBefore |
| 11 | OK | s18 TLS | wet16 |
| 12 | OK | s18 published | wet16.castagnaSlope |
| 13 | OK | s18 block table | wet8 |
| 14 | FIXED expl. (class 6 "far outside the rms scatter") | s19 | dist |
| 15 | FIXED expl. (class 6 "even the brine top looks anomalous") | s19 | dist.inPub/brPub |

### qib_m06
| Q | verdict | key rests on | engine |
|---|---|---|---|
| 1 | OK | s20 class rule | avoIn/avoBr.avoClass I |
| 2 | OK | s20 class IV | avoClass(-0.05, 0.1) = IV |
| 3 | OK | s20 gaps | avoIn/avoBr exact |
| 4 | FIXED (class 1/10: distractor "0.206058, the exact coefficient at normal incidence" was true of the brine case) | s20 | avoIn.exact[0] 0.171249 |
| 5 | OK | s20 far mean | avoIn.stackMeans.far |
| 6 | OK | s20 model | n/a |
| 7 | OK | s5 zoeppritz | ref.zo |
| 8 | OK | s1/s21 | n/a |
| 9 | OK | s21 list | n/a |
| 10 | REWRITTEN (class 5: near-duplicate of m03 Q9, key 0.55) now asks why the band row reads 800 to 1600 ms: "it holds the Ekene Sand" | s9 window line | spec.800-1600 |
| 11 | OK | s21 / s11 | snr |
| 12 | REWRITTEN (class 5: near-duplicate of m03 Q14, joined 0.50) now asks which data the footprint row rests on | s12 Ekene slice | footprint |
| 13 | OK | s6 never graded | n/a |
| 14 | OK | s21 capstone | n/a |
| 15 | FIXED expl. (class 6 "dims faster", "intercept moves as AI does") | s20 | ab.in / ab.br |

### qib_exam
| Q | verdict | key rests on | engine |
|---|---|---|---|
| 1 | OK | s4 TWT; s9/s11 windows | sectionsA s4 |
| 2 | OK | s4 polarity; s20 R | avo exact[0] |
| 3 | OK | s15 mu-rho unit | el.oil.mr, si |
| 4 | OK | s4 depth | top.Ekene-1 |
| 5 | OK | s5 NaN vs refusal | nanPoint, ref.zo |
| 6 | OK | s6 | n/a |
| 7 | OK | s5, s16 | ref.brineP0, fluids.pMPa |
| 8 | OK | s7/s8 Ekene-9 | sectionsA s8 |
| 9 | OK | s7 | n/a |
| 10 | OK | s8 rule + Ekene-1 row | usabilityMatrix(E1 + PHIT/VSH/SW) = good |
| 11 | OK | s8 rule | no-shear well: one medium issue |
| 12 | OK | s8 rule | 1 checkshot + unset elevation: missing |
| 13 | OK | s17 method, s8 | n/a |
| 14 | OK | s3/s7 | n/a |
| 15 | OK | s21 | spec, snr |
| 16 | OK | s10 single trace | one.trace |
| 17 | OK | s9 parabola | spec |
| 18 | OK | s11 assumption | n/a |
| 19 | FIXED expl. (class 11: QI Studio's "over 10,000 (over 40 dB)" now quoted exactly) | s11 clamp | n/a |
| 20 | OK | s12 cycles | footprint (128 / 15.058824) |
| 21 | OK | s12 designed stripe | footprintDesigned |
| 22 | OK | s13 | gc.water.mean |
| 23 | OK | s13, s17 | gc.oil.mean, sub rows |
| 24 | OK | s15 | el.* vpvs, pr |
| 25 | FIXED expl. (unprinted "a study states which wells") | s14 more wells | trend4 |
| 26 | OK | s14, s21 | trend.coef |
| 27 | OK | s17 | subMeans |
| 28 | OK | s14 dof | trend.dof 101 |
| 29 | FIXED expl. ("climbs fastest" unprinted; then de-duplicated from m05 Q2) | s16 | wood.* |
| 30 | OK | s16 | fluids |
| 31 | REWRITTEN (lead item: key rested on a largest/smallest comparison and "less to substitute", neither printed) now keys the 5114 ft brine Vp 3248.090773 | s17 row 5114.000000 | substituteZone rows |
| 32 | OK | s17 density | sub rows |
| 33 | OK | s19 stated line | dist.brFit / brPub |
| 34 | OK | s18 block table | wet8/wet16/wet24 |
| 35 | OK | s18 79 of 800 | wet16.substituted |
| 36 | OK | s19, s20 | dist, avoClass |
| 37 | OK | s20 class rule on s18 point | avoClass(0.000627, -0.001871) = II |
| 38 | OK | s20 gaps | avo exact, stackMeans |
| 39 | REWRITTEN (lead item: "sits close" judgement unprinted) now keys shuey's brine C 0.216617 | s20 Shuey table | avoBr.c |
| 40 | OK | s1/s21 | n/a |
| 41 | OK | s20 table | avo exact[6..7] |
| 42 | OK | s21 capstone six | n/a |

Wrong keys found: none graded a false answer. Two keys (exam Q31, Q39) and one module key (m03 Q8)
rested on unprinted comparisons or judgements and were replaced; one distractor (m06 Q4) was
true under the brine case and was reworded.

## Defects per class (banks)

1 distractor true under another input: 1 (m06 Q4). 2 choice keyed as fact: 1 (m03 Q8, "steadier
figures to quote"). 3 refusal gloss: 0. 4 false superlative: 1 (m04 Q8 "never"). 5 near
duplicates: 2 module-vs-module (m06 Q10, Q12 rewritten) + 1 introduced and cleared (exam Q29
vs m05 Q2). 6 unprinted relationships: 12 explanations trimmed (m03 Q4; m04 Q1 Q2 Q3 Q9; m05 Q2
Q10 Q14 Q15; m06 Q15; exam Q25 Q29) plus keys m03 Q8, exam Q31, Q39. 7 answer in prompt: 0.
8 capstone leak: 0. 9 length tell: m05 at the 40.0 cap, now 33.3 worst rank; m06 and exam
re-balanced after the rewrites. 10 printed alike keyed equal: 1 (exam Q39 via "sits close").
11 inexact quote: 1 (exam Q19). 12 to 15: 0. One CONTRASTIVE ("and never") introduced in a new
distractor was caught by bankleak and reworded.

## Lesson defects fixed

- Exercises impossible on the pack: m04 l04, m05 l03, m05 l05, m06 l01 (Ekene-4 or Ekene-2, no
  oil leg) and m06 l03 (Ekene-2) moved to Ekene-3.
- m01 l02 selections table left the net sand count blank: 168 restored.
- m01 l05 exercise: salinity refusal hidden while pressure stays 0 (fluidsAt checks pressure
  first): now restores 3200 first.
- m03 l02 said the verdict quotes "the band and the centroid"; the verdict quotes the band and
  the peak. Corrected.
- Capstone-adjacent literals swept by gate_capstone_leak in beginner lessons: Ekene-8 and Ekene-9
  top depths (m02 l01 table column dropped, m02 l03 sentence) and the Sw 0.669800 row (m05 l02).
- False superlatives over eight tabled samples ("at every sample"): m05 l02, m05 l03; "every later
  figure" (m04 l02).
- Unprinted readings removed: A "sits close" to the exact coefficient (m06 l01), rms-scatter
  comparison and "brine top looks anomalous" (m05 l05), "less to substitute" (m05 l02), "rises
  fastest" (m05 l01), AI/Vp/Vs "bears on normal incidence/angle" (m05 l03), mu-rho "direction a
  pore fluid would push" (m04 l04), "Vp/Vs would read higher" and "size of the misfit" (m04 l02),
  "data problem" and "no answer exists" glosses (m04 l01), opposite-polarity and two-sources
  claims (m01 l04), shale boundaries "set by the stronger contrasts" (m05 l04), "a fluid effect in
  one measure would be fragile" (m06 l02), register keep/edit verdicts stated as fact (m02 l04).
- Length rank: per-minute means now 12:492 13:515 14:541 (were 12:537 13:535 14:540).

## Gates (final)

bank .py: all seven wrote; lengthtails worst 36.7; dupaxes 0 pairs; numsweep banks 360 checked,
0 unresolved; bankleak 0 within tolerance, VIOLATIONS 0; gate_copy_rule VIOLATIONS 0;
gate_vocabulary BREACHES 0; gate_capstone_leak FINDINGS 0; lengths no RANK PROBLEM, 0 out of
band; numsweep lessons beginner 393 checked, 0 unresolved; litsweep lessons 0 not in the digest,
0 forward; leakage 0 fatal; scaffold 0 drift; vitest 25 passed.
