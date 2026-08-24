# Reading the column

The last lesson established that each layer has its own gradient. This lesson reads the whole golden profile, top to bottom, and shows what that looks like as a curve and how to describe it correctly.

## The profile

The engine solves the fixture on twenty-one nodes: the surface plus twenty cell centres at 50, 150, 250 and so on to 1950 m. Here is the whole solution.

| depth | T (degC) | depth | T (degC) |
|---|---|---|---|
| 0 m | 10 | 1050 m | 44.190476190476254 |
| 50 m | 11.666666666666671 | 1150 m | 45.90476190476196 |
| 150 m | 15.000000000000012 | 1250 m | 47.61904761904767 |
| 250 m | 18.333333333333353 | 1350 m | 49.33333333333339 |
| 350 m | 21.666666666666693 | 1450 m | 51.04761904761911 |
| 450 m | 25.000000000000032 | 1550 m | 52.76190476190482 |
| 550 m | 28.33333333333337 | 1650 m | 54.47619047619054 |
| 650 m | 31.66666666666671 | 1750 m | 56.190476190476254 |
| 750 m | 35.00000000000006 | 1850 m | 57.90476190476197 |
| 850 m | 38.33333333333339 | 1950 m | 59.619047619047684 |
| 950 m | 41.66666666666673 | | |

The trailing digits are floating point noise from the solver. The values at 50 m, 950 m and 1950 m are graded in the capstone, each to a tolerance of 0.05 degC, which is far wider than that noise.

## Two straight segments

Read the left column downward. Each step of 100 m adds the same 3.333333333333333 degC, so the upper half of the profile is a straight line from 10 degC at the surface to 41.66666666666673 degC at 950 m. Its slope is the 33.333333333333336 degC per km of the last lesson.

Read the right column downward. Each step of 100 m adds a constant 1.7142857142857142 degC, a little over half the step in the left column. That segment is straight too, with the slope of 17.142857142857142 degC per km.

So the profile is not a curve in any smooth sense. It is two straight segments joined at 1000 m, one steep and one gentle, and the join is the only interesting feature in it.

## What happens at 1000 m

At the layer boundary the temperature is

$$T = 10 + \frac{0.06 \times 1000}{1.8} = 43.333333333333336 \text{ degC}$$

which sits between the last upper-layer cell at 950 m and the first lower-layer cell at 1050 m, as it should.

Two things are true at that boundary and they are easy to confuse.

Temperature is continuous. There is one temperature at 1000 m, 43.333333333333336 degC, and both layers agree on it. Rock on either side of a contact is in thermal contact, so a jump in temperature across a surface of zero thickness is not physically possible. The upper layer ends at that temperature and the lower layer begins from it.

The gradient is discontinuous. It changes abruptly from 33.333333333333336 degC per km to 17.142857142857142 degC per km at exactly that depth, because conductivity changes abruptly there and heat flow does not change at all.

That is what people mean when they say a temperature profile has a kink at a lithology boundary. The kink is in the slope rather than in the value. Plot the profile and you see a continuous line with a corner in it. Plot the gradient instead and you see a step.

If you ever produce a profile with a jump in the temperature itself at a contact, that is a bug rather than geology, and the usual cause is two segments computed independently from the surface rather than chained, so that the second segment never inherits the first one's base temperature.

## Reading the bottom of the column

The deepest cell, at 1950 m, is at 59.619047619047684 degC. Build it from the boundary rather than from the surface:

$$T = 43.333333333333336 + \frac{0.06 \times 950}{3.5} = 59.619047619047684 \text{ degC}$$

Compare that with what the shallow gradient would have predicted. Carrying the upper layer's 33.333333333333336 degC per km down to 1950 m instead lands at exactly 75 degC, against a true 59.61904761904762 degC, an overprediction of 15.38095238095238 degC. That is one change of conductivity, no change in heat flow at all, and an error large enough to move a source rock in or out of the oil window.

That is the practical shape of the last lesson's warning. The error is not subtle, it grows with distance from the interval you measured, and it points in a direction you can work out in advance from the lithology.

## How to describe this column to someone else

Say it in three parts, and in this order. The basal heat flow is 60 mW/m2, which is 0.06 W/m2. The upper 1000 m has a conductivity of 1.8 W/m/K and a gradient of 33.333333333333336 degC per km. The lower 1000 m has a conductivity of 3.5 W/m/K and a gradient of 17.142857142857142 degC per km. Then quote temperatures with their depths: 43.333333333333336 degC at 1000 m, 59.619047619047684 degC at 1950 m.

What you never say is that the column has a gradient. It has two, and the heat flow is the only quantity that describes the whole thing.

The panel plots this profile and lets you change the inputs to see how the two segments respond.

{{panel:bs-burial-heat-explorer}}

## Exercise

Using the table, work out the temperature rise across each 100 m step in the upper layer and across each 100 m step in the lower layer, and check both against the gradients quoted for those layers. Then say what would happen to the temperature at 1950 m if the upper layer's conductivity were lowered while everything else stayed the same.

Self check: each 100 m step in the upper layer adds 3.333333333333333 degC, which is 33.333333333333336 degC per km expressed per cell, and the table agrees, since 11.666666666666671 degC at 50 m and 15.000000000000012 degC at 150 m differ by that amount. Each 100 m step in the lower layer adds 1.7142857142857142 degC, which is 17.142857142857142 degC per km per cell, a little over half the upper-layer step. Lowering the upper layer's conductivity makes that layer a worse conductor, so its gradient steepens, the temperature at the 1000 m boundary rises, and every temperature below it rises by the same amount, including the one at 1950 m. The lower layer's own gradient is unchanged, because neither its conductivity nor the heat flow through it has changed.
