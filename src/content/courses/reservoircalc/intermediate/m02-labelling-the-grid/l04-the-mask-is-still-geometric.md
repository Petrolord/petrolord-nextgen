# The mask is still geometric

Three separate tests decide whether a node contributes to a volume, and it is easy to run them together in your head and get the wrong answer. This lesson separates them, because most confusion about partitioned models comes from conflating the three.

## The three tests

A node contributes to a block's volume only if all three of these hold.

The first is whether the node is live. A node is live when the gridder was willing to give it a value, which at Ekene means it lies inside the convex hull of the wells or within 800 m of one. Of the 500 nodes in the frame, 201 pass.

The second is whether the node carries an oil column. That asks whether the top surface lies above the block's contact, and if so, how far the base or the contact lies below it. Of the 201 live nodes, 169 pass at a contact of 1560 m.

The third is which block the node belongs to. That is the label, and every node in the frame has one whether or not it passed either of the first two tests.

## Every node has a label

This is the point that surprises people. The labelling routine does not skip dead nodes. It walks all 500 nodes in the frame, computes each one's easting, compares it to the fault, and writes a 0 or a 1.

That means the label array is full: 280 nodes carry a label of 0 and 220 carry a label of 1, covering the whole frame including ground that has no map, no oil and no meaning. The dead nodes simply never reach the accumulation step, so their labels are never used.

The reason it works this way is worth noting: the label is a property of a position, and a position has a block whether or not anything was mapped there. Liveness is a property of the map, and oil is a property of the map and the contact together.

## Why keeping them separate matters

Because the three tests are independent, changing one of them has a predictable and limited effect, and knowing which effect is which lets you debug a partition quickly.

Move the fault and only the third test changes. The set of live nodes is untouched, the set of oil bearing nodes is untouched, and the same 169 cells are simply divided differently. The field total cannot move, and if it does, something is wrong.

Change a contact and only the second test changes. Live nodes stay live. Every block's cell count can move, the field total moves, and the labels are irrelevant to the change.

Change the well control or the extrapolation limit and the first test changes, which usually changes the second as well, because a node that stops being live also stops carrying oil.

You will use this in module four, where a well is removed from the control set and the west block's booking falls by two million barrels while its cell count does not move at all. That combination looks impossible until you notice it is the first test staying put while the depths underneath the second test change.

## The mask has no opinion about the fault

There is a deeper point hiding here, and module four is built on it.

The mask is geometric. It is decided by where the wells are, not by what the wells measured and not by any structural interpretation. The gridder tests a distance and nothing else. It has no way to know that a fault runs through the field, so the live area extends smoothly across the fault trace exactly as though the rock were continuous.

Every node immediately east of the fault is live because western wells are within 800 m of it, and every node immediately west of the fault is live partly because Ekene-6, an eastern well, is within 800 m of it. The mask does not respect the partition in either direction.

That is not a bug in the mask. It is the mask doing its job, which is to say where interpolation is defensible on grounds of distance. It becomes a problem only when a partition is laid over the top and the reader assumes the two are consistent.

## Worked example

Take the numbers apart at the capstone settings and confirm that they only ever describe one of the three tests each.

The frame holds 500 nodes. 201 of them are live, so 299 fail the first test and are blank on the map. Of the 201 live nodes, 169 carry oil at 1560 m, so 32 live nodes fail the second test: these are mapped ground whose top lies below the contact, and they are the blank cells inside the coloured area rather than outside it.

Of the 169, the third test splits them 117 west and 52 east.

Now change the fault to 1900 m and re run the three counts: 500, 201, 169, split 130 and 39. Only the last pair moved. Now put the fault back and change both contacts to 1550 m: the counts become 500, 201, and a smaller oil count, split differently again. The first number never moves at all, because nothing you can do from this panel changes which nodes are live.

## Exercise

A colleague reports that moving their fault increased the field total by 3 percent. State what must have gone wrong, and name the check that would have caught it.

Self check: moving a fault changes only the block labels, so the field total cannot move. A rise of 3 percent means cells are being double counted or the contact was changed at the same time. The check is the one the panel prints as two tiles: the blocks added against the field total, which must agree to the digits shown for every fault position.
