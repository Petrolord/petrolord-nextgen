# The hookload that went negative

The result that says the string will not go in.

{{panel:td-string-explorer}}

## The number

On the horizontal well, tripping in:

    hookload = -16676.68507494847 N

A negative hookload. The hook would have to PULL DOWN on the string to make it descend at 0.3 m/s.

## What the model is saying

That the friction holding the string up exceeds the string's own weight resolved along the hole.

In the 1600 m lateral there is no component of gravity along the hole at all, because the hole is horizontal. Every metre of that lateral contributes side force from its own weight, and therefore friction, and none of it contributes any driving force.

So the string in the vertical and build sections has to push the lateral section along, and there is not enough of it to do so.

## What actually happens on a rig

The string stops.

You cannot push a drill string. It is thousands of metres of thin steel in a hole slightly larger than itself, and the moment it goes into compression beyond a small limit it buckles, first into a sine wave lying in the low side and then into a helix wrapped around the wall. Once it is helical it presses outward hard, which increases the friction, which requires more push, which buckles it further. That is lock-up, and the Expert tier is where it is taught properly.

## The warning the model gives you

Look at the panel row: buckling begins at 0 m. The whole string is flagged.

That is the model telling you it has left its own domain. It has returned a number, and the number is arithmetic rather than physics: it computed friction from a compression the string could not actually have carried.

The minimum tension along that string is -281944.752574833 N, which is 282 kN of compression in drill pipe whose sinusoidal buckling limit at 90 degrees is 171229.45713680828 N. It buckled long before it got there.

## The right response

Not to refine the step. Not to lower the friction factor until the number goes positive.

The response is to change the plan: a lighter mud to reduce nothing useful, or more likely heavier drill pipe in the lateral, a tractor, a friction reducer in the mud, or a shorter lateral. All of those change the physical problem, which is what the model is telling you needs to change.

## The slide-drilling case is worse

Slide drilling the same well gives a hookload of -156755.75915568782 N and a minimum tension of -422023.82665557245 N.

Sliding cannot be done here at all. That is a real and common finding on long laterals, and it is why rotary steerable systems, which never slide, took over extended reach drilling.

## Exercise

Reduce the open-hole friction factor in the panel until the horizontal well's slack-off hookload becomes positive, and note the value.

Then say whether achieving that friction factor with a mud additive would actually solve the problem, using the minimum tension rather than the hookload to justify your answer.
