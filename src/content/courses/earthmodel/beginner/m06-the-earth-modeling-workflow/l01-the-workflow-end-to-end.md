# The workflow end to end

Five modules have taken the Beginner earth modelling problem apart a piece at a time. This lesson puts it back together in working order, because the pieces are not independent. Each step consumes what the step before it produced, and a model frame chosen carelessly in step one is still wrong at the end without ever announcing itself.

The order is: frame, surfaces, resample, clamp, zones, separations, volume, hand on.

## Step 1: decide the model frame

Nothing can be computed until there is one frame for everything to live on. This model uses 25 by 20 nodes at 50 m cells with its origin at (1000, 2000), which is 500 nodes each carrying 2500 m2 of cell area.

This step produces no result of its own and it controls every number that follows. The node count and the cell area are two of the three factors in the volume, and the frame decides both. A frame is a decision, not something inherited from whichever surface arrived first.

## Step 2: gather the surfaces as they arrive

Three surfaces define this model, and each one arrives on its own grid.

| surface | grid | cell size | origin |
| --- | --- | --- | --- |
| TopA | 40 x 32 | 40 by 40 m | (900, 1900) |
| TopB | 27 x 27 | 60 by 45 m | (950, 1950) |
| BaseB | 30 x 25 | 55 by 55 m | (880, 1880) |

None of the three matches the model frame or either of the others, which is normal for surfaces built by different interpreters in different vintages.

## Step 3: resample onto the frame

Every surface is resampled onto the model frame. After that step, all 500 nodes are live on all three surfaces, so nothing has to be treated as missing anywhere in the model.

| surface | mean (m) | min (m) | max (m) | live nodes |
| --- | --- | --- | --- | --- |
| TopA | 1539.500000 | 1500 | 1579 | 500 |
| TopB | 1575.500000 | 1530 | 1620.9999999999998 | 500 |
| BaseB | 1585.740000 | 1561 | 1620.9999999999998 | 500 |

The TopB mean of 1575.5 m is the first of the six graded capstone numbers.

## Step 4: clamp the stack depth-down

Resampled surfaces can cross. The depth-down monotonic clamp enforces that a deeper surface is never shallower than the one above it, and it reports how many nodes it had to fix on each surface.

On this model the counts are 0, 0 and 180. Nothing was fixed on TopA, nothing on TopB, and 180 nodes were fixed on BaseB. That count is the second graded number, and it is the pinch-out of zone B written as a number rather than hidden.

Its signature is visible in the table above. TopB and BaseB share the same maximum of 1620.9999999999998 m, because where zone B has closed the clamp has moved BaseB down onto TopB. The clamp sets an offending node to the running maximum depth, so the deeper surface moves down onto the one above it.

## Step 5: difference the surfaces into zones

Zone A is TopA to TopB, zone B is TopB to BaseB.

| zone | mean over all 500 nodes | max | min | nodes with positive thickness |
| --- | --- | --- | --- | --- |
| A | 36 m | 42 m | 30 m | 500 |
| B | 10.24 m | 31 m | 0 m | 320 |

Three more graded numbers sit in that table: zone A's mean of 36 m, zone A's maximum of 42 m, and zone B's mean of 10.24 m over all 500 nodes. Zone B's mean over the 320 nodes where the zone exists is 16 m, which is the same rock described differently.

## Step 6: check the separations

Mean surface separation should equal mean thickness, and here it does exactly. 1575.5 minus 1539.5 gives 36 for zone A, and 1585.74 minus 1575.5 gives 10.24 for zone B.

It is the cheapest confirmation there is that steps 3, 4 and 5 were consistent with each other.

## Step 7: bulk rock volume

Mean thickness times node count times cell area. Zone A gives 36 x 500 x 2500 = 45,000,000 m3, the sixth graded number and a closed-form anchor. Zone B gives 10.24 x 500 x 2500 = 12,800,000 m3, and the two zones together hold 57.8 x 10^6 m3.

## Step 8: hand it on

The Beginner tier stops here, with a frame, three clamped surfaces, a clamp count, two thickness grids and two bulk rock volumes. Those are exactly the ingredients a volumetric estimate needs, and the ReservoirCalc course is where a contact, net-to-gross, porosity, saturation and a formation volume factor turn them into hydrocarbon in place.

## Where each course fits

Laid out this way, the geoscience path stops looking like separate applications.

The Well Data course is the formal prerequisite for this one and earns the place, because a depth reference settled there is what makes a surface depth mean the same thing at every well. The Well Correlation course names the zones, so that zone A and zone B are stratigraphic units with a definition rather than two gaps between three grids. The Mapping and Seismic Interpretation work produces the three surfaces themselves, each on whatever grid its own workflow used, which is why step 3 exists at all.

Downstream, this course hands its bulk rock volumes to the ReservoirCalc course.

Each course inherits the previous one's weaknesses. A pick that is wrong in the correlation work becomes a wrong surface here, then a wrong thickness, then a wrong volume, and the volume carries no memory of where the error entered.

## Exercise

Write the eight steps in order and put beside each the single number from this model that it produces. Then answer in one sentence: which step produces no number of its own and yet controls two of the three factors in the bulk volume?

As a self check: the frame is 25 by 20 nodes at 50 m cells, 500 nodes of 2500 m2; the three surfaces arrive on 40 x 32, 27 x 27 and 30 x 25 grids; resampling leaves all 500 nodes live and TopB with a mean of 1575.5 m; the clamp fixes 0, 0 and 180 nodes; the zones give 36 m mean and 42 m maximum for A and 10.24 m mean over 500 nodes for B; the separations check as 1575.5 minus 1539.5 equal to 36 and 1585.74 minus 1575.5 equal to 10.24; the volumes are 45,000,000 m3 and 12,800,000 m3, or 57.8 x 10^6 m3 together; and step 8 hands those to the fluids workflow. The step that produces nothing and controls everything is step 1, because the frame fixes both the node count and the cell area, which are two of the three factors in every volume the model reports.
