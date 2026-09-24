# Parts that add to a total

{{panel:dq-checks-explorer}}

Some columns on a sheet are parts of another column. EKENE-3's oil and water are parts of its gross liquid, so on every day oil plus water should equal gross. `phaseSumCheck` tests that. It takes named parts and a total, and flags a day when the parts miss the total by more than an allowed difference, max(absTolerance, relTolerance x |total|). The Petrolord default is relTolerance 0.005 of the TOTAL and absTolerance 0. Both are choices, and the result states them in its basis.

| day | oil + water, bbl/d | gross total, bbl/d | difference | allowed | flagged |
| --- | --- | --- | --- | --- | --- |
| 40 | 1737.500000 | 1774.000000 | -36.500000 | 8.870000 | true |
| 41 | 1792.800000 | 1798.200000 | -5.400000 | 8.991000 | false |

The difference and allowed columns are derived: the sum less the total, and 0.005 times the total. The flagged column is the engine's.

## Two days, two outcomes

On day 40 a truck load was booked into the gross total, a stated planted defect. The parts sum to 1737.500000 bbl/d against a total of 1774.000000, a difference of -36.500000, beyond the 8.870000 allowed. Its reason sentence prints the sum, the total and the allowed difference, the last with every digit the multiplication produced. Reason with the `allowed` field, which at six decimals is 8.870000.

Day 41 carries a small difference, -5.400000, inside its 8.991000 allowance. It is not flagged. That is the tolerance working as intended: gross and its parts are often measured or allocated separately, and a small disagreement between them is ordinary.

## Why the tolerance is on the total

The tolerance could be taken on the sum of the parts, on one part, or as a fixed number of barrels. The engine takes it as a fraction of the total by default. The total scales with the day's rate, so scaling by it means a high-rate day gets a proportionally wider allowance than a low-rate day. The absolute tolerance is there for the other case, a floor of barrels below which you do not care, and its default of 0 means no floor.

These are the choices the engine makes; a caller with different meters states different ones. Whatever you choose, the allowed figure is only meaningful beside the rule that made it.

## Moving the tolerance

| tolerance, stated | failed | days flagged |
| --- | --- | --- |
| relTolerance 0.005, the default | 1 | 40 |
| relTolerance 0.01 | 1 | 40 |
| relTolerance 0.005 with absTolerance 50 bbl/d | 0 | none |

At a relative tolerance of 0.01 day 40 is still flagged: the difference still exceeds the allowance at that setting. Adding an absolute tolerance of 50 bbl/d, a stated input, clears it, because the allowed difference becomes the larger of the two and the truck load fits inside it. An absolute floor chosen without looking at the size of the errors you want to find can hide them.

## Days with no sum

3 days carry no sum. A day with any part or the total missing is not checked, because a sum with a missing term is not a sum. On EKENE-3 those are the days of the oil meter outage, which completeness has already flagged.

## Exercise

Open the checks explorer on the consistency view. The oil, water and gross boxes hold a stretch of EKENE-3 around day 40, with the phase sum relTolerance at 0.005. Read the phase-sum flags and find the one for day 40, then copy its reason. Confirm day 41 has no flag. Now set the relTolerance to 0.01 and read the flags again, and explain in one sentence why day 40 is still flagged.
