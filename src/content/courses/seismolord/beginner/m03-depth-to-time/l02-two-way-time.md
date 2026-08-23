# Two-way time

The time axis of a seismic trace has a specific meaning that is easy to state and easy to forget. It is the time for energy to travel from the surface down to a reflecting interface and back up again. Down and back. Two-way time, abbreviated TWT and quoted in milliseconds.

## Where the factor of two comes from

Reflection seismic puts the source and the receiver on the same side of the target. There is no instrument waiting at the reservoir to catch the wave on its way past, so the only way to learn about an interface is to send energy down and wait for the part of it that comes back. Every arrival on a seismic trace has made the trip twice.

For a vertical path through material of average velocity $v$, down to an interface at depth $z$, the distance travelled is $2z$ and the time taken is

$$TWT = \frac{2z}{v}$$

The velocity in that expression is the average velocity of everything between the surface and the interface, not the velocity of the interface itself and not that of any single bed. It is an overburden average, because the energy had to cross all of it.

## Worked example

Take an interface at $z = 1500$ m with an average overburden velocity of $v = 2000$ m/s.

1. Total path length: $2 \times 1500 = 3000$ m.
2. Divide by velocity: $3000 / 2000 = 1.5$ s.
3. Convert to milliseconds: $1.5 \times 1000 = 1500$ ms.

So the reflection arrives at 1500 ms of two-way time. That number reappears throughout this course: it is the two-way time of the top of the teaching well's logged interval, and one of the six numbers the capstone grades.

## The single most common beginner error

The mistake to guard against is dropping the factor of two. It is not an exotic error. It is the error, the one that shows up most often in first attempts, and it is worth naming plainly so you recognise it in your own arithmetic.

Compute the same case without the two and you get $1500 / 2000 = 0.75$ s, which is 750 ms. That is a real quantity, but it is the one-way time, the time for the energy to reach the interface and nothing more. Put it on a display and your reflector sits at half its correct time, which in this course would mean half its correct depth as well.

The error is seductive because 750 ms is a perfectly plausible seismic time. A time that is exactly half of the right answer is far more dangerous than one that is obviously absurd, because absurd numbers get caught and plausible ones get mapped.

## The sanity check

There is a two-step check you can run on any time-depth statement.

First, halve the two-way time to get the one-way time. Half of 1500 ms is 750 ms, which is 0.75 s. Second, multiply the one-way time by the average velocity to get the depth. $0.75 \times 2000 = 1500$ m. If you get back the depth you started with, the factor of two was handled correctly. If you get back double or half of it, you know which way you slipped.

## Which depth, exactly

The formula assumes a vertical path, which raises a question about what $z$ means. Three depth measurements are in routine use and they are not the same thing.

* **Measured depth (MD)** is the length of hole drilled, measured along the borehole from the drilling reference. If the well deviates, MD runs along the curve.
* **True vertical depth (TVD)** is the vertical distance from the same drilling reference straight down to the point. For a deviated well, TVD is always less than MD.
* **True vertical depth subsea (TVDSS)** is TVD referenced to mean sea level rather than to the drilling datum, usually the kelly bushing sitting tens of metres above sea level.

Seismic times are referenced to a seismic datum, commonly mean sea level, so the depth that belongs in the two-way time formula is a subsea vertical depth. Feeding measured depth from a deviated well into that formula puts your reflector too deep, and forgetting the elevation of the drilling reference shifts every time in the well by a constant amount.

This course sidesteps all of it, on purpose and out loud. The teaching well is vertical, so MD and TVD are identical, and its reference is placed at mean sea level, so TVD and TVDSS are identical too. All three coincide, and a depth of 1500 m means the same thing whichever convention you name.

That is a simplification, not a fact about wells. It is stated here rather than buried so that you know which real complication has been switched off. In your own work, always ask which of the three a depth is, because a deviated well or a tall rig floor makes them disagree by amounts large enough to ruin a tie.

## Exercise

Convert a reflector at 2400 m to two-way time using an average overburden velocity of 2000 m/s, then run the sanity check in both directions. As a self-check: the path length is 4800 m, the two-way time is $4800 / 2000 = 2.4$ s, which is 2400 ms; halving gives 1200 ms of one-way time, and $1.2 \times 2000$ returns 2400 m. Then write down the wrong answer produced by forgetting the factor of two, and say in one sentence why that particular wrong answer is hard to spot. Finally, state which of MD, TVD and TVDSS belongs in the formula, and why all three are interchangeable for the teaching well.
