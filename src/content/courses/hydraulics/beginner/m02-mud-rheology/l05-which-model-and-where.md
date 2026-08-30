# Which model, and where

Three curves, one crossing point, and the part of the range that matters.

{{panel:hy-rheology-explorer}}

## The three curves for kcl_polymer

| shear rate | power law | Bingham | Herschel-Bulkley |
|---|---|---|---|
| 5 /s | 0.5979 Pa | 6.2548 Pa | 2.9005 Pa |
| 10 /s | 1.0070 Pa | 6.3847 Pa | 3.1751 Pa |
| 100 /s | 5.6899 Pa | 8.7233 Pa | 6.8455 Pa |
| 511 /s | 19.4039 Pa | 19.4032 Pa | 19.4037 Pa |
| 1022 /s | 32.6803 Pa | 32.6815 Pa | 32.6807 Pa |

Read the bottom two rows. At the two rates the models were fitted at, all three agree to four significant figures, because two of them were fitted there exactly and the third passes close.

Read the top row. At 5 per second they differ by a factor of ten.

## Where each part of the well runs

**Inside the drill pipe** the shear rate is in the hundreds to thousands per second. All three models agree there, so the pipe pressure loss barely depends on which one you pick.

**Across the bit** the model is irrelevant: the nozzle loss is an inertial term with no viscosity in it at all.

**Up the annulus** the shear rate is in the tens per second. That is exactly where the three models disagree most.

## The consequence

The choice of rheology model is a choice about the ANNULUS, and the annulus is what sets the equivalent circulating density.

So the model choice barely moves the pump pressure and moves the number the formation feels.

That is the opposite of the intuition that a model fitted to the high-rate readings must be safe because the high-rate readings are the biggest.

## The apparent viscosity

The stress divided by the shear rate: what a Newtonian fluid's viscosity would have to be to give the same stress at that rate.

For kcl_polymer under Herschel-Bulkley it is 0.58010665711728 Pa.s at 5 per second and 0.03197720649909612 Pa.s at 1022 per second, a ratio of 18.141254994668703. Eighteen times thinner at the high rate.

That is what shear thinning means, and it is the property that makes a drilling mud work: thick in the annulus where it has to carry cuttings, thin in the pipe where it has to be pumped.

## The local power law

The engine does not use one n and K for the whole well. For each element it computes a LOCAL n prime and K prime from the Herschel-Bulkley model at that element's shear rate, and uses those in the friction factor.

That is why the reported n prime varies down the well: 0.10 at 5 per second and 0.77 at 1022. A single fitted n would be wrong nearly everywhere.

## Exercise

From the table above, compute the ratio of the Bingham to the power-law stress at 5, 10 and 100 per second.

Then say at what shear rate the two models agree within one percent, and check it against the panel's curve view.
