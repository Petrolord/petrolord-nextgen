# The capstone walkthrough

The Associate capstone for this course is called Build the golden framework, and it is short. It gives you the three source surfaces on their own grids, asks you to resample them onto the 25 by 20 model frame at 50 m cells, apply the depth-down monotonic clamp and derive the two zone thickness grids. Then it grades six numbers. There is no essay, no free interpretation and no hidden dataset. Every one of the six is read off the framework panel, and if you have worked the five previous modules all six are already familiar.

This lesson walks them in the order the capstone asks for them, says where each is read, and points out where marks are lost.

## The six graded fields

| Field | Unit | Value | Tolerance |
| --- | --- | --- | --- |
| Mean TopB depth on the model frame | m | 1575.5 | 0.1 |
| BaseB nodes fixed by the clamp | count | 180 | 0 |
| Zone A mean thickness | m | 36 | 0.05 |
| Zone A maximum thickness | m | 42 | 0.05 |
| Zone B mean thickness | m | 10.24 | 0.05 |
| Zone A bulk rock volume | 10^6 m3 | 45 | 0.01 |

**Mean TopB depth on the model frame, 1575.5 m, tolerance 0.1.** The mean of the clamped TopB surface across all 500 nodes of the frame. Read it from the surface statistics in the panel, from the TopB row. It is the mean on the model frame and not on TopB's own 27 x 27 source grid, so read it after the resample.

**BaseB nodes fixed by the clamp, 180, tolerance 0.** The clamp reports how many nodes it had to correct on each surface, and the counts on this model are 0, 0 and 180. Read the BaseB entry. This field is a count and it takes no unit.

**Zone A mean thickness, 36 m, tolerance 0.05.** The mean of the zone A thickness grid over all 500 nodes. Zone A is present at every node, so there is only one denominator available here and no ambiguity to resolve.

**Zone A maximum thickness, 42 m, tolerance 0.05.** The largest single value in the same thickness grid, read from the zone A statistics. It is a maximum and not a mean, so it does not depend on a node set at all.

**Zone B mean thickness, 10.24 m, tolerance 0.05.** The mean of the zone B thickness grid over all 500 nodes of the frame, including the nodes where the zone has pinched out to zero. The section below is about this field.

**Zone A bulk rock volume, 45, unit 10^6 m3, tolerance 0.01.** The gross rock in zone A, which is 36 x 500 x 2500 = 45,000,000 m3 and therefore 45 in the field's unit of 10^6 m3.

## The clamp count has a tolerance of zero

Five of the six fields have a numeric window around them. The clamp count does not. Its tolerance is 0, so the entry must be exactly 180, and 179 or 181 scores nothing.

That is the right treatment for the field, because a count of fixed nodes is not a measurement. There is no rounding in it and no reading error to allow for. The engine either fixed 180 nodes or it did not, and the answer is an integer that the panel reports directly. Read it, do not estimate it, and do not derive it from the map by counting zero-thickness cells by eye.

## The volume tolerance is 0.01 in units of 10^6 m3

The sixth field's unit label is 10^6 m3, so the expected entry is 45 rather than 45,000,000. The tolerance of 0.01 is in that same unit. It is one hundredth of a million cubic metres, not one hundredth of a cubic metre.

Two habits protect this field. Enter the value in the unit the label asks for, because 45,000,000 typed into a field graded at 45 fails by a factor of a million. And get there through the closed form rather than by reading digits off a long engine value, since 36 x 500 x 2500 = 45,000,000 m3 is arithmetic you can check as you type it.

## Zone B's mean is the 10.24 over 500, not the 16 over 320

The fifth field is the one people lose without noticing, and module four spent a whole lesson on why.

Zone B has positive thickness at 320 of the 500 nodes and zero thickness at the other 180. Averaged over all 500 nodes its mean thickness is 10.24 m. Averaged over only the 320 nodes where the zone exists it is 16 m. Both describe the same rock and the same 12,800,000 m3 of bulk volume, because 16 x 320 = 10.24 x 500 = 5120.

The graded field wants 10.24 m, the mean over the whole model frame. The difference between the two figures is far larger than the 0.05 tolerance, so entering 16 fails outright. It is not a near miss and it is not partially credited.

Read the denominator the panel is using before you copy a mean out of it, and remember that the same discipline is what the sixth field depends on, since a volume built from 16 m over 500 nodes would be wrong while a volume built from 16 m over 320 nodes is right.

## Getting to the capstone at all

The platform enforces the order. Read every lesson in a module, then pass that module's quiz at 75 percent. Three consecutive failed attempts trigger a 24 hour cooldown, so a quiz is worth preparing for rather than probing. Clear all six modules that way, pass the final exam at 70 percent, and the capstone unlocks. Passing it is what grants the Associate certification for this course.

Try it yourself: open the panel below and locate all six values in the capstone's order before you attempt the capstone itself.

{{panel:em-framework-explorer}}

## Exercise

Without opening the panel, list the six graded fields in capstone order with the unit and tolerance of each. Then answer in one sentence: which field admits no tolerance at all, and which field would you fail by quoting a mean over the wrong node set?

As a self check: mean TopB depth on the model frame in m, tolerance 0.1; BaseB nodes fixed by the clamp as a count, tolerance 0; zone A mean thickness in m, tolerance 0.05; zone A maximum thickness in m, tolerance 0.05; zone B mean thickness in m, tolerance 0.05; and zone A bulk rock volume in 10^6 m3, tolerance 0.01. The field with no tolerance is the clamp count, which must be exactly 180. The field you would fail on the wrong node set is zone B's mean thickness, where the answer is 10.24 m over all 500 nodes and the 16 m over the 320 nodes with the zone present misses by far more than the 0.05 allowed.
