# Quality control

A map that is wrong looks exactly like a map that is right. Both are smooth, both are contoured, both post the wells in the same places, and neither carries a warning label. The only defence is a set of checks you run every time, in the same order, before you let anyone quote a number off the map.

Six checks cover most of what goes wrong at this tier.

## Control integrity

Start where the map starts. Every control point must be a real pick at a real location.

Three failures are common enough to look for by name. A depth that is not a pick, carried in from a prognosis or a neighbouring surface, puts a fictional constraint into the grid and the spline will honour it faithfully. A coordinate in the wrong units or the wrong place moves a genuine pick somewhere it does not belong, which removes control from where it should be and adds it where it should not. And a well missing the surface must be absent from the control set, not present with a zero. Zero is a number, and the interpolator cannot tell that you meant nothing.

On Ekene this check passes trivially. All six wells have a TOP_SAND pick and a map position, and no well has to be dropped.

## The honour check

The gridding method used here passes through every control point, so the map must reproduce each well's own value at that well's own location. This is the cheapest correctness test there is, and it catches coordinate errors, unit errors and frame errors all at once.

The quick version of the check uses the extremes. Ekene-4 has the deepest pick at 1590 m, and the deepest value anywhere on the mapped surface is exactly 1590 m. That is what honouring the control looks like from the deep end: the map does not go deeper than the deepest well, because nothing pulls it deeper and the spline is anchored there.

## The overshoot check

The shallow end does not behave the same way, and it is the check most worth understanding.

The shallowest pick in the field is Ekene-3 at 1541 m. The mapped crest is 1539.72 m, which is 1.28 m shallower than any measurement in the dataset. The spline is not averaging; it is bending a smooth sheet through six pins, and a sheet bending over a high can carry the surface slightly above its highest pin.

The point of the check is not to eliminate the overshoot. It is to notice it and be able to explain it. An overshoot of about a metre on 49 m of relief is the geometry of a smooth surface and is unremarkable. An overshoot of 30 m would mean the method was inventing structure, and would send you back to step 3. Either way, a crest that is shallower than every pick is a number to explain rather than a discovery to celebrate, because no rock has ever been seen at that depth.

## The mask check

Confirm that the map stops where the control stops. On Ekene, 201 of 500 nodes are live, so most of the frame is deliberately blank.

The failure mode here is a map with values painted all the way out to the frame edge. That map has either been built without an extrapolation limit or had one set so loosely it never bites, and its corners are invention presented in the same ink as the well control.

## The settings check

Never quote a node count without the cell size beside it. The same six picks, the same frame rule and the same method give 794 live nodes at a 50 m cell and 50 live nodes at a 200 m cell, against 201 at the 100 m cell the capstone uses.

Those three numbers describe one surface at three sampling densities. A reader given "794 live nodes" without the cell size may conclude the map is better constrained than the 201 node version, which it is not. Six wells is six wells.

## Sampling stability

The last check is the most useful one for a prediction you are about to stake a well proposal on. Sample the location at more than one cell size and see whether the answer moves.

P-1 reads 1542.620 m at a 50 m cell, at a 100 m cell and at a 200 m cell. Three different grids, three different node counts, the same depth to three decimal places. That stability is reassuring: it says the value at P-1 is set by the nearby control rather than by where the grid nodes happen to land, which is what you would hope for a location a few hundred metres from a well.

A location whose sampled depth swings with cell size is telling you the opposite. It sits somewhere the surface is being carried by the interpolator rather than by the data, and the number should be quoted with that caveat or not quoted at all.

Try it yourself: run each check in this lesson against the panel below.

{{panel:mp-map-explorer}}

## Exercise

Run all six checks on the Ekene map and write one line for each, stating what passed and what needed an explanation. As a self-check: control integrity passes with six real picks and no missing tops; the honour check passes at the deep end, where the deepest mapped value is exactly Ekene-4's 1590 m; the overshoot check flags a crest of 1539.72 m, 1.28 m shallower than Ekene-3's 1541 m, explained by a smooth surface bending over a high; the mask check passes with 201 live of 500 nodes and blank corners; the settings check requires the cell size of 100 m to be quoted with the 201; sampling stability passes, since P-1 reads 1542.620 m at 50 m, 100 m and 200 m cells. Then answer in one sentence: which check would catch a well whose easting was entered in kilometres instead of metres? The honour check, since the map would not reproduce that well's pick at the place the well is posted.
