# The Apapa recipe

Apapa is the case this tier is built on: an invented Lagos import and blending terminal making an 8000 bbl PMS cargo to the 50 ppm gasoline template from four bought-in components. Every figure is illustrative, and none is a market price or a real grade.

## What the terminal holds

| component | cost $/bbl | SG | RON | MON | sulfur ppm | RVP psi | available bbl |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Reformate | 93.8 | 0.805 | 98.6 | 87.9 | 4 | 3.2 | 3500 |
| FCC gasoline | 84.9 | 0.748 | 92.3 | 80.6 | 110 | 6.2 | 4000 |
| Isomerate | 88.2 | 0.662 | 87.6 | 85.4 | 1 | 12.9 | 1500 |
| Butane | 54.1 | 0.582 | 93.8 | 89.1 | 1 | 52.8 | 400 |

Read it as the kernel reads it. Four columns of volumes are the variables. The cost column is the objective. The quality columns fill the coefficients of the specification rows, each on its declared basis: RON, MON and density on volume, sulfur on mass through the SG column, RVP through its index. The availability column gives each variable its upper bound, and a lower bound of zero sits under each.

The template sets five specifications: RON at least 91, MON at least 81, Sulfur at most 50 ppm, RVP at most 9 psi, and Density between 0.72 and 0.775 kg/l. With the batch row fixing the total at 8000 bbl, that is one equation and six specification rows, because the density range is two rows.

## The answer

| component | volume bbl | volume fraction | cost $ |
| --- | --- | --- | --- |
| Reformate | 3284.6899 | 0.4106 | 308103.9109 |
| FCC gasoline | 3531.1221 | 0.4414 | 299792.2634 |
| Isomerate | 784.1881 | 0.0980 | 69165.3861 |
| Butane | 400.0000 | 0.0500 | 21640.0000 |
| total | 8000.0000 | 1.0000 | 698701.5605 |

The status is optimal. The unit cost is 87.3377 $/bbl. The digest states the rule for the cost column: "Each component's cost $ is its volume bbl times its cost $/bbl, and the total is their sum." The total cost of the cargo is 698701.5605 $.

## What to read first

Read the status. Optimal says a recipe exists and this is the cheapest one the rows allow. Nothing else in the result has meaning until the status is read.

Read the bounds next. Butane sits at 400.0000 bbl, its full availability, and the engine lists it: "Components at their availability: Butane." The engine names no other component in that line. A component at its availability is a bound holding exactly, one of the constraints that pins the vertex.

Read the total. The volumes sum to 8000.0000 bbl, the batch row met exactly as an equation must be, and the volume fractions sum to 1.0000.

Then read the specifications, which is the next lesson's work. Two of them are pressed against their limits and three are not, and which is which says more about this cargo than the recipe does.

## The recipe is a vertex

The kernel returns a vertex, and at a vertex the number of constraints and bounds holding exactly is at least the number of variables. Here there are four variables. The batch row holds. Butane's upper bound holds. The next lesson shows which specification rows hold, and the count is what module one said it must be.

{{panel:crude-recipe-explorer}}

In the panel, load the Apapa pool and read the recipe beside the component table. Change one cost and watch whether the recipe moves.

## Exercise

Read Butane's row in the component table (available 400 bbl) and in the recipe (400.0000 bbl), then Reformate's (available 3500 bbl, recipe 3284.6899 bbl). Say which of the two is at a bound, and say what the engine's line "Components at their availability: Butane." shows about the constraints that pin the Apapa vertex.
