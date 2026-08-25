# Why they differ

The two means are 31.1667 m and 32.2543 m, a gap of 1.0876 m. This lesson takes the gap apart into two named causes and shows that neither of them is an error.

## The gap is not gridding noise

The first thing to establish is that the gap is real. Run the isochore at three cell sizes and compare:

| Cell size | Live nodes | Map mean | Gap over the well mean |
| --- | --- | --- | --- |
| 50 m | 794 | 32.28733137692853 | +1.1207 |
| 100 m | 201 | 32.25429068038713 | +1.0876 |
| 200 m | 50 | 32.271982421875 | +1.1054 |

A sixteenfold change in node count moves the gap by three centimetres. Whatever is causing it is a property of the field and the well pattern, not of the grid.

## Cause one: the wells do not control equal areas

Assign every live node to its nearest well and count how much of the map each well speaks for.

| Well | Thickness | Nodes | Share of the map |
| --- | --- | --- | --- |
| Ekene-6 | 34 | 68 | 33.8 percent |
| Ekene-3 | 29 | 38 | 18.9 percent |
| Ekene-1 | 32 | 31 | 15.4 percent |
| Ekene-5 | 31 | 24 | 11.9 percent |
| Ekene-2 | 36 | 22 | 10.9 percent |
| Ekene-4 | 25 | 18 | 9.0 percent |

The well mean gives each of these a weight of one sixth, 16.7 percent. The map gives Ekene-6 a weight of 33.8 percent, more than double, and Ekene-4 a weight of 9.0 percent, about half.

Now look at which wells gained and which lost. **Ekene-6 is thick at 34 m and gained the most weight. Ekene-4 is the thinnest at 25 m and lost the most.** The area weighting has systematically promoted the thick wells and demoted the thin one.

Recompute the well mean with those area weights instead of equal ones and it becomes **31.801 m**, up from 31.167 m. So area weighting accounts for $+0.634$ m of the gap, a little under two thirds of it.

The reason Ekene-6 dominates is geometric rather than geological: it is the only well inside the hull of the others, so it is the nearest control for the whole middle of the field, while the five hull wells each speak only for their own corner and lose half of their surroundings to the mask.

## Cause two: the spline does not average its control

The remaining $+0.453$ m is the interpolator.

A thin-plate spline does not produce a surface whose average is the average of its control points. It minimises bending energy subject to passing through them exactly, and a minimum-bending surface through six scattered values overshoots and undershoots between them. Those departures do not cancel, because the control points are not symmetrically arranged.

On this field the net effect is upward: the surface spends more of its area above the level its control implies than below it. The tile that reads **146 of 201 nodes above the well mean** is the direct measurement of that asymmetry.

So the decomposition is:

$$31.167 \xrightarrow{\ \text{area weighting}\ } 31.801 \xrightarrow{\ \text{spline shape}\ } 32.254$$

## Neither is an error

This is the part that matters.

The area weighting is **correct behaviour** for anything that will be multiplied by area. A volume calculation wants the thick middle of the field to count for more than the thin corner, because it is more of the field.

The spline departure is **the price of interpolation**, and it is the same price the Associate tier's crest problem charged. A surface that honours six points exactly and bends as little as possible between them is a defensible choice, and it has consequences that show up in its statistics.

What would be an error is quoting one mean and calling it the other, or presenting the gap as a discrepancy to be reconciled. There is nothing to reconcile. Two different questions have two different answers.

## Worked example

A reviewer asks why the map says 32.25 m when the wells say 31.17 m, and suggests the map should be adjusted to honour the well average. What is the answer?

That adjusting the map to reproduce the well average would break it. The map already honours every well exactly at its own location, which is the honouring that matters; forcing its area average to equal the well average would require moving the surface away from the wells or away from the minimum-bending fit, and both are worse.

Then give the decomposition: about two thirds of the gap is that Ekene-6 controls a third of the map while counting a sixth in the well average, and the rest is the shape of the interpolated surface between the wells.

## Exercise

State how much of the 1.0876 m gap is explained by area weighting, name the well that gains the most weight and the one that loses the most, and say in one sentence why the gain and loss run in the direction that raises the map mean.

As a self-check: area weighting explains $+0.634$ m of the gap, about two thirds, leaving $+0.453$ m to the shape of the spline. Ekene-6 gains the most, from 16.7 to 33.8 percent, and Ekene-4 loses the most, from 16.7 to 9.0 percent. The gain and loss raise the map mean because Ekene-6 at 34 m is one of the thicker wells while Ekene-4 at 25 m is the thinnest, so the weighting promotes a thick value and demotes the thinnest one.
