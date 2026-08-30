# Machine precision against a workbook

What it means when two independent implementations agree to fourteen digits.

## The result

This implementation reproduces the published per-source covariance entries to a worst relative error of about four parts in a hundred million million, over a hundred and eight rows at four depths.

On the totals at total depth, the worst relative error is about three parts in ten thousand million million.

Those are not "close". They are the same calculation performed twice with different code, in different languages, by different people, arriving at the same double-precision numbers.

## Why that is the expected result

Because the model is deterministic arithmetic. Given the same station list, the same header and the same parameter set, there is exactly one right answer, and it is a few hundred floating point operations away.

Agreement at machine precision is therefore the CORRECT outcome, and anything less would indicate a difference in interpretation somewhere: a sign, a frame, a formulation choice, a singular override.

That is worth stating because most numerical agreement in engineering is not like this. Two reservoir simulators agreeing to three percent is a triumph. Two implementations of a published closed-form model agreeing to three percent would mean one of them was wrong.

## The distinction that matters

**Verification** asks whether the code computes the model correctly. This is verification, and it passes at machine precision.

**Validation** asks whether the model describes reality. That is a much harder question, it is answered by field experience over decades, and it is why the model has revisions.

Confusing the two is the commonest overstatement in this subject. An implementation that reproduces the workbook to fourteen digits has said nothing at all about whether the well is where the ellipse says.

## The residual difference

The worst per-source relative error is not zero. Four parts in a hundred million million is accumulated floating point rounding: a different order of summation, a different intermediate grouping, and the last bits differ.

That is the floor. Nothing can be done about it and nothing needs to be.

It is also a useful signature: an agreement at 1e-14 says the arithmetic is the same. An agreement at 1e-6 would say the mathematics is the same and something small is different, which is a much less comfortable position and worth chasing down.

## What to do with this in practice

When you receive an uncertainty from a survey provider, the useful questions are not about implementation:

- which error model and revision?
- which parameter set, and what corrections were applied to the survey?
- what magnetic reference, and from where?
- what is the covariance at the depths I care about, not just at total depth?

None of those is answered by the software being correct, and all of them change the answer more than any software difference would.

## The misconception to avoid

"Our software matches the standard, so our uncertainties are right." It means the arithmetic is right. The uncertainties are right if the parameter set matches the survey that was run, and choosing the wrong parameter set is a factor-of-two error that no amount of verification catches.

## Exercise

Two providers quote position uncertainties for the same well that differ by a factor of two.

List four explanations that have nothing to do with either implementation being wrong, and for each, say what you would ask to test it.
