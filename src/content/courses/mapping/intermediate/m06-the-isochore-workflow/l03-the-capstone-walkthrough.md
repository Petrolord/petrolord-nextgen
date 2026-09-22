# The capstone walkthrough

The capstone gives you a well set of its own, with both SAND picks for every well, a prospect and a cell size, and asks for six numbers from its isochore. This lesson walks the exercise in the order that produces the fewest mistakes, works it on the Ekene teaching wells, and names the errors that lose fields. None of the Ekene numbers is a capstone answer.

{{panel:mp-isochore-explorer}}

## What is being asked

Grid both SAND surfaces at the stated cell and subtract them into an isochore. Read the panel: the thickness extremes and mean, the thickness at the prospect, how many live isochore nodes sit above the plain mean of the well thicknesses, and that plain mean itself.

| Field | Unit |
| --- | --- |
| Isochore minimum thickness | m |
| Isochore maximum thickness | m |
| Isochore mean thickness | m |
| Thickness at the prospect | m |
| Live isochore nodes above the well mean | count, exact |
| Mean of the well thicknesses | m |

## The order to run it in

**Type the case first.** Choose "Type a well set", replace the Ekene lines with the brief's wells (name, x, y, TOP_SAND, BASE_SAND), type the prospect and the cell size, and confirm the cell-size tile before recording anything. Four of the six fields move if the cell is wrong.

**Work the well mean by hand.** On Ekene it is $(32 + 36 + 29 + 25 + 31 + 34)/6 = 187/6 = 31.166666666666668$ m, and it needs no map at all. Doing it by hand first means the panel is checking you rather than the other way round.

**Switch the surface to the isochore and read four fields in one panel state.** On Ekene at 100 m: minimum 25, maximum 35.897705078125, mean 32.25429068038713 and the value at P-1, 34.050048828125. Taking them together prevents the commonest failure, which is reading one of them from a different cell size.

**Read the count above the well mean last.** It sits in the same panel state and can never exceed the live total printed beside it.

## The self-consistency checks

The mean must lie between the extremes. If it does not, two fields came from different settings.

The map mean and the well mean are both honest and they differ: on Ekene the map mean exceeds the well mean by about a metre. A gap of zero means the two means have been crossed.

The live count times the cell area should be a plausible area for the well pattern.

The thickness at the prospect should equal the base surface minus the top surface there, which is a route to the same field through two different tiles: on Ekene, $1576.6699 - 1542.6199 = 34.0500$.

## The four ways fields are lost

**Reading at the wrong cell size.** On Ekene the maximum is exactly 36 at a 50 m cell and 35.8977 at 100 m. Both are correct readings of different settings and only one answers the brief.

**Reporting the well mean where the map mean is asked, or the reverse.**

**Reporting the isochore minimum as the difference of the two surface minima.** The two surfaces reach their extremes at different nodes.

**Reporting the live node count.** The live total sits on a tile beside the graded one. The field asks how many of those nodes lie above the well mean, a count only the isochore produces.

## Reading the panel honestly

Record the conditions with the numbers: *isochore, the cell size, 800 m limit, the live count*, written once at the top of the answer, and then six values underneath it.

## Exercise

Write out the six capstone fields with their units, then state which one requires no gridding at all and which one has a tolerance of zero.
