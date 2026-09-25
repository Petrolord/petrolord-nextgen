# D4 Data-Driven Production Forecasting: the key-truth writer's task

Read `BRIEF.md` first. Every number here is quoted from `digest.txt`, the only
teaching truth for this course. The engine's FINDINGS record, the oracle, the
library pins and the engine's source comments are PROVENANCE.

## TWO JOBS

1. **The key truths.** One sentence a learner should be able to say afterwards,
   with the number that makes it checkable.
2. **The second reader of every bank, before `gen_migration.py`.** Read prompt,
   options, explanation, digest and lesson for every question, one tier at a
   time, and CALL THE ENGINE (through the lab or the panel, or node on the
   vendored `packages/engines/engines/dataai/forecast.js`) for every keyed
   figure. Swap roles where the explanation supports a distractor.

## THE DEFECT CLASSES TO READ FOR, from the FC, H, D1, D2 and D3 audits

1. **A distractor that became true.** The engine returns the distractor's
   number under some stated setting the question did not rule out (another
   seed, another nSims, another lag m, refit against held, another first
   origin, a parameter given instead of fitted).
2. **A wrong failure-mode gloss.** "Refused" said of a metric the engine
   returns as null with its reason (MAPE through a shut-in month, MASE on a
   flat training window); "clipped" said of a point forecast (only the
   percentiles are); "P90" glossed as the 90th percentile or the high case.
3. **A false superlative.** "the best method", "always", "never" where the
   digest shows one well or one set of origins. A ranking is one backtest.
4. **An exam question that near-duplicates a module question** (audit at
   Jaccard 0.45).
5. **A sentence characterising a relationship nobody computed.** Every "worse",
   "more", "higher" rests on two printed figures.
6. **The answer printed before the work** in the prompt or a table above it.
7. **A capstone input or value** in any prompt, option or explanation.
8. **The answer-length tell**, and the D1 tell: three distractors opening the
   same way while the key does not.
9. **Printed alike keyed as equal.** Two figures equal at six decimals are
   equal only where the digest says the engine returns them equal.
10. **A boundary stated globally.** Each rule draws its own (section 22): ses
    needs 2 values and holt 3, the bootstrap needs 2 scored residuals, a
    comparison needs 3 training values even for ses alone, an origin with o +
    horizon = n is accepted.
11. **A message quoted inexactly.** A refusal, a reason or a basis is quoted
    verbatim or not at all.
12. **A digest section number in learner-visible text.** Say "the course".
13. **An in-sample figure read as a test.** An MSE from `fitSmoothing` scores
    months the fit was chosen on; only a hold-out or a backtest scores months
    it never saw.

## THE KEY TRUTHS THIS COURSE OWES ITS LEARNERS

### Associate

1. A flat forecast is the last level: ses at alpha 0.3 forecasts 221.171043 at
   every step while EKENE-P1's last month is 211.400000.
2. On a steady decline simple smoothing fits alpha 1, the naive forecast; the
   noisy EKENE-P4 fits 0.528376.
3. Holt spends its second month on the start: `scoredFrom` 2 and 46 scored
   errors on 48 months, where ses scores 47.
4. A straight trend runs below zero: Holt on EKENE-P5 reads -0.623541 at step
   17.
5. The damped forecast levels off at l_n + b_n phi / (1 - phi): 175.163940 on
   EKENE-P1 at phi 0.9.
6. The NIST/SEMATECH handbook's printed figures reproduce: 6 cases, 64
   published figures, every one at its printed decimals.

### Professional

7. An error is actual minus forecast: ses on the teaching hold-out has ME
   -51.683333, a forecast high every month.
8. MAPE returns null when an actual is 0, with the reason; sMAPE scores each
   shut-in term 200.000000.
9. MASE divides by the training months' naive error: 0.241874 for holt at m 1,
   0.024087 at m 12.
10. A backtest refits at every origin unless told to hold: 0.374515 refitted,
    0.368974 held.
11. One flat training window leaves the pooled MASE null for every origin and
    step.
12. The winner depends on the well's history: arps first before EKENE-P2's
    shut-in, holt first after its workover.

### Expert

13. The bootstrap replays the fitted residuals from one seeded stream: seed 11
    and seed 12 give P50 137.469798 and 140.453203 at step 12.
14. P90 is the low case: the damped EKENE-P1 P90 at step 1 is 174.139087 and
    the P10 225.708211.
15. A point forecast can sit above its own P10: ses on EKENE-P1 at step 12,
    211.400000 against 69.250000.
16. Arps comes from the decline curve engine with a month as a day: EKENE-P1
    Di 0.060069 per month; EKENE-P2 drops its 3 shut-in months.
17. A ranking keeps the listed order on a tie: the constant golden ranks
    damped, ses, holt, as listed.
18. A ranking by MAPE ranks nothing when every method's MAPE is null: EKENE-P2
    from origin 12.

## THE RULES

Digest section 25's vocabulary is binding. No em dashes, no en dashes, no "X,
not Y" contrastive. No key truth may carry a capstone field name, well, stated
input or graded answer at any precision.
