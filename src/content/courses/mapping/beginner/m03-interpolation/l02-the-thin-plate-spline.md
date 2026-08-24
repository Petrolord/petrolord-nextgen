# The thin-plate spline

The Mapping app grids with a thin-plate spline, usually shortened to TPS. It is the fourth family from the previous lesson, the smooth-sheet one, and it is worth understanding properly because every number the capstone grades comes out of it.

## The bent sheet

Imagine a thin metal sheet, large enough to cover the field, and six pins driven in at the well locations, each pin set at the picked depth. Push the sheet onto the pins. It has to touch all six, and it will do so in the laziest way it can, taking whatever shape stores the least bending energy. Away from the pins it does not flap or ripple, because ripples cost energy. That resting shape is the thin-plate spline.

Stated as mathematics, the method chooses the surface that passes exactly through every control point while minimising the total bending, and the solution to that problem has a fixed form:

$$z(x,y) = a_0 + a_x x + a_y y + \sum_{i=1}^{n} w_i \, U(r_i)$$

The first three terms are a tilted plane, the regional dip of the surface. The sum adds one bump per control point, where $r_i$ is the distance from the point being evaluated to control point $i$ and the basis function is $U(r) = r^2 \log r^2$, defined as zero at zero distance. The engine fits the plane coefficients and the $n$ weights $w_i$ together, by building one dense linear system of $n + 3$ equations and solving it with Gaussian elimination and partial pivoting. That solve is a one-off cost; after it, evaluating a node is just the plane plus a loop over the six weighted bumps.

You do not need to reproduce that algebra. You do need four consequences of it.

## It is smooth everywhere

There is no tiling, no crease and no bullseye. The surface has continuous slope and curvature across the whole mapped area, including right at the wells, because the same single expression is evaluated at every node. Contours curve like geological contours instead of turning corners at data points. This is why a TPS map looks credible, and it is also the first thing to be suspicious about: it looks equally credible where there is no data.

## It can overshoot

Averaging methods are trapped inside the range of the data. A spline is not. To stay smooth through the six pins, the sheet is allowed to rise above or fall below every pin in between them, in the same way a flexible ruler bent through a set of points bows past them.

The Ekene fixture shows this exactly. The shallowest pick in the field is Ekene-3 at 1541 m. The shallowest node on the gridded map is 1539.7181 m, so the crest of the mapped surface is 1.28 m shallower than any measurement ever taken in the field. Nothing has gone wrong. The engine is doing what a bent sheet does, and that overshoot is a real prediction about a location between wells. It is also not a measurement, and module 4 spends a lesson on precisely this crest.

## It is global

Every control point appears in the sum for every node. Evaluating a node at the far southwest corner of the grid still adds a contribution from Ekene-4 in the northeast, 2600 m away. That is not a rounding detail, it is the definition of the method.

So the fit is not local. Change one pick, or add a seventh well, and the whole system is resolved and every node moves, including nodes on the opposite side of the field. Most move by a tiny amount, but none are untouched. When you correct a top after a map has been made, re-grid and re-read the whole map rather than assuming a distant contour stayed put. It is also why a bad pick is contagious here in a way it is not with nearest neighbour or triangulation: one wrong depth pulls on the entire sheet.

## Two housekeeping rules from the engine

The solver needs at least three control points, and it refuses the job if the system is singular, which happens when the control points are collinear or duplicated. Three wells on a straight line define no unique surface, so the engine raises an error rather than returning something it cannot justify. Non-finite depths and the null flag value are filtered out before fitting.

The engine also decimates very large control sets. Solving a dense system of this kind costs roughly the cube of the number of control points, so beyond a default ceiling of 700 the engine keeps one representative point per cell of a coarse grid laid over the data, drops the rest, and reports how many it dropped. At dense seismic pick spacing the decimated fit is indistinguishable from the full one. On the Ekene fixture this never fires: six points is far under the ceiling, so all six are used and the dropped count is zero. Know the rule exists so that a nonzero dropped count on a real seismic horizon does not surprise you.

## Exercise

Without computing anything, answer three questions about the Ekene map. First, if Ekene-4's pick were corrected from 1590 m to 1585 m, which nodes on the map would change? Second, why can the crest be shallower than every pick? Third, how many of the six control points does the engine use for the fit? As a self-check: all live nodes change, because the fit is global and the whole system is resolved; the crest can be shallower because a smooth sheet through fixed pins bows past them, and the fixture shows this with a crest of 1539.7181 m against a shallowest pick of 1541 m; and all six are used, because decimation only trims control sets above the 700-point ceiling.
