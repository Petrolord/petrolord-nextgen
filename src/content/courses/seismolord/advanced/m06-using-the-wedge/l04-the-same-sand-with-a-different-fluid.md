# The same sand with a different fluid

Everything in this tier has held the rock fixed and moved the wavelet or the thickness. This lesson moves the third thing. The geometry stays exactly as it is, the wavelet stays at 25 Hz, and the pore fluid in the sand changes from brine to gas. What that does to the wedge is the link between resolution work and the fluid work that sits above this course.

## The sand

The starting point is a brine filled sand encased in shale, with properties taken at 60 degrees Celsius, 25 MPa, and a formation water salinity of 0.035 by weight.

| | $V_p$ (m/s) | $V_s$ (m/s) | $\rho$ (kg/m3) | Impedance |
| --- | --- | --- | --- | --- |
| Shale | 2500 | 1150 | 2350 | 5,875,000 |
| Sand, brine filled | 3000 | 1700 | 2200 | 6,600,000 |

The sand has 25 percent porosity and a quartz frame with a mineral bulk modulus of 36.6 GPa. The brine at those conditions has a density of 1017.82 kg/m3 and a bulk modulus of 2.6978 GPa. The gas, at a gravity of 0.6, has a density of 172.67 kg/m3 and a bulk modulus of 0.05572 GPa, which is about one forty eighth of the brine's.

## The substitution

Gassmann's relation takes the saturated rock, removes the fluid to recover the dry frame, and puts a different fluid back. The shear modulus is unchanged by the swap, because a fluid supports no shear, and the bulk density changes by the porosity times the difference in fluid density.

Running it on this sand:

| | $V_p$ (m/s) | $V_s$ (m/s) | $\rho$ (kg/m3) | Impedance |
| --- | --- | --- | --- | --- |
| Sand, brine filled | 3000 | 1700 | 2200 | 6,600,000 |
| Sand, gas filled | 2542.08 | 1788.03 | 1988.71 | 5,055,462 |

Three things happened, and only one of them is usually expected.

**$V_p$ fell by 15 percent**, from 3000 to 2542 m/s. Replacing a stiff fluid with a compliant one softens the rock, and the compressional velocity carries that.

**$V_s$ rose**, from 1700 to 1788 m/s. The shear modulus did not change, but the density fell, and $V_s = \sqrt{\mu/\rho}$, so a lighter rock with the same rigidity is faster in shear. This is the classic signature of a gas substitution and it is the reason shear information separates fluid effects from lithology effects.

**Impedance fell by 23 percent**, from 6.60 to 5.06 million, because both velocity and density moved the same way.

## What that does to the reflection pair

At the top of the sand, against the shale above:

$$R_{brine} = \frac{6{,}600{,}000 - 5{,}875{,}000}{12{,}475{,}000} = +0.058116$$

$$R_{gas} = \frac{5{,}055{,}462 - 5{,}875{,}000}{10{,}930{,}462} = -0.074977$$

The polarity flipped. With brine in the pores the sand is harder than the shale and reflects as a peak. With gas in the pores it is softer and reflects as a trough. The base coefficient flips with it, so the pair is still equal and opposite, just the other way round.

## What that does to the wedge

Run the wedge again with each pair, at 25 Hz on the same 2 ms grid:

| | Tuning thickness | Tuning amplitude | Isolated amplitude |
| --- | --- | --- | --- |
| Brine pair | 16 ms | 0.083974 | 0.058116 |
| Gas pair | 16 ms | 0.108337 | 0.074977 |

**The tuning thickness did not move.** Sixteen milliseconds in both cases, exactly as module 3 promised: the tuning thickness belongs to the wavelet, and nothing about the rock was allowed to touch it.

**The amplitudes scaled exactly.** The ratio of the two tuning amplitudes is 1.29013, and the ratio of the two reflection coefficient magnitudes is 1.29013. To the precision the model stores, they are the same number. The fluid change multiplied the whole tuning curve by a constant and left its shape alone.

That is the cleanest possible separation of the two effects. **The wavelet decides the shape of the tuning curve. The rock and its fluid decide the scale.**

## Why this matters for a bright spot

A gas sand at tuning thickness is doing two things at once, and both make it bright.

The fluid raised the reflection coefficient magnitude from 0.058 to 0.075, a factor of 1.29. Tuning then multiplies whatever is there by 1.445. Together the tuned gas sand reads 0.1083 against the untuned brine sand's 0.0581, a factor of 1.86.

An interpreter looking at that contrast has no way, from the amplitude alone, to say how much of the 1.86 was fluid and how much was thickness. Separating them needs either a thickness constraint from the wedge and the apparent thickness floor, or an angle dependent measurement, which is where the next lesson goes.

## Worked example

Confirm the gas sand's bulk density from the substitution rule.

$$\rho_{gas} = \rho_{brine} + \phi\left(\rho_{fluid,gas} - \rho_{fluid,brine}\right) = 2200 + 0.25\left(172.67 - 1017.82\right) = 2200 - 211.29 = 1988.71$$

which matches the table. The whole density change is 211 kg/m3, nearly 10 percent of the rock, and it comes entirely from replacing a quarter of the volume with something 5.9 times lighter.

## Exercise

Using the brine and gas impedances above, state what would happen to the reflection pair and to the tuning thickness if the encasing shale had an impedance of 5,000,000 instead of 5,875,000. Then say which of the numbers in this lesson would change and which would not.

As a self-check: with a 5,000,000 shale the brine sand's top coefficient becomes $(6{,}600{,}000 - 5{,}000{,}000)/11{,}600{,}000 = +0.137931$ and the gas sand's becomes $(5{,}055{,}462 - 5{,}000{,}000)/10{,}055{,}462 = +0.005516$, so the gas case no longer flips polarity and becomes a very weak peak instead. Every amplitude in the lesson changes because all of them scale with the coefficients, while the tuning thickness stays at 16 ms in both cases because it depends only on the 25 Hz wavelet.
