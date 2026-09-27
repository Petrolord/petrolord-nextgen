# The cost pool carried forward

{{panel:joa-recovery-calculator}}

Cost that the limit does not let through in a year is not lost. It stays in the cost pool and is carried forward to the next year, where it waits for room under that year's limit. The pool is the running balance of cost spent and not yet recovered, and this lesson follows the Ekene pool from its first year to the year it empties.

## The pool, threaded through applyPSC

The engine calls the canonical applyPSC of the cash flow engine once a year and hands each year the pool the year before left:

> applyPSC imported from engines/economics/cashflow.ts, called once a year with the unrecovered pool threaded; nothing here re-computes the cost pool

The pool that opens the first year is a stated input: cost already spent before the first year of the call. The Ekene variant states 142000000.000000. A call that states none is refused:

> openingCostPool must be a finite number at or above 0; got nothing

A pool of 0 is a stated figure too: a contract with no cost spent before its first year states it.

## The Ekene pool, year by year

The Ekene variant states a cost oil limit of 60.000000 percent of gross:

| year | pool in | capex | opex | cost oil limit | cost recovered | pool out |
| --- | --- | --- | --- | --- | --- | --- |
| 2029 | 142000000.000000 | 280000000.000000 | 0.000000 | 0.000000 | 0.000000 | 422000000.000000 |
| 2030 | 422000000.000000 | 90000000.000000 | 20000000.000000 | 131400000.000000 | 131400000.000000 | 400600000.000000 |
| 2035 | 93903800.000000 | 0.000000 | 25000000.000000 | 77590200.000000 | 77590200.000000 | 41313600.000000 |
| 2036 | 41313600.000000 | 0.000000 | 26000000.000000 | 69831600.000000 | 67313600.000000 | 0.000000 |
| 2037 | 0.000000 | 0.000000 | 27000000.000000 | 62848200.000000 | 27000000.000000 | 0.000000 |

In 2029 there is no revenue, so the limit is 0.000000 and the whole pool and the year's capex are carried forward:

> 2029: recoverable 422000000 is above the cost oil limit 0; 422000000 carried to 2030

In 2030 the recoverable cost is the pool plus the year's capex and opex, and only the limit is recovered:

> 2030: recoverable 532000000 is above the cost oil limit 131400000; 400600000 carried to 2031

In 2036 the recoverable cost of 67313600.000000 is below the limit of 69831600.000000 for the first time, so all of it is recovered and the pool empties. From 2037 the pool is 0.000000 and cost recovered is the year's opex alone, 27000000.000000, far inside the limit. The room left under the limit goes to profit oil, so profit oil jumps in 2037.

## The totals

Over the ten years the Ekene variant recovers 738000000.000000 of cost, which is the opening pool plus every year's capex and opex, and leaves 0.000000 unrecovered at the end. Every year's pool out and tax is the applyPSC return value exactly, checked when the course was built.

A pool that has not emptied by the last year is reported as unrecovered at the end, as the limit base lesson showed on revenue after royalty. The engine computes no year beyond those it is given.

## Exercise

Work in the course's own recovery calculator, view "PSC cost recovery", starting from "The Ekene PSC variant".

1. Follow the pool in and pool out columns from 2029 to 2037, and read the reasons for 2029 and 2030.
2. Find the year the pool empties, and check the cost recovered in 2036 and 2037 against the table above.
3. Read the tiles "Cost recovered, total" and "Unrecovered at the end".
4. With the control "Opening cost pool (stated)", set 0 and find the year the pool now empties. Then clear the control and read the refusal.
