# The Bourdet three-point rule

How to differentiate noisy data without differentiating the noise.

## The naive derivative fails

The obvious way to estimate d(dp)/d(ln t) at a point is to take the neighbouring points and form a difference quotient. On clean data that works. On gauge data it does not, because consecutive samples are separated by a very short time and the pressure difference between them is dominated by noise rather than by signal.

Divide a noise-sized numerator by a tiny denominator and you get a large, meaningless number. Do it at every point and the derivative plot is a hedge.

## The Bourdet rule

Bourdet, Ayoub and Pirard proposed taking the neighbours from FURTHER AWAY, at least a fixed distance in log time, and then combining the two one-sided slopes with a weighting that keeps the estimate centred.

For a point i, find the nearest neighbour on the left that is at least L log cycles away, and the nearest on the right likewise. Form the two one-sided slopes:

    m1 = (y_i - y_left) / (ln x_i - ln x_left)
    m2 = (y_right - y_i) / (ln x_right - ln x_i)

and combine them weighted by the OPPOSITE spans:

    derivative = (m1 dx2 + m2 dx1) / (dx1 + dx2)

where dx1 and dx2 are the two log-time gaps.

## Why that weighting

The cross-weighting is what makes the estimate centred rather than biased towards the closer neighbour.

If the left neighbour is close and the right neighbour is far, the left slope is a local estimate and the right slope is an average over a longer stretch. Weighting the left slope by the RIGHT gap gives more weight to the estimate taken over the shorter interval, which is the one less contaminated by curvature over its span.

It is equivalent to fitting a parabola through the three points and taking its slope at the middle one, which is the standard three-point derivative, and the algebra is easier in the form above.

## The smoothing window L

L is the minimum separation, measured in log10 cycles, that a neighbour must have from the point being differentiated.

- L = 0 uses the immediately adjacent points, which is the naive derivative.
- L = 0.1 is the usual default and separates neighbours by about 26 percent in time.
- L = 0.5 separates them by a factor of about 3.2 and smooths heavily.

Values between 0 and 0.5 are the accepted range. Above that, real features start to be smoothed away.

The engine's signature is `bourdetDerivative(series, { L = 0.1, xKey = 'x', yKey = 'y' })`.

## What happens at the ends

The first and last points have no neighbour on one side. The engine falls back to a one-sided two-point slope at the two ends, and to a plain central difference when the window is wider than the available span on one side.

That means the first and last derivative values are less reliable than the ones in the middle, and it is why a derivative plot's extreme points should not be used to read a plateau. The engine will happily return them.

## The abscissa is your choice

Notice that nothing in the rule says what x is. The engine is deliberately agnostic: it differentiates y against ln x for whatever x you hand it.

For a drawdown, x is elapsed time. For a buildup, x is Agarwal equivalent time or a superposition time function, because differentiating a buildup against raw shut-in time gives a derivative that droops at late time for reasons that have nothing to do with the reservoir.

The engine's own `autoFitModel` makes this choice explicitly: elapsed time for drawdowns, Agarwal equivalent time for buildups, applied identically to the model and the data.

## The misconception to avoid

"Smoothing loses information, so use L = 0." On real data L = 0 loses ALL the information, because the noise dominates. The trade is not between accuracy and smoothing; it is between two kinds of error, and on gauge data the noise term is far larger. On the clean fixtures in this course the choice barely matters, which is exactly why the next lesson sweeps it and shows you how little it moves.

## Exercise

Write out the three-point formula and check the two limiting cases: what does it give when dx1 equals dx2, and what does it give when dx2 is very much larger than dx1?

Say which of the two one-sided slopes dominates in the second case, and explain why that is the right behaviour.
