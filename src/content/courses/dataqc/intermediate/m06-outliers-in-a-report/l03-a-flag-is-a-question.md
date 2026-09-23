# A flag is a question

{{panel:dq-outliers-explorer}}

Every rule in this tier returns flags, and every flag carries the rule that fired and a reason. None of them says a value is wrong, and none of them removes one. The engine's own word for a modified z flag is potential outlier, and that is the right frame for every flag in this tier: a value a stated rule has picked out, and a question for someone who knows the data.

Flags this tier has met that were not planted defects:

| where | rule, at the stated setting | flags that are not planted |
| --- | --- | --- |
| EKENE-7 GR, sentinel converted | Hampel, halfWindow 3, nSigma 3 | 9 of 11 |
| EKENE-7 oil sand, RHOB and NPHI | Mahalanobis, alpha 0.050000 | entry 62 |
| EKENE-7 oil sand, RHOB and NPHI | Mahalanobis, alpha 0.100000 | entries 62 and 56 |
| EKENE-3 gauge | Hampel, halfWindow 3 | entry 1 |

## What a flag can be

A flagged value can be a bad measurement: a gauge glitch, a fractured plug, a spike from a tool. It can be a real feature of the rock or the process that happens to sit far from the rest: a thin bed, a bed boundary, a genuine change in a well. And it can be an ordinary value that the rule picked out because of how its setting was chosen. The rule cannot tell these apart. It reports the distance and the line, and the reading is left to the analyst.

The 9 unplanted Hampel flags on the gamma ray are an example: each is exactly what the rule flags, and the engine says which rule fired and by how much, and stops.

## Writing a flag into a report

A report that quotes an outlier gives the reader enough to reproduce it and to judge it:

* the rule, by name: the z-score, the modified z-score, Tukey's fences, the Hampel window, Grubbs' test or the Mahalanobis distance;
* its settings: the threshold, k and the quartile rule, halfWindow and nSigma, alpha and the side;
* the centre and spread it measured from, with the source of every spread named: the sample standard deviation, the raw MAD, or 1.4826 x MAD of a window;
* the value, the statistic and the line, quoted from the numeric fields at the course's precision;
* what was done about it, and who decided.

The last point matters most. A flag followed by a deletion, with no reason recorded, turns a question into an unrecorded edit.

## Words to use and to avoid

In this course "outlier" always names its rule: an outlier by the modified z-score, a value beyond the upper Tukey fence. A spread is never a bare figure; it carries its source. A quantile is named by its probability and its rule, and no P label is used. Every method in this tier is a stated statistical rule, and a report describes it that way.

## When the rule could not ask

A report also records when a rule could not give an answer. A z-score run on ten values with `thresholdReachable` false, a Hampel sample with `judged` false, a modified z refused because the MAD is zero, a Mahalanobis row skipped for a missing value: each of these is a place where the question was never asked. Counting them as clean overstates what was checked.

## Exercise

Open the explorer's Mahalanobis view with the oil sand density and neutron at alpha 0.05, and confirm the two flagged rows, entries 60 and 62. Write the report line for each, following the list above, and add one sentence on what you would check before calling entry 62 a bad measurement.
