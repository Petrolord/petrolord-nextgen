# What intervals cannot say

You now know what the block contains and how it is built. This lesson is the governance half: the four sentences an evaluator is tempted to write from an interval, and which of them the arithmetic actually supports. Three of the four do not survive.

## "The engine did not complain, so the fit is sound"

Fit Ekene-1 over its full 72-month history, flood response and all. The Professional tier established that this is not a poor fit but an invalid one, because a monotonically declining Arps curve cannot describe a rate history that rises. The engine's Auto-Select returns hyperbolic with $q_i = 97.2058663778433$ stb/d, $D_i = 0.00196150586036441$ per day, $b = 1.95000000000000$ at $R^2 = 0.818388421218434$.

Its interval block returns `hasIntervals: true`. Read the numbers:

| Parameter | Fitted | Half-width | Reported interval |
|---|---|---|---|
| $q_i$ (stb/d) | 97.2058663778433 | 30.6946450743432 | 66.5112213035002 to 127.900511452187 |
| $D_i$ (1/d) | 0.00196150586036441 | 0.00261952695412852 | -0.000658021093764111 to 0.00458103281449293 |
| $b$ | 1.95000000000000 | 0.195000000000000 | 1.755 to 2.145 |

The lower end of the $D_i$ interval is negative. A negative nominal decline is a well whose rate grows without limit, and the block published it without comment.

It passed because the reasonableness check from lesson 2 asks only that $\Delta q_i < 2q_i$ and $\Delta D_i < 5D_i$. Here $\Delta q_i / q_i = 0.315769471721303$ against a bound of 2, and $\Delta D_i / D_i = 1.33546730961174$ against a bound of 5. Both pass comfortably. `hasIntervals: true` means "not obviously junk by two very loose tests", and nothing more.

## "The half-widths tell me how uncertain each parameter is"

Two of the three do. The third is fabricated, and it is the one that matters.

The $b$ half-width above is 0.195000000000000, which is exactly ten percent of 1.95. It is exactly ten percent of $b$ for every hyperbolic fit in the course: 0.0500000000000000 on Ekene-3's $b = 0.5$, 0.0350000000000000 on Ekene-6's $b = 0.35$, 0.0500000000000000 on the Ikoku fit's grid $b = 0.5$. The source says why, in a comment above the line: $b$ came from the grid search rather than the regression, so no interval can be propagated for it, and a conservative estimate is used instead. `bHalfWidth = b * 0.10`.

That placeholder is the single most important caveat in this module, because of what the Expert tier already knows about $b$. Hold $q_i = 120$ stb/d, $D_i = 0.0012$ per day and a 10 stb/d limit, and EUR runs from 91666.6666666667 stb at $b = 0$ to 321875.914758613 stb at $b = 1.2$, a factor of 3.51137361554850. The parameter with the largest leverage over booked volume is the one whose reported uncertainty contains no information from the data at all. A reserves report that prints all three half-widths in the same table, in the same font, is misleading its reader whether or not it means to.

## "The interval is wide, so the data must be noisy"

Residual variance does not distinguish scatter from misfit. Both show up as vertical distance from the fitted curve, and the formula squares them together.

Ekene-3's primary window has no noise whatsoever. Force a harmonic onto it and the engine returns $q_i = 179.338857993516$ with a half-width of 6.46848810208487 percent and $D_i = 0.00359325039110851$ with a half-width of 9.54681212730772 percent. Every barrel of that interval is model misfit. An evaluator reading only the interval would conclude the well had messy data and might respond by asking for better metering, which would change nothing at all. The correct response is to change the family.

The converse trap is the one from lesson 1: a fit whose family is wrong but whose window is short enough that misfit has not yet accumulated will report a tight interval and mislead in the other direction.

## "No interval means the engine failed"

Sometimes the block is genuinely useful, and it is useful when it refuses.

Fit Ekene-1 as an exponential over the twelve months from 2023-09-01 to 2024-08-01, a window that straddles the flood response and includes rates that rise and then fall. The fit returns $q_i = 39.3373789029702$ and $D_i = 0.0000245336371182929$ per day at $R^2 = 0.00760679640972350$, and the block comes back `hasIntervals: false`. The $q_i$ test passes easily, at $\Delta q_i / q_i = 0.0373890935079556$. The $D_i$ test fails: $\Delta D_i = 0.000189235269532259$, which is 7.71329862832121 times $D_i$, against a bound of 5.

So a missing block is a signal, not a defect. It means the regression could not separate a decline from a flat line, which on this window is the truth. Treat `hasIntervals: false` the way you would treat a refusal to quote a price: the honest response is to fix the window, not to find a tool that answers anyway.

## What you can say

One sentence survives, and it is worth writing out in the form you would put in a memo.

> Under the assumption that this well follows the fitted family over this window, and that the deviations of the monthly rates from that family are independent and identically scattered, the data constrain $q_i$ to within X and $D_i$ to within Y at a nominal 95 percent level, using a normal multiplier rather than a Student $t$ multiplier. No part of this statement covers the choice of family, the choice of window, the value of $b$, or the economic limit.

Everything after the comma in that first clause is load bearing. Module 4 takes the honest next step: if the interval cannot carry the uncertainty that actually matters, then the deliverable has to stop being a single number.

## Exercise

Return to the Ekene-1 full-history fit at the top of this lesson. Its $b$ is 1.95000000000000 and its reported half-width is 0.195000000000000.

First, use the fixed $q_i = 120$, $D_i = 0.0012$, limit 10 leverage case as a yardstick: on that case a step in $b$ from 1 to 1.2 multiplies EUR by 1.29532397036353, and the reported half-width here is a step of 0.195 in each direction. Estimate the multiplier that the $b$ band alone implies, and compare it with the roughly plus or minus 32 percent that the $q_i$ half-width implies on its own. Second, write the one-sentence disclosure you would attach to that $b$ half-width if a colleague put this fit in front of a committee. Third, state which of the two loose bounds would have to tighten, and to roughly what value, before this particular fit would have been refused an interval at all.
