# The capstone walkthrough

The Associate capstone for this course is short. Its brief keeps the golden model's three source surfaces on their own grids and gives you a model frame of its own: an origin, a square cell size and the node counts. It asks you to resample the surfaces onto that frame, apply the depth-down monotonic clamp and derive the two zone thickness grids. Then it grades six numbers. There is no essay and no hidden dataset. Every one of the six is read off the framework panel once you have typed the frame into it.

The panel opens on the golden 25 by 20 frame at 50 m cells, which is this course's teaching case. None of its numbers is a capstone answer. This lesson walks the six fields in the order the capstone asks for them, works each one on the golden frame, and points out where marks are lost.

## The six graded fields

| Field | Unit | Where it is read |
| --- | --- | --- |
| Mean TopB depth on the frame | m | Mean TopB depth tile |
| BaseB nodes fixed by the clamp | count | Clamp fixed on BaseB tile |
| Zone A mean thickness | m | Zone A mean thickness tile |
| Zone A maximum thickness | m | Zone A max thickness tile |
| Zone B mean thickness over the frame | m | Zone B mean thickness tile |
| Zone A bulk rock volume | 10^6 m3 | Zone A bulk volume tile |

## Setting the frame

Type the frame's origin x and y, its cell size and its two node counts into the boxes at the top of the panel. The frame must sit inside the area all three source surfaces cover, and the panel says so if it does not. Read the subtitle after typing: it repeats the node counts, the cell size and the total number of nodes the means are taken over.

A frame is a decision, and every number in the model is written onto it. The same three surfaces on another frame give other means, another clamp count and another volume, which is the whole point of the exercise.

## Worked on the golden frame

**Mean TopB depth, 1575.5 m.** The mean of the clamped TopB surface across all 500 nodes of the frame, after the resample, not on TopB's own 27 x 27 source grid.

**BaseB nodes fixed by the clamp, 180.** The clamp reports how many nodes it had to correct on each surface, and on the golden frame the counts are 0, 0 and 180. This field is a count and takes no unit.

**Zone A mean thickness, 36 m.** The mean of the zone A thickness grid over all 500 nodes. Zone A is present at every node, so there is only one denominator available.

**Zone A maximum thickness, 42 m.** The largest single value in the same grid. It is a maximum and not a mean, so it does not depend on a node set.

**Zone B mean thickness, 10.24 m.** The mean over all 500 nodes of the frame, including the nodes where the zone has pinched out to zero.

**Zone A bulk rock volume, 45 x 10^6 m3.** The gross rock in zone A, 36 x 500 x 2500 = 45,000,000 m3. On a frame of your own the cell area and the node count both change, and the closed form changes with them.

The capstone frame moves every one of these. The method does not move.

## The clamp count is graded exactly

Five of the six fields have a numeric window around them. The clamp count does not: its tolerance is 0, and one node either way scores nothing. That is the right treatment, because a count of fixed nodes is not a measurement. Read it from the tile, do not estimate it, and do not derive it from the map by counting zero-thickness cells by eye.

## The volume is in units of 10^6 m3

The sixth field's unit label is 10^6 m3, so the entry is the volume in millions of cubic metres, and its tolerance is in that same unit. Two habits protect this field. Enter the value in the unit the label asks for, because the volume in plain cubic metres fails by a factor of a million. And check the tile against the closed form, mean thickness times node count times cell area, before you type it.

## Zone B's mean is over the whole frame

The fifth field is the one people lose without noticing, and module four spent a whole lesson on why. On the golden frame zone B has positive thickness at 320 of the 500 nodes. Averaged over all 500 nodes its mean is 10.24 m; averaged over only the 320 nodes where the zone exists it is 16 m. Both describe the same 12,800,000 m3 of rock.

The capstone wants the mean over the whole frame. The panel prints both, labelled with their node counts, so read the denominator before you copy a mean out of it.

## Getting to the capstone at all

The platform enforces the order. Read every lesson in a module, then pass that module's quiz at 75 percent. Three consecutive failed attempts trigger a 24 hour cooldown, so a quiz is worth preparing for rather than probing. Clear all six modules that way, pass the final exam at 70 percent, and the capstone unlocks. Passing it is what grants the Associate certification for this course.

Try it yourself: reproduce the six golden values on the panel below, then change the cell size to 40 m and the node counts to fit, and watch which of the six move.

{{panel:em-framework-explorer}}

## Exercise

Without opening the panel, list the six graded fields in capstone order with the unit of each. Then answer in one sentence: which field admits no tolerance at all, and which field would you fail by quoting a mean over the wrong node set?

As a self check: mean TopB depth in m; BaseB nodes fixed by the clamp as a count; zone A mean thickness in m; zone A maximum thickness in m; zone B mean thickness over the whole frame in m; and zone A bulk rock volume in 10^6 m3. The field with no tolerance is the clamp count. The field you would fail on the wrong node set is zone B's mean thickness, where the mean over only the nodes with the zone present is a different and much larger number.
