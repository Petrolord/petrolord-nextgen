# One number for a whole line

A relaxation length compresses a pipe, a fluid and a rate into one distance. The length of the line divided by that distance is the only number the arrival needs.

{{panel:pd-line-explorer}}

## What the distance contains

Lc is m Cp over U pi D: the fluid in the first two, the build in the third, the geometry in the fourth. It contains no length, no inlet and no ambient.

On the published insulated build at 120000.0 lb/hr and Cp 0.50 through the 6.065 in bore the golden relaxation length is 28308.04630582 ft. The shipped engine on the same inputs returns 28308.04610085 ft, a relative difference of 7.240504e-9. The oracle works in SI and converts only at the boundary, so that residue is a unit system crossed and not a disagreement about physics.

## The line as one dimensionless number

The published fluid, 180.0 degF in against a 40.0 degF ambient at 120000.0 lb/hr and Cp 0.5, at three published lengths. The ntu column is golden, the retained column is derived.

| Length, ft | ntu, golden | Excess retained, derived |
| --- | --- | --- |
| 5280.0 | 0.186519406637 | 0.829842457344 |
| 26400.0 | 0.932597033183 | 0.393530370692 |
| 105600.0 | 3.730388132730 | 0.023983525239 |

Two lines with different pipes, fluids and lengths that land on the same ntu arrive at the same fraction of their inlet excess. At ntu 1 the retained excess is 0.367879441171, which is where the 63 percent in the module header comes from: 63.21205588 percent has gone.

## What the one number assumes

One U for the whole length, one ambient, one heat capacity, no pressure term. No pressures are set in any published case, so the Joule-Thomson term is exactly zero in every published row and the pressure column is NaN in all 21 stations of the published profile, printed rather than hidden.

## The mistake

Reading U as a property of the fluid. It is a property of a build. The same 2.0 in syntactic foam layer holds a resistance of 0.4665266247 hr ft degF/Btu per foot wherever it appears, while its share reads 98.88212788 percent insulated, 52.83080440 percent with a 4.0 ft trench added, and 78.37609570 percent on a derived build with a stagnant bore.

The build also names an area. On the published buried build, U times its own reference diameter is 0.360463185702 Btu/(hr ft degF) per foot at the 6.065 in bore and 0.360463185702 at the 8.625 in coated outside diameter. That product is the line. A U is that product divided by whichever diameter was named, in ft.

## What it refuses

`relaxationLengthFt` returns a bare NaN, not an object with a reason, for a zero U, a zero mass rate or a zero heat capacity. There is nothing to check `ok` on.

## Exercise

Compute the relaxation length for AKASO SPUR and then its ntu, and say which of the two you would quote to somebody comparing it against another line.

Then say what has to be true of the seabed for a single ntu to describe the whole line.
