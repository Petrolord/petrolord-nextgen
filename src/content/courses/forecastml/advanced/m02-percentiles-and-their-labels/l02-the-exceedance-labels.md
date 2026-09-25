# The exceedance labels, low case and high case

{{panel:pf-uncertainty-explorer}}

The engine returns three arrays of percentiles, keyed `P90`, `P50` and `P10`. The labels follow the platform's convention for an outcome where more is better, and the convention runs the opposite way to the plain percentile numbers.

## The definition, in the platform's words

The platform labels outcomes by exceedance. Its definition reads:

> P90 means a 90% probability the actual quantity meets or exceeds this value, per SPE PRMS.

A rate that 90 percent of the paths meet or exceed is a low rate: only a tenth of the paths fall below it. So P90 is the low case, and it is the 10th percentile of the simulated paths. P10 is the high case, the 90th percentile of the paths, which only a tenth of the paths exceed. P50 is the median, the 50th percentile, the same under either reading.

| label | case | percentile of the paths |
| --- | --- | --- |
| P90 | low | 10th |
| P50 | middle | 50th |
| P10 | high | 90th |

The engine's basis closes on the same rule: production is an outcome where more is better, so P90 (low) is the 10th percentile and P10 (high) the 90th.

## The ordering this gives

Because the 10th percentile of a set of values can never exceed its median, and the median never exceeds the 90th, the three arrays are ordered at every step: P90 at or below P50, and P50 at or below P10. On the teaching run, damped on EKENE-P1, seed 11, 1000 paths:

| step | P90 (low) | P50 | P10 (high) |
| --- | --- | --- | --- |
| 1 | 174.139087 | 206.724356 | 225.708211 |
| 6 | 83.953419 | 175.633354 | 262.377587 |
| 12 | 0.000000 | 137.469798 | 324.803671 |

The ordering holds on every row, and the course checks it at every step of the teaching run. A table that shows the P90 above the P10 has swapped the labels somewhere between the engine and the page.

## Why the course writes the case beside the label

Other tools, and other fields, write P90 for the 90th percentile. On a rate that reading gives the high case, and a reader who brings it to this course reads every interval upside down. The course therefore writes the case beside the label wherever a percentile appears: P90 (low) and P10 (high). The engine carries the definition in its result, so the rule travels with the numbers.

When you compare an interval from this engine with one from another tool, check which convention the other tool uses before you compare any figure.

## The labels in a sentence

Written out in full, the teaching run's step 12 reads: damped on EKENE-P1, seed 11, 1000 paths, P90 (low) 0.000000, P50 137.469798, P10 (high) 324.803671 bbl/d. The low case is reported as 0 because at least a tenth of the paths had fallen below zero by that step, which the next lesson takes apart. The label names the case, the number names the rate, and the seed and paths name the run.

## Exercise

Open the view "Bootstrap intervals" with EKENE-P1, damped, h 12, seed 11 and 1000 paths. Read the declared block headed THE LABELS and copy its definition. Then, for steps 1 and 12, write each percentile with its label and its case in words, as in the sentence above. Finally, read the three arrays at every step and confirm that the P90 (low) never rises above the P50 and the P50 never rises above the P10 (high).
