# Working the capstone

The six graded values, and what each one is testing.

{{panel:ps-shot-explorer}}

## A different well and a different sand

The capstone is not the published case. The hole is larger, the charge is not in the catalog, the phasing is one neither published gun uses, and the sieve is a curve you have not seen.

Read the conditions before computing anything. In particular note the shot density, which is not four and not twelve, and note that the finest sieve in the stack is not at the fines cutoff.

## The six values

Two conversions and four sieve statistics.

The shot density in shots per metre is the quoted density per foot converted once. The perforation spacing is its reciprocal, and it is worth doing both and checking that they multiply to one.

The median and the coarse decile come from the sieve curve by log interpolation between the bracketing points. Find the two points either side of each percentile first, then interpolate; guessing which pair brackets a percentile is where this goes wrong.

The uniformity is the ratio of two more interpolated values, so it inherits both interpolations.

The fines percentage is the complement of the retained fraction at the cutoff, and on this curve the cutoff falls BETWEEN two sieves, so it has to be interpolated as well. A curve whose finest sieve sits exactly at the cutoff would let you read it off; this one does not.

## Where the marks get lost

Interpolating linearly in size rather than in its logarithm. That overstates every D-value, and it overstates the coarse decile most because the sieves are furthest apart at the coarse end.

Reading the curve as cumulative passing. The check is that the coarse decile must be larger than the median.

Converting the shot density with the wrong direction, which is a factor of about three and a quarter and produces a spacing three and a quarter times too big or too small.

And forgetting that the fines cutoff needs interpolating on this curve.

## Checking yourself

Three checks with no answer needed. The spacing times the density is one. The coarse decile exceeds the median. And the uniformity is greater than one, because the fortieth percentile is coarser than the ninetieth on a retained curve.

## Exercise

Write down the three self checks before you open the capstone.

Work the six values and apply them.

Then say which of the six you are least sure of, and what one extra sieve point would have made it easier.
