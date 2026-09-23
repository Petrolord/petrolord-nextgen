# Which method for which question

{{panel:dq-outliers-explorer}}

This tier has taught six rules for deciding which values stand apart. Run five of them on the same three teaching series, each at its defaults with the Hampel window at halfWindow 3, and the results line up like this:

| series | z beyond 3 | modified z beyond 3.5 | Tukey fences, R7 k 1.5 | Hampel | Grubbs rejects |
| --- | --- | --- | --- | --- | --- |
| EKENE-3 gauge | none | 7 | 7 | 1, 7 | 7 |
| EKENE-7 core | none | 8 | 8 | 8 | 8 |
| EKENE-7 core, two high plugs | none | 2, 8 | 2, 8 | 2, 8 | none |

The entries are positions in each series.

## Reading across the rows

On the gauge, the z-score flags nothing: ten readings put its ceiling at 2.846050, below the threshold. The modified z-score, the fences and Grubbs' test all find entry 7. The Hampel window finds entry 7 and entry 1 as well: entry 1, the highest of the ordinary readings, sits farther from its window median than three scaled MADs of a quiet seven-sample window.

On the core plugs with one fractured plug, every rule except the z-score finds entry 8. The z-score could reach 3 at fourteen values and still did not, because the plug inflated the standard deviation measuring it.

On the core plugs with two high plugs, the two rules built on the mean and the sample standard deviation, the z-score and Grubbs' test, both find nothing. The three built on the median, the quartiles and a window median find both plugs. That is masking, and on this row the two families part.

## Each method answers its own question

The table is not a contest. Each rule asks a different question:

* the z-score and Grubbs' test: how far is this value from a mean and standard deviation that the value itself helps set;
* the modified z-score and the fences: how far is it from a median and quartiles it barely moves;
* the Hampel window: how far is it from its own neighbours;
* the Mahalanobis distance, from module five: how far is a row from the centre of a cloud, measured along and across its correlation.

Pick the rule whose question is the one you are asking. A core set screened for a single broken plug, with a report that must quote a significance level, calls for Grubbs' test with its limits stated. A short set where two or three values may be off calls for the modified z-score or the fences. A log through changing lithology calls for a window. A pair of channels that should move together calls for the Mahalanobis distance.

## Two rules are better than one, if both are named

Running two rules from different families is a sound habit. When they agree, the flag is robust to the choice of centre. When they disagree, the disagreement is itself informative: a value flagged by the fences and missed by the z-score is likely sitting inside a spread it helped inflate.

Whatever you run, the report names each rule and its settings. A flag from any of them is a question about that entry, and none of them deletes it.

## Exercise

Open the explorer and run the gauge readings through the z, modified z, fences, Hampel and Grubbs views at their defaults, with halfWindow 3. Confirm each cell in the gauge row of the table. Then write two sentences for a gauge report: the first stating which rules flagged entry 7, and the second explaining why the z-score did not.
