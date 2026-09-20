# The index slope

The sulfur row needed one scale to turn its dual into dollars per ppm. The RVP row needs two, because the limit sits inside it in index units. This lesson reads the second factor, the slope of the index at the limit.

## The RVP row in index units

Module two built the RVP row on the index basis: w_i is each component's rvpIndex, d_i is 1, and the 9 psi limit enters as its own index. So the row's natural unit is an index point, and its dual prices index points.

The digest takes the first step. The RVP row's rowPrice at Apapa is -0.2569. Its scale is sum(d_i v_i), and with d_i equal to 1 that is the batch volume, 8000.0000 bbl. rowPrice x 8000.0000 bbl is -2054.8893 $ per index point.

That figure is still not the answer a planner asks for. The specification is written as 9 psi, and the question is what one psi is worth.

## From index points to psi

One psi of relief on the limit moves the limit's index by the slope of the index at that limit, dIndex/dL. Multiply the value per index point by index points per psi, turn the sign for relief on a maximum, and the result is dollars per psi.

The engine reports 4448.9659 $ per psi on the RVP maximum. The digest recovers the slope two ways:

- Divided by the negative of the per-index figure, the reported value gives 2.1651 index points per psi, the slope of the index at the 9 psi limit.
- The same slope from the exported exponent, RVP_INDEX_EXPONENT x 9^(RVP_INDEX_EXPONENT - 1), is 2.1651.

Both routes print 2.1651: one read back from the engine's price, the other the derivative of RVPI = RVP^n at 9 psi. Their agreement shows that the reported price carries exactly the index slope the rule says it should.

## Why the slope is taken at the limit

The index is curved in RVP, so its slope depends on where it is read. The relief that matters is relief on the limit, so the slope is read at the limit, 9 psi, and nowhere else. A price read at any other point would be a price for a different specification.

This also explains why a whole psi of relief need not save exactly the reported figure. Across a whole psi the index slope changes, and lesson five shows the re-solve at 10 psi and at 8 psi.

## The same idea on mass

Viscosity in the AGO pool blends through the Refutas index on mass, so its row would carry both scales at once, sum(SG x volume), which is 5070.0000 on the AGO recipe, and the slope of the Refutas index at the limit. At the AGO optimum that row is not binding and its value of relief is 0.0000 per cSt. The rule is the same: price = rowPrice x sum(d_i v_i) x dIndex/dL.

{{panel:crude-recipe-explorer}}

In the panel, select the RVP row and change the exponent. Watch the slope at the limit and the price per psi move together.

## Exercise

Read the RVP figures: -2054.8893 $ per index point, 4448.9659 $ per psi, and the slope 2.1651 index points per psi from both routes. Keep three figures apart: rowPrice -0.2569 per unit of the row, which is not a price, and the two above. Say what each figure measures, and say what the agreement of the two slope figures shows about how the engine built the price per psi.
