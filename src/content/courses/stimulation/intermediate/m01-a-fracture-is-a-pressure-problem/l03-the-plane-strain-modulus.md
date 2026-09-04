# The plane strain modulus

Every width equation in this tier divides by E prime, and E prime is not Young's modulus.

{{panel:st-frac-explorer}}

## The definition

The plane strain modulus is Young's modulus divided by one minus the square of the Poisson ratio:

    E' = E / (1 - nu^2)

One elastic modulus and one Poisson ratio in, one stiffness out. The engine computes it in `planeStrainModulus` before any geometry is touched, and both fracture models take E prime rather than E.

## The published pair

| Quantity | Value |
| --- | --- |
| Young's modulus E | 25 GPa |
| Poisson ratio nu | 0.28 |
| Plane strain modulus E prime | 27.126736 GPa |

At a Poisson ratio of 0.28 the denominator is 1 minus 0.0784, so E prime sits a little under nine per cent above E. At the Poisson ratios of ordinary sandstones and carbonates the correction stays in that region, a few per cent.

It never becomes dramatic. Even at the incompressible limit the denominator is only 0.75, so E prime cannot exceed four thirds of E for any admissible rock.

## Why so small a correction is still worth making

Two reasons, and the first is not accuracy.

It is consistency. The published width coefficients 2.31 and 3.22 were derived with E prime in the denominator. Feed them E instead and you are not using a slightly stiffer rock, you are using a formula whose constants no longer belong to it.

The second reason is that the correction costs nothing. You already have the Poisson ratio, because the stress profile needed it.

## How hard it pushes on width

Width goes as the plane strain modulus to the minus one quarter power in both models, and the fourth root is a strong damper. A gap of a few per cent between E and E prime arrives at the width as roughly a quarter of that percentage, well inside the uncertainty on the modulus itself.

So the correction will not rescue a bad log derived modulus, and it is not meant to. It is bookkeeping done properly.

## What the engine refuses

`planeStrainModulus` throws if Young's modulus is not positive, and it throws if the Poisson ratio is outside the open interval from 0 to 0.5. Both refusals are physical. A Poisson ratio of 0.5 is incompressible, and above it the elastic constants are inadmissible, so there is no sensible value to return.

## Exercise

Confirm the published pair by hand: divide 25 GPa by 1 minus 0.28 squared and check you land on 27.126736 GPa.

Then repeat it at a Poisson ratio of 0.15 and at 0.35, and state how much of the width difference survives the fourth root.
