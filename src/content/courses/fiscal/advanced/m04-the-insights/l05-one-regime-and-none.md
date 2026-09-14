# One regime, and none

`deriveInsights` returns up to five verdicts. The word up to is doing real work: with one regime it returns three, and with none it returns nothing at all.

{{panel:ec-comparison-explorer}}

## Three verdicts, not five

On `insights_single_regime` the function returns the contractor verdict, the payback verdict and the government verdict, and omits the capex and price verdicts entirely. A ranking of one is not a ranking. Both sweeps still run and still produce a series, but a series has no winner and the function declines to name one.

A sentence template that always prints will print, and a reader would have been told which of one regime was the most resilient to cost overrun.

## The sentences drop their comparison clause

With several regimes the payback verdict reads that "Beta" pays back in year 4, against year 6 for "Alpha", and the government verdict that "Beta" collects the most, 900.0 million USD against 400.0 million USD for the next highest, "Alpha". With one regime the same two verdicts read differently: "Alpha" pays back in year 6, and no other regime pays back within the project life; and "Alpha" collects 400.0 million USD in total government cash flow.

The government sentence loses the words the most, because there is nothing to be most of, and reports a total instead of a ranking.

## The clause that reads like a comparison

The single-regime payback sentence still says that no other regime pays back within the project life. That clause is true, and it is true because there is no other regime. A reader skimming it can take it as a finding about a set of rejected alternatives when it is a statement about an empty set. Its heading still reads "Fastest capital recovery", the same wording it carries when six regimes were ranked.

## No regimes at all

`insights_empty` compares nothing and returns an empty list. It does not return five verdicts about an absent regime, and it does not return one verdict saying there was nothing to compare. An empty result is the honest shape for an empty question, and a panel rendering the list has to handle it.

## What this refuses

The function refuses to rank a single item, refuses to fill a comparison clause it cannot support, and refuses to speak about an empty comparison. `runFiscalComparison` takes a project and a list of regimes, and the list is what gets ranked.

## The mistake

The careful mistake is reading a missing verdict as a computation that failed. On a single-regime run the capex and price verdicts are absent by design, and their absence carries information: nothing was ranked, so nothing about resilience or progressivity has been claimed. Reaching for the sweep series and eyeballing a winner puts the hard-coded claim back by hand.

## Exercise

State the three verdicts `insights_single_regime` returns and the two it omits, then write out its government sentence and say how it differs in wording from the multi-regime form. Finally, say what `insights_empty` returns.
