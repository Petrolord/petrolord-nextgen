# Working the capstone

There is a right order for this work, and most of the mistakes people make come from doing the steps in the wrong one.

{{panel:wc-risk-explorer}}

## Build the schedule before you price anything

Start with the activity list. Every drill, trip, casing and flat activity in order, with its own rate or duration, and depths that join up. The engine will refuse a section that does not start where the last one finished, and it will refuse a rate of penetration of zero, so a program that runs at all has already passed a structural check.

Set the NPT fraction deliberately and remember what it is a fraction of. It stretches productive time, so a fraction f is f over one plus f of elapsed time.

Only then attach costs. Each line needs a basis and a category, because the basis is what decides whether a slip touches it.

## Check the curve lands on the base

This is the first check and it is not optional.

Build the cost time curve and read its final value. It must equal the AFE base cost exactly, absolute error zero, not close and not within rounding. If it does not, something in the accrual is wrong and every number downstream of it is suspect.

Then check the other half of the identity. The gap between the approved total and the final curve value must equal the contingency exactly, because contingency does not accrue along the curve.

## Define the ranges, then sample with a seed

Choose which quantities are genuinely uncertain, rather than putting a range on everything. Say where each minimum, mode and maximum came from. Apply correlation where the physical story demands it, and note that doing so moves no mean.

Then run the sampler with a recorded seed and a recorded iteration count. Both belong beside the result, not in your head.

## The three checks on the result

Run these every time, in this order.

| Check | What passing looks like |
| --- | --- |
| Curve endpoint | Final curve value equals the base cost, absolute error zero |
| Convexity direction | Sampled mean exceeds the deterministic case when the uncertainties are rates |
| Percentile labelling | Every percentile carries the convention it is stated in |

The second one is the diagnostic worth dwelling on. If your uncertainties are rates of penetration and the sampled mean comes back at or below the deterministic total, do not report it. Something is wrong: the ranges may be reversed, the uncertainty may not be reaching the activity you think it is, or the run may not be varying what you believe it is varying.

The third is the one that ends careers quietly. Print the convention in words beside every tail figure, every time.

## Exercise

Build a program in the panel, then verify the curve endpoint against the base cost and record the absolute error.

Attach a rate of penetration uncertainty, run with a seed you write down, and confirm the direction of the gap between the sampled mean and the deterministic total. State each percentile you read with its convention spelled out.
