# Drops and drop fractions

{{panel:ef-judge-explorer}}

An inertia column is hard to read by eye because its early numbers are so much larger than its late ones. The engine prints two more columns beside it so the fall itself can be read: the drop, and the drop fraction.

## The two columns

The drop at k is how much the inertia fell from the k before. The drop fraction divides that fall by the inertia before it, so it says what share of the remaining misfit the extra centre removed. The engine's basis, verbatim:

> inertia(k - 1) - inertia(k); dropFraction divides by inertia(k - 1)

The first row has no k before it, so both columns read none at k 1. On the 180 cored rows, standard scaling, seed 3, 10 starts at every k:

| k | inertia | drop from k - 1 | drop fraction |
| --- | --- | --- | --- |
| 2 | 245.390847 | 474.609153 | 0.659179 |
| 3 | 81.231125 | 164.159721 | 0.668972 |
| 4 | 58.289042 | 22.942083 | 0.282430 |
| 5 | 51.743024 | 6.546018 | 0.112303 |
| 6 | 47.642067 | 4.100956 | 0.079256 |
| 7 | 44.956011 | 2.686056 | 0.056380 |
| 8 | 41.863457 | 3.092553 | 0.068791 |

## The two columns rank the k differently

The largest drop is at k 2, 474.609153, because it is taken from the largest inertia, the one-cluster figure. The largest drop fraction is at k 3, 0.668972: the third centre removed a slightly larger share of what was left than the second did. A raw drop is always biggest early, whatever the rows hold, because it is measured against a larger starting figure. The fraction removes that scale and makes the steps comparable.

After k 3 the fractions shrink: 0.282430 at k 4 and 0.112303 at k 5. The k 5 figure is never reached again by any larger k shown. The fraction at k 8, 0.068791, is a little above the fraction at k 7, 0.056380, so the column does not fall smoothly either. A drop fraction is a property of two fitted runs, and a run that stops in a slightly better or worse arrangement moves it.

## What the columns show and what they leave open

Where the fraction falls sharply, adding a centre stopped paying for itself. On these rows it falls sharply twice: from 0.668972 at k 3 to 0.282430 at k 4, and from there to 0.112303 at k 5. Both could be called a bend in the curve. The table does not decide between them, and the engine does not either; the next lesson is about that.

The core of these wells describes 4 facies. That fact comes from the rock and was never given to k-means, and it will matter later in this tier when the clusters are compared with core.

## When the range is wrong

The elbow needs a largest k at or above the smallest. Asked for a kMax below kMin, the engine refuses and names the field, verbatim:

> kMax must be a whole number from kMin (4) to 180 (the number of rows)

The message states both ends of the accepted range: kMin at the bottom and the number of rows at the top, since k-means cannot make more clusters than there are rows.

## Exercise

In the elbow view, run the Ekene cored rows with seed 3 and largest k 8. Copy the inertia column into a sheet of your own and compute each drop and each drop fraction by the engine's formula, then compare them with the columns the view prints. Mark the k with the largest drop and the k with the largest drop fraction, and write one sentence on why they differ.
