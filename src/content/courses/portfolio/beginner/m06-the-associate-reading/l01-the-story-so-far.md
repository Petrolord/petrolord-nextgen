# The story so far

One inventory, one optimizer and every number this tier owns, read once from a single project's risk to the grid under the answer.

## What the engine models

A project's risked EMV is pos x npv_p50 - (1 - pos) x fail_cost, with pos the chance of success between 0 and 1 and fail_cost the loss if it fails, 0 or more. Money is million USD, and a negative capex is refused outright with a PortfolioInputError. The optimizer funds each project in full or not at all and maximises summed risked EMV with capex inside the limit. A project at 0 or less is never funded, and money may be left unspent.

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

## The grid

OKONO solves on an exact grid of 1.0000 million USD per cell. A limit over 5000, or any capex or limit that is not whole, turns the grid coarse at limit / 2000. The published gridOvershoot case funds 6002.0000 against 6000.0000 for 800.0000 where the best set that fits gives 780.0000, and the engine now flags overLimit true and overLimitBy 2.0000. The undershoot, a project worth 200.0000 left out, and the free project charged a cell, worth 10.0000, are still silent.

## Risk beside value

By the seeded Monte Carlo at seed 20260829 and 10000 iterations, the 450.0000 set has P(loss) 0.123600 and a P90 of -18.3574, its low case; the 600.0000 set has P(loss) 0.001800 and a P90 of 200.3575.

## Exercise

Risk OK-3 by hand and give its fraction of success-case NPV. Then state the greedy and optimal sets at 450.0000 with their values, the set at 600.0000, and one grid behaviour that the overLimit flag does not catch.
