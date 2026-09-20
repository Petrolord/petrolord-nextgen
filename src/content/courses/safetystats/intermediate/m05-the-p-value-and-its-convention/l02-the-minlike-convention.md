# The minlike convention, and why it can disagree

{{panel:ss-intervals-explorer}}

UTOROGU north recorded 7 events in 355200 hours and south recorded 6 in 1048900 hours. Two p-values on the same counts:

| what | value |
| --- | --- |
| engine pValue, central: twice the smaller tail, capped at 1 | 0.051759 |
| minlike p-value, derived | 0.025879 |
| engine rate ratio, north over south | 3.445148 |
| engine 95 percent rate-ratio interval | 0.991404 to 12.408545 |

One p-value sits above 0.05 and the other below it. The interval includes 1.

## What minlike means

The minlike p-value adds up the probability of every count that is no more likely than the one observed. Picture the binomial for north's share of the 13 events. The observed count has some probability. Minlike walks the whole distribution, on both sides, and sums every count whose probability is at or below that one. It is the convention of R's poisson.test and of scipy's binomtest, so it is the figure a reader will most often meet when checking this engine against another tool.

On UTOROGU it gives 0.025879, which is labelled DERIVED here because the engine does not compute it. The engine's own central p-value is 0.051759.

## Why the two differ

The central p-value doubles one tail. That assumes the other side of the distribution contributes as much as the observed side does. When the binomial is lopsided, because north has a small share of the hours, the far side has less probability in it than the near side. Minlike counts what is actually there on the far side. Central counts a mirror image of the near side. On skewed distributions the two can land on opposite sides of 0.05, as they do here.

Neither is an error. They are two accepted answers to the question of how to make an exact two-sided test into one number.

## Why it matters on these counts

At 0.05, the two conventions give opposite verdicts. Minlike says the rates differ at 95 percent. Central says the data do not rule out equal rates. The rate-ratio interval, from 0.991404 to 12.408545, includes 1, so it sides with central. A report that quoted the minlike figure beside this interval would contradict itself: a p-value below 0.05 and an interval that includes equal rates.

## Why the engine chose central

The engine uses the central convention because it is the test the Clopper-Pearson interval inverts (Fay 2010). The interval and the p-value then come from the same construction and always tell the same story. That consistency is the reason, and the method line names the convention. A reader who checks an engine p-value in R will see a different number on some inputs; that is this choice, and it is declared.

## What a reader should do

Quote the engine's central p-value beside the engine's interval. If a colleague brings a minlike figure from R or scipy, say which convention each figure uses before comparing them.

## Exercise

Open the comparison view and enter UTOROGU north's 7 events in 355200 hours against south's 6 in 1048900 hours at confidence 0.95. Record the central p-value, the minlike p-value the panel labels DERIVED, and both limits of the rate-ratio interval. State which p-value agrees with the interval and what fact about the interval tells you so.
