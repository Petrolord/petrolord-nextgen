# Four claims that were never computed

Four claims about a fiscal comparison are easy to make and easy to believe. The summary table alone settles none of them, and on the six templates two of them are false.

{{panel:ec-comparison-explorer}}

## The four claims

The first says the regime with the highest contractor NPV also has the fastest payback. The second calls the second-ranked regime the one that maximises government revenue. The third and fourth assert a capex-resilience ranking and a price-response ranking without running either sweep. `deriveInsights` answers all four from numbers.

## The payback claim, checked

On `insights_suite` the contractor verdict names "Alpha", delivering the highest contractor NPV at 150.0 million USD with an IRR of 22.0 percent, and the payback verdict names "Beta", which pays back in year 4 against year 6 for "Alpha". Two different regimes, in one result object.

The real templates make the same point differently. On `cmp_all_templates_default_project` the best contractor NPV is Nigeria - PIA (2021) at 432.0925 with payback in year 3, and Ghana - Deepwater, ranked sixth at 172.7531, also pays back in year 3. Payback is an integer year, so it ties across regimes that NPV separates by hundreds of millions of USD.

## The government claim, checked

`runFiscalComparison` sorts the summary by contractor NPV descending, and the sort carries no information at all about take. On `cmp_all_templates_default_project` the second row is Generic Royalty/Tax with government cash flow 758.7514. The government's largest collection on that comparison is 1316.6067, from Ghana - Deepwater, which sits sixth. On ODIDI the second row is Brazil - Concession at 232.9950 while Angola - Deepwater PSC, ranked sixth, collects 316.7898.

A rule that names the second-best regime for the contractor as best for the government reads close to the opposite of the truth on both comparisons.

## The two rankings nothing computed

A capex-resilience ranking needs the capex sweep and a price-response ranking needs the price sweep, and a sentence that states either without running it is guessing. Run them on the default project: contractor NPV given up across the swept capex points runs from 88.6123 for Angola - Deepwater PSC to 267.7301 for USA - Gulf of Mexico, and the climb in government take across the swept prices runs from -17.2498 for USA - Gulf of Mexico to 20.5076 for Brazil - Concession. USA - Gulf of Mexico sits at the exposed end of both while the resilient end and the progressive end belong to different regimes, which is a finding a hard-coded sentence could never have produced.

## What the function refuses

`deriveInsights` returns up to five verdicts, keyed `npv`, `payback`, `government`, `capex` and `price`. When a claim cannot be supported it is omitted rather than guessed: `insights_single_regime` returns three verdicts and `insights_empty` returns an empty list rather than a verdict about nothing.

## The mistake

The careful mistake is to treat the first summary row as first at everything. It is first at one quantity, contractor NPV, and on the default project the first row, Nigeria - PIA (2021), carries government cash flow of 687.4682, the smallest of the six.

## Exercise

From `cmp_all_templates_default_project`, name the regime a second-row government claim would pick and the take it collects, then name the regime that actually collects the most and its take. Then say why payback cannot rank six regimes on that comparison.
