# The thickness extremes

Two of the six capstone fields are the ends of the isochore's range. This lesson reads them, finds where they sit, and shows that they get there by two different mechanisms.

{{panel:mp-isochore-explorer}}

## The two numbers

At the capstone settings, a 100 m cell with the 800 m mask, the isochore runs from a minimum of **25 m** to a maximum of **35.897705078125 m**.

The well thicknesses run from 25 m at Ekene-4 to 36 m at Ekene-2. So the mapped range sits inside the measured range at one end and lands exactly on it at the other.

## The minimum is a well

The mapped minimum of 25 m sits at node (2600, 2500), which is Ekene-4's own location. It is the thinnest well, it lands exactly on a grid node, and the spline honours it, so the map returns its measured thickness with no interpolation involved.

That is worth noticing rather than assuming. It means the thinnest point on this map is a **measurement**, not a prediction. Nothing on the map is thinner than the thinnest well, because the spline has no reason to go below its control in that corner.

## The maximum is not

The mapped maximum of 35.897705078125 m sits at node (2200, 1200). Ekene-2, whose measured thickness is 36 m, is at (2200, 1150). The maximum is **50 m north of the thickest well** and 0.102 m thinner than it.

The tempting reading is that the spline undershot, the way the Associate tier's depth crest overshot. That reading is wrong, and the panel disproves it in one click.

Change the cell size to 50 m. Now the frame has rows every 50 m, Ekene-2 at $y = 1150$ lands exactly on a node, and the mapped maximum becomes **exactly 36 m at (2200, 1150)**.

Nothing about the fit changed. The spline honoured Ekene-2 at 36 m in both runs. What changed is whether the grid had a node in the right place to show it.

## Two mechanisms, opposite directions

Put the two extremes of this course side by side.

**The depth crest** on TOP_SAND is 1539.7181 m, which is 1.28 m **shallower** than the shallowest pick of 1541 m at Ekene-3, and sits 300 m away from it. Refining the cell size does not remove it: at a 50 m cell the crest is 1539.6909 m, if anything slightly shallower still. That is a genuine property of the fitted surface. A thin-plate spline minimises bending energy and will overshoot beyond its control to do so, and the overshoot is real structure the map is inventing.

**The isochore maximum** at a 100 m cell is 0.102 m **thinner** than the thickest pick, and refining the cell to 50 m removes it entirely. That is not a property of the fit; it is a property of where the nodes happen to fall.

So a mapped extreme can be wrong in either direction, and the two causes need different responses. Spline overshoot is not fixed by a finer grid and has to be recognised and reported. Node placement is fixed by a finer grid, or by moving the frame, and is not really an error at all so much as a display resolution.

## The test that separates them

Refine the cell size and re-read the extreme.

If it **moves toward the control values** and settles, the coarse grid was simply missing the right node.

If it **stays past the control values** or moves further past them, the fit itself is doing it, and no amount of refinement will help.

That test takes ten seconds on the panel and it should be run on every mapped extreme that is about to appear in a report, because an extreme is exactly the value a reader will quote.

## Worked example

At a 200 m cell the isochore minimum reads 26.733154296875 m rather than 25 m. What has happened, and which of the two mechanisms is it?

It is node placement again, in the other direction. At a 200 m cell Ekene-4 no longer lands on a node, so the map has no node at the thinnest well and the nearest node it does have is thicker. The Associate tier recorded the same drop-out on the depth surface at 200 m.

The test confirms it: refining from 200 m to 100 m brings the minimum back to exactly 25 m and it stays there at 50 m. The fit was always honouring Ekene-4; the coarse grid could not show it.

## Exercise

State the isochore minimum and maximum at the capstone cell size, say which well each is associated with, and explain in two sentences why refining the cell to 50 m changes the maximum but not the minimum.

As a self-check: the minimum is 25 m at Ekene-4's node and the maximum is 35.897705078125 m at (2200, 1200), 50 m from Ekene-2. Refining to a 50 m cell puts a node at Ekene-2's own coordinates of (2200, 1150), so the maximum becomes exactly its measured 36 m, while Ekene-4 at (2600, 2500) already lands on a node at 100 m and gains nothing from the refinement, so the minimum stays at 25 m.
