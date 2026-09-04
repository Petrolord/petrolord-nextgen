# A ratio of two groups

`skinPiMultiplier` is one dimensionless group divided by another. Productivity is inversely proportional to `pssDenominator`, which is ln(re/rw) less 3/4 plus the skin, so the uplift from a treatment is the denominator before over the denominator after.

{{panel:pd-channel-explorer}}

## The group, on the published geometry

The golden publishes one geometry: a drainage radius of 2000.000000 ft and a wellbore radius of 0.350000 ft. That is a radius ratio of 5714.285714286, a natural logarithm of 8.650724584041, and after the 3/4 a denominator of 7.900724584041 at zero skin. The 3/4 is the pseudo-steady-state constant for a circular drainage area. It is not adjustable and it is not a fudge.

The skin enters undivided, and that is why the radii matter so little. A twentyfold change in drainage radius, from 500 ft to 10000 ft at the published wellbore radius, moves the zero-skin denominator by 2.995732274, which one unit of skin more than covers.

## The five published pairs

| Skin before | Skin after | Published multiplier | Engine difference |
| --- | --- | --- | --- |
| 8.000 | 0.000 | 2.012565355861 | 0.0000e+0 |
| 5.000 | -2.000 | 2.186294988065 | -4.4409e-16 |
| 2.000 | 0.000 | 1.253141338965 | -2.2204e-16 |
| 0.000 | 0.000 | 1.000000000000 | 0.0000e+0 |
| 12.000 | -3.000 | 4.060771880315 | -8.8818e-16 |

## Why that agreement is worth something

The published column was not produced by the same arithmetic. The oracle builds a full radial Darcy rate in SI, permeability in square metres and pressures in pascals, computes two real flow rates and divides them. The engine divides two dimensionless groups and never forms a rate at all. Two independent routes onto the same physics, holding to machine precision across all five pairs.

That is one of only two places in this module where a returned number is checked against anything. The diagnosis, the screening and the ranking are asserted against nothing.

## The identity that anchors it

The row with skin 0.000 before and after returns exactly 1.000000000000, with a departure from one of 0.0000e+0, because it is one number divided by itself. Any implementation that cannot reproduce that bit for bit has an error term in it somewhere.

## What the group refuses to do

`pssDenominator` and `minimumSkin` return a bare NaN when the wellbore radius is larger than the drainage radius, and `pssDenominator` returns a bare NaN for a wellbore radius of zero. There is no ok flag on either function and no error text. A caller that does not run a finite check on the result cannot tell a refusal from an answer, which is a different failure contract from the one `skinPiMultiplier` uses.

## The mistake

Reading the multiplier as a rate forecast. It is a ratio of two productivity indices at the same drawdown. Nothing in it knows the permeability, the thickness, the fluid or whether the well can lift what the sandface delivers.

## Exercise

Compute the denominator at zero skin on the published geometry and check it against the published minimum skin of -7.900724584041.

Then say what the multiplier would be if the treatment changed nothing.
