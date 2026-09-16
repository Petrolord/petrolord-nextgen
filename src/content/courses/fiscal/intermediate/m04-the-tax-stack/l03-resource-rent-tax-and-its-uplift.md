# Resource rent tax and its uplift

A second profits tax on the same base, less relief drawn from a pool the uplift sizes once. The pool empties, and the year it empties is the whole lesson.

{{panel:ec-instrument-explorer}}

## What the engine charges

The pool is opened once, at total capex times one plus the uplift, and drawn against the contractor's profit share in every year that share is positive. The relief in a year is the smaller of the share and whatever is left of the pool. It is never refilled, and the tax is charged on the part of the base that survives. The uplift defaults to 20 percent when the field is omitted, and a value of 0 is respected rather than replaced.

Isolate it. "Brazil - Concession" on the default project charges 40 percent, and running it with the other two taxes at zero leaves one column.

| year | profitOil | resource rent tax alone |
| --- | --- | --- |
| 3 | 75.7962 | 0.0000 |
| 4 | 152.5706 | 0.0000 |
| 5 | 148.4098 | 0.0000 |
| 6 | 132.3955 | 0.0000 |
| 7 | 118.0035 | 10.8703 |
| 8 | 105.0690 | 42.0276 |
| 9 | 93.4441 | 37.3776 |

The column is 0.0000 while the pool lasts, turns on part way through year 7 at 10.8703 million USD, and from year 8 is the full rate on the whole base. Over the life it totals 350.7165 million USD against 502.1091 for a corporate income tax of 34 percent on the same base.

## Why the total barely moves

Total capex here is 500.0000 million USD, so a 20 percent uplift opens a pool of 1.2 times that. Relief over the life can never exceed the pool, so the uplift moves the year the charge begins much more than it moves the total.

| rrtUpliftPct | total tax | total contractor NCF | first year with a positive charge |
| --- | --- | --- | --- |
| 0 | 390.7165 | 1086.0748 | 6 |
| 5 | 380.7165 | 1096.0748 | 7 |
| 10 | 370.7165 | 1106.0748 | 7 |
| 20 | 350.7165 | 1126.0748 | 7 |
| 30 | 330.7165 | 1146.0748 | 8 |
| 50 | 290.7165 | 1186.0748 | 9 |

Total tax falls by a fixed amount for each point of uplift while the first charged year slides later, which is what a pool looks like under a sweep. Until the 2026-09-15 repair the engine subtracted the capex times the uplift in every one of the 25 years.

Two published cases pin it on the Suite test project. With the uplift omitted so the default applies, total tax is 2127.5549 million USD and contractor net cash flow 1323.4598; with the uplift set to 0, total tax is 2207.5549 and 1243.4598. The two ledgers agree in year 2 at 95.1483 and in year 3 at 175.6502, part company in year 4 at 169.6803 against 249.6803, and agree again from year 5. The gap is one pool larger than the other, given once and then gone.

## The mistake

The mistake is reading the parameter as an allowance granted every year, which is what it used to be. `rrt_pool_never_exhausted` marks the far end: an uplift of 900 percent opens a pool of 10000 against a capex of 1000, so the base is zero in all 25 years and total tax is 1198.0658, the corporate income tax alone.

## What it refuses

The pool is sized on total capex and never on a year's capex, it is opened once and never topped up, and relief left in it at the horizon goes nowhere. It takes no notice of the corporate income tax on the same base, since the two are computed independently and added.

## Exercise

Write the resource rent tax alone for years 3 to 9 and its life total. Then give the total tax at uplifts of 0, 20 and 50 percent with the first charged year beside each, and say which of the three most looks like a regime with no resource rent tax.
