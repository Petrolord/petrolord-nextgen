# Damping the trend with phi

{{panel:pf-smoothing-explorer}}

Holt's forecast carries its final trend unchanged for ever, which is how it ran below zero on EKENE-P5. The damped trend, published by Gardner and McKenzie in 1985, adds one parameter that makes the trend fade. That parameter is phi, and this lesson reads what it does inside the recursion.

## The recursion, in the engine's words

The basis of a damped fit reads:

    damped trend (Gardner and McKenzie 1985): f_t = l_{t-1} + phi b_{t-1}, l_t = alpha y_t + (1 - alpha) f_t, b_t = beta (l_t - l_{t-1}) + (1 - beta) phi b_{t-1}; forecast l_n + (phi + ... + phi^h) b_n

Set it beside Holt's and only two places change. The fitted value adds phi times last month's trend, where Holt adds the whole trend. The trend update carries phi times the old trend forward, where Holt carries all of it. Everything else, the level update and the weights alpha and beta, is the same.

## What phi does

Phi multiplies the trend at every step. With phi below 1, each month's contribution from the old trend is a little smaller than the last. Inside the series that is corrected every month by new rates, as in Holt. Past the last month there is nothing to correct it, and the forecast's step-to-step change shrinks by a factor of phi each step. The forecast flattens instead of running on as a line.

| phi | what the forecast does past the last month |
| --- | --- |
| 1 | falls by the same amount every step, as Holt |
| just below 1 | fades slowly, close to Holt for many steps |
| lower | fades quickly and levels off soon |

## Phi in the engine

When phi is left blank the engine fits it, searching from 0.8 to 0.98. Those bounds are stated defaults, `PHI_MIN` 0.8 and `PHI_MAX` 0.98. When phi is given, any value above 0 and at most 1 is accepted and held fixed. A given phi of 0 or of 1.05 is refused, and the message states both rules in one sentence:

> phi must be a number above 0 and at most 1 when given (when fitted it is searched from 0.8 to 0.98)

The damped trend starts exactly as Holt does: l_1 = y_1 and b_1 = y_2 - y_1, with month 1 spent on the start and `scoredFrom` 2. It needs at least three months, or two with an initial trend given.

## Why damp a trend at all

On many producing wells the decline slows as the well ages, and EKENE-P1 was drawn from a hyperbolic curve that does exactly that. A constant trend fitted on the steep early months overstates how fast the well will keep falling; a trend that fades is closer to the shape a decline actually takes. The damped trend does not know about reservoirs. It simply refuses to extrapolate the final slope for ever, and phi says how quickly it lets go.

Damping is a statement about the future made from the history. The fitted phi is chosen to follow months already seen, and it is in-sample like every other fitted parameter in this tier.

## Exercise

In the smoothing explorer choose "The recursion, month by month", load EKENE-P1 and pick damped with alpha 0.5, beta 0.2 and phi 0.9. Read months 2 to 5 and compare each fitted value with Holt's at the same alpha and beta. Then give phi 0 and then 1.05 and read the refusal for each.
