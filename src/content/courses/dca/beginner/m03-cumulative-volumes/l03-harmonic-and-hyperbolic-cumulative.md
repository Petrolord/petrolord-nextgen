# Harmonic and hyperbolic cumulatives

The exponential cumulative gave you a ceiling and a fraction of it delivered. The other two Arps models integrate just as exactly, but they behave differently in the tail, and the difference is worth real money. This lesson works both of them on the Ekene wells that carry them.

## The harmonic cumulative

For $q = q_i / (1 + D_i t)$ the integral is a logarithm:

$$N_p(t) = \frac{q_i}{D_i}\ln(1 + D_i t)$$

The same leading factor $q_i / D_i$ appears, but it is no longer a ceiling. It is a scale. The bracket is now $\ln(1 + D_i t)$, which keeps growing forever, slowly, without ever settling on a limit.

Ekene-5 is the harmonic well: $q_i = 100$ stb/d, $D_i = 0.0015$ per day, on production from 2020-06-01. Its scale factor is

$$\frac{100}{0.0015} = 66666.6666666667 \text{ stb}$$

At one year, $t = 365$ days:

$$D_i t = 0.0015 \times 365 = 0.5475$$

$$\ln(1.5475) = 0.436640725576614$$

$$N_p = 66666.6666666667 \times 0.436640725576614 = 29109.3817051076 \text{ stb}$$

Stop here and do $t = 730$ yourself. The chain is identical: $D_i t = 1.095$, then $\ln(2.095)$, then multiply. You should land on 49303.5702249401 stb. If you get something near 58000 you probably used $\ln(D_i t)$ instead of $\ln(1 + D_i t)$, which is the single most common harmonic slip.

The Ekene flood starts 2023-01-01. Ekene-5 came online 2020-06-01, so that date is $t = 944$ days for this well, not 1096. Every well on the field has its own clock, set by its own first production month.

$$D_i t = 1.416, \quad \ln(2.416) = 0.882113280072569$$

$$N_p = 66666.6666666667 \times 0.882113280072569 = 58807.5520048379 \text{ stb}$$

Ekene-5 delivered 58807.5520048379 stb of primary oil and was still flowing 41.3907284768212 stb/d on the day the injectors came on.

## No ceiling, and what that means

Push the harmonic form out in time and it never stops climbing. At ten years, $t = 3650$, Ekene-5's closed form gives 124529.907172373 stb. At a hundred years it gives 268058.494022682 stb. Both are honest evaluations of the formula and neither is a forecast anyone would book, because no well produces for a century and nothing has yet stopped the arithmetic. What stops it in practice is the economic limit, which is the whole subject of the next module. Remember the shape of the problem: a harmonic well carries a long, heavy tail, so the volume you book depends much more strongly on where you cut it off than an exponential booking does.

## The hyperbolic cumulative

For $q = q_i / (1 + b D_i t)^{1/b}$ the integral is a power:

$$N_p(t) = \frac{q_i}{D_i(1-b)}\left(1 - (1 + b D_i t)^{1 - 1/b}\right)$$

Two features to notice before any arithmetic. The leading factor now carries a $(1-b)$ in the denominator, so it blows up as $b$ approaches 1. And the exponent is $1 - 1/b$, which is negative for every $b$ between 0 and 1, so the power term shrinks toward zero as $t$ grows and the cumulative climbs toward that leading factor. For $b < 1$ the hyperbolic does have a ceiling, and $q_i / (D_i(1-b))$ is it.

At exactly $b = 1$ the formula divides by zero. That is not a bug. The harmonic case is the limit of this expression as $b \to 1$, and the logarithm above is what the limit evaluates to. This is why the engine carries harmonic as its own model rather than as a hyperbolic with $b$ set to one.

## Ekene-3, worked

Ekene-3 has $q_i = 150$ stb/d, $D_i = 0.002$ per day, $b = 0.5$, on production from 2020-03-01. The leading factor is

$$\frac{150}{0.002 \times 0.5} = 150000 \text{ stb}$$

and the exponent is $1 - 1/0.5 = -1$, a plain reciprocal. That makes $b = 0.5$ the easiest hyperbolic to hand-check in the whole family. At $t = 365$:

$$b D_i t = 0.5 \times 0.002 \times 365 = 0.365$$

$$(1.365)^{-1} = 0.732600732600733$$

$$1 - 0.732600732600733 = 0.267399267399267$$

$$N_p = 150000 \times 0.267399267399267 = 40109.8901098901 \text{ stb}$$

Those repeating digits look like a typing accident. They are not. With the exponent at $-1$ the whole calculation collapses to the exact fraction $54750 / 1.365$, and a rational number with a 1365 in the denominator has a repeating decimal expansion. The engine, the fixture and your calculator all agree on 40109.8901098901 stb.

The flood date is $t = 1036$ days for Ekene-3:

$$b D_i t = 1.036, \quad (2.036)^{-1} = 0.491159135559921$$

$$N_p = 150000 \times 0.508840864440079 = 76326.1296660118 \text{ stb}$$

Ekene-3 entered the flood era with 76326.1296660118 stb produced and 36.1855944665954 stb/d still flowing.

## Ekene-6, where the exponent is not friendly

Ekene-6 has $q_i = 90$ stb/d, $D_i = 0.001$ per day, $b = 0.35$, from 2020-09-01, which makes the flood date $t = 852$ days. Leading factor:

$$\frac{90}{0.001 \times 0.65} = 138461.538461538 \text{ stb}$$

Exponent: $1 - 1/0.35 = -1.85714285714286$. Now the power really does need a calculator.

$$b D_i t = 0.35 \times 0.001 \times 852 = 0.2982$$

$$(1.2982)^{-1.85714285714286} = 0.615897509921331$$

$$N_p = 138461.538461538 \times 0.384102490078669 = 53183.4217032003 \text{ stb}$$

Three wells, three models, one method: build $D_i t$ or $b D_i t$, evaluate the bracket, scale by the leading factor.

## Where these go wrong

**Sign flip in the exponent.** Writing $1/b - 1$ instead of $1 - 1/b$ makes the power grow instead of shrink, so the bracket goes negative and the cumulative comes out negative. A negative $N_p$ always means this.

**Using the hyperbolic form on a harmonic well.** With $b = 1$ the leading factor is infinite. Use the logarithm.

**Reading a well's flood date off the calendar instead of its own clock.** 2023-01-01 is $t = 1096$ for Ekene-1, 1036 for Ekene-3, 944 for Ekene-5 and 852 for Ekene-6. Feeding 1096 into all four is a quiet way to overstate three of them.

## Exercise

Compute Ekene-6's cumulative at $t = 365$ days from the closed form, showing $b D_i t$, the power term and the leading factor. You should get 27706.7638074657 stb. Then answer without computing anything: Ekene-3 and Ekene-6 both have $b$ below 1, so both have a finite ceiling. Which one is higher, and why does a smaller $b$ pull the ceiling down even though Ekene-6 also has the gentler decline?
