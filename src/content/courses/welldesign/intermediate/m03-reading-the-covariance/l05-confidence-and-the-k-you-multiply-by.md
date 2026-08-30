# Confidence, and the k you multiply by

The factor that turns a covariance into a number people argue about.

## The problem

A covariance describes a distribution. An ellipse is a contour of it. Which contour is a choice, and the choice changes every number downstream by the factor chosen.

## The one-dimensional intuition does not carry

In one dimension, one sigma covers 68 percent, two sigma 95 percent, three sigma 99.7 percent. Everybody knows those.

In two dimensions they are wrong. The probability of being inside the k-sigma ellipse of a two-dimensional normal distribution is

    P = 1 - exp(-k^2 / 2)

so:

| k | one dimension | two dimensions |
|---|---|---|
| 1 | 68.3 percent | 39.3 percent |
| 2 | 95.4 percent | 86.5 percent |
| 2.7955 | 99.5 percent | 95.0 percent |
| 3 | 99.7 percent | 98.9 percent |
| 3.5 | 99.95 percent | 99.78 percent |

The two-dimensional 95 percent factor is 2.7955, not 1.96, and the difference matters: using 1.96 where 2.7955 was meant understates every semi-axis by 30 percent.

In three dimensions the factors are different again, and larger still.

## Which k the industry uses

**k = 3.5** is the standard for anti-collision, and it is what the clearance examples in the Expert tier use. It is not a 3.5-sigma confidence in any one-dimensional sense; it is a chosen scaling with a long history and a broad consensus.

**k = 2.7955** turns up when a 95 percent plan-view ellipse is wanted for a target intersection statement.

**k = 1** is used for reporting the raw scale, and it is the one most likely to be misread as 68 percent.

## Why it is a convention rather than a calculation

Because the underlying distribution is not really normal, the parameter magnitudes are consensus estimates rather than measurements, and gross errors are excluded entirely.

Choosing k = 3.5 is choosing how much margin to carry against a model that is itself approximate. It is a risk decision dressed as a statistical one, and treating it as a statistical one is how people end up arguing about the third decimal of a probability that was never real.

## Where it bites

In the Expert tier, the separation factor divides a distance by an uncertainty that has k in it. So the separation factor is inversely proportional to k, and the choice of k moves the answer proportionally.

That is a direct, quantifiable consequence: two operators using different confidence factors will disagree about whether two wells are safely apart, and the disagreement is entirely about the convention.

## What to report

The ellipse semi-axes, the azimuth, AND the k. All four, always.

An ellipse quoted without its k is a shape without a scale, and the reader will assume whichever convention they use, which is how a 95 percent ellipse gets compared against a 3.5 one and found to be comfortably smaller.

## The misconception to avoid

"Two sigma is 95 percent." In one dimension it is 95.4 percent. In two dimensions it is 86.5, and in three it is lower still. Position uncertainty is at least two-dimensional and usually three, so the one-dimensional table is the wrong one, and using it overstates the confidence in the answer by an amount that grows with dimension.

## Exercise

Using P = 1 - exp(-k^2/2), compute the two-dimensional confidence for k = 1, 2, 3 and 3.5.

Then compute the k needed for 99 percent in two dimensions. State how much larger every semi-axis of a 95 percent ellipse would have to be to become a 99 percent one.
