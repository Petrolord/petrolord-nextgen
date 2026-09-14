# The story so far

This tier is one sentence, tested six ways: on a comparison screen, knowing which instrument moved a number matters less than knowing which numbers are not measurements.

## Four returns and one sort

`runFiscalComparison` gives back `summary`, `annualCashFlows`, `sensitivityData` and `insights`. Only the summary is sorted, by contractor NPV descending, and nothing else can be read off a row's position. On the default project all six templates share a total revenue of 2686.9277, and the first row, Generic Royalty/Tax at 397.0445, collects the smallest government take of the six at 758.7514, while the last, Nigeria - PIA (2021) at 154.8286, collects the largest at 1339.2784.

## One rate, two values

The summary's effective tax rate adds total capex back to the contractor side; the price sweep's does not. Nigeria - PIA (2021) reads 59.6432 in the table and 76.7282 on the chart at the same 70 USD per bbl, on the same cash flows. The sweep's version also has a denominator that can hit zero, and there it returns null with the state undefined for a regime that collected 1431.0440.

## Two sweeps with edges

The price sweep runs nine points from 40 to 120 USD per bbl and scales oil only, so gas and NGL prices never move. Across it Angola - Deepwater PSC climbs 12.1305 percentage points while the climb for USA - Gulf of Mexico is -17.2498. The capex sweep is labelled 0.8 to 1.5 and delivers seven points ending at 1.4, because the accumulator reaches 1.5000000000000004 and fails its own test. USA - Gulf of Mexico gives up 228.7953 over the swept points and 267.7301 over the range the label promised.

## Verdicts and their quantities

`deriveInsights` replaced four hard-coded claims with five keyed verdicts and omits any it cannot support: three on a single regime, none on an empty list. Each sentence rounds to one decimal place, which is why `cmp_never_recovers` names a most and a least resilient regime whose losses are both 10909.090909.

## Numbers to distrust

`calculateIRR` returns 102400 percent when the root is past its bracket and 0 for two unlike situations, one of them a project that loses money at every rate. `rrtUpliftPct` is charged annually, so at the default 20 the total resource rent tax is 62.5794 against 590.7165 at zero uplift.

## The field it all lands on

ODIDI at 12 percent returns six negative NPVs, from -5.8662 for Brazil - Concession to -58.1813 for Angola - Deepwater PSC, while all six pay back between year 6 and year 8. Payback and NPV answer different questions, and a reader who quotes one for the other has an investable field and an uninvestable one in the same table.

## Exercise

Name the four things `runFiscalComparison` returns and the one that is sorted. Then give both effective tax rates for Nigeria - PIA (2021) at 70 USD per bbl and say which adds capex back.
