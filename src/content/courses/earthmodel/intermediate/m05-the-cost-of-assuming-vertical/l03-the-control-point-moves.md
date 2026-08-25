# The control point moves

The tie table is this tier's deliverable, but one more product of the trajectory work outlives the tier: the zone control points. They are where each well's zone information will STAND when the Expert tier populates properties, and for a deviated well, where they stand is not where the well stands.

{{panel:em-tie-explorer}}

## What a control point is

For property population, each well contributes one value per zone, and that value needs a location. The engine's convention, documented in the plan it implements: the location is the well path's position at the zone interval's MEASURED DEPTH MIDPOINT, and the value's weight is the interval's MD length. One point per well per zone, at the middle of the hole's transit of the zone.

For vertical wells the convention is invisible: the midpoint of any MD interval in a vertical hole is at the wellhead's x and y. W1's zone A control point sits at (1100, 2100), weight 35. W3's at (1900, 2700), weight 45; W4's at (2050, 2150), weight 46.

## W2's point stands 211 m from its wellhead

W2's zone A runs 1580 to 1700 m MD; the midpoint is MD 1640, which module two landed at x 1610.8719179395334, y 2200, TVDSS 1539.0898442132484. That x is the capstone's sixth graded field, and it sits 210.8719179395334 m east of the wellhead.

Switch the panel's trajectory control to the vertical assumption with W2 selected and watch the control point tile: the location snaps back to (1400, 2200), the wellhead. The weight stays 120 either way, since MD is measured along the hole regardless of what shape you believe the hole has. The vertical assumption thus corrupts the control point's LOCATION while leaving its weight and value untouched, a quiet 211 m transplant of data from one place to another.

## Why 211 m will matter enormously

At this tier the control point is a coordinate in a tile. At the next tier it decides which FAULT BLOCK the point belongs to, and the golden model's fault runs at x equals 1575, between W2's wellhead at 1400 and its zone A midpoint at 1610.87. The wellhead is west of the fault; the control point is east of it. Which side of that line the point stands on determines which block's property statistics W2 feeds, and the Expert tier's whole population story pivots on it. The vertical assumption does not merely misplace the point by 211 m; it puts W2's data into a different block.

This is the cleanest example in the course family of an intermediate-tier convention becoming an expert-tier decision. The MD-midpoint rule looks like bookkeeping here; one tier up it silently reassigns a well to a different part of the field.

## The midpoint is a choice

Worth saying plainly: locating a zone's value at the MD midpoint is a CONVENTION, one defensible choice among several. One could use the TVD midpoint (slightly different along a curved hole), the position at maximum reservoir quality, or spread the value along the transit as multiple points. The engine picks the MD midpoint because it is simple, stable and matches its oracle; the important discipline is that the choice is documented and applied uniformly, so that a different choice is a visible model revision rather than a hidden inconsistency.

## Worked example

Find where W2's zone B control point stands. Zone B runs 1700 to 1760 m MD; midpoint 1730. Landing: station 1500 plus 230 m of hold gives x $= 1511.876968573417 + 230/\sqrt{2} = 1674.5115282463228$, TVDSS $= 1440.0948948471319 + 162.63455966897356 = 1602.7294545200377$. Weight: 60. The zone B point stands even further east than the zone A point, 274.5 m from the wellhead, because zone B sits deeper along the hold; the deeper the zone, the further a deviated well's information migrates.

## Exercise

Compute how far apart W2's zone A and zone B control points stand horizontally, and verify the answer equals the MD distance between the two zone midpoints divided by the square root of two. Then state, for a vertical well, what the corresponding distance is, and why the difference between the two answers is a preview of the Expert tier rather than a defect in either convention.
