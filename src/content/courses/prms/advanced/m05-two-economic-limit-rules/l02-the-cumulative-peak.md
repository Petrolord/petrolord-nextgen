# The cumulative peak

{{panel:prms-reserves-calculator}}

{{panel:prms-aggregation-calculator}}

SPE-PRMS 2018 (June 2018; CC BY-NC-ND 4.0) sets the economic limit its own way, in sections 3.1.3.1 to 3.1.3.4. The course cites those sections and puts the rule in its own words: the economic limit is the year the cumulative net cash flow, before income tax, allowances and abandonment, reaches its maximum. Interim negative years count only when later positive years more than offset them.

## Reading the rule

Add up the yearly net cash flow before tax and abandonment, year by year. The running total climbs while years pay and falls when they do not. Its highest point is the limit. A loss year followed by enough paying years to lift the total above its previous high does not end the project; a loss year that is never made up does.

## When the two rules agree

On a declining forecast with no late capital, every year pays less than the one before, and once a year stops paying none after it pays again. The running total then peaks at the last paying year, which is also where the trailing trim stops. The engine uses the canonical trim and checks it against the peak on every call. On EKN-1 the two agree for each case, so the engine returns 2033, 2037 and 2040 without comment.

## A profile where they part

The golden case "econ-refuse-limit-disagrees" states a low forecast of 100000, 10000, 25000 and 22000 barrels from 2027 to 2030, at 50 a barrel with opex of 1000000 a year and no royalty. The canonical cash flow of that case, year by year:

| year | revenue less royalty less opex | cumulative before tax and abandonment |
| --- | --- | --- |
| 2027 | 4000000.000000 | 4000000.000000 |
| 2028 | -500000.000000 | 3500000.000000 |
| 2029 | 250000.000000 | 3750000.000000 |
| 2030 | 100000.000000 | 3850000.000000 |

The last year pays, so the trailing trim keeps every year to 2030. The running total peaks in 2027: the loss of 2028 is never fully made up, since the later years recover only part of it. The cumulative peak sets the limit in 2027.

## What each rule counts

Under the trailing trim, the barrels of 2028 to 2030 are inside the limit and count toward Reserves. Under the cumulative peak they are beyond it. The difference is a Reserves figure, moved by a choice of rule. The next lesson reads what the engine does about that.

## Reading the peak on your own forecast

Build the running total the way the table does: for each year, revenue less royalty less opex, then add it to the total so far, then find the highest total. The trailing trim needs only the yearly column, read from the bottom up; the peak needs the whole running total. Income tax, allowances and abandonment stay out of the running total for this rule.

## Exercise

Open the aggregation calculator on the view "The economic limit: the two rules" and start from "EKN-1: the two rules agree". Read each case's economic limit. Then switch to "The two economic-limit rules disagree" and read the forecast rows, the price and the opex in the box. Work the table above for yourself, year by year, and mark where the trailing trim stops and where the running total peaks. Read the refusal the calculator prints and find both years in it.
