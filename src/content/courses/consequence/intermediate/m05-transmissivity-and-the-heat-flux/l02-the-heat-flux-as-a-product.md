# The heat flux as a product

{{panel:cq-fire}}

Every link of the chain is now in place. The burning flux set the flame length, the wind set the tilt, a named method set the surface emissive power, the geometry set the view factor and the caller stated a transmissivity. The heat flux is what they make together, and the engine makes it by one multiplication.

## Three factors

The engine's model string reads "solid flame: q = SEP x F x tau". The heat flux q, in W/m2, is the surface emissive power times the view factor times the transmissivity. The engine's `solidFlameHeatFlux` takes the three as given; `poolFireSolidFlame` chains every step from a pool to a heat flux and returns each factor beside the answer. Because the heat flux is a product, a relative error in any factor becomes the same relative error in the heat flux. A surface emissive power that is high by some share gives a heat flux high by the same share, whatever the other two factors are.

## ERHA end to end

ERHA, the stated heptane bund fire of 20 m, burns with its Babrauskas burning flux, in a 4 m/s wind, with the tilt at a viscosity of 0.000015 m2/s, the sooty surface emissive power and a STATED transmissivity of 0.8. Targets sit downwind at distances from the pool centre:

| distance from centre m, stated | surface emissive power W/m2 | Fmax | heat flux W/m2, or the refusal field |
| --- | --- | --- | --- |
| 25 |  |  | `tiltDeg` |
| 40 | 52025.691247 | 0.250188055557 | 10412.965226 |
| 60 | 52025.691247 | 0.088888022627 | 3699.568657 |
| 100 | 52025.691247 | 0.022463264091 | 934.933474 |
| 150 | 52025.691247 | 0.008332606429 | 346.807687 |

The flame length, 32.511563 m, and the tilt, 49.174202 degrees, are the same in every row. Only the view factor changes with distance, so the heat flux falls exactly as Fmax does. At 25 m the tilted flame reaches over the target, and the chain stops at the view factor with the field `tiltDeg`.

## What the engine holds fixed

The flame base radius is D/2. The engine does not elongate the base in the wind, which matches the Yellow Book's own worked step. The heat flux uses Fmax, the most exposed orientation of the target. The transmissivity here is stated, so the heat flux carries no Bagster fit inside it and can be graded.

## A view factor above one

The heat flux function checks its inputs. A view factor is a fraction, and anything outside zero to one is refused, naming `viewFactor`:

> viewFactor: must lie in [0, 1]

## Quoting a heat flux

A heat flux without its chain is hard to check. A consequence note gives the heat flux with the surface emissive power method, the flame length and tilt, the view factor orientation and the transmissivity with its source. Two notes that disagree on a heat flux can then be traced to the factor where they part.

## Exercise

Take the 60 m row. Multiply the surface emissive power, the Fmax and the stated transmissivity of 0.8 on your calculator, keeping every digit, and compare your product with the engine's 3699.568657. The heat flux view runs the sooty method only, so make the Mudan case by hand: read ERHA's Mudan power in the panel's first view, multiply it by the same Fmax and 0.8, and explain the change in the heat flux using the product.
