# The largest change is at the well

Comparing the six-well and seven-well maps node by node produces a map of differences. This lesson reads it, and the largest number in it turns out to be a number the tier already has.

## The comparison

Subtract the six-well surface from the seven-well surface at every live node. Both maps have the same 201 live nodes, so the difference is defined everywhere.

| | Value |
| --- | --- |
| Largest change | 5.6728515625 m, at (1500, 1500) |
| Mean absolute change | 1.919145119130908 m |
| Location of the largest change | Ekene-7's own node |

## Why the largest change equals the blind residual

This is not a coincidence and it is worth seeing why.

Before the new well, the map said 1543.3271484375 m at (1500, 1500). After the new well, the map honours the pick exactly and says 1549 m there. The change is

$$1549 - 1543.3271484375 = 5.6728515625\ \mathrm{m}$$

which is exactly the blind residual with the sign flipped.

So **the map moves at the new well by precisely the amount it was wrong there**. That is a property of an exact interpolator: adding a control point forces the surface through it, and the distance it has to travel is the error it was making.

The consequence is a small piece of foresight. The change a new well will cause at its own location is knowable the moment the pick arrives, before any regridding, by subtracting the prediction from the pick.

## Why the mean change is so large

The mean absolute change across all 201 nodes is **1.92 m**.

One well, moved 5.67 m at its own location, has shifted the average node by nearly two metres. That is a third of the local correction propagated across the entire map.

Two things drive it.

**A thin-plate spline is not local.** Every control point contributes to the surface everywhere, with an influence that falls off slowly. There is no radius beyond which a new well stops mattering.

**Six is a small control set.** Each well carries roughly a sixth of the surface's information, so adding a seventh redistributes a substantial share of it.

On a field with fifty wells, one more would move the mean node by centimetres. On six, it moves it by metres.

## What that says about the previous map

Uncomfortable, and worth saying plainly.

The six-well map was in use, contoured, read, and probably quoted. Adding one interior well changed the average node on it by 1.92 m, and the field's entire structural relief is 49 m. So roughly four percent of the total relief of the map was rearranged by a single well.

That is a direct measurement of how much of the six-well map was **assumption** rather than data. Not an estimate, not a model: the map changed by that much when one more fact arrived.

## The habit this suggests

> When a new well arrives, difference the old and new maps before doing anything else, and record the mean absolute change.

It costs one subtraction, it produces a number nobody has to argue about, and it is the most direct available answer to how much the previous map was to be trusted. A mean change of 0.1 m says the map was well constrained. A mean change of 1.9 m says it was not.

## Worked example

A new well arrives and the difference map shows a mean absolute change of 0.15 m with a largest change of 0.4 m at the well itself. What does that say?

That the map already knew what the well found. The prediction was within 0.4 m of the pick, which is a good blind test, and the surface barely moved anywhere.

It also says the well added little information to the map, which is a separate matter from whether it was worth drilling. A well that confirms the map is valuable for confidence and worthless for revision.

## Exercise

State the largest and mean absolute changes between the six-well and seven-well maps, explain why the largest one is at Ekene-7's location and equals the blind residual, and say what the mean change implies about the six-well map.

As a self-check: the largest change is 5.6728515625 m at (1500, 1500) and the mean absolute change over the 201 live nodes is 1.919145119130908 m. The largest is at Ekene-7 because an exact interpolator forces the surface through every control point, so the surface must move there by exactly the amount it was previously wrong, which is the blind residual. A mean change of 1.92 m against a total structural relief of 49 m implies that about four percent of the map's relief was rearranged by a single well, so a substantial part of the six-well map was interpolation rather than data.
