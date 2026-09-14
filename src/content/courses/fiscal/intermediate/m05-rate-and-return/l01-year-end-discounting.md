# Year end discounting

Every row in this ledger is a whole year, and the year number is its own discount exponent. Year 1 is already discounted once.

{{panel:ec-instrument-explorer}}

## What calculateNPV does

Each year's contractor net cash flow is divided by one plus the rate, raised to that year's number, and the results are added. There is no time zero row, no valuation date and no partial period. A row is a year, and the year is the power.

That means the first year's outflow is not taken at face value. On "USA - Gulf of Mexico" over the Designer's default project the year 1 contractor net cash flow is -310.0117 million USD, and it enters the sum after one division. Swept across the rate, the whole ledger reads:

| rate percent | NPV year end |
| --- | --- |
| 0 | 980.9313 |
| 5 | 598.5674 |
| 8 | 455.5370 |
| 10 | 382.0660 |
| 12 | 321.4390 |
| 15 | 248.6601 |
| 20 | 160.9642 |
| 25 | 100.4166 |
| 30 | 57.0224 |

At 0 percent the NPV is 980.9313 million USD, which is exactly the total contractor net cash flow of that ledger over its 25 years. A discount rate of zero is not a special case in the code; it just makes every divisor one. The project's own rate is 10 percent, so 382.0660 is the figure the summary reports for this regime.

## A negative NPV is not a loss

The teaching field runs at a discount rate of 12 percent, and every one of the six templates returns a negative NPV on it: "Brazil - Concession" -5.8662 million USD, "Generic Royalty/Tax" -13.3840, "Ghana - Deepwater" -27.4074, "USA - Gulf of Mexico" -37.3123, "Nigeria - PIA (2021)" -43.7842 and "Angola - Deepwater PSC" -58.1813. None of those regimes loses money. Brazil returns 192.9896 million USD of undiscounted contractor net cash flow over the life and pays back in year 6. Its internal rate of return is 11.4055 percent, which is below 12, and that is the whole of the explanation.

## The mistake

The careful mistake is to treat year 1 as time zero and leave it undiscounted, the way a spreadsheet laid out with an initial investment in column zero usually does. Every number then comes out slightly too high, and it comes out too high by a factor that changes with the rate, so no single correction fixes a swept table. The tell is not the 0 percent row: a rate of zero makes every divisor one, so every convention returns the undiscounted 980.9313 there, whatever layout produced it. It is at every other rate, where the mistaken layout returns exactly one plus the rate times the year-end figure, a gap that widens with the rate and closes only at zero.

## What it refuses

There is no valuation year, so the discount always starts from the first row. There is no mid period option inside this function, no partial years and no inflation, real or nominal. The horizon is 25 rows for every regime and every project. And the function discounts contractor net cash flow only, so there is no discounted government take and no discounted tax to read beside it.

## Exercise

Write the nine swept NPVs for that regime and say which of them equals the undiscounted total and why. Then give the six teaching field NPVs at 12 percent, and explain in one sentence how a regime with a payback in year 6 can carry a negative NPV.
