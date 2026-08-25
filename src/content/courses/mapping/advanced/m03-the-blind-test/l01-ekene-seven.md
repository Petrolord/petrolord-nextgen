# Ekene-7

The second instrument needs a well that the map has never seen. This lesson introduces it and sets up the test before any number is compared.

## The well

**Ekene-7**, an appraisal well at map coordinates **(1500, 1500)**, finding TOP_SAND at **1549 m**.

It is drilled inside the existing well pattern rather than as a step-out, which matters for three separate reasons that appear later in the tier.

## Where it sits

Distances from Ekene-7 to each of the six existing wells:

| Well | Distance | TOP_SAND |
| --- | --- | --- |
| Ekene-6 | 500.0 m | 1546 |
| Ekene-1 | 707.1 m | 1548 |
| Ekene-2 | 782.6 m | 1565 |
| Ekene-3 | 806.2 m | 1541 |
| Ekene-5 | 984.9 m | 1552 |
| Ekene-4 | 1486.6 m | 1590 |

The nearest control is 500 m away. Three wells sit within 810 m and the farthest is nearly a kilometre and a half.

It is **interior** to the control hull, comfortably inside the pentagon formed by the five outer wells. That is what makes it a fair test of interpolation rather than of extrapolation, and it is also what will make the seven-well set have two cross-validatable wells instead of one.

## What its pick looks like in context

At 1549 m, Ekene-7 is the fourth shallowest of the seven picks: 1541, 1546, 1548, **1549**, 1552, 1565, 1590.

It is 3 m deeper than Ekene-6, 500 m away, and 1 m deeper than Ekene-1, 707 m away. Nothing about it is anomalous. It is an ordinary interior pick that sits between its neighbours.

That ordinariness is worth noting before the comparison, because it removes one explanation in advance. If the blind test produces a large residual, it will not be because the new well found something exceptional.

## The rule the test depends on

**The prediction must be recorded before the pick is known.**

The six-well map already exists and already carries a value at (1500, 1500). That value is the prediction, and it must be read and written down before the new well is added to anything.

The natural instinct on receiving a new pick is to add it to the control set and regrid, which produces a better map and destroys the test in the same operation. Once Ekene-7 is control, the map honours it exactly and the residual is zero by construction, which measures nothing.

On this field the prediction is **1543.3271484375 m**, and the next lesson is where it gets read off the panel properly.

## Why an interior appraisal well is the right test

Three properties make it a good one.

**It is interpolation, not extrapolation.** The prediction at (1500, 1500) comes from inside the hull, which is the regime the map is actually used in.

**It is in the region the prospect is in.** P-1 at (1600, 1600) is only 141 m from Ekene-7, so the test is being run essentially where the decision is being made. A blind test on the far flank would be a weaker analogue.

**It is at a typical distance from control.** Its nearest well is 500 m away, against 361 m for P-1 and 707 m for the leave-one-out test at Ekene-6. All three are the same order, so the residuals are comparable.

## Worked example

Suppose the appraisal well had been drilled at (3200, 2800), well outside the existing pattern. What would the blind test have measured?

Extrapolation. The location is outside the six-well hull, so the existing map has no value there at all and the test could not be run. If the mask were disabled to force a number, the residual would measure how a thin-plate spline behaves beyond its control, which is usually poor and always irrelevant to how the map performs inside the field.

A step-out well tests the concept of the play. Only an interior well tests the map.

## Exercise

State Ekene-7's location, pick and nearest control distance, then explain in two sentences why the prediction has to be recorded before the well is added to the control set.

As a self-check: Ekene-7 is at (1500, 1500) with a TOP_SAND pick of 1549 m and its nearest control is Ekene-6 at 500 m. The prediction must be recorded first because the test compares what the six-well map said against what the well found, and adding the well to the control makes the map honour 1549 m exactly at that location. The residual would then be zero by construction and would measure the interpolator's exactness rather than its predictive skill.
