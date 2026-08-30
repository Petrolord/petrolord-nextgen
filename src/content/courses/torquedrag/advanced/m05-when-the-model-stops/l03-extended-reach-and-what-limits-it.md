# Extended reach, and what limits it

Four limits, and which one binds first.

{{panel:td-buckling-explorer}}

## The four

**Hookload.** Pulling the string out of a long well. Limited by the derrick and by the pipe's tensile capacity.

**Torque.** Turning it. Limited by the top drive and by the pipe's torsional capacity.

**Weight transfer.** Getting load to the bit. Limited by buckling and lock-up.

**Hydraulics.** Circulating enough to clean the hole at the pressures the formation will take. Not in this course.

## Which one binds

Not the one people expect.

On the horizontal well in this course, tension utilization rotating on bottom is 0.07364558584156092 and torsion is more than three times that. Extend the lateral and the gap widens, because a lateral adds contact length and no true vertical depth.

So on a long lateral the binding constraint is torque, then weight transfer, and hookload is comfortable throughout.

That is the reverse of a deep vertical well, where hookload binds and torque is trivial.

## Why torque grows so fast with reach

Every metre of lateral adds:

    friction torque per metre = mu x (buoyed weight per metre) x (tool joint radius)

For this drill pipe at 0.35 friction: 0.35 x 265.26806749988424 x 0.0841375, about 7.81 N.m per metre.

That is linear in length, and it accumulates from the toe all the way to surface. A 5000 m lateral adds around 39 kN.m to the surface torque from the drill pipe alone, which is a substantial fraction of most drill pipe's torsional rating.

## Why weight transfer fails before hookload does

Because the compression needed to push the string along the lateral grows with the lateral's length, and the buckling limits do not grow at all.

The limits are a property of the pipe, the hole and the inclination. Once the required compression exceeds them, adding length makes it worse and nothing about the pipe has changed.

## What is done about it

**Torque:** reduce the friction factor with mud or with torque reduction subs, use a larger pipe with a higher torsional rating, use a rotary steerable to avoid the sliding.

**Weight transfer:** heavier pipe in the lateral, a tractor, or do not slide.

**Hookload:** rarely the problem, and back reaming makes it better at the expense of the one that is.

## The design conversation this supports

When somebody proposes a longer lateral, the first question is what happens to the surface torque, not what happens to the hookload.

That is a change in habit from vertical-well thinking, and the utilization ratio is the number that makes it visible in one line.

## Exercise

Compute the friction torque per metre of lateral for the drill pipe at friction factors of 0.20, 0.35 and 0.50.

Then compute how long a lateral each of those allows before the drill pipe's torsional capacity of 100465.75263363292 N.m is reached, ignoring everything above the lateral.
