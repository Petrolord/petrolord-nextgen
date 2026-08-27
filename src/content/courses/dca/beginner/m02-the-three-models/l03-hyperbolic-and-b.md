# Hyperbolic decline and b

You have now seen the two ends of the Arps family: the exponential well that loses the same fraction of itself every day, and the harmonic well whose decline slows down as fast as its rate does. Real wells mostly live between those two. The hyperbolic form is the bridge, and the single number that says where on the bridge a well sits is the decline exponent $b$.

## The form

$$q(t) = \frac{q_i}{\left(1 + b\,D_i\,t\right)^{1/b}}$$

Three parameters instead of two. As before, $q_i$ is the initial rate and $D_i$ is the nominal decline at $t = 0$, per day. The new one, $b$, is dimensionless.

Look at what $b$ does structurally. It appears twice, once multiplying $D_i t$ inside the bracket and once as the reciprocal power outside. Those two appearances pull in opposite directions, and their balance is the whole behaviour of the curve. Put $b = 1$ and the power becomes 1, leaving $q_i/(1 + D_i t)$, which is the harmonic form from the last lesson exactly. Let $b$ shrink toward 0 and the bracket approaches 1 while the power runs off to infinity; the limit is $q_i e^{-D_i t}$, the exponential. So the family really is one family with one dial:

- $b = 0$: exponential, the fastest-fading member.
- $0 < b < 1$: hyperbolic, the working middle.
- $b = 1$: harmonic, the slowest-fading member.

You cannot literally substitute $b = 0$ into the formula, since $1/b$ is undefined there. Exponential is the limiting case, not an arithmetic special case, and every fitting engine treats it as its own model for that reason.

## What b means physically

$b$ measures how quickly the well's own decline decelerates. Write it as a sentence: the instantaneous fractional decline at time $t$ is $D_i$ divided by $(1 + b D_i t)$. With $b = 0$ that denominator never changes and the fractional decline stays at $D_i$ forever. With $b = 1$ the denominator grows as fast as it possibly can within the family, and the decline fades fastest. Values in between decelerate in between.

The practical translation is about tails. A bigger $b$ means a fatter, longer tail, more oil produced late, and a larger ultimate recovery from identical early data. That is why $b$ is the most argued-over number in decline analysis and why the industry writes governance rules about it. At this tier, hold on to the direction and its warning: **raising $b$ raises every long-term number you produce, so $b$ must be earned from data, never chosen for convenience.**

## Ekene-3, worked by hand

Ekene-3 came on stream 2020-03-01 at $q_i = 150$ stb/d with $D_i = 0.002$ per day and $b = 0.5$. With $b = 0.5$ the power $1/b$ is exactly 2, so the formula becomes a plain square:

$$q(t) = \frac{150}{\left(1 + 0.5 \times 0.002\,t\right)^{2}} = \frac{150}{\left(1 + 0.001\,t\right)^{2}}$$

At one year, $t = 365$ days:

$$1 + 0.001 \times 365 = 1.365, \qquad 1.365^2 = 1.863225, \qquad q(365) = \frac{150}{1.863225} = 80.5055750110695 \text{ stb/d}$$

Stop and do that on a calculator now: add, square, divide. If you land on 80.5056 stb/d you have the mechanics. The rest of the committed table follows the same three steps:

| t (days) | $1 + bD_i t$ | $(1 + bD_i t)^{1/b}$ | q (stb/d) |
|---|---|---|---|
| 182 | 1.182 | 1.397124 | 107.363412266914 |
| 365 | 1.365 | 1.863225 | 80.5055750110695 |
| 730 | 1.730 | 2.99290 | 50.1186140532594 |
| 1096 | 2.096 | 4.393216 | 34.1435522405454 |

## Ekene-6, where the power is not friendly

Ekene-6 has $q_i = 90$ stb/d, $D_i = 0.001$ per day and $b = 0.35$, and $1/b = 2.85714285714286$, which no amount of wishing turns into a square. You need the power key on the calculator. At one year:

$$b\,D_i\,t = 0.35 \times 0.001 \times 365 = 0.12775$$
$$1.12775^{\,2.85714285714286} = 1.40987149752878$$
$$q(365) = \frac{90}{1.40987149752878} = 63.8356049879382 \text{ stb/d}$$

Compare the two wells after that first year. Ekene-3 has come down from 150 stb/d to 80.5055750110695, while Ekene-6 has come down from 90 stb/d to 63.8356049879382. Ekene-3 lost far more ground, but that is mostly $D_i$ talking, not $b$: Ekene-3's nominal decline of 0.002 per day is twice Ekene-6's 0.001 per day, while its $b$ is only modestly larger. $b$ and $D_i$ answer different questions. $D_i$ sets how fast the well is falling at the start; $b$ sets how quickly that falling eases off. Reading one as the other is the most common misreading of a fit report you will ever make.

## See it in the panel

{{panel:dca-fit-explorer}}

Select Ekene-3 with the window on Primary. The fit returns Hyperbolic with qi 150, Di 0.002 and a $b$ tile reading 0.49999999999999994 rather than a tidy 0.5. That is not an error and it is not noise: the engine searches $b$ in steps of 0.05 built up by repeated addition, and binary floating point does not add 0.05 to itself an exact number of times. The tile shows you the raw number the engine actually holds. Trust it and read it as one half; the Professional tier takes the search mechanism apart properly.

Now switch to Ekene-6 and read its $b$ tile, then flip between the two wells on the semilog axis and watch the curvature. Both bend upward away from a straight line instead of holding the ruler-straight track Ekene-1 holds. Ekene-3 shows the stronger bend, carrying both the larger $b$ and the larger $D_i$; the next two lessons separate those two effects properly.

## The misconception to retire

"A high $b$ means the well is declining fast." It means the opposite. $b$ is not a rate of decline at all; it is a measure of how much the decline brakes itself. Between two wells with the same $q_i$ and $D_i$, the one with the higher $b$ is above the other at every single time after $t = 0$, forever. If you take one habit from this lesson, take that ordering.

## Exercise

By hand, from $q_i = 150$, $D_i = 0.002$ per day and $b = 0.5$: compute Ekene-3's rate at $t = 730$ days and check it against 50.1186140532594 stb/d in the table. Then compute Ekene-6's rate at $t = 1096$ days from $q_i = 90$, $D_i = 0.001$ and $b = 0.35$, and check against 35.5922312275763 stb/d. Finally, without computing anything, say which of the two wells would still be flowing at a higher fraction of its initial rate after ten years, and name which parameter decided it.
