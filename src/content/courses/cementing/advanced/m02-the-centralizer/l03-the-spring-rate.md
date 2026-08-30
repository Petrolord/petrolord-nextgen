# The spring rate

Turning a manufacturer's single number into a linear spring.

{{panel:cm-standoff-explorer}}

## The manufacturer's number

A bow spring centralizer is specified by its RESTORING FORCE at a stated standoff, conventionally 67 percent. On this course's jobs that is 8900 N at 0.67.

That is one point on a force-deflection curve.

## What the engine does with it

Assumes the curve is a straight line through the origin, and computes its slope:

    deflection at 67 percent standoff = (1 - 0.67) x clearance
    k = restoring force / that deflection

On this well's open hole, with a clearance of 0.019049999999999997 m:

    k = 8900 / (0.33 x 0.019049999999999997) = 1415732.124393542 N per metre

## Then the deflection under the actual load

    deflection = min(clearance, W / k)

capped at the clearance, because the pipe cannot go through the wall.

At 12 m spacing and 40 degrees, with a load of 2665.871594451281 N:

    2665.871594451281 / 1415732.124393542 = 0.0018830339076986488 m

and the standoff at the centralizer is

    (0.019049999999999997 - 0.0018830339076986488) / 0.019049999999999997 = 0.901153075711357

## The clearance is inside the spring rate

Which is worth staring at. The same centralizer has a DIFFERENT spring rate in a different hole size, because the deflection at which its force was quoted depends on the clearance.

In this well's cased section, clearance 0.021348699999999998:

    k = 8900 / (0.33 x 0.021348699999999998) = 1263294.5785784135 N per metre

A softer spring in the bigger hole, from the same device. That follows from the convention, not from the steel.

## The assumption

A real bow spring is not linear. Its force rises steeply as it approaches full compression and it can take a permanent set if it is overloaded.

The linear model is a planning approximation, and it is worst exactly where it matters: at large deflections, where a real spring would be stiffer than the line predicts and the engine therefore UNDERSTATES the standoff.

Conservative, which is the right direction, and approximate.

## Doubling the force

    k = 17800 / (0.33 x 0.019049999999999997) = 2831464.248787084

exactly twice, so the deflection halves. At 12 m and 90 degrees the standoff at the centralizer goes from 0.8462214846722909 to 0.9231107423361454.

A useful improvement at the centralizer, and module 3 shows that it is not where the problem is.

## Exercise

Compute the spring rate for a 13350 N centralizer in this well's open hole.

Then compute the deflection it would suffer at a 12 m spacing and 90 degrees, and the standoff at the centralizer.
