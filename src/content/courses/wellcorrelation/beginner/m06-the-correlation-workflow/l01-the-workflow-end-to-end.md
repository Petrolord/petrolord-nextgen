# The workflow end to end

Five modules have each taught one piece: tops, structure, flattening, zones, lines. This lesson puts them in the order you actually work them. The order matters. Every step depends on the one before it, and doing them out of sequence is how correlations go wrong quietly rather than loudly.

The working order is:

1. Gather the wells and their tops.
2. Look at the structural view first.
3. Choose a datum and flatten.
4. Read the intervals.
5. Report, with the datum stated.

Walk it once over the Ekene section and the shape of the whole course comes into focus.

## Step one: gather

You start with wells and a tops table, and before anything else you audit what you have. Four wells: Ekene-1, Ekene-2, Ekene-3 and Ekene-4. Four top names across the project: TOP_A, TOP_SAND, BASE_SAND and TOP_B.

Two things get checked here and nowhere else. First, that the names are consistent, because a name that does not match its neighbours is a separate surface as far as the software is concerned. Four wells and four names is the tidy answer; five names would mean somebody typed one of them twice, differently.

Second, you note which tops are missing where. Ekene-4 has no TOP_B. That is not an error and not something to fix; the well simply stopped before it reached that surface. What matters is that you know it now, at the start, so that nothing later in the workflow quietly treats TOP_B as a four-well surface when it is a three-well surface.

## Step two: structure first

Look at the structural view before you flatten anything. This is the step people skip, and skipping it costs you the only view in which structure is visible at all.

In the structural view every well hangs at its true measured depth and you can see where the rock actually is. On Ekene, TOP_SAND is picked at 1548, 1565, 1541 and 1590 m, so its structural relief across the section is 49 m: shallowest at Ekene-3, deepest at Ekene-4. That single number is a geological fact about the sand surface, and it is legible here and only here. Note the relief on each surface you care about while you are in this view, because the next step is going to remove it.

## Step three: choose a datum and flatten

Now you pick a datum, and you pick it for the question you are asking. The question drives the choice, not habit.

Asking about the sand and what sits below it, you flatten on TOP_SAND at a 1500 m datum. The engine computes one shift per well: 1500 minus that well's TOP_SAND depth. For Ekene-1 through Ekene-4 that gives -48, -65, -41 and -90 m. Each well's whole column slides by its own shift, rigidly, and all four sand tops land on the 1500 m line.

Ekene-4 takes the largest shift, -90 m, because it was the deepest well on that surface. The size of a well's shift is a direct readout of how far off the datum it sat.

## Step four: read the intervals

With structure removed, you read stratigraphy. Zone spans first: gross sand thickness is 32 m in Ekene-1, 36 m in Ekene-2, 29 m in Ekene-3 and 25 m in Ekene-4. Those four numbers did not change when you flattened, and they would not change under any other datum, because both ends of an interval take the same shift. They are properties of the wells.

Then read how the correlation lines behave. Each line joins one named top across the wells that carry it. The TOP_A, TOP_SAND and BASE_SAND lines run the full width of the panel. The TOP_B line reaches only three wells and stops before Ekene-4, exactly as the audit in step one predicted. A line that stops short is the section telling you the truth about your data coverage.

## Step five: report

The last step is the one that protects everybody downstream. State the datum. A depth read off a flattened panel is a displayed depth, and it is not the depth in the ground. Ekene-1's TOP_B displays at 1592 m on this panel and sits at 1640 m in the well. Both numbers are correct; only one of them is a true depth.

So every reported figure carries its view with it. Thicknesses are safe to quote bare, because they are view-independent. Depths are not. And any statistic that touches TOP_B is quoted as a three-well number, because that is how many wells reached it.

## Exercise

Take the same section but ask a different question: how does the interval between TOP_A and TOP_SAND vary across the wells? Which step of the workflow changes, and which steps stay identical?

Self-check: only step three changes, because the question is now about the interval below TOP_A, so TOP_A becomes the sensible datum. Steps one, two, four and five are unchanged in kind. Note in particular that step two is still worth doing first and still reports the same 49 m of relief on TOP_SAND, and that the gross sand thicknesses read in step four are still 32, 36, 29 and 25 m, because thickness does not depend on the datum you chose.
