# The uplift charged every year

`rrtUpliftPct` reads like a one-off capital uplift and behaves like an annual allowance. It subtracts that percentage of total capex from the resource rent tax base in every one of the 25 years, and the engine calls the result a screening approximation in its own comment.

{{panel:ec-comparison-explorer}}

## What the base actually is

The resource rent tax base is the contractor profit share minus `totalCapex` times `rrtUpliftPct` divided by 100, and that subtraction happens once a year for the whole project life. At the default uplift of 20 percent the relief given over the life is five times the whole capex.

## The sweep that shows it

Take the Brazil - Concession instruments on the default project, whose total capex is 500.0000 million USD, and move the uplift:

| rrtUpliftPct | total tax | total contractor NCF | total government take | NPV at 10 percent | first year with a positive RRT charge |
| --- | --- | --- | --- | --- | --- |
| 0 | 590.7165 | 886.0748 | 859.4093 | 357.3957 | 3 |
| 5 | 380.1066 | 1096.6848 | 648.7993 | 428.7343 | 3 |
| 10 | 233.9725 | 1242.8188 | 502.6653 | 490.6506 | 3 |
| 20 | 62.5794 | 1414.2120 | 331.2721 | 577.8474 | 4 |
| 30 | 1.0282 | 1475.7631 | 269.7210 | 615.4871 | 4 |
| 50 | 0.0000 | 1476.7914 | 268.6928 | 616.1893 | null |

At the default of 20 the tax total is 62.5794, exactly what the four-run tax decomposition records for the resource rent tax alone on this regime and project, so the sweep isolates that one instrument. Ten percentage points of uplift, from 20 to 30, take the total from 62.5794 to 1.0282. At 50 the tax is 0.0000 and the first year with a positive charge is null: the instrument is switched off by a parameter that never mentions switching anything off.

The year-by-year shape says the same. In the published decomposition the resource rent tax column is 0.0000 until year 4, reads 21.0282, 19.3639, 12.9582, 7.2014 and 2.0276 across years 4 to 8, and is 0.0000 from year 9 onward. A tax on rent that stops after five years is the uplift eating the base.

## The default is not neutral

Omitting the field does not mean no uplift. `rrt_uplift_default_20` omits `rrtUpliftPct` and pays total tax of 1638.5664 with a contractor net cash flow of 1812.4483. `rrt_uplift_zero_respected` sets it to 0 and the same regime pays 2607.5549 with a contractor net cash flow of 843.4598. A blank field chose the first of those two.

## What it refuses

The engine will not spread the uplift over a schedule, will not stop granting it once the capex has been recovered, and will not report how much relief it granted. There is no line in the ledger for it.

## The mistake

The careful mistake is reading the parameter name and assuming a one-off. A reader who models a 20 percent capital uplift by typing 20 has granted five times the capex over the life and will report a resource rent tax that stops in year 8. The only way to know which behaviour you have is to sweep the parameter and watch the tax move.

## Exercise

State the total tax at uplift 0, 20 and 50 from the sweep, and the first year each carries a positive charge. Then give the two published totals for the default and for an explicit zero, and say which a blank field gives.
