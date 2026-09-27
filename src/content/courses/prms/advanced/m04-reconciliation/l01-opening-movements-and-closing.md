# Opening, movements and closing

{{panel:prms-aggregation-calculator}}

A reserves estimate changes from one date to the next. Some of the change is production; some is new information, new projects, or quantities moving between classes. A reconciliation lists each change as a stated movement, adds them to the opening figures, and checks the result against the closing figures the estimator states. The engine's `reconcile` function does exactly that, category by category.

## The rule

The engine's basis, verbatim:

> opening + movements = closing, category by category; production comes out of every Reserves category alike (the movement headings are the engine's stated convention)

It cites SPE-PRMS 2018 (June 2018; CC BY-NC-ND 4.0) by section, verbatim:

> SPE-PRMS 2018 (June 2018, v1.03 with the 2022 errata; CC BY-NC-ND 4.0, cited by section): 3.1.3.5 (reconciliation, technical revision), 2.2.2.6 (reclassification without new information leaves the distribution unchanged)

The movement headings (production, revisions, improved recovery, extensions and discoveries, acquisitions, divestments, transfers) are the engine's stated convention. Another reporting scheme may group movements differently; the arithmetic is the same.

## The Ekene field Reserves, one year

The fixture states the Ekene field Reserves in MMbbl over 1 year, with four movements and a stated closing, at a tolerance of 0.001000:

| movement | 1P | 2P | 3P |
| --- | --- | --- | --- |
| opening | 15.200000 | 21.000000 | 27.500000 |
| production | -1.100000 | -1.100000 | -1.100000 |
| revisions | 0.300000 | -0.200000 | -0.600000 |
| transfers | 3.400000 | 5.100000 | 6.900000 |
| improved-recovery | 0.500000 | 0.800000 | 1.200000 |
| computed closing | 18.300000 | 25.600000 | 33.900000 |
| stated closing | 18.300000 | 25.600000 | 33.900000 |

Each column adds down: the opening plus every movement gives the computed closing. The engine prints its working in its reasons, the opening first and the closing check last, verbatim:

> Reserves reconciliation in MMbbl: opening 1P 15.2, 2P 21, 3P 27.5

> computed closing: 1P 18.3, 2P 25.6, 3P 33.9; stated closing 1P 18.3, 2P 25.6, 3P 33.9

> the reconciliation closes: every category within the stated tolerance 0.001

## The stated closing is a check

The closing is stated by whoever prepared the new estimate. The engine does not replace it with its own sum. It computes the closing from the opening and the movements, compares the two category by category, and reports the difference and whether it falls within the stated tolerance. A reconciliation that closes says the movements account for the change. It does not say the new estimate is right. That is a matter for the estimate itself.

## Every input is stated

The class, the unit, the period, the opening, the movements, the stated closing and the tolerance are all inputs with no default. The tolerance is refused when it is missing, verbatim:

> tolerance must be a finite number at or above 0; got nothing

A period of zero years is refused too, and an opening out of order is refused with the same order check the categories use everywhere in this course: low at or below best at or below high.

## Exercise

Open the aggregation calculator on the view "Reconciliation" and start from "The Ekene field Reserves, one year". Read the movement table and add each category's column yourself, the opening first; compare your sums with the computed closing. Read the Closes tile and the reasons. Then set the Tolerance (stated) control to "not stated" and read the refusal, and restore it.
