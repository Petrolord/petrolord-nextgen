# The p-value and the interval agree

{{panel:ss-intervals-explorer}}

The course swept every pair of counts from 0 to 15 north and 0 to 24 south on the UTOROGU hours, leaving out only the pair where both are zero:

| convention | comparisons | disagreements with the engine's interval |
| --- | --- | --- |
| central, the engine's | 399 | 0 |
| minlike, derived | 399 | 14 |

A disagreement is a comparison where the p-value falls below 0.05 while the 95 percent interval includes 1, or the other way round.

## What agreement means

For every one of the 399 comparisons, the central p-value falls below 0.05 exactly when the engine's rate-ratio interval excludes 1. The two outputs are two views of one result. A reader who looks at either will reach the same verdict at 95 percent.

This is designed in. The engine uses the central convention because it is the test the Clopper-Pearson interval inverts (Fay 2010). Inverting a test means collecting every rate ratio the test would not reject at the stated level, and that collection is the interval. When the test and the interval share a construction, the edge of the interval and the 0.05 line of the p-value are the same boundary seen from two sides.

## Four comparisons that agree

| comparison | central p-value | 95 percent interval | includes 1 |
| --- | --- | --- | --- |
| ERHA | 0.256209 | 0.621694 to 6.039396 | yes |
| UTOROGU | 0.051759 | 0.991404 to 12.408545 | yes |
| compare-first-zero | 0.048748 | 0.000000 to 0.990863 | no |
| compare-second-zero | 0.039551 | 1.100207 and above | no |

Each pair agrees. UTOROGU is the close one: its p-value is only just above 0.05 and its lower limit only just below 1, and the pair still gives one verdict.

## Where minlike breaks the pairing

The minlike p-value on UTOROGU is 0.025879, below 0.05, while the interval from 0.991404 to 12.408545 includes 1. That is one of the 14 disagreements in the sweep. On those inputs a report that used a minlike p-value and the engine's interval would state a significant difference beside an interval that allows equal rates, both from the same data.

Fourteen out of 399 is a small share, and that is what makes it dangerous. A reader who checks a handful of comparisons in R will usually see the verdicts match and conclude that the conventions are interchangeable. UTOROGU shows the kind of comparison where they part: a close call, with a p-value near 0.05 and a limit near 1, which is exactly the kind of comparison a report is most likely to be argued over.

## What to report

Report the interval first, because it carries the size of the difference as well as the verdict. Give the central p-value beside it as a check, and say that it is central. If both are from this engine they will agree, and a reader can confirm that at a glance.

## Exercise

From the table of four comparisons, check each row yourself: state whether the central p-value is below 0.05 and whether the interval includes 1, and confirm the two answers match. Then set UTOROGU's minlike p-value of 0.025879 against its interval and state which of the two checks it fails.
