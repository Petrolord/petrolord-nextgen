# The ratio

The evidence term in Eaton's relation is a single dimensionless number at each depth: the normal transit time divided by the measured transit time,

$$r(z) = \frac{\Delta t_n(z)}{\Delta t(z)}$$

Everything the sonic log has to say about pressure enters the method through this one ratio, so it repays close reading.

## Which way up

The trend is on top. That convention is worth a moment, because getting it upside down produces pressures below hydrostatic and a prognosis that looks plausible until someone checks a number.

A normally compacted shale sits on the trend: $\Delta t = \Delta t_n$, so $r = 1$. An undercompacted, overpressured shale is slow: $\Delta t > \Delta t_n$, so $r < 1$. The ratio falls as things get worse. Raised to a positive power it stays below 1, and multiplied into the stress budget it hands the fluid the difference. A ratio above 1 would mean the rock is faster than normal, which is not an overpressure signal at all; what the method does with that case is lesson 5's subject.

The same ratio can be written in velocity, $v / v_n$, with the measured velocity on top, since velocity is the reciprocal of transit time. Same number, same direction. This course stays in transit time because the log does.

## The ratio down this well

Above 2500 m the golden well's sonic sits exactly on its header trend, so $r = 1$ at every one of the first 251 samples. Not approximately 1: the well was constructed that way, and the method duly returns the hydrostatic at every sample above the ramp top, to floating-point residue.

Below 2500 m the encoded ramp makes the log increasingly slow relative to trend. The ratio at four depths, all computed from the engine:

At 2600 m the log reads 313.01471963830767 us/m against a trend of 311.6193270435334, ratio 0.9955420863389854. At 3000 m, 297.76677602422825 against 292.07031526461174, ratio 0.9808693876607879. At 3500 m, 282.5387777324301 against 273.3910027183001, ratio 0.9676229398047687. At total depth, 270.92263512383806 against 259.5530276341839, ratio 0.9580337483265022.

Notice the scale. The worst ratio in the well is about 0.958. The rock at total depth is roughly four percent slower than normal, and that four percent carries the whole 6 MPa. Eaton's ratios live very close to 1; departures of a few percent are the signal.

## The ratio is local

Each sample's ratio uses that sample's log value and that sample's trend value. Nothing propagates: a bad log reading at 3000 m contaminates the pressure at 3000 m and nowhere else. That locality is a strength, and it has a sharp edge.

The strength: spiky log noise makes spiky pressure noise, which the eye identifies and discounts, rather than a smeared bias.

The edge: the ratio has no memory and no context. It cannot tell whether a slow reading is undercompaction, a washed-out hole, an organic-rich interval, or a lithology the trend was never meant to describe. Every one of those becomes pressure if it reaches the equation. That is why the shale-picking discipline of the Associate tier sits upstream of everything here: the method is only ever pointed at rock the trend claims to describe.

## Precision matters more than it looks

Because ratios sit so close to 1, small errors in either transit time move the pressure visibly. Hold that thought for module 4, where a 6 us/m disagreement at the mudline, about one percent, turns into megapascals of phantom pressure at depth: on a real well, trend error is indistinguishable from signal error, and the budget it multiplies is tens of MPa.

## Worked example

Compute the ratio and its cube at 3500 m. From the engine, $\Delta t = 282.5387777324301$ us/m and $\Delta t_n = 273.3910027183001$ us/m.

$$r = \frac{273.3910027183001}{282.5387777324301} = 0.9676229398047687$$

$$r^3 = 0.9059797014636933$$

The grains keep 90.6 percent of the stress budget at 3500 m; the fluid gets 9.4 percent of it. The budget there is 42.544004457243325 MPa, and 9.4 percent of that is the 4 MPa the ramp implies at 1000 m below its top. The full chain is next lesson's subject; here the point is that the cube of a number four percent under 1 is a number ten percent under 1, which is the first sight of the exponent doing its work.

## Exercise

At 2600 m the ratio is 0.9955420863389854. Without a calculator, estimate the percentage the fluid takes of the stress budget there under $n = 3$, using the rule that for small $x$, $(1-x)^3$ is approximately $1-3x$. Then check against the exact figure of 0.4 MPa on a budget of 30.04308796385235 MPa.

Self check: the ratio is about 0.45 percent below 1, so the cube is about 1.33 percent below 1, and the fluid should take roughly 1.3 percent of the budget. Exactly: 0.4 of 30.043 MPa is 1.331 percent. The small-departure approximation is nearly perfect here, and it says something worth keeping: near the top of a ramp, Eaton with $n = 3$ reads pressure as three times the fractional slowness, times the budget.
