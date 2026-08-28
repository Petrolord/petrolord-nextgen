# The story so far

One deck, six sections, 940 lines. This tier read all of it. Here is what it says, in the order the simulator reads it.

## The problem

A Cartesian grid, thirty cells east by thirty north by five layers:

$$30 \times 30 \times 5 = 4500 \text{ cells}$$

Each cell 328.0839895013123 ft square, which is the 100 m the field was mapped on. Field units throughout: feet, millidarcies, psia, stock tank barrels, thousands of standard cubic feet.

## The rock

One depth per column, 900 of them, giving the top of layer 1. The shallowest is 5055.774278215223 ft and the deepest is 5216.535433070866 ft, so the structure has about 161 ft of relief.

Five layers beneath each column, thicknesses and permeabilities from the waterflood course's own layer column:

| layer | dz (ft) | permx (md) |
|---|---|---|
| 1 | 7.411104817049187 | 173.81198701129736 |
| 2 | 9.058016998615672 | 607.7507038307907 |
| 3 | 6.587648726265944 | 250 |
| 4 | 5.764192635482701 | 102.8382190362731 |
| 5 | 5.764192635482701 | 359.5839451276606 |

summing to 34.585155812896204 ft of net pay at a porosity of 0.2. The most permeable layer is the second, not the first.

## The fluids

Oil that carries 400 scf/stb of dissolved gas and saturates at 2000 psia. Above that it behaves as a slightly compressible liquid whose formation volume factor is exactly 1.2 at the initial 3200 psia. A gas table for the gas that would appear if pressure ever fell below the bubble point. Water at 1.02 with a small compressibility. Rock at 4e-6 per psi.

Two saturation tables from the SCAL course's Corey design. SWOF starts at a connate water saturation of 0.35, where the water is completely immobile, and closes at 1. SGOF closes at 0.65, which is one minus the connate water, because that is the most gas this rock can hold.

## The starting state

A datum, a pressure of 3200 psia at it, and an oil-water contact at 5118.110236220472 ft, which is the mapped 1560 m. No gas cap: the reservoir is undersaturated by 1200 psi everywhere. Solution gas constant with depth at the PVT table's top node.

From those few numbers the simulator computes the initial pressure in every cell, decides which cells hold oil, and works out how much oil the model contains.

## The wells

Seven. Six vertical Ekene wells, each completed through all five layers, so five connections each. Four producers on oil-rate control with a bottom-hole pressure floor, two water injectors with a pressure ceiling. One deviated side-track whose completions came from a trajectory rather than from a completion interval.

## The time

Thirty six monthly periods of history, one WCONHIST block and one DATES block each, then a prediction tail of sixty uniform steps. Two thirds of the deck is that schedule.

## What this tier did not ask

Where any of it came from. The tops are 900 numbers derived from six measurements, and this tier took them as given. The oil is one of several defensible descriptions of the same fluid. The layer column is one analysis of a sand.

Those are the Professional tier's questions, and they are the difference between reading a deck and trusting one.

## Exercise

First, write the one-paragraph description of this model you would put at the top of a study report, using one number from each of the six sections.

Second, of everything above, name the two numbers you would most want to check against an independent source before running anything, and say what source.
