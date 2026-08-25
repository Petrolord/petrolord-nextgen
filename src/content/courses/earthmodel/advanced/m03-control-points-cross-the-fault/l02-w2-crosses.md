# W2 crosses

Run the block labels over the control set and the model's single most consequential fact falls out: W2's wellhead and W2's control point are in different blocks. This lesson establishes the fact, and the rest of the module unpacks what it does to every statistic in block 1.

{{panel:em-population-explorer}}

## The labels

The fault boundary relevant here is the southern panel's eastern edge at x 1575, spanning y 1975 to 2430. Test each control point:

W1 at (1100, 2100): west of 1575, inside the panel's y range: block 1.
W2 at (1610.8719179395334, 2200): EAST of 1575: block 0.
W3 at (1900, 2700): far east, and north of the panel: block 0.
W4 at (2050, 2150): far east: block 0.

Block 1's control set: W1 alone. Block 0's: W2, W3, W4.

Now the wellheads, same test: W1 (1100, 2100) block 1; W2 (1400, 2200) block 1; W3 and W4 block 0. Two wellheads stand in block 1, but only one control point does. W2 is drilled in block 1 and its zone A information lives in block 0, because 210.87 m of eastward migration carried the MD midpoint across x 1575 with 35.87 m to spare.

## This is a model property, not a bug

Every ingredient is doing its documented job. The trajectory is right: the hole really does cross the fault trace on its way down. The midpoint convention is right by its own definition. The containment test is right. The composition of three correct pieces yields a well that COUNTS for a block it was not drilled in, and the lesson is that data location is a DERIVED quantity in any model with deviated wells, with everything that implies: it moves when surveys are re-run, and it can sit on the far side of administrative boundaries from the rig.

The physical reading is sensible, too, which is why the convention survives: the rock W2 sampled in zone A mostly IS east of the fault trace. The hole enters zone A at x 1568, just 7 m west of the boundary, and exits at x 1653, well east; its transit is almost entirely block 0 rock. Assigning its zone value to block 0 is the right call for this well. The convention got the right answer by midpoint luck rather than by measuring the transit; a well entering at x 1500 and exiting at 1580 would be assigned wholly to block 1 by a midpoint at 1540 despite sampling both sides. The convention is one point per well, and its failure mode is wells that straddle.

## Watch it in the panel

The profile row at y 2200 is W2's own row. The white dot at x 1610.87 with value 0.2936 sits on the GREEN, block 0 side of the orange fault line, and the green kriged curve bends toward it. Nothing on the blue side reflects W2 at all. Switch methods, sweep the nugget and range: no setting moves any of W2's influence west of the line. The panel is the fact made visible: influence follows the point, and the point is east.

## Worked example

Quantify "with 35.87 m to spare" and its fragility. The midpoint sits at x 1610.8719179395334; the boundary at 1575; margin 35.8719179395334 m. The midpoint moves east at $1/\sqrt 2$ times any MD change of the zone's midpoint, so shifting the zone interval about 50.7 m shallower in MD, or re-surveying the build 5 degrees shallower, would drag the midpoint west of the boundary and flip W2's block assignment, taking 120 weight units and the value 0.2936 from block 0's books to block 1's. Both blocks' porosities, and the graded 0.28631191845445614, would change discontinuously. Statistics that can jump on a 5 degree survey revision deserve the word FRAGILE in a report, and finding such cliffs is an Expert skill this fixture teaches on purpose.

## Exercise

Compute where W2's zone B control point (x 1674.5115282463228, y 2200) stands, block-wise, and then state the full block membership picture for W2: wellhead, zone A point, zone B point. In one closing sentence, say what a report should list as "wells in block 1" and why the honest answer needs a per-zone qualifier.
