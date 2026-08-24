# The workflow end to end

Five modules have each taught one piece of this tier: what flattening adds, how a datum is chosen, what a displayed depth is, how growth is measured, and how a missing top behaves. This lesson puts them in the order you work them on a real section, and names what arrives from the tier below and what leaves for the tier above.

The order is not a suggestion. Each step consumes the output of the one before it, and the two steps people are tempted to skip are the two that catch mistakes.

## What arrives from the Associate tier

You do not start from nothing. The Associate tier produced the section itself: wells gathered, tops picked on logs, names made consistent across the project, and the structural view read and understood. It also produced the two habits this tier runs on. Relief is read in the measured view. Thickness is read anywhere, because it does not depend on the view.

Concretely, what arrives is the tops table for four wells and four surfaces, the knowledge that Ekene-4 stops above TOP_B, and the structural relief on each surface: TOP_A 35 m, TOP_SAND 49 m, BASE_SAND 45 m and TOP_B 34 m over the three wells that carry it.

## Step one: audit the tops table

Before any arithmetic, count. Four wells, four top names, fifteen picks in sixteen slots, and three wells carrying all four tops. That last count is the one you will report and the one the capstone grades exactly.

The audit also fixes your vocabulary for the rest of the job. TOP_B is a three-well surface here. Anything you compute on it later is a three-well number, and you decided that at the start rather than discovering it halfway through.

## Step two: look at the measured section first

This is the step that gets skipped, and skipping it removes the only view in which structure exists.

Hang every well at its measured depth and read the relief. TOP_SAND runs 1548, 1565, 1541 and 1590 m, so its relief across the section is 49 m, shallowest at Ekene-3 and deepest at Ekene-4. Write the relief numbers down now, because the next step removes exactly this information from the picture and you will not be able to recover it from the flattened panel.

## Step three: choose the flattening top and the datum

The question chooses the top. This tier asks how the interval between TOP_A and TOP_SAND varies across the section, so TOP_A is the flattening top: hanging the section on the upper bound of the interval of interest is what makes the interval's variation legible below it.

The datum is a display convenience and 1450 m is chosen because it sits above every well's TOP_A, which puts every well's shift on the same side of zero. The datum changes every displayed depth and changes nothing else.

## Step four: compute one shift per well

The shift is the datum minus the well's pick of the flattening top. Across Ekene-1 to Ekene-4 that is 1450 minus 1500, 1512, 1495 and 1530, giving -50, -62, -45 and -80 m.

Four subtractions and the flattening is done. Every shift is negative because every TOP_A is deeper than the datum, so every well moves up the display, and the magnitude of a well's shift is a direct readout of how far off the datum it sat. Ekene-4 sat furthest and takes the largest shift at -80 m.

## Step five: read the displayed depths

A displayed depth is the measured pick plus that well's shift. Ekene-2's TOP_SAND is 1565 plus -62, which is 1503 m displayed. All four TOP_A picks land on 1450 m by construction, which is the point of the exercise and also the first quality control check.

Everything read off the flattened panel is a displayed depth and carries that word with it. The stored pick has not moved.

## Step six: read the intervals

Intervals are unchanged by flattening, because both ends of an interval take the same shift and the difference cancels. The TOP_A to TOP_SAND interval is 48, 53, 46 and 60 m across the four wells, and it reads the same on the measured section and the flattened one.

That invariance is what makes flattening safe. If a thickness moved when you changed the datum, flattening would be distorting the data instead of redrawing it.

## Step seven: measure the growth

The interval is not constant, so the section is not a layer cake. The growth range is the maximum minus the minimum, 60 minus 46, which is 14 m. Ekene-4 carries the thickest A-to-SAND interval at 60 m and Ekene-3 the thinnest at 46 m.

This is the measurement the whole tier was building toward. The Associate tier could say the interval varies. Here it has a number, and 14 m of variation across four wells is a statement about how accommodation changed while the section was accumulating.

## Step eight: quality control and report

Run the checks in the next lesson, then report with the view attached. State the flattening top and the datum. Label every depth as measured or displayed. State that 3 of 4 wells carry all four tops. Quote the displayed span of 150 m as a span rather than as a depth.

## What leaves for the Expert tier

Two things go up. The first is the growth measurement itself, the fact that the section thickens and thins between surfaces rather than stacking evenly. The second is the gap, still open: Ekene-4 has no TOP_B, and three wells do.

The Expert tier takes those two together and predicts where Ekene-4's TOP_B would have been. It is a prediction, it stays outside the tops table, and it is the subject of the last lesson in this module rather than of this one.

## Exercise

Take the same section and change the question: how does the interval between BASE_SAND and TOP_B vary across the wells? Walk the eight steps and say which ones change, which produce a different number, and which produce no number at all.

Self-check: step one changes in consequence, because BASE_SAND to TOP_B needs both surfaces and only three wells carry TOP_B, so this is a three-well analysis from the outset. Step three changes, because BASE_SAND becomes the sensible flattening top and the datum moves with it. Steps four and five then produce different shifts and different displayed depths. Step six and step seven produce a three-well interval set and a three-well growth range. Step eight changes in wording, since every figure now needs the three-well label. Step two is unchanged in kind and still reports the same relief, because relief is measured and does not care what you flatten on. For Ekene-4 the analysis produces no number at all, and the blank is the correct output.
