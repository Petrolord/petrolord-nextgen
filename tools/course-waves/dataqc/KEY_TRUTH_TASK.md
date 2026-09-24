# D1 Oilfield Data Quality: the key-truth writer's task

Read `BRIEF.md` first. Every number here is quoted from `digest.txt`, the only
teaching truth for this course. The engine's FINDINGS record, the oracle,
the library pins and the engine's source comments are PROVENANCE.

## TWO JOBS

1. **The key truths.** One sentence a learner should be able to say afterwards,
   with the number that makes it checkable.
2. **The second reader of every bank, before `gen_migration.py`.** Read prompt,
   options, explanation, digest and lesson for every question, one tier at a
   time, and swap roles where the explanation supports a distractor.

## THE KEY TRUTHS THIS COURSE OWES ITS LEARNERS

### Associate

1. A flag is a rule that fired with its reason, and the engine never decides a
   value is wrong: 22 defects are planted in the Ekene data and each is found by
   a named check.
2. Missing is null, undefined or NaN, and a sentinel is present: the gamma ray
   with -999.25 in place reads 1.000000 complete and fails 4 range checks.
3. Coverage counts a step up to maxStep as covered: the gamma ray covers
   0.991304 at a half foot and 1.000000 at a foot.
4. Limits are definitional and units are never converted: NPHI written in
   percent fails 10 fraction checks, and a sonic in an unlisted unit is refused.
5. A cumulative is compared with the last present value: day 70 falls
   7496.700000 bbl against day 68.
6. A tolerance must match the reporting precision: the water cut check fails 83
   days at 1e-6 and 6 at 1e-4.

### Professional

7. The z-score has a ceiling set by the sample size: 2.846050 at ten values, so
   the gauge glitch at 2.845783 cannot be flagged.
8. The modified z-score measures against the median and MAD: the same glitch
   reads 186.162000.
9. A quantile needs its rule named: R6, R7 and R8 give first quartiles of
   31.817500, 31.947500 and 31.825833 on the same water sand.
10. A local window sees what a global mean hides: the sand spike at entry 70
    reads z 1.058062 and is flagged by Hampel.
11. Grubbs is for one outlier and a second one masks it: G falls to 2.275359
    under a critical value of 2.507321.
12. A distance that knows the correlation sees an off-trend pair: entry 60 has
    d^2 22.397696 against a cutoff of 7.377759, while neither z flags it.

### Expert

13. Phase-one limits come from in-control history: centre 611.380000, sigma
    3.774063 from MRbar / 1.128.
14. EWMA and CUSUM accumulate a small shift the individuals chart misses: from
    day 16, 1 low signal against 11 and 20.
15. k and h carry a unit, and the unit changes the chart: 45 flags read as psi
    against 28 in sigma units.
16. The scorecard total depends on stated weights and names its weakest
    dimension: 0.889531 equal, 0.927390 weighted, weakest uniqueness.
17. Defaults are choices written in a basis block: the phase-sum tolerance is
    0.005 of the total, a Petrolord choice.
18. Printed figures can carry errata: NIST prints G as 2.4687 where the engine
    reads 2.468765.

## THE RULES

Digest section 32's vocabulary is binding. No em dashes, no en dashes, no "X,
not Y" contrastive. No key truth may carry a capstone field name, series,
stated input or graded answer at any precision.
