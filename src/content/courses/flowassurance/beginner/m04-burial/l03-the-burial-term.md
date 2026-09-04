# The burial term

The ground resistance is acosh(2H/D) divided by 2 pi k. Two lengths, one conductivity, an inverse hyperbolic cosine, and nothing else at all.

{{panel:pd-thermal-explorer}}

## Where the shape factor comes from

It is the classical conduction shape factor for an isothermal cylinder in a semi-infinite medium, obtained by the method of images: the pipe and a mirror of it above the surface, arranged so the surface sits at ambient. H is the depth to the CENTRELINE of the coated pipe, D is the coated outside diameter, and the argument cares only about the ratio 2H/D.

## The argument, and what it does to the answer

The published coated diameter is 8.625 in in wet soil at k 1.2. Only the depth moves.

| Depth to centreline, ft | 2H/D | acosh(2H/D) | Ground resistance |
| --- | --- | --- | --- |
| 0.359375 | 1.00000000 | 0.0000000000 | 0.0000000000 |
| 0.400000 | 1.11304348 | 0.4711170417 | 0.0624838383 |
| 0.500000 | 1.39130435 | 0.8580828860 | 0.1138067774 |
| 1.000000 | 2.78260870 | 1.6825620278 | 0.2231567198 |
| 2.000000 | 5.56521739 | 2.4015118047 | 0.3185103955 |
| 3.000000 | 8.34782609 | 2.8115413651 | 0.3728922550 |
| 4.000000 | 11.13043478 | 3.1008062984 | 0.4112572083 |

Resistances in hr ft degF/Btu per foot. The 4.0 ft row is the published build, every other row a derived sweep point on published inputs. The acosh column carries the whole shape of the answer; dividing by 2 pi k only scales it.

## The floor at H equal to D/2

Half the published coated diameter is 0.35937500 ft. There the pipe rests on the seabed, 2H/D is exactly 1.00000000, acosh(1) is zero, and the ground resistance is zero. That is correct rather than a limitation: a pipe on the bottom has no soil above it to conduct through, so the buried build returns the same 1.3348791131 Btu/(hr ft2 degF) as the exposed one.

It is also the check that the shape factor is right. The golden publishes the limit in SI as 1.6148921380e-9 K m / W and the engine returns 0.000000000000 hr ft degF/Btu per foot. Both are floating point residue of an exact zero, different sizes because the two arithmetics reach acosh(1) by different routes, and neither is a disagreement to be converted into the other.

Below that floor the argument falls under 1, where acosh has no real value, so there is no ground resistance to compute.

## The mistake

Reading the trench term as though it scaled with depth. Between 1.000000 ft and 2.000000 ft the depth doubles and acosh moves by a factor of 1.42729466. Price a deeper trench by scaling 0.2231567198 with depth and you have bought a resistance the soil will never deliver, and quoted a U that is too low.

## What it will not tell you

Whether the trench is stable, whether the line stays in it, or whether the soil above it is the soil that was measured. It is a geometry and a conductivity, and returns a number for any pair of them.

## Exercise

Read the ground resistance at 1.000000 ft and at 2.000000 ft in the panel, then at 0.359375 ft.

Then write down what acosh(2H/D) is at the last of those, and say in one sentence why that is physics rather than a failure.
