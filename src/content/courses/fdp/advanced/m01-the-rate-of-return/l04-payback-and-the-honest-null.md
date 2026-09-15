# Payback, and the honest null

Payback is the point at which the cumulative cash flow first turns positive, and when it never turns, the honest answer is never rather than a number.

{{panel:ec-value-explorer}}

## Where the crossing happens

The EGINA Base cumulative runs -2250.0000 at year 0, then -1454.1875, then -658.3750, then 137.4375. The crossing falls inside year 3 and the engine reports 3.8273 years. Year 0 carries the whole capex of 2250.0000 and no production, and each of the first three years earns 795.8125, which is what walks the cumulative back up.

| scenario | oil price | NPV | payback years |
| --- | --- | --- | --- |
| High price | 92.0000 | 3667.1870 | 3.0625 |
| Base | 70.0000 | 2047.5653 | 3.8273 |
| Low price | 48.0000 | 427.9436 | 5.7734 |
| Stress | 18.0000 | -1797.2732 | never |
| Tie-back base | 70.0000 | 1048.6281 | 3.2035 |

## Never is a value

At 18.0000 USD a barrel the cumulative never reaches zero, and payback is null. At 30.0000 USD a barrel, on an NPV of -898.3507, it is null again. Null here is not missing data and it is not an error. It is the measured answer, and it is the strongest thing payback ever says.

There is one published case that behaves differently and it is worth knowing by name: a case with zero production every year records payback as the project life by convention, alongside an NPV of -979.6325 and the status `no-sign-change`. That convention is a property of that published case. A reader who meets a payback equal to the concept life of 20.0000 years should check whether the project paid back in its last year or never paid back at all.

## What payback does not weigh

Payback stops looking the moment the cumulative turns. The Base case is at 137.4375 when it crosses and at 2540.3809 by year 7, and payback of 3.8273 years is identical in both readings. A short payback on a flow that collapses afterwards and a short payback on a flow that keeps climbing are the same number.

It also says nothing about size. The tie-back pays back in 3.2035 years and the FPSO in 3.8273, and the FPSO earns 2047.5653 million USD against 1048.6281.

## The mistake

The mistake is substitution: reporting the project life where the measurement is never, because a chart needs a bar and a null will not draw one. That turns the clearest finding a screening case can produce into a plausible looking 20.0000. The second mistake is ranking on payback, which favours whichever option gets its money back soonest and is indifferent to how much money that is.

## Exercise

List the payback of all five EGINA scenarios, marking which ones report never. Then, using the cumulative values -2250.0000, -1454.1875, -658.3750 and 137.4375, say which year the Base case crosses in and why 3.8273 is not a whole number.
