# Fixed opex and variable opex

Opex has two halves that behave in opposite ways. One never moves and one tracks the declining production, so the total falls every year and approaches a floor it never reaches.

{{panel:ec-regime-explorer}}

## The formula and the two halves

Opex is `fixed` plus `variable` times the barrels of oil equivalent produced that year, divided by one million because the variable rate is quoted in USD per boe while the ledger is in millions of USD.

The Designer's default project carries fixed opex of 10 million USD a year and variable opex of 5 USD per boe. ODIDI carries fixed 12 million USD a year and variable 4 USD per boe.

| year | default project opex | ODIDI opex |
| --- | --- | --- |
| 1 | 31.0027 | 25.0037 |
| 2 | 28.8480 | 23.1706 |
| 3 | 26.9153 | 21.5960 |
| 4 | 25.1816 | 20.2434 |
| 5 | 23.6264 | 19.0816 |
| 6 | 22.2311 | 18.0837 |
| 25 | 11.5851 | 12.3405 |

Over the life the default project spends 441.4436 million USD of opex and ODIDI spends 390.2137 million USD.

## The floor is visible in the last row

Year 25 of the default project costs 11.5851 million USD against a fixed component of 10 million USD a year, so almost the whole bill is now fixed. Year 25 of ODIDI costs 12.3405 million USD against a fixed component of 12 million USD a year. The curve is heading for the fixed number and would only arrive there if production reached zero, which the horizon ends before it can.

That is why ODIDI, the smaller field, ends up with the higher opex in its last year despite a lower variable rate. Its fixed component is larger, and by year 25 the fixed component is almost the whole bill.

## These columns ignore the regime

The opex and capex columns are the same for every regime run on the same project. A comparison table showing six regimes shows six identical cost columns. Nothing a government does in this model changes what the field costs to run.

## The mistake

The careful reader expects opex to move with revenue, or with price, because most cost intuitions are built on cash margins. The default project's price steps from 70 to 75 USD per bbl at year 5 and opex still falls, from 25.1816 to 23.6264 million USD. Opex tracks boe, and boe does not know what a barrel sold for.

The second slip is the multiplier. The variable rate is USD per boe and the ledger is millions of USD, so the divide by one million is doing real work. Forgetting it inflates year 1 default opex by a factor of one million and produces a ledger where nothing recovers, ever, which looks like a cost recovery problem and is not.

## What opex refuses

It refuses to escalate, to carry a workover, to step when a facility is added, and to distinguish fixed from variable in any way the recovery mechanism can see. There is no inflation on the fixed half and no efficiency curve on the variable half.

## Exercise

Say which half of opex accounts for most of year 1 on the default project and which half accounts for most of year 25. Then explain why ODIDI ends the life above the default project on opex while starting it well below.
