# Two molecular weights of air

One domain, two modules, two values for the molecular weight of air. Nothing goes wrong until something crosses between them.

{{panel:pd-remedy-explorer}}

## The seam

`gasWellLoading.AIR_MW` is 28.9647 and `gasProperties.AIR_MW` is 28.9625. The difference is 0.002200 lbm/lbmol, or 75.9603 parts per million. Both modules compute real gas density from the same relation on the same gas constant, and both are used on gas wells in this domain.

They also disagree at the door. `gasWellLoading` takes an average temperature in degR; `gasProperties` takes degF and divides by 144 to return a gradient. The station this is priced on is golden velocity row 6, at 2500.0 psia, 620.0 degR, z 0.9 and gas gravity 0.65, where 620.0000 degR is 160.3300 degF and `gasProperties.toRankine` turns it back into 620.0000 degR. The conversion is exact. The convention is still two conventions.

## What the seam costs at that station

| Route | Value |
| --- | --- |
| `gasWellLoading.gasDensityLbFt3`, lbm/ft3 | 7.8600213238 |
| `gasProperties.gasGradient` times 144, lbm/ft3 | 7.8594243196 |
| The published SI oracle, lbm/ft3 | 7.8600381043 |

The two engine routes differ by 5.970042e-4 lbm/ft3, a fraction of 7.595452e-5. Carry that into a Turner critical velocity at the same station and it reads 5.2642800885 ft/s on one density against 5.2644933087 ft/s on the other, a difference of -2.132202e-4 ft/s and a fraction of 4.050320e-5.

Those two fractions do not stand in the ratio anyone expects. It is 0.53325597, not one half, because the gas density enters the velocity through one over its square root and again, weakly, through the buoyancy inside the density difference. Both are printed rather than reasoned about for that reason.

## Why this is worth a lesson at all

Not for the size of it. This gap costs nothing on any decision this course makes, and `gasProperties.gasGradient` returns 0.0545793356 psi/ft at that station whether or not you approve of its constant. It is worth a lesson because a constant written two ways is costless while the seam stays closed, and the symptom when it opens is not an error message. It is two right answers parting at the fifth decimal with nothing watching.

## The same module cannot decide how to fail

`turnerFluid` given an unknown fluid id falls back to water rather than refusing. `criticalVelocity` given an unknown correlation refuses: ok = false, error = "Unknown loading correlation "guess". Use turner or coleman." Two policies for one kind of mistake inside one module, which is the module telling you it never decided.

The costs are not comparable either. An unknown correlation caught by a refusal costs nothing. An unknown fluid read silently as water is worth a factor of 1.4626530609 on the terminal velocity at 1000.0 psia and 620.0 degR, on Turner properties of 60.0 dyne/cm and 67.0 lbm/ft3 against 20.0 dyne/cm and 45.0 lbm/ft3. That ratio belongs to that station and does not carry to another.

## Exercise

Write the two densities at 2500.0 psia and 620.0 degR and the fraction between them, then the two critical velocities and their fraction.

Then say why the second fraction is not half the first, and name the term that accounts for the rest.
