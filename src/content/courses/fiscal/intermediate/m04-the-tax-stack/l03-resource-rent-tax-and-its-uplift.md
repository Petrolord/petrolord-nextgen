# Resource rent tax and its uplift

A second profits tax on the same base, less a capital uplift charged in every one of the 25 years. That one word, annual, is the whole lesson.

{{panel:ec-instrument-explorer}}

## What the engine charges

The resource rent tax base is the contractor's profit share minus totalCapex times rrtUpliftPct divided by 100, and the charge is made only when that difference is positive. The uplift defaults to 20 percent when the field is omitted, and a value of 0 is respected rather than replaced.

Isolate it. "Brazil - Concession" on the Designer's default project charges 40 percent; running it with the corporate income tax and the minimum tax at zero leaves one column.

| year | profitOil | resource rent tax alone |
| --- | --- | --- |
| 3 | 75.7962 | 0.0000 |
| 4 | 152.5706 | 21.0282 |
| 5 | 148.4098 | 19.3639 |
| 6 | 132.3955 | 12.9582 |
| 7 | 118.0035 | 7.2014 |
| 8 | 105.0690 | 2.0276 |
| 9 | 93.4441 | 0.0000 |

The charge starts in year 4, peaks at 21.0282 million USD and is back to 0.0000 by year 9, never to return, though profit oil is still 93.4441 that year and stays positive to the end. Over the life the resource rent tax alone totals 62.5794 million USD against 502.1091 for a corporate income tax of 34 percent on the same base. The higher rate collects the smaller amount.

## Why: the relief is five times the capex

Total capex on this project is 500.0000 million USD, and the subtraction of that capex times the uplift percent happens in every one of the 25 rows. At the default 20 percent, the relief given over the life is five times the whole capital cost. The engine calls this a screening approximation in its own comment. The parameter name does not.

Sweeping the uplift with the tax isolated is the only way to see it move:

| rrtUpliftPct | total tax | total contractor NCF | first year with a positive charge |
| --- | --- | --- | --- |
| 0 | 590.7165 | 886.0748 | 3 |
| 5 | 380.1066 | 1096.6848 | 3 |
| 10 | 233.9725 | 1242.8188 | 3 |
| 20 | 62.5794 | 1414.2120 | 4 |
| 30 | 1.0282 | 1475.7631 | 4 |
| 50 | 0.0000 | 1476.7914 | null |

At 50 percent no year in the life ever carries a positive charge, and the tax is 0.0000. Two published cases pin it on the Suite test project: with the uplift omitted so the default applies, total tax is 1638.5664 million USD and contractor net cash flow 1812.4483; with the uplift set to 0, total tax is 2607.5549 and contractor net cash flow 843.4598. Year by year those two runs read 127.0875 against 207.0875 in year 2, 302.2975 against 382.2975 in year 3, and 100.7819 against 180.7819 in year 8. The gap is the same fixed amount every year, which is what an annual allowance looks like.

## The mistake

The mistake is reading "uplift percent" as a one-off relief, granted in the year the money is spent. Under that reading a 40 percent tax on a base that reaches 152.5706 million USD would be a serious instrument. Under the engine's reading it collects 62.5794 over 25 years and stops in year 8. Nothing on the screen distinguishes the two readings, so sweep the parameter before quoting a resource rent tax total.

## What it refuses

The uplift is a percent of total capex, not of any year's capex, and it is granted for all 25 years with no cap and no expiry. Unused uplift is not carried forward; the year simply pays 0.0000. And it takes no notice of the corporate income tax on the same base; the two are computed independently and added.

## Exercise

Write the resource rent tax alone for years 3 to 9 and its life total. Give the total tax at uplift 0, 20 and 50 percent, and say what a reader would conclude about this instrument seeing only the default.
