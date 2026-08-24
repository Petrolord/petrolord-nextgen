# What the spread is not

The jackknife produces a number with metres on it and a defensible construction behind it. This lesson lists the five things it will be mistaken for, because every one of them will be assumed by somebody unless it is denied in writing.

## One: it is not a confidence interval

A confidence interval carries a probability: 90 percent of the time the truth lies inside it. The jackknife range carries no probability at all.

Six values obtained by removing one well each are not six independent samples from a distribution. They are six deterministic recomputations of the same calculation with slightly different inputs, and they share five wells out of six with each other. Nothing in that construction produces a frequency.

**Say:** *the answer moves over a range of 7.77 m if any single well is removed.* **Do not say:** *there is a 90 percent chance the true depth lies within 7.77 m.*

## Two: it is not symmetric and should not be halved

The six values run from 1541.94 to 1549.71 around a six-well answer of 1542.62. That answer sits 0.68 m above the bottom of the range and 7.09 m below the top.

Quoting it as $1542.62 \pm 3.9$ m throws that away and implies the map is as likely to be shallow as deep. On this field the removals overwhelmingly push the answer **deeper**, because the wells that dominate at P-1 are pulling the surface up.

**Say:** *1542.62 m, jackknife range 1541.94 to 1549.71 m.* **Do not say:** *1542.62 plus or minus 3.9 m.*

## Three: it is not the total uncertainty

It measures sensitivity to which wells are present. Four other contributions are entirely absent from it.

**Pick uncertainty.** If TOP_SAND is picked to the nearest metre, every control value carries that, and the jackknife holds the picks fixed.

**Datum and depth conversion.** A systematic error in how measured depth becomes true vertical depth subsea moves every well together and the jackknife cannot see it, because it never varies.

**Method.** A different interpolator through the same six wells would give a different answer at P-1. The jackknife holds the method fixed.

**Geology below the resolution of the well spacing.** The residuals in module 2 and 3 measured exactly this and it is a separate contribution.

The jackknife is one term in an uncertainty budget, and on sparse control it is usually the largest, which is why it is worth computing first.

## Four: it is not a correction

The six values average to 1544.66 m, deeper than the six-well answer. It is tempting to move the estimate there.

Do not. Each of the six comes from a map with less data than the one in use. Their centre reflects the leverage of the removed wells, not information about the horizon. The best estimate from six wells is the six-well map.

## Five: it is not transferable to another location

The 7.77 m is the spread **at P-1**. Somewhere 200 m away it will differ, and somewhere near a well it will be close to zero, because at a control point every five-well map still honours the remaining wells and the surface is pinned.

A single jackknife number quoted for a whole map is meaningless. It is a per-location quantity and it must be computed at the location the decision is about.

## The honest report

> Depth at P-1: 1542.62 m from six wells. Removing any single well moves it to between 1541.94 and 1549.71 m, a range of 7.77 m, with the largest move coming from Ekene-6, the nearest control at 361 m. This range measures sensitivity to control only, and excludes pick, datum, depth conversion and method uncertainty.

Four sentences, no probability claimed, no symmetry implied, and the dominant well named so a reader can judge for themselves.

## Worked example

A colleague writes: *mapped depth 1542.6 m, uncertainty plus or minus 3.9 m (jackknife, 90 percent confidence).* How many of the five errors are in that sentence?

Three. The plus-or-minus implies symmetry that the six values contradict. The 90 percent implies a probability the construction does not produce. And the absence of any statement of scope invites the reader to treat it as the total uncertainty rather than the control-sensitivity term.

The precision of 1542.6 m is reasonable and the jackknife attribution is correct, so the sentence is not without merit; it is three edits away from being usable.

## Exercise

Name the five things the jackknife spread is not, then rewrite this sentence correctly: *depth at P-1 is 1542.62 plus or minus 3.9 m at 90 percent confidence.*

As a self-check: it is not a confidence interval, not symmetric, not the total uncertainty, not a correction to the estimate, and not transferable to another location. A correct rewrite is: depth at P-1 is 1542.62 m from six wells, and removing any single well moves it to between 1541.94 and 1549.71 m; this range measures sensitivity to control only and carries no probability.
