# Quality control

A flattened section is a redrawing of somebody's data, and a redrawing can go wrong in ways the original cannot. The picks are unchanged, but the frame they are drawn in is now a construction, and a construction can be built incorrectly, read incorrectly, or reported without the labels that make it readable at all.

Five checks catch nearly everything. Each has a pass condition you can state before you look, which is the property that makes a check worth running. None of them takes a minute.

## Check one: every flattening top lands exactly on the datum

Flatten Ekene on TOP_A at a 1450 m datum and read TOP_A in every well. All four must display at exactly 1450 m. Not 1449, not 1451.

This is the check that verifies the shifts. The shift is the datum minus the well's flattening pick, so the flattening pick plus the shift is the datum by definition. If a well's TOP_A does not land on the line, the arithmetic behind that well is wrong and every other displayed depth in that well is wrong by the same amount.

There is one common cause that is not arithmetic at all. A well that lacks the flattening top has no shift to compute, so it may be drawn at its measured depth alongside wells that have been moved. On Ekene all four wells carry TOP_A, so this does not arise here, and it is the first thing to look for on a section where it does. Spot that well before you read numbers off the panel, not afterwards.

## Check two: intervals are unchanged from the measured section

Pick an interval and compute it twice, once from the measured picks and once from the displayed ones. The two must agree exactly.

The TOP_A to TOP_SAND interval reads 48, 53, 46 and 60 m across Ekene-1 to Ekene-4 on the measured section. On the flattened panel, Ekene-2 shows TOP_A at 1450 and TOP_SAND at 1503, and 1503 minus 1450 is 53. Same number. That is the expected result, since both ends of an interval take the same shift and the shift cancels in the difference.

A disagreement means the two ends of that interval did not take the same shift, which means something moved a pick rather than moving a well. This is the check that would catch a hand-edited depth, a well drawn with a stale shift, or a display that applied the shift to some surfaces and not others.

## Check three: every quoted depth is labelled measured or displayed

Go through your own text and look at each depth. Each one must say which frame it belongs to.

Ekene-2's TOP_SAND is 1565 m measured and 1503 m displayed. Both numbers are correct and they describe the same surface. Only one of them is where the rock is. A reader who receives 1503 m without the label will treat it as a depth in the ground, and there is nothing in the number itself to stop them.

This check is boring and it is the one that costs real money when it fails, because a displayed depth handed upward does not stay a display error. It becomes a wrong contour, then a wrong volume. Thicknesses are safe to quote bare, since they do not depend on the frame. Depths never are.

## Check four: the well count with all tops is stated

Somewhere in your report, before the numbers, say how many wells carry a complete column. On Ekene that is 3 of 4.

The check is that the statement is present, not that it is prominent. Its job is to tell the reader that some figures below will have a smaller denominator than others, so they should read the labels rather than assume. Without it, a three-well statistic and a four-well statistic sit side by side looking identical.

## Check five: the displayed span matches the shallowest and deepest displayed picks

Read the shallowest displayed pick and the deepest displayed pick on the panel, subtract, and compare with the span you are about to report.

On the flattened Ekene section the shallowest displayed pick is 1450 m, which is every well's TOP_A sitting on the datum. The deepest is Ekene-2's TOP_B at 1662 minus 62, which is 1600 m. The span is 1600 minus 1450, which is 150 m.

Two things this check catches. The first is a clipped view: if the panel is not showing the whole column, the span you read off the drawing will be shorter than the span the picks imply. The second is a units or frame slip, since a span computed from measured depths and a span computed from displayed ones are different numbers and only one of them describes the drawing.

Note what actually sets the deep end. Because a displayed depth is 1450 plus the pick's measured distance below that well's own TOP_A, the span equals the largest measured distance below TOP_A anywhere on the section. Those distances, from each well's TOP_A down to its deepest pick, are 140, 150, 133 and 85 m across Ekene-1 to Ekene-4, so Ekene-2 sets the span at 150 m.

Ekene-4 is the counterexample worth keeping in mind while you run this check. It carries the deepest measured pick of every top it has, at 1530, 1590 and 1615 m, and it draws shallowest of all four wells on the flattened panel, with its deepest displayed pick at 1450 plus 85, which is 1535 m. Depth below the flattening top is what governs the display, not raw depth, so the deep end of the span has to be read from the flattened panel rather than assumed from the deepest row of the tops table.

Open the panel, flatten on TOP_A at 1450 m, and run all five checks before reading a single number for the record.

{{panel:wc-flatten-explorer}}

## Exercise

You receive a flattened Ekene section from a colleague. Three wells show TOP_A at 1450 m and the fourth shows it at 1462 m. The report quotes a TOP_A to TOP_SAND interval of 60 m for that fourth well and a displayed span of 150 m. Say which checks pass, which fail, and what single explanation accounts for the pattern.

Self-check: check one fails, because the fourth well's flattening top does not land on the datum, so its shift is wrong by 12 m. Check two passes, and that is the informative part: the interval of 60 m is still correct, because a wrong shift moves both ends of the interval equally and cancels out of the difference. Check five is not trustworthy on this panel, since one well's picks are all displaced by 12 m and either end of the span could belong to that well. The single explanation is a bad shift for one well, most likely a datum or a flattening pick applied incorrectly to it alone, and the giveaway is that it corrupts every displayed depth in that well while leaving every interval in that well intact.
