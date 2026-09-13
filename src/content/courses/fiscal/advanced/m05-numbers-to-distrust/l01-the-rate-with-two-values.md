# The rate with two values

One result object holds two quantities called the effective tax rate, computed on the same cash flows by different formulas, and one screen shows both within a centimetre of each other.

{{panel:ec-comparison-explorer}}

## The two formulas

The summary table divides total government take by total government take plus contractor take, with TOTAL CAPEX ADDED BACK to the contractor side. The add-back is what makes it a rate on profit rather than a rate on cash. The price sensitivity divides the same two quantities on the same cash flows WITHOUT the add-back. Both come back from one call to `runFiscalComparison`.

At the deck's own first-year price of 70 USD per bbl, the two read like this on `cmp_all_templates_default_project`:

| regime | summary, capex added back | price sweep, no add-back | difference, percentage points (derived) |
| --- | --- | --- | --- |
| Generic Royalty/Tax | 33.7901 | 43.4694 | 9.6793 |
| USA - Gulf of Mexico | 34.0485 | 43.8018 | 9.7533 |
| Brazil - Concession | 37.1137 | 47.7450 | 10.6313 |
| Angola - Deepwater PSC | 53.4534 | 68.7654 | 15.3119 |
| Ghana - Deepwater | 58.6335 | 75.4293 | 16.7958 |
| Nigeria - PIA (2021) | 59.6432 | 76.7282 | 17.0850 |

On the Designer's own two defaults the gap is the same size: Concessionary (Royalty/Tax) reads 46.3452 in the table and 59.6210 on the chart, a difference of 13.2758, and Nigerian PIA (PSC) reads 55.5380 against 71.4471, a difference of 15.9091.

Neither number is wrong on its own terms. Take over profit and take over cash are both quantities a fiscal analyst uses, and they answer different questions. What is wrong is that one screen calls both the effective tax rate.

## The sweep's second problem

The summary's denominator stays comfortably positive on these cases. The sweep's denominator is government take plus contractor net cash flow with nothing added back, and it can reach zero and go through it. The division is guarded by a test that total profit is above zero, and when the guard fires it returns exactly 0.

On `cmp_never_recovers` all six templates plot a flat 0.0000 percent at all nine prices, while the same run records government take of 1431.0440 for Nigeria - PIA (2021) and 1662.7835 for Angola - Deepwater PSC. A share of 0.00 percent is drawn for a project on which the government collected a great deal.

Run the Angola template on the default project with every capex line multiplied by three: 0.0000, then 2223.0766, then 144.0692, then 85.6015 at the first four prices. Three of those are the guard firing, the ratio exploding through a near-zero denominator, and an ordinary reading, in that order, on one line of one chart, unflagged.

## The mistake

The careful mistake is treating the difference between the two rates as movement. It is not a change with price, not a modelling error, and not a rounding artefact. Both numbers describe the same 25 years of the same ledger, and 17.0850 percentage points separate them because one counted capex as returned to the contractor and the other did not.

## What to do

Quote a rate with its definition, and before believing any point on the sweep curve read the two totals underneath it. If lifetime contractor net cash flow is negative, the number is not a share.

## Exercise

For Nigeria - PIA (2021) on `cmp_all_templates_default_project`, state both effective tax rates at 70 USD per bbl and the difference, and say which counts capex as returned. Then say what the sweep plots for that regime on `cmp_never_recovers` and what it collected there.
