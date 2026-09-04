# The same seam elsewhere

Three numbers stand for one gradient in this codebase, and two of them are shipped. That is not a plunger lift problem.

{{panel:pd-remedy-explorer}}

## Three values, one quantity

| Where it comes from | Value, psi/ft per unit SG |
| --- | --- |
| 62.4 lbm/ft3 over 144 | 0.4333333333333 |
| Shipped as `PSI_PER_FT_SG` | 0.4330000000000 |
| The exact conversion | 0.4335275040010 |

The same rounded 0.433 sits in `espDesign` in this domain, beside an exact 62.4 over 144 elsewhere in that same module. The ESP course reaches the identical seam from the other side, in head rather than in lift pressure, and adjudicates its own instance a convention on the grounds that both ends of every comparison there are built from the same rounded number, so the bias is uniform and cancels where it is used.

Two modules in one domain carrying a rounded 0.433 is one adjudication, not two local fixes. A decision reached inside one module about a constant that appears in three places is a decision about one place.

## The same shape, in mass

The identical pattern runs in this domain in a different quantity. `gasWellLoading.AIR_MW` is 28.9647 lbm/lbmol and `gasProperties.AIR_MW` is 28.9625, a gap of 0.002200 lbm/lbmol, which is 75.9603 parts per million. Both modules use the same gas constant R of 10.7316 psia ft3 per lbmol degR and both compute real-gas density.

At the published station of 2500.0 psia, 620.0 degR, z 0.9 and gas gravity 0.65, `gasWellLoading.gasDensityLbFt3` gives 7.8600213238 lbm/ft3 and `gasProperties.gasGradient` times 144 gives 7.8594243196 lbm/ft3. The gap is 5.970042e-4 lbm/ft3, a fraction of 7.595452e-5. The oracle publishes 7.8600381043 lbm/ft3 for that station, so one of the two routes is closer, and neither is the reason the other exists.

## Why it costs nothing until it does

Both instances are invisible inside their own module. A study that stays in `plungerLift` is internally consistent, and so is one that stays in `gasProperties`. The cost appears at the seam: a density from one module fed to a velocity in the other, or a lift pressure from one gradient compared against a head from another. The seam is where nobody is looking, because each side is correct by its own arithmetic.

## The mistake

Fixing one site. Changing `PSI_PER_FT_SG` in `plungerLift` alone leaves `espDesign` on 0.433 and leaves the 62.4 over 144 route beside it, so the number of values in circulation stays at three and only their locations change.

## What it refuses

Nothing cross-checks any of this. There is no shared constants module the two air molecular weights are read from, no assertion that two modules in one domain agree, and no warning anywhere. The two production modules also disagree about whether temperature enters in degR or degF at the door.

## Exercise

Write down the three gradient values and say which one has a derivation behind it rather than a rounding.

Then compute the two densities at the published station and record the gap in lbm/ft3.
