# Honouring the control

An interpolator is called exact when it returns each control point's own value at that control point's own location. Feed it Ekene-4 at (2600, 2500) with a pick of 1590 m, evaluate the fitted surface at (2600, 2500), and you get 1590 m back. Not 1589.4, not 1590.6. The thin-plate spline in the engine is exact, and this lesson is about why that is the behaviour you want for structural mapping, when it is not, and what it lets you check on the Ekene map.

## Why the spline is exact

It is exact by construction rather than by luck. When the engine fits the spline, it builds a linear system whose right-hand side is the list of picked depths and whose rows state, one per control point, that the fitted surface evaluated at that point equals that point's depth. Solving the system is exactly the act of enforcing those equalities. No smoothing term is added anywhere that would let the solver trade a little misfit at the wells for a little less bending in between, so all the smoothing goes into the space between the pins.

This is the difference between fitting and interpolating. A least squares plane through the six picks would be a fit: it would miss every well by some amount, sitting shallower than some picks and deeper than others. The spline interpolates, and misses nothing.

## Why that is right for structural mapping

The wells are the hardest facts in the whole exercise. A well pick is a depth at which a bit passed through a surface and logs recorded it, tied to a surveyed coordinate. Everything else on a depth map is inference. If the map disagreed with a pick, the map would be wrong, because no algorithm knows better than the measurement about the one place the measurement was made.

There is a practical dimension too. Later work ties back to wells. A development well planned on the map gets drilled, and its actual top is compared against the predicted depth. If the map already disagreed with the existing wells by a metre or two, that comparison loses its meaning, because you can no longer separate prediction error from gridding error. An exact interpolator keeps the misfit at zero where you know the answer, so any misfit at a new well is genuinely information about the surface.

Exactness also makes the map auditable. Anyone can post the six picks on the map and confirm the contours agree with them, which is a cheap and effective quality check, and it only works because the method promises to honour the control.

## When you would not want it

Exactness is a virtue only when the data deserves it. Three situations argue the other way.

Noisy data. Automatically tracked seismic horizons or picks converted through an imperfect velocity model carry scatter that is not structure. Forcing a surface through every one of those values makes the algorithm reproduce the noise, and because a spline is smooth, it does so by bending hard, producing dimples and small closures that mean nothing.

Picks of uneven quality. Six wells might include two with excellent logs and clear tops, three that are reasonable, and one where the pick was a judgement call in a washed-out hole. An exact interpolator treats all six as equally certain and pins the surface just as firmly to the worst one as to the best.

Dense data. When there are thousands of picks a few metres apart, honouring every single one is not meaningful anyway, and a smoothing fit that misses each point slightly but follows the trend is the more honest description of what the data supports.

The general rule: exact interpolation for sparse, high quality, hand-checked control, which is the well-pick case; a smoothing or filtering approach when the data is dense, automatic or of mixed reliability. This course sits firmly in the first case with six checked well picks.

## The checkable consequence on the Ekene map

Here is a claim about the fixture you can test. The deepest value on the gridded map is exactly 1590 m, and 1590 m is Ekene-4's pick. The map bottoms out on a well and not below one, because the deepest control sits at a node and, in this geometry, no interpolated node dips below the deepest measurement. The sheet is being pulled down toward Ekene-4 in the northeast corner and there is nothing on the far side of it pulling harder.

Now compare that with the shallow end, which behaves completely differently. The shallowest value on the map is 1539.7181 m, and no well picked that. The shallowest pick is Ekene-3 at 1541 m, so the mapped crest is 1.28 m shallower than any measurement in the field. The same exact interpolator produced both numbers. At the deep end it returned a measurement. At the shallow end it returned an invention.

That asymmetry is not a bug and it is not a general law of splines either. It is a fact about this arrangement of six wells, and the only reason you know it is that you compared the map's extremes against the pick list. Get in the habit of doing exactly that. When a mapped extreme equals a pick, the map is reporting data at that spot. When it does not, the map is reporting the algorithm, and someone will still call it the crest of the field. Module 4 takes that crest apart.

## Exercise

For each of the following, say whether the value is a measurement or a product of the algorithm, and how you know. The deepest mapped value, 1590 m. The shallowest mapped value, 1539.7181 m. The value of the surface evaluated at Ekene-6's coordinates. As a self-check: 1590 m is a measurement, because it equals Ekene-4's pick and an exact interpolator reproduces picks at their own locations; 1539.7181 m is a product of the algorithm, because no well picked it and it lies 1.28 m above the shallowest pick of 1541 m; and the value at Ekene-6's coordinates is 1546 m, a measurement, for the same exactness reason. Then state in one sentence a case where you would deliberately choose a method that misses the picks.
