# The channel back-out

The forecast says 63.72 years. The field says 425 days. This lesson closes the gap by inverting the forecast: instead of asking when breakthrough happens for a given pore volume, ask what pore volume would give the observed breakthrough. The answer is the strongest result in the course.

## The inversion

The pattern breakthrough condition is

$$W_{i,bt} = Q_{i,bt} \times PV \times E_{Abt}$$

Everything except $PV$ is known. $Q_{i,bt} = 0.33077027444818546$ pore volumes comes from the Welge construction in the SCAL course, and $E_{Abt} = 0.6573574366303985$ from the Craig correlation at $M = 1.2$. So

$$PV_{\text{implied}} = \frac{W_{i,bt}}{Q_{i,bt} \, E_{Abt}}$$

and $W_{i,bt}$ is now not a model output but a measurement: the water actually delivered to Ekene-6 by the day it made water.

## The measured injection

Ekene-6 saw water on 2024-03-01, 425 days after the flood start. Over the months before that date, the allocation matrix routes to Ekene-6 a share of 0.45 from Ekene-2 and 0.35 from Ekene-4. Summing those shares over every injection row before the breakthrough date:

$$W_{i,\text{allocated}} = 35106.29313483455 \text{ bbl}$$

At $B_w = 1.02$ that is 35808.41899753124 reservoir barrels.

## The answer

$$PV_{\text{implied}} = \frac{35106.29313483455 \times 1.02}{0.33077027444818546 \times 0.6573574366303985} = 164686.15596920124 \text{ rb}$$

Against a pattern element of 11205422.76570545 rb, that is

$$\frac{164686.15596920124}{11205422.76570545} = 0.014697005138728762$$

**1.4697005138728763 percent.**

The water that reached Ekene-6 by its breakthrough date could have contacted at most one sixty-eighth of the pattern element. If it had contacted more than that, it would not have arrived yet.

## Why "at most"

The inversion assumes the water that arrived did so having swept a region with the full Buckley-Leverett profile behind it, at the areal sweep the correlation gives. Every one of those assumptions is generous to the sweep. If the water channelled through a narrow path with a poorer displacement profile, the contacted volume is smaller still.

So 1.47 percent is an upper bound on the contacted fraction, derived from the observed date and the allocated volume, and it is the least favourable interpretation for the "the flood is working" hypothesis.

## What this is, as evidence

It is a volumetric argument. It uses:

- a date, from the production record
- a volume, from the injection record and the allocation matrix
- two dimensionless numbers, from published correlations and the displacement construction
- a pore volume, from the geoscience booking

It uses no curve shapes, no classification thresholds, no fitted parameters, and no judgement beyond the allocation matrix.

That last dependence is worth sizing. Suppose the allocation is badly wrong and Ekene-6 actually received ALL of the field's injection before its breakthrough, rather than the 0.45 and 0.35 shares. That is 85625.10520691355 barrels rather than 35106.29313483455, a factor of 2.439024390243903, and the implied swept fraction becomes 3.584635399689942 percent. Still under a twenty-eighth of the element.

To make the swept fraction reach even a quarter of the element, Ekene-6 would have had to receive 17.010268258069352 times its allocated share, which is seven times more than the whole field injected. The conclusion is robust to the allocation by a wide margin, which is exactly what you want from a result that depends on a judgement.

## What it means physically

Water moving from an injector to a producer through 1.5 percent of the intervening pore volume is moving through a preferential path: a thin high permeability streak, a fracture, a fault, or communication behind casing.

It also means the water is not doing the job it was injected to do. The pressure job, yes: the voidage ledger confirms the field replaced its voidage and the pressure recovered 34.4931292839633 psi. The displacement job, no. Water that contacts one sixty-eighth of the rock displaces oil from one sixty-eighth of the rock.

That is the two-jobs distinction from the first lesson of the Associate tier, now with a number attached to each.

## The design consequence

If most of the injected water is short-circuiting, the correct response is conformance control rather than more injection. Increasing the rate sends more water down the same path. The candidate treatments are the ones from the Professional tier's channelling discussion: profile modification, selective completion, shutting off the offending interval, or a gel treatment.

None of those is priced here, and the engine that would price them does not exist centrally. What this lesson delivers is the case for doing the work, not the design of the treatment.

## The misconception to avoid

"1.5 percent seems too small to be real." It is a bound on the volume contacted by the water that arrived FIRST, not on the volume the flood will eventually contact. Water continues to arrive along the same path and slowly widens it, and other paths open. What the number says is that the earliest arrival came through a very small fraction, which is the definition of a channel, and it says nothing about the flood's ultimate sweep.

## Exercise

First, reproduce the implied pore volume from the four inputs, and express it as a thickness: if the channel occupies the full area between the wells, how thick would it be at 20 percent porosity? Compare that with the 84 foot net pay.

Second, recompute the implied fraction under the assumption that Ekene-6 received the entire field injection before its breakthrough date, and state how far the allocation would have to be wrong to change the conclusion.
