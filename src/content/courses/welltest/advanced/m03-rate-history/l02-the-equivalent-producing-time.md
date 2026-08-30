# The equivalent producing time

The tp in the Horner analysis is not how long the well flowed.

{{panel:wt-regression-explorer}}

## The problem

Horner analysis needs a producing time. The derivation assumed the well produced at a constant rate q for a time tp and was then shut in.

Real wells do not do that. A well that has been on production for two years at varying rates, and is then shut in for a buildup, has no tp.

## Horner's approximation

Use the time that WOULD have produced the same cumulative volume at the final rate:

    tp = cumulative production / last rate

The reasoning is that the recent history dominates the buildup response, and the distant history is adequately represented by its cumulative effect.

The engine's `equivalentProducingTime` computes exactly this. It walks the rate steps, accumulates rate times duration up to the shut-in time, tracks the last non-zero rate, and divides.

## The example in this module

The three-rate history: 450 stb/d for 24 hours, 250 for 36 hours, 700 for the next 36, then shut in at 96 hours.

Cumulative in rate-hours:

    450 x 24 = 10800
    250 x 36 = 9000
    700 x 36 = 25200
    total     45000

Divide by the last rate of 700 and you have the equivalent producing time. Do the arithmetic; it is a graded field in the capstone and the panel will confirm it.

The number is a bit over 64 hours. The well spent 36 hours at its final rate.

So the equivalent producing time is nearly TWICE the duration of the last flow period, because the earlier production at other rates still counts.

## What using the wrong tp does

Two effects, of very different sizes.

**The permeability barely moves.** The slope of the late Horner line is not very sensitive to tp, because over the late data the Horner ratio is dominated by dt.

**p star moves a lot.** The extrapolation to a Horner ratio of 1 depends on the whole axis, and the axis depends on tp directly.

That asymmetry is a useful diagnostic. A buildup whose permeability agrees with other estimates but whose extrapolated pressure looks wrong is pointing at the producing time rather than at the reservoir.

## When the approximation is poor

The approximation assumes the recent history dominates. It does that badly in three cases.

**A short final rate period after a long history at a very different rate.** The cumulative is dominated by the old history and the buildup is dominated by the new rate.

**A well that was shut in shortly before the test.** A recent shut-in leaves its own transient, which the single-tp approximation cannot represent.

**A rate that changed shortly before shut-in.** The last change's transient is still developing when the well is shut in.

In all three the honest answer is to abandon the single-tp approximation and use full superposition: the multi-rate semilog of the next lesson, or a model fit against the whole history.

## What the industry does

For a routine buildup after stable production, the Horner approximation with an equivalent producing time. It is good and it is the default.

For anything with a complicated recent history, superposition. Modern software builds the superposition time function from the rate record and plots against that, which is the general form of which the Horner ratio is the two-rate special case.

The engine gives you both: `equivalentProducingTime` for the approximation and `superposeDeltaP` with `multiRateSemilogAnalysis` for the general case.

## The misconception to avoid

"tp is the length of the last flow period." That is the commonest error in buildup analysis and it is silent, because the resulting Horner plot looks perfectly normal. Its signature is an extrapolated pressure that disagrees with other estimates while the permeability does not, and the check takes one division.

## Exercise

Compute the equivalent producing time for the history above, then recompute it assuming the well had produced at 700 stb/d for 36 hours and nothing before.

State both. Then say what the ratio between them would do to the Horner ratio at a shut-in time of 10 hours, and in which direction p star would move.
