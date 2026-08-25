# The population panel map

This tier's panel carries the whole second half of the course, so this lesson tours it before the modules that use it in anger.

{{panel:em-population-explorer}}

## The three controls

The method control chooses how zone A porosity is populated per block: simple kriging, a plane trend, or a constant. The other two controls are the variogram's assumed numbers, the nugget and the range, exposed because they are ASSUMPTIONS: nothing in four control points pins either, and the panel exists to show what each assumption is worth. Method, nugget, range: one epistemic control and two dials on the least-constrained model input, which is this course family's standard shape for a panel.

## The profile

The drawing is not a map but a PROFILE: porosity along the single model row at y 2200, west edge to east edge. That row is chosen with intent. It crosses the fault at x 1575, so the per-block discontinuity is visible as a break in the curve; and it passes exactly through W2's zone A control point at (1610.87, 2200), so the one data point east of the fault boundary on this row is drawn where it actually stands. The blue segment is block 1, the green segment block 0, and the white dots are control points on this row with their values.

Watch three shapes as you play with the controls. Block 1's segment never moves: a flat line at 0.3150, whatever the method or parameters. The kriged block 0 curve pins itself to W2's dot and relaxes away from it. And the break at the fault changes height with the method but never closes, because the two blocks share no data.

## The tiles

The tiles are the tier's graded quantities and their cross-checks: the census pair; the two per-block porosities; the jump across the fault on the profile row; the provenance line, which reports the method ACTUALLY used per block with a star when a fallback fired; the kriged value at W1 against W1's own 0.3150; the far-field kriged value; the arithmetic against weighted means, which module five will show are two different numbers used by two different parts of one engine; the trend probe with its hand value; and the per-block bulk volumes with the closure check that must read zero.

## First experiments

Three quick passes to calibrate your hands. Switch the method from kriging to trend and watch the provenance tile: block 0 changes method, block 1 reports constant with a fallback star, because one point cannot fit a plane. Drop the range to 300 m and watch the kriged block 0 curve collapse toward a flat line at the arithmetic mean everywhere far from W2's point. Raise the nugget step by step and watch the curve peel away from W2's dot faster and faster while the AT-well tile stays pinned at 0.3150 throughout: the nugget changes the neighbourhood, never the honoured value.

## Worked example

Use the panel to answer a question the tiles do not directly display: what porosity does block 0's kriged map carry at the fault's edge on this row? Read the green curve where it begins, just east of the orange fault line, with default parameters: about 0.292, close to W2's 0.2936 because the first block 0 node at x 1600 sits only 11 m from W2's control point at x 1610.87. The blue side of the break reads 0.3150. The break is therefore about 0.023 of porosity, and the jump tile confirms minus 0.023016035393453593. Nothing physical happens at x 1575; the jump is the bookkeeping of two data populations meeting at an administrative line, which is exactly what a sealing fault is to a property model.

## Exercise

With defaults set, record the values of the following five tiles: census, phi block 0, phi block 1, kriged at W1, closure check. Then predict, before touching anything, which of the five change when you switch the method to constant, and verify. One sentence on why the unchanged ones cannot change.
