# D4 Data-Driven Production Forecasting: the bank writer's task

Read `BRIEF.md` and `LESSON_TASK.md` first. Every number in this file is quoted
from `digest.txt`, which is the only teaching truth for this course. The
engine's FINDINGS record, the oracle, the library pins and the engine's source
comments are PROVENANCE.

## THE SHAPE

132 questions a tier: 6 module banks of 15, plus a 42 question exam. Four
options each, one correct, and an explanation that says WHY the wrong ones are
wrong. Banks live in `banks/` as `d4<b|i|a>_<m01..m06|exam>.py` and `.json`.
**Every bank `.py` writes its JSON to a LITERAL path** in this directory
(`/root/dai-wip-forecastml/banks/d4b_m01.json`,
`/root/dai-wip-forecastml/banks/d4i_exam.json`,
`/root/dai-wip-forecastml/banks/d4a_m06.json` and so on, never a path built
from a variable), because the kit's check-bank-sources reads literal paths
only.

## THE ANSWER-LENGTH DEFECT

A shipped bank was passable without reading the question, because the
second-longest option scored about four answers in five. **Balance the option
lengths.** The correct option must not be the longest and must not be the
second-longest more often than chance. `lengthtails.py` measures it. Lengthen
distractors; never edit the correct option to satisfy the gate.

## THE OPENING DEFECT

A D1 bank showed a new tell: all three distractors opening the same way while
the key did not. **Vary the openings** of every option, the key's included.

## WHAT MAKES A GOOD D4 QUESTION

The engine's own distinctions, all of them in the digest, and a good distractor
is a real wrong method with its real number:

1. **SSE against MSE.** Holt at alpha 0.5 and beta 0.2 on EKENE-P1: SSE
   29230.297102 over 46 scored errors, MSE 635.441241. ses scores 47 errors on
   the same months.
2. **the fitted alpha against the naive forecast.** ses fits alpha 1.000000 on
   EKENE-P1 (on its bound) and 0.528376 on EKENE-P4.
3. **Holt against damped out to step 24.** Holt on EKENE-P5 is -0.623541 at
   step 17; damped is 6.569332 at step 24.
4. **the damped forecast against its limit.** At phi 0.9 the forecast is
   184.933594 at step 12 and 175.163940 at step 400, the limit.
5. **ME against MAE.** On the teaching hold-out ses has ME -51.683333 and MAE
   51.683333; holt has ME -4.573069 and MAE 6.783515.
6. **MAPE against sMAPE.** On EKENE-P5's low tail holt reads MAPE 24.095758 and
   sMAPE 32.408520; with a shut-in in the actuals MAPE is null.
7. **the training scale against the scored months' scale.** Holt's MASE on the
   teaching hold-out is 0.241874; scaled by the hold-out's own naive error it
   would read 0.902281.
8. **lag 1 against lag 12.** The same holt forecast: MASE 0.241874 at m 1,
   0.024087 at m 12, Q 281.625000.
9. **refit against held.** The teaching backtest: MASE 0.374515 refitted,
   0.368974 held.
10. **each origin's scale against one scale.** Pooled MASE 0.374515; every
    error over the last origin's scale gives 0.458893.
11. **the honest backtest against leakage.** One step ahead from origin 36:
    MAE 8.096036 honest, 8.045544 from the full-series fit.
12. **P90 against the 90th percentile.** The damped EKENE-P1 intervals at step
    1: P90 (low) 174.139087, P10 (high) 225.708211, seed 11, 1000 paths.
13. **Di per month against another time base.** EKENE-P1's Arps Di is 0.060069
    per month.
14. **a ranking against its origins.** EKENE-P2 after the workover ranks holt
    first from origin 28 and damped first from origin 30.

## THE CAPSTONES ARE NOT YOURS

The three capstone fields live in `d4_capstone.mjs` and NOTHING ABOUT THEM IS IN
`digest.txt`: no field name, no well, no dataset, no stated input, no answer. A
question that wants the capstone's subject teaches the METHOD with the digest's
own Ekene wells. `gate_capstone_leak.mjs --banks banks` sweeps every prompt,
option and explanation for every capstone name, run of values, stated input and
graded answer at four renderings.

## NO FORWARD REACH

An Associate question never needs an out-of-sample error, a MAPE, a MASE, a
backtest or a comparison with Arps; a Professional question never needs a
bootstrap interval, a P90 or P10, the Arps parameters, a tie band, a ranking
rule or a cap.

## PRINTED ALIKE IS NOT EQUAL

Two figures that agree at six decimals are never keyed as equal unless the
digest says the engine returns them equal. Section 20 shows the pattern:
EKENE-P1's Arps b prints 0.500000 and is 0.49999999999999994 as returned, and
the digest prints the difference before it says so. Section 15 is the other
side: the two leaky routes print 8.045544 each, and the digest checks that they
are the same numbers exactly before it calls them the same.

## THE VOCABULARY AND THE COPY RULE

Digest section 25 is binding on every prompt, option and explanation. No em
dashes, no en dashes, no "X, not Y" contrastive. When you quote an engine
message, quote it verbatim and say it is the engine's own words. Never cite a
digest section number in a question or an explanation.
