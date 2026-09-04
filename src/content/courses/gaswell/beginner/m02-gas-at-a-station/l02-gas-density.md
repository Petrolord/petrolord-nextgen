# Gas density

`rho = p M / (z R T)`. Four station numbers and one molecular weight, and the domain carries two molecular weights.

{{panel:pd-droplet-explorer}}

## The published spot check

At 1000.0 psia, 600.0 degR, z 0.88 and gas gravity 0.65 the independent oracle publishes 3.3226524714 lbm/ft3 and the engine returns 3.3226453778 lbm/ft3, a difference of -7.0936e-6 lbm/ft3. One implementation is in SI with no `gc` anywhere, the other in field units carrying `gc` explicitly, and they agree to six decimal places. `R` is 10.7316 psia ft3 / (lbmol degR) in both production modules, so it is not a source of disagreement.

## Two molecular weights of air

`gasWellLoading.AIR_MW` is 28.9647 lbm/lbmol and `gasProperties.AIR_MW` is 28.9625 lbm/lbmol, a gap of 0.002200 lbm/lbmol or 75.9603 parts per million. Both are defensible roundings of one physical constant, and neither module is wrong on its own.

Priced at one published station, 2500.0 psia and 620.0 degR at z 0.9 and gas gravity 0.65, with pressure, temperature, compressibility and gravity identical on both routes:

| Route | Density, lbm/ft3 |
| --- | --- |
| `gasWellLoading.gasDensityLbFt3` | 7.8600213238 |
| `gasProperties.gasGradient` times 144 | 7.8594243196 |

The gap is 5.970042e-4 lbm/ft3, or 7.595452e-5 of the density. Gas density enters the critical velocity as one over its square root, and again, more weakly, through the buoyancy inside the density difference. The Turner velocity reads 5.2642800885 ft/s on one route and 5.2644933087 ft/s on the other, a difference of -2.132202e-4 ft/s, which is 4.050320e-5 of the velocity against 7.595452e-5 of the density. Those fractions stand at 0.53325597, the one half from the inverse square root plus the buoyancy term.

## The other half of the seam

The two doors also disagree about temperature. `gasWellLoading` takes degR. `gasProperties` takes degF, converts internally, and returns a gradient in psi/ft rather than a density, 0.0545793356 psi/ft at that station. The station is 620.0000 degR and 160.3300 degF, and `gasProperties.toRankine` takes it back to 620.0000 degR exactly, so the conversion is sound. What is not labelled is which convention a number was born in.

## Why this costs nothing today

Nothing in the loading path calls both routes for one station. A critical velocity is built inside `gasWellLoading` on its own 28.9647 lbm/lbmol, and a gradient is built inside `gasProperties` on its own 28.9625. Two forms of one physical constant inside one domain is free while the seam stays closed, and 5.970042e-4 lbm/ft3 is far below what a field pressure or temperature could resolve.

## The mistake

Treating that as a reason not to know about it. The seam is where nobody is looking, precisely because both numbers are right and both modules pass their own tests. It costs nothing until something crosses it, and the symptom then is not an error. It is two answers for one station agreeing to four decimals and parting at the fifth, with no test in either module watching that place.

## Exercise

Compute the density at 2500.0 psia and 620.0 degR both ways and record the gap in lbm/ft3 and as a fraction.

Then say why 620.0 handed to the wrong door is a larger problem than 0.002200 lbm/lbmol.
