# Onward

Two things this tier quietly assumed, and the tiers that stop assuming them.

## The first assumption: the position is exact

Every number in this tier was quoted as though it were known. The survey table prints TVD to four decimals. The compiler reproduces a published endpoint to ten significant figures. None of that says where the well IS.

The Professional tier adds the uncertainty. It uses the ISCWSA MWD Rev4 model, which is the industry standard, published with a validation workbook, and it computes a covariance at every station from twenty-seven separate error sources.

What you will find there:

- the engine reproduces the published workbook to machine precision, which is a claim about the implementation rather than about the reservoir;
- at total depth on the validation well the LATERAL uncertainty is more than four times the highside one, so the ellipse is long and thin and points across the well;
- one error source pays for well over half the total variance at total depth and does not appear in the top five at 1200 m, so an uncertainty budget without an attitude and a depth attached to it is not a budget.

## The second assumption: the well is alone

Nothing in this tier mentioned another well. Real wells are drilled from pads and platforms with slots metres apart, into fields with decades of existing wells, and the plan has to be cleared against every one of them.

The Expert tier is anti-collision. It takes two wells, each with its own uncertainty from the Professional tier, and computes a separation factor at every station of the reference well.

What you will find there:

- the ISCWSA standard clearance example, eleven offset wells against one reference, all reproduced;
- separation factors below 1 on five of the eleven, which is the industry no-go threshold;
- one case where the factor is NEGATIVE, meaning the uncertainty envelopes overlap, and where raising the confidence factor from 2 to 5 improves the number without moving either well;
- the geomagnetic reference underneath all of it, checked against its publisher's own test values.

## Before you go

Two habits.

**State the method and the references.** A survey listing without its calculation method, depth reference, north reference and vertical section azimuth is four unstated choices, and any of them can move the answer by more than the precision it is printed to.

**Compute it twice.** The cheapest check in this whole subject is to run a second method over the same stations. If minimum curvature and balanced tangential disagree by more than a foot or two over a build section, one of them is not what you think it is.

## The one sentence

Three numbers are measured and everything else is a calculation, so the calculation is part of the result and belongs in the report beside it.

## Exercise

Take a survey listing you have access to, or the golden well from the panel.

Write the four-line header it would need to be fully specified: calculation method, depth reference, north reference, vertical section azimuth. Then say which of the four your source actually states.
