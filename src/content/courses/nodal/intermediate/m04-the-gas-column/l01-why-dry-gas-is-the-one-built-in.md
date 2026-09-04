# Why dry gas is the one built in

The engine ships one outflow column of its own, and it is the only one whose physics closes without an opinion.

{{panel:pd-vlp-explorer}}

## One built in, everything else injected

The node solver takes a callable returning a required bottomhole pressure for a rate. If you do not hand it one, it falls back on a dry gas column solved by Cullender and Smith. That is the only outflow model the engine owns.

Dry gas is single phase, so its density needs only a compressibility factor and its wall loss only a friction factor, and both are published and gate-tested:

| Pressure, psia | Temperature, degF | Gas gravity | z factor |
| --- | --- | --- | --- |
| 150 | 90 | 0.6 | 0.98086541 |
| 800 | 120 | 0.65 | 0.90756402 |
| 2500 | 180 | 0.65 | 0.88010263 |
| 4500 | 220 | 0.7 | 0.97569737 |

Read that column carefully. The four rows move pressure, temperature and gas gravity together, so the fall from 0.98086541 to 0.88010263 and the climb back to 0.97569737 is the range z takes across four published conditions, not a trend in pressure. Nothing is held constant here, and a reader who takes the dip for a pressure effect has read three variables as one.

| Reynolds number | Relative roughness | Moody friction factor |
| --- | --- | --- |
| 1200 | 0.0002 | 0.05333333 |
| 3000 | 0.0002 | 0.03605480 |
| 50000 | 0.0002456 | 0.02174609 |
| 2000000 | 0.0002456 | 0.01476271 |
| 10000000 | 0.00001 | 0.00899571 |

A wet column needs holdup and a flow pattern, which are correlated rather than derived and disagree between correlations. Choosing one is a judgement, so the engine leaves it to you.

## What the built-in column refuses to do

It refuses to be J shaped. Nothing in Cullender and Smith lightens with rate: the gas is already gas, so raising the rate raises friction and leaves the weight alone.

| Rate, Mscf/d | Required bottomhole pressure, psia |
| --- | --- |
| 13.289296 | 952.986300 |
| 2225.9571 | 991.537315 |
| 6651.2928 | 1244.436062 |
| 8863.9606 | 1425.971648 |
| 11076.6285 | 1627.613595 |
| 13289.2963 | 1842.190804 |

Sampled at twenty five points to a bound of 13289.296319 Mscf/d, that curve is monotone. The engine still reports a minimum of 952.986300 psia at 13.289296 Mscf/d, because a minimum is a reduction over rows and a reduction always returns something, and it flags that the minimum is the lowest sampled rate.

## The mistake

Running an outflow study on the default column because the injected one was not wired up, then reading its minimum as physical.

The signature: the minimum sits at the very first sample, a thousandth of the span, and it moves by exactly one sample spacing when you change the sample count and nothing else. A genuine J puts its minimum in the interior and barely moves.

## Exercise

In the panel, read the required bottomhole pressure at the lowest sampled rate and at the rate bound, and state which way the curve moves with rate.

Then say what the reported minimum rate becomes if the sample count doubles, and why that is a reason to distrust it.
