# The story so far

This tier is one sentence, tested six ways: on a comparison screen, knowing which instrument moved a number matters less than knowing which numbers are not measurements.

## Four returns and one sort

`runFiscalComparison` gives back `summary`, `annualCashFlows`, `sensitivityData` and `insights`. Only the summary is sorted, by contractor NPV descending, and nothing else can be read off a row's position. On the default project all six templates share a total revenue of 2686.9277, and the first row, Nigeria - PIA (2021) at 432.0925, collects the smallest government cash flow of the six at 687.4682, while the last, Ghana - Deepwater at 172.7531, collects the largest at 1316.6067.

## Two ratios, two names

Government share of net revenue, in the summary, adds total capex back to the contractor side; government take, on the price sweep, does not. Nigeria - PIA (2021) reads 30.6156 in the table and 39.3855 on the chart at the same 70 USD per bbl, on the same cash flows. Government take also has a denominator that can hit zero, and there it returns null with the state undefined for a regime that collected 1021.2611.

## Two sweeps with edges

The price sweep runs nine points from 40 to 120 USD per bbl and scales oil only, so gas and NGL prices never move. Across it Brazil - Concession climbs 20.5076 percentage points while the climb for USA - Gulf of Mexico is -17.2498. The capex sweep is labelled 0.8 to 1.5 and delivers eight points ending there, on a step count, since an accumulating sum would reach 1.5000000000000004 and fail its own test. USA - Gulf of Mexico gives up 267.7301 over that range.

## Verdicts and their quantities

`deriveInsights` answers four tempting claims with five keyed verdicts and omits any it cannot support: three on a single regime, none on an empty list. Each sentence rounds to one decimal place and each sweep verdict refuses to rank inside one printed step, which is why `cmp_never_recovers` names no resilient regime and reports all six at 12,727.3 million USD.

## Numbers to distrust

`calculateIRR` names a rate only inside the band from -99 to 1000 percent and otherwise returns null with a status, and it never prints the edge of its own search, or 0, in place of a rate. `rrtUpliftPct` sizes a one-time pool, so on the isolated sweep the resource rent tax totals 350.7165 at the default 20 against 390.7165 at a zero uplift.

## The field it all lands on

ODIDI at 12 percent returns one barely positive NPV, 1.7389 for Nigeria - PIA (2021), and five negative ones, from -5.8662 for Brazil - Concession to -58.1813 for Angola - Deepwater PSC, while all six pay back between year 6 and year 8. Payback and NPV answer different questions, and a reader who quotes one for the other mistakes a marginal field for a safe one.

## Exercise

Name the four things `runFiscalComparison` returns and the one that is sorted. Then give government take and government share of net revenue for Nigeria - PIA (2021) at 70 USD per bbl and say which adds capex back.
