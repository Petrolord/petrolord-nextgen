# Exponential decline

Of the three Arps forms, the exponential is the one to learn first, because it has the fewest moving parts and because one of the Ekene producers follows it exactly. Ekene-1 came on stream on 2020-01-01 at 120 stb/d and declined exponentially through the whole primary period, with a nominal decline of 0.0012 per day. Everything in this lesson can be checked by hand against that well.

## The form

The exponential rate equation is

$$q(t) = q_i \, e^{-D_i t}$$

with $q_i$ the initial rate, $D_i$ the nominal decline rate, and $t$ the time since the start. In this course $D_i$ is always per day and $t$ is always in days, because that is the unit the fitting engine works in. Ekene-1's parameters are $q_i = 120$ stb/d and $D_i = 0.0012$ per day.

The defining property is that the decline rate never changes. Every day, the rate loses the same fraction of itself. Not the same number of barrels: the same fraction. Early on, when the rate is high, that fraction is many barrels per day of lost capacity; late in life it is a trickle. But the fractional loss is constant, and that constancy is what makes the curve exponential.

## Work one point by hand

Take one year, $t = 365$ days. The exponent is

$$D_i \, t = 0.0012 \times 365 = 0.438$$

so the rate is

$$q(365) = 120 \times e^{-0.438} = 120 \times 0.645326 = 77.4390939428753 \text{ stb/d}$$

Stop and do this on a calculator now. Multiply 0.0012 by 365, change the sign, exponentiate, multiply by 120. If you get 77.439 stb/d you have the structure right. The decay factor $e^{-0.438} = 0.645326$ says that after one year the well produces at 64.5 percent of where it started.

The committed rate table for Ekene-1 gives you more checkpoints, and every one of them sits exactly on this curve:

| t (days) | q (stb/d) |
|---|---|
| 0 | 120 |
| 182 | 96.4564626973622 |
| 365 | 77.4390939428753 |
| 730 | 49.9734439224456 |
| 1096 | 32.2104760492461 |

Notice the two-year value. It is $120 \times e^{-0.876}$, and $e^{-0.876} = (e^{-0.438})^2$, so the two-year rate is the one-year decay factor applied twice: $120 \times 0.645326 \times 0.645326 = 49.97$ stb/d. Equal time steps always multiply by the same factor. That multiplicative regularity is the practical signature of exponential decline, and it is worth internalising before the plotting lesson makes it visual.

## The half-life

A useful single number for any exponential process is its half-life, the time for the rate to fall by half:

$$t_{1/2} = \frac{\ln 2}{D_i} = \frac{0.693147}{0.0012} = 577.622650466621 \text{ days}$$

about 19 months. And it is ALWAYS 19 months for this well: from 120 to 60, from 60 to 30, from 30 to 15, each takes the same 577.6 days. Keep this in contrast with the harmonic well in the next lesson, where each successive halving takes longer than the one before.

## See it in the panel

{{panel:dca-fit-explorer}}

Select Ekene-1, leave the window on Primary, and read the tiles. The fitted model comes back Exponential with qi 120 and Di 0.0012, matching the planted truth exactly, because the teaching data carries no noise. Hover along the curve and confirm the one-year and two-year rates against the table above. Then flip the rate axis between Semilog and Linear and notice how differently the same numbers read; lesson 5 is about that.

## The one error to avoid

The commonest beginner mistake is to treat the annualised nominal decline as a simple percentage haircut. The nominal decline per year is $0.0012 \times 365 = 0.438$, and it is tempting to write

$$q(365) \stackrel{?}{=} 120 \times (1 - 0.438) = 67.44 \text{ stb/d}$$

That is wrong, and not by a little: the true one-year rate is 77.44 stb/d, so the shortcut understates the rate by 10 stb/d. The nominal decline is an instantaneous rate of fractional loss, not a full-year haircut. Exponentiating is what converts it honestly, and the difference between 0.438 and $1 - e^{-0.438} = 0.354674$ is the whole subject of lesson 4. Until then, one rule: rates come from the equation, never from subtracting a nominal fraction.

## Exercise

Without the panel, compute Ekene-1's rate at $t = 730$ days from $q_i = 120$ and $D_i = 0.0012$ per day, and check yourself against 49.9734439224456 stb/d from the table. Then compute the day on which the rate first falls below 60 stb/d using the half-life, and confirm on the panel chart that the curve crosses 60 stb/d at about day 578.
