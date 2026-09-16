# The uplift charged every year

`rrtUpliftPct` reads like a one-off capital uplift, and until the 2026-09-15 repair it behaved like an annual allowance. It sizes a pool now. The only way to tell which behaviour a parameter has is still to sweep it.

{{panel:ec-comparison-explorer}}

## What the base is

The resource rent tax base is the contractor's profit share less relief drawn from a pool. The pool opens once, at total capex times one plus the uplift, so at the default 20 percent it holds 1.2 times the capex. In each year whose profit share is positive the relief is the lesser of that share and what is left of the pool, and the pool is never refilled. Relief over the life therefore never exceeds 1.2 times the capex. The rule this replaced subtracted total capex times the uplift over 100 in every one of the 25 years, five times the whole capex at the default.

## The sweep that shows it

Take the Brazil - Concession instruments on the default project, whose total capex is 500.0000 million USD, set the corporate income tax to zero so the resource rent tax stands alone, and move the uplift:

| rrtUpliftPct | total tax | total contractor NCF | total government cash flow | NPV at 10 percent | first year with a positive RRT charge |
| --- | --- | --- | --- | --- | --- |
| 0 | 390.7165 | 1086.0748 | 659.4093 | 486.5404 | 6 |
| 5 | 380.7165 | 1096.0748 | 649.4093 | 491.8603 | 7 |
| 10 | 370.7165 | 1106.0748 | 639.4093 | 496.9919 | 7 |
| 20 | 350.7165 | 1126.0748 | 619.4093 | 507.2550 | 7 |
| 30 | 330.7165 | 1146.0748 | 599.4093 | 517.0923 | 8 |
| 50 | 290.7165 | 1186.0748 | 559.4093 | 535.4514 | 9 |

The total tax falls by a fixed amount for every point of uplift and the first charged year slides later, from year 6 at a zero uplift to year 9 at 50 percent. Nothing switches off. In the published decomposition the resource rent tax column is 0.0000 until year 7, reads 10.8703 there and 42.0276 in year 8, and then falls with the profit share to 4.1217 in year 25.

## A pool gives a fixed total

That is the test. A pool moves the year the charge begins and leaves the total relief where it is; an annual allowance would change the total. `rrt_pool_never_exhausted` opens a pool of 10000 against a capex of 1000, larger than every profit share in the life put together, so the base is zero in all 25 years and the total tax of 1198.0658 million USD is the corporate income tax alone.

## The default is not neutral

Omitting the field does not mean no uplift. `rrt_uplift_default_20` omits `rrtUpliftPct` and pays total tax of 2127.5549 million USD with a contractor net cash flow of 1323.4598. `rrt_uplift_zero_respected` sets it to 0, which opens the pool at the capex itself, and the same regime pays 2207.5549 with 1243.4598. A blank field chose the first of those two.

## What it refuses

The engine will not spread the pool over a schedule and will not report how much relief it granted. There is no line in the ledger for it.

## The mistake

The careful mistake is reading a parameter name and assuming the behaviour behind it. The name now reads the way the code behaves, which is exactly when a reader stops checking. Sweep it anyway, and watch both the total and the timing.

## Exercise

State the total tax at an uplift of 0, 20 and 50 from the isolated sweep, and the first year each carries a positive charge. Then give the two published totals for the default and for an explicit zero, and say which a blank field gives.
