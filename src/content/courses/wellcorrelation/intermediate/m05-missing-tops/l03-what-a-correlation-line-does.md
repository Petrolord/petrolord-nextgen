# What a correlation line does

A correlation line joins one named top across the wells that have it, in section order, at each well's displayed depth. When it reaches a well that does not have that top, it stops. It does not bridge the gap, it does not dip through, and it does not place a point where no pick exists.

That is the entire behaviour, and stating it this flatly is deliberate. At this tier you are drawing lines on a flattened section, where every line has already been moved by a different amount in every well, and it is easy to lose track of what a line is still asserting. The answer is that it asserts exactly one thing, and that thing is unchanged by flattening: these picks, in these wells, are the same surface.

## The four lines on the flattened Ekene section

Flatten on TOP_A at a 1450 m datum. The shifts are -50, -62, -45 and -80 m across Ekene-1 to Ekene-4, and every displayed depth is the well's measured pick plus that well's shift.

The TOP_A line runs 1450, 1450, 1450, 1450. It reaches all four wells and it is dead flat, because that is what the shifts were computed to achieve. A flat datum line is a construction and never an observation.

The TOP_SAND line runs 1498, 1503, 1496 and 1510 across the four wells. It reaches all four. Its shape is not structure. It is the picture of how thick the interval above the sand is in each well, hanging below a datum that has been forced level.

The BASE_SAND line reaches all four wells too.

The TOP_B line reaches three. Ekene-1 displays TOP_B at 1640 minus 50, which is 1590. Ekene-2 displays it at 1662 minus 62, which is 1600. Ekene-3 displays it at 1628 minus 45, which is 1583. Ekene-4 has no TOP_B, so the line ends after the third well and there is no fourth point to draw.

## Stopping is a property of the data, not of the drawing

It matters that the stop happens because of the tops table rather than because of a rendering rule someone could change. The line is built by walking the wells in section order and looking the top up in each one. When the lookup comes back empty, that well contributes no point. There is no placeholder, no interpolation and no flag to turn any of that on.

So the short line is the tops table speaking. It is telling you, in the most visible place on the section, that TOP_B is constrained by three wells and unconstrained under the fourth. That is useful information, delivered for free, and the gap is doing the work precisely by being visible.

## A line that appears to reach Ekene-4 is a drawing error

Suppose you saw a section where the TOP_B line ran all the way to Ekene-4. What would you conclude?

Not that somebody discovered a deeper section in Ekene-4. The correct conclusion is that the figure is wrong. Either a point was added to the tops table that no interpreter picked, or the drawing extended a line across a well it had no data for, or a smoothing routine ran a curve through the whole section and did not know it should have stopped.

All three of those are drawing errors, and none of them is a geological claim, because a geological claim requires an observation and there is no observation to be had below Ekene-4's total depth. The distinction is worth holding onto because the two look identical on the page. A fabricated point renders in the same colour, at the same line weight, with the same confident little marker as a real one. The only way to tell them apart is to go back to the tops table, which nobody downstream will do.

## What flattening does and does not do to a line

Flattening changes every line's shape and changes no line's membership.

The shape changes because each point moves by its own well's shift, and the shifts differ. The measured TOP_B line runs 1640, 1662, 1628 and the displayed one runs 1590, 1600, 1583. Both are the same three picks in the same three wells. Only the drawing frame moved.

Membership does not change. The TOP_B line reaches three wells before flattening and three wells after it, because flattening operates on picks that exist and has nothing to operate on where a pick is absent. If a line got longer or shorter when you changed the datum, something other than flattening happened to your data.

This is why the length of a line is safe to quote in either view, while its depths are not. Say "the TOP_B line reaches 3 of the 4 wells" and the statement holds everywhere. Say "TOP_B is at 1600 m in Ekene-2" and the statement holds only on the flattened panel with a TOP_A datum of 1450 m, which is why the label displayed has to travel with the number.

## The reading habit

When you look at a section, read the lines in two passes. The first pass is membership: how many wells does each line touch, and where does each one stop. The second pass is shape: what does each line do between the wells it touches. Most people do the second pass only, and the information in the first pass is exactly the information that gets lost when a figure is passed on.

## Exercise

You are handed a flattened Ekene section drawn by somebody else. The TOP_B line runs smoothly across all four wells and carries a fourth point in Ekene-4 at some displayed depth. List the two questions you would ask before using any number from this figure, and say what that fourth depth would have to be in order to be legitimate.

Self-check: the first question is whether Ekene-4 has a TOP_B pick in the tops table, and it does not, so no point belongs there. The second is what produced the fourth point, whether a hand-entered depth, an interpolation, or a curve fitted through the section without a stop rule. A depth for Ekene-4 could only be legitimate as an estimate reported outside the tops table and labelled as one. Drawn on the section as a line point it is a claim of observation, and there is no observation below Ekene-4's total depth to support it.
