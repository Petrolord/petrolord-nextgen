# One group decides the value

Productivity is inversely proportional to one denominator, so every question about what a stimulation is worth is a question about that one number.

{{panel:pd-diagnostic-explorer}}

## Three terms and no more

`pssDenominator` returns ln(re/rw) less 3/4 plus S, and nothing else. The 3/4 is the pseudo-steady-state constant for a circular drainage area. It is not a fudge factor and it is not adjustable.

On the published geometry, re = 2000.000000 ft and rw = 0.350000 ft, re over rw is 5714.285714286, its logarithm is 8.650724584041, and taking 3/4 away leaves 7.900724584041 at zero skin. The group is dimensionless: no permeability, no thickness, no viscosity, no pressure and no rate enters it.

## Worth is a ratio of two of them

`skinPiMultiplier` divides the before group by the after group. The five published pairs sit on that same geometry.

| Skin before | Skin after | Published multiplier |
| --- | --- | --- |
| 8.000 | 0.000 | 2.012565355861 |
| 5.000 | -2.000 | 2.186294988065 |
| 2.000 | 0.000 | 1.253141338965 |
| 0.000 | 0.000 | 1.000000000000 |
| 12.000 | -3.000 | 4.060771880315 |

The first row is a denominator of 15.900724584 before and 7.900724584 after. The last is 19.900724584 before and 4.900724584 after.

## Two roads onto the same arithmetic

The oracle builds a full radial Darcy rate in SI, permeability in square metres and pressures in pascals, and divides two real flow rates. The engine divides two dimensionless groups. It reproduces published case 1 with a difference of 0.0000e+0, case 3 at -2.2204e-16 and case 5 at -8.8818e-16, and that agreement is one of only two checks the oracle makes anywhere in this module.

The identity pins it. Skin 0.000 to 0.000 returns 1.000000000000000, a departure from one of 0.0000e+0, because it is one number divided by itself.

## The mistake

Reading the group as a productivity index. It is not one, it cannot give you a rate, and it will not tell you whether a treatment is affordable. What it gives is a flow efficiency against an undamaged well on the same geometry: at a skin of 8.0 the denominator is 15.900724584 and the efficiency 0.496878274, and at a skin of 0.0 they are 7.900724584 and 1.000000000.

A careful person then quotes 0.496878274 as though the well made half of something absolute. It is half of what this same well would make at zero skin on this same drainage radius, and nothing else.

## What it refuses

Hand `pssDenominator` a wellbore radius larger than the drainage radius and it returns a bare NaN, with `Number.isFinite` false. A wellbore radius of zero does the same. There is no ok flag and no message, so a caller who does not test the result cannot tell an answer from a refusal.

## Exercise

Work the group by hand at a skin of 2.0 and at a skin of 12.0 and check the two denominators against 9.900724584 and 19.900724584. Then say why the published multiplier for 12.000 to -3.000 is the largest of the five.
