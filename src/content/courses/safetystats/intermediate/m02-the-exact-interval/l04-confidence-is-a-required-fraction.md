# Confidence is a required fraction

{{panel:ss-intervals-explorer}}

Two calls to `rateConfidenceInterval`, and what the engine returns for each:

| what was passed | field named | result |
| --- | --- | --- |
| confidence as a percentage, 95 | `confidence` | refused |
| no confidence at all | `confidence` | refused |
| confidence 0.950000 on 7 in 400000 hours, base 200000 | none | 1.407182 to 7.211338 |

The first two carry no number. The third is the BLS worked example with its interval.

## The engine's own words

Both refusals return the same message, verbatim:

> confidence must be a fraction strictly between 0 and 1, for example 0.95

The field it names is `confidence` in both cases. A refusal carries no number, so a program that reads the result sees an `error` and a `field` and nothing it could mistake for a limit.

## Why 95 is refused

A percentage and a fraction differ by a factor of a hundred, and the engine has no way to guess which one the caller meant. A confidence of 95 read as a fraction is not a probability at all, and quietly dividing it by a hundred would be a guess that happens to be right most of the time. The engine refuses to guess, and the message says exactly what to send instead: a fraction strictly between 0 and 1, for example 0.95.

The same reasoning is behind the Associate rule that the base has no default. OSHA TRIR and IOGP TRIR share their letters and differ by a factor of five. A confidence given as 95 and one given as 0.95 share their digits and differ by a factor of a hundred. In both cases the engine would rather stop than carry an assumption into a number that looks finished.

## Why there is no default

A default of 0.95 would be the most common choice, and that is the danger. A report that quotes an interval without saying its confidence invites the reader to assume one. If the engine supplied 0.95 silently, a caller who meant 0.900000 and forgot to pass it would get a wider interval labelled with nothing, and the report would carry the wrong figure with no trace of why. Requiring the value means every interval the engine returns was asked for at a confidence someone chose.

The choice matters. For a count of 7, the count upper limit is 13.148113802432 at 0.900000 and 14.422675361702 at 0.950000. Those are different claims about the same data.

## Strictly between

The word strictly rules out 0 and 1 themselves. An interval at a confidence of 1 would have to cover every possible true rate and would have no upper limit. An interval at 0 would promise nothing. Neither is a question worth asking, so the engine refuses both ends along with everything outside them.

## Exercise

Open the intervals explorer on 7 cases in 400000 hours with the 200,000 base. Enter 95 in the confidence box, copy the engine's message and the field it names, then clear the box and do the same. Finally enter 0.95 and record the limits. Confirm they are 1.407182 and 7.211338, and state in one sentence why the engine refused the first two.
