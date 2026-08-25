# The cells do not move, the depths do

The Ekene-6 experiment produced a result that looks contradictory at first reading. The west block lost 20 percent of its oil and kept exactly the same number of cells. This lesson explains why, and the explanation is a rule you will use whenever a partitioned model behaves strangely.

## The two numbers

With all six wells: 117 cells, 9.855617 MMstb.

Without Ekene-6: 117 cells, 7.865728 MMstb.

The cell count did not move at all. Not by one.

## Why the count held

Recall the three tests from module two. A node contributes if it is live, if it carries an oil column, and it contributes to whichever block its label names.

Liveness is geometric. The gridder marks a node live if it lies inside the convex hull of the control points or within 800 m of one of them. That test reads the well positions and nothing else. It never looks at what the wells measured.

Removing Ekene-6 removes a position, so in principle the live area could shrink. In the west block it does not, because every western node that was live is live on the strength of the western wells and the hull they form. Ekene-6 was never the reason any western node was live.

What Ekene-6 was providing is depth. Its 1546 m pick pulled the fitted surface up across a wide area including the western side of the fault. Remove it and those same nodes are still live, still mapped, still carrying oil, and every one of them is now deeper.

Deeper tops mean shorter columns. Shorter columns mean less rock. The same 117 cells hold 20 percent less oil.

## The rule

Cell counts move when geometry moves. Volumes move when depths move. The two are independent, and reading them together tells you which part of the model changed.

That gives a quick diagnostic for any change to a partitioned model.

If the cell counts move and the volumes move, the contact changed or the control geometry changed.

If the cell counts hold and the volumes move, the mapped depths changed while the control positions did not: somebody edited a pick, changed the gridding method, or removed a well without changing the hull.

If the cell counts move between blocks while the field total holds, the labels changed and nothing else did. That is a fault position change.

If the field total moves at all when only the fault moved, there is a bug.

## Reading it off the panel

You can see two of the four cases in the panel directly.

{{panel:rc-block-explorer}}

Step the fault from 1800 m to 1900 m with both contacts at 1560 m. The block cell counts move, 117 to 130 and 52 to 39, and the field total holds at 169 and 12.139208. That is the labels case.

Now put the fault back to 1800 m and change both contacts to 1550 m. The field cell count itself falls, and the field total falls with it. That is the contact case.

The third case, depths moving while the geometry holds, is the Ekene-6 experiment, and the panel cannot show it because it cannot remove a well. Knowing that the panel's controls cannot produce that case is itself useful: the two things you can change from the panel never alter a mapped depth.

## Worked example

Apply the diagnostic to a report you have not seen.

A colleague sends two versions of the same partitioned model. In version two the west block books 12 percent less oil, its cell count is unchanged, and the east block and field total are also down by roughly 12 percent.

Cell counts held, so the contact did not change and the control geometry did not change. Volumes fell everywhere, so mapped depths moved down across the field.

The likely causes are a changed gridding parameter, a corrected pick that has pulled the whole surface deeper, or a different extrapolation setting that changed the fit without changing the mask. What it is definitely not is a fault position change, which cannot move the field total, or a contact change, which would have moved the cell count.

## Exercise

A partitioned model is edited and the west block gains 8 cells while the east loses 8, and both blocks' volumes change, but the field total is identical to fifteen digits. State what was changed and what was not.

Self check: the fault position was moved one column east, transferring 8 oil bearing cells. Nothing else changed. The field total held exactly because relabelling cells cannot alter the sum over all cells, and the block volumes both moved because each block gained or lost the volume those 8 cells carry.
