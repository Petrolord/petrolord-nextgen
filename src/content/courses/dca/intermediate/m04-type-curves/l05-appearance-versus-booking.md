# Appearance versus booking

The fixed-b match on Ekene-6 reports R2 0.999047938405246 and a quality label of Good. The same match under-books the well by 13742.3505116328 stb. Both statements describe the same fit, and neither is a mistake. This lesson is about how that happens, how to detect it without knowing the truth, and what to write down when you do.

## The two bookings side by side

| Quantity | Fixed-b type-curve match | Ekene-6's own fit |
|---|---|---|
| $b$ | 0.05 (borrowed) | 0.35 |
| $q_i$ (stb/d) | 88.8116671130696 | 89.9999999999999 |
| $D_i$ (1/d) | 0.000893152170857701 | 0.00100000000000000 |
| R2 over history | 0.999047938405246 | 1.00000000000000 |
| EUR at 10 stb/d (stb) | 91524.2759502962 | 105266.626461929 |
| Time to limit (days) | 2583.69556071181 | 3307.62651421312 |

The booking is short by 13742.3505116328 stb, which is 13.0548028121744 percent, and the economic life is short by 723.930953501306 days, close to two years of production.

## Over the data, they are the same curve

Sum both curves day by day across the 821 days of history and the true decline delivers 51820.6746955467 stb while the borrowed-b match delivers 51838.9360947107 stb. The match is high by 18.2613991640319 stb, 0.0352396013199696 percent. Its largest single residual anywhere in the history is 1.18833288693037 stb/d, at the very first point, and its RMSE is 0.423232559356918 stb/d on rates running from 90 down to 42.6981789346170.

There is nothing wrong with the fit where the data is. R2 is not lying about anything.

## Past the data, they are different wells

| $t$ (days) | True rate (stb/d) | Fixed-b rate (stb/d) |
|---|---|---|
| 852 | 42.6981789346170 | 42.0841866578568 |
| 1500 | 26.9534513980971 | 24.2824353322635 |
| 2000 | 19.7613686386314 | 16.0471758660725 |
| 3000 | 11.5748985199386 | 7.18483958721722 |

At the end of history the two curves are within a barrel a day of each other. At 2000 days the borrowed-b curve is nearly 4 stb/d low, and it hits the economic limit almost two years early. All of that divergence is $b$, because $b$ is the tail parameter: it controls how fast the instantaneous decline softens with time, and softening only becomes visible after enough time has passed for it to accumulate.

## The measurement that matters

The data covers 821 days. The booking runs to 3307.62651421312 days. So the history covers 24.8214239567890 percent of the booked life, and three quarters of the volume-generating period is unobserved, produced entirely by an exponent borrowed from two wells that were not analogous in the first place.

Write that ratio beside every extrapolated booking. It is one division, and it converts an argument about R2 into an argument about coverage, which is the argument that was always the real one.

## The check you can run without the truth

On a real well you will not have the planted answer to compare against. You can still expose the problem, by refitting the same target at a range of fixed exponents and watching what moves. Applying $b$ values across the grid to Ekene-6's own 28 rows:

| Fixed $b$ | R2 over history | EUR at 10 stb/d (stb) |
|---|---|---|
| 0.05 | 0.999047938405246 | 91524.2759502962 |
| 0.1 | 0.999329787551082 | 93524.5094375525 |
| 0.2 | 0.999751591582965 | 97851.7693675173 |
| 0.3 | 0.999971509347677 | 102661.484846537 |
| 0.35 | 1.00000000000000 | 105266.626461929 |
| 0.5 | 0.999724578289740 | 113989.490502181 |

Every one of those fits reports R2 above 0.999 and quality Good. Their bookings span more than twenty thousand barrels. The history simply cannot tell these exponents apart, and this is noise-free fixture data with 28 clean points: the R2 column does peak at the true $b$, but it peaks in the fourth and fifth decimal place while the EUR column moves by 20 percent. Put a realistic amount of scatter on those rates and the peak disappears entirely, while the EUR spread stays exactly where it is.

Run this sweep whenever a booking rests on a borrowed or weakly-constrained exponent, and report the spread rather than the single number. It costs six fits.

{{panel:dca-typecurve-explorer}}

Put the two numbers on the screen together. With the default pool and Ekene-6 as the target, the panel shows the applied EUR beside the well's true closed-form EUR and the percentage difference. Read the R2 tile and the percentage tile at the same time, once, and the lesson of this module is on one line of a dashboard.

## Two named misconceptions

**"R2 0.999 means the forecast is right."** R2 measures agreement with the rows you handed the fitter. It has no opinion about rows you did not, and on this well the rows you did not hand it carry three quarters of the volume.

**"Quality Good is a sign-off."** It is a band label whose top rung, on this particular function, begins at 0.85. The same fit read through the other quality function in the same engine comes back Excellent. Neither function saw the tail, and neither one is a review.

## Worked example: what the entry should say

The Professional capstone asks for the type-curve booking, 91524.2759502962 stb, because reproducing a stated method exactly is part of the job. Reporting it is a separate job. A defensible entry gives both numbers, the method behind each and a recommendation:

> Ekene-6, primary window, 28 monthly points to 2022-12-01. Direct fit: hyperbolic, $b$ 0.35, $D_i$ 0.001 per day, EUR 105266.626461929 stb at a 10 stb/d limit. Fixed-b type-curve match, $b$ 0.05 borrowed from a pooled Ekene-3 plus Ekene-6 curve: EUR 91524.2759502962 stb, 13.0548028121744 percent lower, R2 0.999047938405246 over 24.8214239567890 percent of booked life. Fixed-b sweep across $b$ 0.05 to 0.5 spans 91524 to 113990 stb at R2 above 0.999 throughout. Recommend the direct fit: the well has sufficient history to fit itself, and the pooled curve scores R2 0.615735522363384 against Ekene-6's own points.

That paragraph takes two minutes to write and it is the difference between a number and a booking. Note also the direction of the error. Borrowing an exponent below the truth under-books, as here. Borrowing one above the truth over-books, and the R2 will look every bit as good, which is why the governance of high exponents is a subject of its own at the Expert tier.

## Exercise

A new well has 6 months of history and a fixed-b match reporting R2 0.998, with the exponent borrowed from a 12-well pool. Its booked life is 3000 days.

Compute the coverage ratio and compare it with Ekene-6's 24.8214239567890 percent. State which two numbers from the type-curve report you would demand before accepting the booking, given that a pooled R2 can hide a per-member R2 of 0.615735522363384. Then describe the sweep you would run on the target well itself, what you would report from it, and what you would say to a reviewer who replies that the match already reports quality Good.
