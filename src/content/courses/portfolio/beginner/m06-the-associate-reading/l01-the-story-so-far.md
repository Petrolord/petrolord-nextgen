# The story so far

One inventory, one optimizer and every number this tier owns, read once from a single project's risk to the exact solve under the answer.

## What the engine models

A project's risked EMV is pos x npv_p50 - (1 - pos) x fail_cost, with pos the chance of success between 0 and 1 and fail_cost the loss if it fails, 0 or more. Money is million USD. A capex that is missing, blank, non-numeric, infinite or negative, and a pos that is typed but blank, non-numeric or outside 0 to 1, are refused by project name with a PortfolioInputError; a pos left out is the default 1. The optimizer funds each project in full or not at all and maximises summed risked EMV with capex inside the limit. A project at 0 or less is never funded, and money may be left unspent.

## Risking OKONO

| project | capex | pos | npv_p50 | fail_cost | risked EMV |
| --- | --- | --- | --- | --- | --- |
| OK-1 | 120.0000 | 0.950000 | 95.0000 | 10.0000 | 89.7500 |
| OK-2 | 180.0000 | 0.900000 | 130.0000 | 20.0000 | 115.0000 |
| OK-3 | 90.0000 | 0.250000 | 420.0000 | 85.0000 | 41.2500 |
| OK-4 | 240.0000 | 0.800000 | 210.0000 | 40.0000 | 160.0000 |
| OK-5 | 60.0000 | 1.000000 | 38.0000 | 0.0000 | 38.0000 |
| OK-6 | 310.0000 | 0.550000 | 360.0000 | 120.0000 | 144.0000 |

OK-3 by hand is 0.250000 x 420.0000 - 0.750000 x 85.0000 = 41.2500. Its risked EMV is 0.098214 of its success-case NPV of 420.0000. Success-case NPV is what happens if the well works; risked EMV is what the chance of it working is worth.

## Choosing under a limit

Ranked by risked EMV per million USD, OK-1 leads at 0.747917 and OK-3 comes last at 0.458333. Filling 450.0000 down that ranking funds OK-1, OK-4 and OK-5 at 420.0000 for 287.7500. The optimizer funds OK-1, OK-3 and OK-4 at 450.0000 for 291.0000, taking the lowest-ranked project because it fills the space the ranking leaves. The best set is not the best projects.

## The frontier

The frontier to 450.0000 ends on the answer, 450.0000 and 291.0000, and its last step swaps OK-5 for OK-3 for 3.2500 more. Its steps rise and fall, from 0.108333 per extra million USD to 1.616667, so no step prices the next one. At 600.0000 the set is OK-1, OK-2, OK-4 and OK-5 for 402.7500, and OK-3 is gone: optimal sets are not nested. At 750.0000 the optimizer spends 690.0000 and leaves 60.0000 unspent.

## The exact solve

Every OKONO limit is solved exactly: solveMethod "exact", optimalityGap 0.0000, resolution null. Awkward inventories are solved exactly too: gridOvershoot funds A + C at 5995.0000 for 780.0000, gridUndershoot funds W + X + Y + Z at 5999.0000 for 860.0000, and a free project with positive EMV is always funded. A grid runs only as a stated fallback beyond exactStateLimit, with every weight rounded up and optimalityGap reported, 200.0000 on gridUndershootFallback.

## Risk beside value

By the seeded Monte Carlo at seed 20260829 and 10000 iterations, the 450.0000 set has P(loss) 0.123600 and a P90 of -18.3574, its low case; the 600.0000 set has P(loss) 0.001800 and a P90 of 200.3575.

## Exercise

Risk OK-3 by hand and give its fraction of success-case NPV. Then state the greedy and optimal sets at 450.0000 with their values, the set at 600.0000, and what solveMethod and optimalityGap read at 450.0000 and what the fallback would add to the result.
