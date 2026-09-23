# When the MAD is zero

{{panel:dq-outliers-explorer}}

The MAD is the median of the absolute deviations from the median. If more than half of the values equal the median exactly, more than half of those deviations are zero, the middle one is zero, and the MAD is zero. Exactly half is not enough: on 1, 5, 5, 9, two of four values sit at the median 5, and the engine returns a MAD of 2. The modified z-score divides by the MAD, so it is undefined.

The engine's worked case is the series 5, 5, 5, 6, 7, stated. Three of its five values are the same, and they sit in the middle of the sorted series, so more than half the values equal the median.

| function | field named | result |
| --- | --- | --- |
| `modifiedZScores` | `values` | refused |

The engine's refusal, in its own words:

> values have MAD = 0: more than half the present values equal the median, so the modified z-score is undefined

## Why a refusal

Some implementations fall back to another spread when the MAD is zero and carry on. The engine builds no fallback, and says so: in its list of what is not built, the entry for a MAD of zero reads "a refusal".

Any fallback is a second rule with its own threshold, and a flag from it would be reported as a modified z-score when it is something else. The refusal names the field, says what happened and why, and leaves the next step to the caller.

## When it happens in oilfield data

Three kinds of data produce a MAD of zero:

* a channel that reports to a coarse resolution, so most readings land on the same few values;
* a meter or sensor that held one value for a stretch, which the Associate tier's frozen run check is built to find;
* a series that is mostly a single constant, such as a status or a choke setting, where more than half the entries are the same number.

In each case the refusal says something about the data before any outlier question is asked. A held value is a consistency problem first.

## What to do instead

Each response is a choice to state. Run the frozen run check first. Use a rule that does not divide by the MAD, such as Tukey's fences in the next module, which measure from the quartiles. Or lengthen the series so the middle of it is no longer a single repeated value.

The ordinary z-score is not an automatic rescue either. It refuses a series with zero spread, where every present value is the same:

> values have zero spread: every present value is the same, so a z-score is undefined

The series 5, 5, 5, 6, 7 has a spread, so a z-score can be computed on it, with all the weaknesses of module one.

## Exercise

Open the explorer's modified z view and type 5, 5, 5, 6, 7. Read the engine's refusal and confirm that it names the field `values`. Change the first value to 4 and run it again, then read the median and the MAD the engine now returns. Write one sentence for a report explaining why the first series could not be screened with the modified z-score.
