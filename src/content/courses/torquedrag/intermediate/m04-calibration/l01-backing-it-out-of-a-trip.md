# Backing it out of a trip

The inverse problem, and how the engine solves it.

{{panel:td-friction-explorer}}

## The forward problem and its inverse

Forward: given a friction factor, what hookload will the rig read?

Inverse: given a hookload the rig actually read, what friction factor reproduces it?

The second is what calibration is, and it is the only way the friction factor ever gets a value on a specific well.

## How the engine does it

Bisection. The response is monotone in the friction factor, so:

    lo = 0.05, hi = 1.0
    repeat 200 times:
      mid = (lo + hi) / 2
      if hookload(mid) is below the target, lo = mid, else hi = mid
    return (lo + hi) / 2

Two hundred halvings takes the bracket from 0.95 wide to far below machine precision, so the answer is deterministic and reproducible to the last bit.

## Why bisection rather than something cleverer

Because the forward run is cheap and the response is monotone.

A Newton method would converge faster and would need a derivative, which means either an analytic one, which does not exist here, or a finite difference, which introduces a step choice. Bisection needs neither and cannot diverge.

Two hundred forward runs on a hundred-station well is milliseconds.

## The worked case

On the build-and-hold well, tripping out, a target hookload of 1100000 N gives an open-hole friction factor of 0.39698485180907916.

Check it by running forward: at that factor the pick-up hookload is 1100000 N to within a thousandth of a newton.

That is the whole procedure. One observation in, one number out.

## What is held fixed

Everything else. The survey, the string description, the mud weight, the trip speed, the cased-hole friction factor, and the model itself.

Every one of those is an assumption, and the fitted factor is the residual that makes the equation balance. Which is the subject of the next three lessons.

## Which observation to use

The pick-up hookload, for two reasons. Its response to the factor is linear on most wells, which makes the fit stable. And it is the operation where friction contributes most, so the fit is well conditioned.

Slack off is a worse choice because the response goes nonlinear once compression starts, and rotating off bottom is useless because its hookload does not depend on the friction factor at all.

## Exercise

Use the panel to fit a friction factor to a pick-up hookload of 1000000 N on the build-and-hold well, then to 1200000 N.

Note both, and confirm they bracket the book value of 0.35 in the way the sweep in module 1 predicted.
