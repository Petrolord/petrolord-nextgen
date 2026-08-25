# The validation panel map

The panel below regrids the Ekene TOP_SAND surface for any control set you choose and reports everything this tier measures. This lesson is a map of it.

{{panel:mp-validation-explorer}}

## The control

One selector, eight settings, and it is the whole interface.

**All six wells** is the map the two tiers below built. Every reading here should match what they reported.

**Without Ekene-1** through **without Ekene-6** are the six leave-one-out runs. Each grids five wells on the same frame and marks the withheld well on the map so you can see where the prediction is being asked for.

**Six plus Ekene-7** adds the appraisal well to the control set, which is the map that exists after the blind test.

Everything below the selector responds to it. Change the setting and re-read every tile.

## The map

The gridded surface for the chosen control set, contoured, with the wells posted.

Three markers are worth looking for.

**Filled well symbols** are control points for the current run.

**The open symbol** is the withheld well, on the six leave-one-out settings. It is posted with its actual pick so that the comparison is on the same picture as the prediction.

**P-1** at (1600, 1600), marked throughout, because module 5 tracks what happens to it under every setting.

The most instructive thing on the map is not a marker. It is the **blank margin**, which grows dramatically when a well is removed. Switch from all six to without Ekene-1 and watch the southwest of the map disappear.

## The tiles

Twelve readings, in three groups.

**The control set**, three tiles that describe what is being gridded.

- **Control points used**, 6, 5 or 7 depending on the setting.
- **Live nodes**, which is 201 for all six wells, 201 with Ekene-7 added, and between 130 and 183 for the leave-one-out runs.
- **Cross-validatable wells**, the count of wells that could be dropped and still predicted on the current control geometry. It reads 1 for the six-well set and 2 for the seven-well set, and it is a capstone field.

**The surface**, four tiles that are the Associate tier's readings recomputed for the current control set.

- **Crest** and **deepest**, the shallowest and deepest live values.
- **Map mean**.
- **Depth at P-1**, which is the tile module 5 is built around.

**The test**, five tiles that only mean anything when a well is withheld or newly added.

- **Withheld well** and its **actual pick**.
- **Prediction at that well**, which reads blank for five of the six leave-one-out settings, and that blank is the result rather than a missing feature.
- **Residual**, predicted minus actual, blank when the prediction is.
- **Nearest control distance**, how far the withheld or new well is from the closest well still in the set.

## A first pass to run now

Set the selector to all six wells and confirm the crest at 1539.7181 m and P-1 at 1542.6199 m against the tiers below.

Now step through the six leave-one-out settings and watch two tiles: the live node count, which falls to as low as 130, and the prediction tile, which is blank five times out of six.

Then select without Ekene-6, the one that works, and read the residual: $+9.8439$ m.

Finally select six plus Ekene-7 and read the crest and P-1 again. Both move, and one of them moves by more than four metres.

## Exercise

Using the panel, record the live node count for all six leave-one-out settings and identify which is the only one that returns a prediction. Then state what the blank prediction tile means.

As a self-check: removing Ekene-1 leaves 144 live nodes, Ekene-2 leaves 130, Ekene-3 leaves 183, Ekene-4 leaves 133, Ekene-5 leaves 155 and Ekene-6 leaves 201, and only the Ekene-6 run returns a prediction. A blank prediction means the withheld well's own location is no longer inside the area the remaining wells constrain, so the map has no value there to compare against the pick; it is a finding about the control geometry rather than a failure of the software.
