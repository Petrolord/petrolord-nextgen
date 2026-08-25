# Trend per block

The trend fitted so far used all four wells, which is the capstone's framing for the probe. The population engine, though, never fits across a fault: it runs the trend PER BLOCK, and this lesson follows what that does on the golden model, where the answer is quietly instructive on both sides of the line.

{{panel:em-population-explorer}}

## Block 0: three points, zero degrees of freedom

Block 0's control set is W2, W3, W4: exactly three points for three coefficients. The fit is no longer least squares in any meaningful sense; it is INTERPOLATION, the unique plane through three points, and residuals are zero by construction rather than by data structure. On this fixture the distinction is invisible, because the three points lie on the same generating plane as the fourth, so the block 0 plane IS the field plane, coefficients 0.38, minus 0.00004, minus 0.00001 again.

But mark the epistemic downgrade even though the numbers repeat. With four points, module two could at least OBSERVE that the residuals were suspiciously zero. With three, zero residuals are guaranteed for ANY three values, planar or not; the fit can no longer be suspicious of anything. One well fewer did not change the map, but it removed the map's last capacity for self-criticism. In per-block work this is the normal condition: blocks have few wells, per-block fits are exactly determined or nearly so, and goodness-of-fit inside a block is routinely an illusion of small n.

## Block 1: one point, and the ladder speaks

Block 1's single point cannot support a plane, and the engine's planeFit throws its documented error at fewer than three wells. The population ladder catches it and falls back: block 1 gets the constant method, value 0.315, and the provenance records method constant, wells 1, fellBack TRUE. Select the trend method in the panel and read the provenance tile: block 0 reports trend without a star; block 1 reports constant with one. Same flat 0.315 map as ever, different pedigree, and the pedigree is the information.

## The seam at the fault

Put the two block maps together along the profile row: block 1 flat at 0.315; block 0's plane crossing the fault boundary at $0.38 - 0.00004 \times 1575 - 0.00001 \times 2200 = 0.295$. The trend seam at x 1575 is therefore a jump of 0.020, from 0.315 down to 0.29499...; the panel's jump tile at the trend setting reads minus 0.020999999999999852, the same number one node spacing further east where the profile actually samples, 0.294 at x 1600 against 0.315. Compare the seams across methods, all readable in the tile as you switch: constant minus 0.0287, trend minus 0.0210, krige minus 0.0230. Three methods, three different-sized cliffs at the same administrative line. The nearest data to the seam is W2's control point, 35.87 m east of it; the west side's nearest support, W1, is over 450 m away. The seam's SIZE is a method artefact computed in a data gap; its EXISTENCE is the model's honest refusal to claim continuity across a fault.

## Worked example

Compute the trend seam's size without the panel, from quantities already derived: block 1's constant is 0.315; block 0's plane at the boundary column's first block 0 node, (1600, 2200), is $0.38 - 0.064 - 0.022 = 0.294$. Seam: $0.294 - 0.315 = -0.021$. Now predict the seam at the NORTHERN arm's boundary, x 1275 at y 2600: block 0's plane there is $0.38 - 0.051 - 0.026 = 0.303$; seam $0.303 - 0.315 = -0.012$. The seam SHRINKS northward, because block 0's plane climbs back toward W1's value as it goes west and the arm's boundary sits further west than the panel's. A fault seam in a trend model varies along the fault; a single "the discontinuity is 0.02" line in a report would be wrong at most latitudes.

## Exercise

State what block 0's provenance would read if W2's control point were moved into block 1 by the survey revision imagined in module three (leaving W3 and W4), and derive the block 0 trend's status in that world: how many points, what kind of fit, and what single check disappears with the third point. Three sentences.
