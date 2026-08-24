# The spread

Six numbers at one location. This lesson turns them into a statement, and is careful about which statement.

## The number

$$\text{spread} = 1549.7083740234375 - 1541.939208984375 = 7.7691650390625\ \mathrm{m}$$

Call it **7.77 m**. That is the full range of mapped depth at P-1 across the six five-well control sets.

## The summaries available

With six values, more than one summary is defensible, and they say different things.

| Summary | Value | What it says |
| --- | --- | --- |
| Full range | 7.77 m | The answer moves this far if any one well is missing |
| Standard deviation of the six | 3.12 m | The typical size of a one-well swing |
| Mean of the six | 1544.66 m | Where the five-well maps centre, 2.04 m below the six-well answer |
| Largest single move | 7.09 m, Ekene-6 | The most influential well |

The full range is the easiest to explain and the most conservative. The standard deviation is smaller and is the one to use if the number is going into a probabilistic calculation.

## Why the mean of the six is not the answer

The six five-well maps centre on 1544.66 m, which is 2.04 m deeper than the six-well map's 1542.62 m.

That is not evidence that the six-well answer is 2 m too shallow. Each of the six values is produced by a **worse** map than the one in use, and the direction of the difference tells you about the leverage of the wells rather than about the truth.

The six-well answer remains the best estimate available from six wells. The jackknife supplies a spread around it, not a correction to it.

## What the spread is measuring

**Sensitivity to control.** Nothing else. It answers the question: if any single one of my six wells did not exist, how much would this answer move?

That is a narrower question than *how wrong is this answer*, and it is a good proxy for it on sparse control, because the dominant source of error at an interior location on a six-well map is precisely that six wells do not determine the surface.

It is **not** measuring pick error, datum error, depth conversion error or geological complexity beyond what the wells sample. Those are separate contributions and none of them is in this number.

## The comparison with the residuals

| Measurement | Value |
| --- | --- |
| Leave-one-out residual at Ekene-6 | 9.84 m |
| Blind residual at Ekene-7 | 5.67 m |
| Jackknife spread at P-1 | 7.77 m |
| Movement of P-1 on adding one well | 4.49 m |

Four numbers, four different methods, all between 4.5 and 10 m.

The agreement is the point. A single number of that order would be easy to dismiss as a one-off; four independent routes landing in the same range is a robust statement that an interior location on this map is uncertain at the scale of several metres.

## The one-line version

> The mapped depth at P-1 is 1542.62 m, with a one-well jackknife spread of 7.77 m across the six five-well control sets.

Two numbers, both reproducible, and the second one gives a reader something to reason with. Compare it with quoting 1542.62 m alone, which invites a precision the map does not have, or with 1542.619873046875 m, which invites considerably more.

## Worked example

A prospect requires 6 m of closure to be economic and the map shows 8 m. The jackknife spread at the crest is 7.8 m. What is the recommendation?

That the mapped closure does not distinguish the economic case from the uneconomic one. The spread is comparable to the entire closure, so the question the map is being asked is finer than the map can resolve.

The recommendation is not to abandon the prospect. It is that the decision needs something the map does not have: an additional well, seismic control converted to depth, or an analogue argument about the structure. Presenting the 8 m alone would be presenting a number that cannot support the decision resting on it.

## Exercise

Compute the jackknife spread at P-1 from the extreme values, state the standard deviation of the six, and explain in two sentences why the mean of the six is not used as a corrected estimate.

As a self-check: the spread is $1549.7084 - 1541.9392 = 7.7692$ m and the standard deviation of the six values is 3.12 m. The mean of the six is 1544.66 m, which sits 2.04 m below the six-well answer, and it is not a correction because every one of the six comes from a map built with one fewer well than the map in use, so their centre reflects the leverage of the removed wells rather than any information about where the horizon actually is.
