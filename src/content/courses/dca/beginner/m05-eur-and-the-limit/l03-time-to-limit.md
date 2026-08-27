# Time to the limit

The EUR tells you how much. This lesson tells you when. Time to limit is the number of days from the start of the decline until the rate falls to the economic limit, and it is the second half of every booking, because a volume with no date attached cannot be scheduled, financed or abandoned.

The derivation is easier than the EUR derivation. Take the rate equation for the model, set $q$ equal to $q_{limit}$, and solve for $t$. That is all three formulas.

## Exponential: a logarithm

$$q = q_i e^{-D_i t} \quad\Longrightarrow\quad t_{limit} = \frac{\ln\!\left(q_i / q_{limit}\right)}{D_i}$$

Ekene-1, $q_i = 120$ stb/d, $D_i = 0.0012$ per day, limit 10 stb/d:

$$\frac{q_i}{q_{limit}} = 12, \qquad \ln 12 = 2.48490664978800$$

$$t_{limit} = \frac{2.48490664978800}{0.0012} = 2070.75554149000 \text{ days}$$

That is 5.67330285339726 years from 2020-01-01, so Ekene-1 reaches 10 stb/d somewhere in the second half of 2025 if nothing changes. Something does change, of course: the flood starts at day 1096. The booking still stands as a statement about the primary decline, and stating the window it came from is part of stating the number.

Two habits to build right now. First, the units of $t$ come from the units of $D_i$ and nothing else. Feed the formula $D_i$ per day and you get days; feed it the annual nominal 0.438 per year and $\ln 12 / 0.438 = 5.67330285339726$, which is the same answer expressed in years. Both are right, and mixing them is the single most common arithmetic failure in this module. Second, the logarithm is natural, not base 10. Using $\log_{10}$ here divides your answer by 2.30258509299405 and nothing in the output will look obviously wrong.

## Harmonic: a subtraction, and one clean check

$$q = \frac{q_i}{1 + D_i t} \quad\Longrightarrow\quad t_{limit} = \frac{q_i / q_{limit} - 1}{D_i}$$

Ekene-5, $q_i = 100$ stb/d, $D_i = 0.0015$ per day, limit 10 stb/d:

$$\frac{100}{10} - 1 = 9, \qquad t_{limit} = \frac{9}{0.0015} = 6000.00000000000 \text{ days}$$

Six thousand days, exactly, with no rounding anywhere in the chain. Enjoy it, because it is the cleanest hand check in the course and you should use it as a self test whenever you suspect your calculator or your formula. Six thousand days is 16.4383561643836 years, and it is a long time compared with Ekene-1's 2070.75554149000 days from a similar starting rate. The fat harmonic tail costs almost three times as long to reach the same 10 stb/d.

Confirm it from the other direction: $q(6000) = 100 / (1 + 0.0015 \times 6000) = 100 / 10 = 10$ stb/d. The rate equation and the time formula are the same statement rearranged, so this check costs ten seconds and catches a wrong sign or a dropped one immediately.

## Hyperbolic: the general case

$$q = \frac{q_i}{\left(1 + b D_i t\right)^{1/b}} \quad\Longrightarrow\quad t_{limit} = \frac{\left(q_i / q_{limit}\right)^{b} - 1}{b D_i}$$

Ekene-3, $q_i = 150$ stb/d, $D_i = 0.002$ per day, $b = 0.5$, limit 10 stb/d:

$$\left(\frac{150}{10}\right)^{0.5} = 15^{0.5} = 3.87298334620742$$

$$t_{limit} = \frac{3.87298334620742 - 1}{0.5 \times 0.002} = \frac{2.87298334620742}{0.001} = 2872.98334620742 \text{ days}$$

Ekene-6, $q_i = 90$ stb/d, $D_i = 0.001$ per day, $b = 0.35$:

$$\left(\frac{90}{10}\right)^{0.35} = 9^{0.35} = 2.15766927997459$$

$$t_{limit} = \frac{2.15766927997459 - 1}{0.35 \times 0.001} = \frac{1.15766927997459}{0.00035} = 3307.62651421312 \text{ days}$$

Stop and run the Ekene-6 chain yourself. Watch the denominator: it is $b D_i$, which is 0.00035 per day, not $D_i$. Forgetting the $b$ in the denominator is the classic slip, and on this well it would shrink your answer by a factor of about three without producing anything that looks absurd. If you get 3307.6 days, or 9.06199044989897 years, the structure is right.

Set the four results side by side, shortest first. Ekene-1 takes 2070.75554149000 days, Ekene-3 takes 2872.98334620742 days, Ekene-6 takes 3307.62651421312 days and Ekene-5 takes 6000.00000000000 days. Resist the urge to read that as a ranking of $b$. Ekene-3 carries the larger exponent of the two hyperbolics, $b = 0.5$ against Ekene-6's 0.35, and still reaches the limit first, because it also carries the steepest decline in the field at $D_i = 0.002$ per day. Time to limit is set by all three fitted parameters and the limit together, never by $b$ alone. What $b$ does control is the shape of the approach. Compare the last stretch, from 20 stb/d down to 10 stb/d: Ekene-1 crosses it in 577.622650466620 days, Ekene-5 takes 3333.33333333333 days over the same ten barrels of rate. The fat tail is not a small correction late in life, it is most of the life.

{{panel:dca-fit-explorer}}

Read the time to limit tile for each well on the primary window and check the four values. If you run a forecast instead of the closed form, expect the whole-day answer: a day-stepping forecast of Ekene-1 reports the first whole day at or below the limit, day 2071, rather than the fractional 2070.75554149000. The two agree to within a day, and the Professional tier takes up why they differ at all.

## The check that ties this lesson to the last one

Cumulative production evaluated at the time to limit must equal the EUR. It is the definition, so it had better hold. For Ekene-5 the harmonic cumulative is

$$N_p(t) = \frac{q_i}{D_i}\ln\!\left(1 + D_i t\right)$$

and at $t = 6000$ days that is $66666.6666666667 \times \ln(10) = 153505.672866270$ stb, the exact EUR from lesson 2. Two formulas that were derived independently landing on the same fifteen digits is how you know both are right.

## Exercise

Work Ekene-3's time to limit at a limit of 25 stb/d with the hyperbolic formula, then convert your answer to years. Next, take the time you computed and put it into Ekene-3's hyperbolic cumulative to confirm you recover the EUR at that same 25 stb/d limit from lesson 2's formula. Finally, answer in one sentence: if an analyst reports a time to limit of 5.67330285339726 for Ekene-1 with no unit named, what has probably happened, and what would the same person's EUR look like?
