# A layer is a resistance

A layer contributes one number to a flowline stack, and it comes from two things: a ratio of diameters read as a logarithm, and a conductivity.

{{panel:pd-thermal-explorer}}

## Two diameters and a k

`layerResistance` takes an inside diameter, an outside diameter and a conductivity k in Btu/(hr ft degF), and returns ln(Do/Di) / (2 pi k) in hr ft degF/Btu per foot of pipe. No fluid, no rate, no temperature and no clock enters it.

On the published pipe the carbon steel wall runs 6.065 in to 6.625 in at k 26.0000 and returns 0.000540611570. The syntactic polypropylene foam runs 6.625 in to 8.625 in at k 0.0900 and returns 0.4665266247.

## Where 862.960859 comes from

Two ratios, multiplied. The log term of the steel wall, ln(6.625 / 6.065), is 0.0883158295, and the log term of the foam, ln(8.625 / 6.625), is 0.2638145910, so the foam is 2.98717220 ahead on geometry alone. The conductivity ratio, steel over foam, is 288.88888889. Their product is 862.960859, and dividing the two engine resistances directly gives 862.960859.

Geometry accounts for the smaller of those two ratios. The material accounts for the larger and for almost all of the product.

## The catalog is a set of defaults

Every layer takes its own k as an input. These are the layer materials the engine offers as defaults, in Btu/(hr ft degF).

| Material | k |
| --- | --- |
| Carbon steel | 26.0000 |
| Concrete weight coat | 0.9000 |
| Solid polypropylene | 0.1300 |
| Syntactic polypropylene foam | 0.0900 |
| Polyurethane foam | 0.0700 |
| Aerogel blanket | 0.0120 |

Aerogel sits at 0.00046154 of carbon steel. That span, three and a half orders of magnitude in one column, is why a thin coating can carry a stack that a steel wall cannot.

## The mistake

Trusting an id you typed. `conductivity` has no fallback: an id outside the catalog, `aerogelBlanket` for one, comes back as n/a, which is a NaN, and it is a NaN on purpose. A silent fallback to the first catalog entry would hand back carbon steel for a layer meant to be aerogel, and those two differ by 2166.666667, so the layer resistance would come back smaller by that factor with nothing in the return to say so. A NaN can propagate into a refusal. A plausible wrong number cannot.

## What it refuses

A layer whose outside diameter is not larger than its inside is refused rather than returned as zero: `ok = false`, "A layer could not be resolved: every layer needs an inside diameter, a larger outside diameter and a positive conductivity." An unresolvable conductivity is refused with the same message.

## Exercise

Put 2.0 in of syntactic polypropylene foam on the 6.625 in steel and record the layer resistance, then change the material to polyurethane foam at k 0.0700 and record it again.

Say which of the two ratios, the log term or the conductivity, accounts for that change, and why the other cannot have moved.
