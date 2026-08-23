# The reflection coefficient

"The amount reflected depends on the size of the contrast" is a statement about direction. To build a synthetic you need a number. For a wave arriving straight down onto a flat interface, that number is the **reflection coefficient**.

## The formula

Label the layer above the interface as layer 1 and the layer below it as layer 2, each with its own acoustic impedance $Z$. At normal incidence,

$$RC = \frac{Z_2 - Z_1}{Z_2 + Z_1}$$

The numerator is the contrast: how much impedance changes as you cross the interface downward. The denominator normalises that contrast against the impedance level it sits on, so the same absolute jump counts for more in a soft section than in a hard one. Both operations matter, and forgetting the denominator is the most common arithmetic slip in this module.

"Normal incidence" means the ray path is perpendicular to the interface. Real seismic is acquired over a range of offsets and the reflection coefficient varies with angle, which is the subject of amplitude versus offset work at the Professional tier. Every synthetic in this course, and the app's synthetic panel, is a normal incidence synthetic, so this one equation is enough.

## Worked example from the teaching well

Take two neighbouring samples on the teaching well's impedance log. At 1580 m impedance is 7979.58, and at 1582 m it is 7702.20. Treat 1580 m as layer 1 and 1582 m as layer 2, because 1582 m is the deeper of the pair, and work the formula in three steps:

1. Numerator: $7702.20 - 7979.58 = -277.38$.
2. Denominator: $7702.20 + 7979.58 = 15681.78$.
3. Divide: $-277.38 / 15681.78 = -0.017688$.

So $RC = -0.017688$, or about $-0.0177$ if you prefer fewer digits. That value is worth remembering, because it is the strongest reflection coefficient anywhere on this well's series, and the next two lessons return to it repeatedly.

Two checks confirm the arithmetic rather than just repeating it. First, invert the formula: the impedance ratio implied by an $RC$ is $Z_2/Z_1 = (1 + RC)/(1 - RC)$, which here gives $0.982312 / 1.017688 = 0.96524$, and dividing the impedances directly gives $7702.20 / 7979.58 = 0.96524$. Second, use the small-contrast shortcut: impedance falls by $277.38 / 7979.58 = 0.03476$, that is 3.48 percent, and for small contrasts $RC$ is close to half the fractional change, $0.03476 / 2 = 0.01738$. That approximation lands within a few percent of the exact 0.017688, the small gap coming from dividing by the sum 15681.78 rather than by twice the upper impedance, 15959.16.

## Properties you should be able to state

**It is dimensionless.** Impedance carries units, here metres per second multiplied by grams per cubic centimetre, but the numerator and denominator carry the same units and they cancel. A reflection coefficient is a pure ratio, which is why nobody ever quotes units after one.

**It is bounded between -1 and +1.** Push the lower impedance toward zero and the formula tends to $(0 - Z_1)/(0 + Z_1) = -1$: everything comes back, with the sign flipped. Push it toward infinity and the formula tends to $+1$: everything comes back, with the sign preserved. Real interfaces sit far from both extremes. The seafloor and the top of a hard evaporite are the classic large-magnitude cases, and they still rarely exceed a few tenths.

**Typical sedimentary values are small.** Within a clastic section, adjacent impedances differ by a small percentage, so reflection coefficients of a few hundredths are the norm and a few thousandths are commonplace. That is the arithmetic reason seismic amplitudes are small numbers: the earth returns a small fraction of what you send into it at each interface, and the rest carries on down.

It also sets the scale for the word "strong". On this well, 0.017688 in magnitude is the strongest reflection in the whole series. In absolute terms it is under two percent of the incident energy amplitude, which sounds negligible, but relative to the rest of this log it is the standout event.

For calibration, here are three larger contrasts computed from the same log's landmark values, none of which are adjacent samples, so treat them as formula practice rather than as reflections the engine reports. From 5476.85 to 5885.81, $RC = 408.96 / 11362.66 = 0.0360$. From 5885.81 to 8189.64, $RC = 2303.83 / 14075.45 = 0.1637$. From the log's minimum of 5436.47 to its maximum of 10624.956, $RC = 5188.486 / 16061.426 = 0.3230$. That last figure is the largest coefficient the log's value range could ever produce, and no pair of neighbouring samples comes close to it.

## Where the engine does this

The engine computes reflection coefficients from the impedance series after it has been resampled onto the seismic time grid, taking each sample against the one immediately above it. There is no separate layer picking step and no thickness anywhere in the formula. Two impedance values in, one dimensionless number out, repeated down the log. Lesson 4 walks that series end to end.

## Exercise

Compute the reflection coefficient for two interfaces, working each in the three steps above. First, layer 1 at 5476.85 over layer 2 at 5436.47. Second, layer 1 at 7979.58 over layer 2 at 8189.64. As a self-check: the first gives $(5436.47 - 5476.85)/(5436.47 + 5476.85) = -40.38 / 10913.32 = -0.0037$, and the second gives $(8189.64 - 7979.58)/(8189.64 + 7979.58) = 210.06 / 16169.22 = 0.0130$. Then state which of the two is the stronger reflection, and confirm that your answer does not depend on which of them is positive.
