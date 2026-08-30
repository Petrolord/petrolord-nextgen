# The ratio factor

The one term that separates minimum curvature from the method before it.

{{panel:wd-survey-explorer}}

## The definition

    RF = (2 / beta) tan(beta / 2)

with beta the dogleg angle in radians over the interval.

It multiplies the balanced-tangential position increment to give the minimum-curvature one. Everything else in the two methods is identical.

## Its behaviour

| dogleg over the interval | ratio factor |
|---|---|
| 0 degrees | 1 exactly |
| 1 degree | 1.0000253855582708 |
| 5 degrees | 1.0006351032877527 |
| 15 degrees | 1.005750996548538 |
| 30 degrees | 1.0234905233494715 |
| 60 degrees | 1.1026577908435842 |

Read the middle of that table. At a dogleg of five degrees over one survey interval, which is already a firm build, the correction is six parts in ten thousand. Over a 30 m interval that is under 2 cm.

So the ratio factor is a small correction, and the difference between minimum curvature and balanced tangential on a real well is correspondingly small: on the published example in this module it is four tenths of a foot in two thousand.

## Why it still matters

Three reasons.

**It is free.** The formula costs one tangent. There is no reason to use a method that is knowably worse.

**It is exact for the designed case.** Trajectory designs are arcs, and on an arc the ratio factor makes the calculation exact rather than approximate. That is what lets a compiled design and a survey listing be compared without a method-difference term muddying it.

**It accumulates.** A tenth of a foot per interval over a hundred intervals is ten feet, and it is one-signed: the ratio factor is always at least 1, so the correction always lengthens the chord.

## The numerical trap

At beta near zero the formula is 0/0. Written naively it returns NaN for a straight interval, which is most intervals in a tangent section.

Every implementation guards it. The engine returns 1 below a small dogleg threshold, which is correct to far more digits than the survey warrants, and the alternative is a series expansion. It is worth knowing that the guard exists, because a home-made survey spreadsheet that does not have it produces a column of errors exactly where the well is straightest.

## Where the arc actually is

The ratio factor has a geometric meaning: it is the ratio of the arc's chord to its... no, the other way round. The arc is LONGER than its chord, and the position increment is built from the chord direction. Multiplying by RF stretches the increment so that the endpoint lands on the arc rather than short of it.

Physically, the hole bulges away from the straight line between two stations, and the ratio factor is how much.

## The misconception to avoid

"Minimum curvature and balanced tangential are different methods." They are the same method with and without one multiplicative correction. The methods that are genuinely different in kind are the ones that use only one station's attitude for the whole interval, and the next lesson is about those.

## Exercise

Compute the ratio factor for a dogleg of 3 degrees over a 30 m interval, and hence the position error a balanced tangential calculation makes on that one interval. The answer is 0.0068557715000228114 m; get there yourself before checking it.

Then, for a well with a 600 m build section at 3 degrees per 30 m, compute how many such intervals there are and what the total accumulated difference would be. Compare it against the tenth-of-a-foot scale in the published example.
