# Slope is one over injectivity

The Hall slope is $p/q$, which is the reciprocal of an injectivity index. On the Ekene fixture that identity is exact and checkable to the last digit, which makes it the cleanest demonstration in this tier that a diagnostic can recover a planted physical parameter.

## The injectivity index

$$II = \frac{q}{\Delta p}$$

barrels per day per psi of driving pressure. It is the well's deliverability: how much water it takes per psi you push with. Its reciprocal is a resistance, and that resistance is what the Hall slope measures.

## The Ekene injection pressure model

The fixture generates each injector's wellhead pressure as

$$p_{\text{whp}} = 2050 + \frac{q}{II}$$

with $II = 0.5$ barrels per day per psi for both injectors, and Ekene-4 degrading to $II = 0.35$ from 2025-01-01.

The 2050 psia is a reference: roughly the flowing reservoir pressure the injector is pushing against. The second term is the driving pressure, $\Delta p = q / II$, which is the part that does the work.

## The exact result

Build the Hall plot on $p - 2050$, the pressure ABOVE the reference. Then $p_{\text{above}} = q / II$ and

$$\frac{dI}{dW} = \frac{p_{\text{above}}}{q} = \frac{q / II}{q} = \frac{1}{II}$$

The slope is exactly the reciprocal of the injectivity index, independent of rate.

Run it on Ekene-4:

| quantity | value | equals |
|---|---|---|
| baseline slope | 2.0000000000000013 | $1/0.5$ |
| recent slope | 2.857142857142859 | $1/0.35$ |
| slope ratio | 1.4285714285714286 | $0.5/0.35$ |

and on Ekene-2, whose injectivity never changes:

| quantity | value |
|---|---|
| baseline slope | 2.0000000000000004 |
| recent slope | 2.0000000000000004 |
| slope ratio | 1 |

The planted parameter comes back exactly. The trailing digits in the fourteenth place are the least squares round trip, not a physical deviation, and the correct way to report the baseline is "2.0" while recording the raw double.

## Why the recent third catches the degradation

Ekene-4's injectivity drops on 2025-01-01. The record runs 2023-01 to 2025-12, so the degraded period is the last 12 of 36 months, which is exactly the last third the engine fits.

That is a construction convenience of this fixture and it is worth being honest about. If the degradation had started in mid-2024, the last third would contain a mixture of the two injectivities and the fitted recent slope would land between $1/0.5$ and $1/0.35$, giving a smaller ratio and possibly no alert. The thirds construction detects a change that happens near the end of the record and is progressively blinder to one that happens earlier.

## Reading the alert

At a ratio of 1.4285714285714286, above the 1.2 threshold, the engine raises:

> Injector Ekene-4: Hall slope up 1.43 times vs baseline, declining injectivity (rising skin / near-well plugging).

The message quotes the ratio, so a reader can judge the size rather than only the fact. That is deliberate: a ratio of 1.21 and a ratio of 3.0 both trip the same threshold and mean very different things.

## What a slope ratio does not tell you

**The cause.** Rising resistance is consistent with scale, fines, bacterial plugging, injected solids, a partially closed valve, or a gauge drift. The alert names plausible causes and cannot distinguish them.

**Whether it matters.** Ekene-4 kept hitting its volume target throughout the degradation, by pushing harder. A thirty percent loss of injectivity is only a problem when it starts costing volume or when the required pressure approaches the parting pressure.

**Where the resistance is.** Near-wellbore skin and a change in the reservoir far from the well look identical in $p/q$.

## The misconception to avoid

"The Hall slope measures the formation." It measures everything between the pressure gauge and the reservoir: the tubing, the perforations, the near-wellbore damage zone, and the formation, in series. A partially plugged filter upstream of the gauge changes nothing; one downstream changes the slope. Knowing where the gauge is, is part of reading the plot.

## Exercise

First, from the Ekene-4 baseline and recent slopes, recover both injectivity indices and confirm they are 0.5 and 0.35. Then express the degradation as a percentage loss of injectivity.

Second, suppose Ekene-4's degradation had begun on 2024-07-01 instead, so that the last third of the record contains 12 degraded months out of 12 but the middle third contains 6. State whether the reported ratio would change, and explain your answer in terms of which points the two fits use.
