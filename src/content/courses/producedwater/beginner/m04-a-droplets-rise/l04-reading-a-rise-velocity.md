# Reading a rise velocity in the studio

This lesson is a reading exercise. The studio prints a rise velocity and a Reynolds number beside the water it was computed for, and the skill is knowing what each of those two figures is doing.

## The UZERE median droplet

Take the stream this tier follows. The water is 0.000710553998 Pa.s and the density difference is 142.391799 kg/m3, and the droplet population has a median of 26 micron. Ask the engine how fast that median droplet rises and it returns 0.000073804485 m/s at a Reynolds number of 0.002796, which is inside the band by a wide margin.

## Reading the velocity itself

A velocity with that many leading zeros in it looks like nothing at all, and that instinct is the useful one. It is the reason a gravity vessel treating produced water has to be large: the only way to buy a droplet that slow the time it needs is plan area, which the next module is about.

## Reading the Reynolds number beside it

The Reynolds number of 0.002796 is the evidence that the velocity beside it can be believed. It sits far below the stated limit of 1, so the creeping flow assumption is comfortable rather than marginal. Compare it with a coarser droplet in the same water: at 240 micron the engine returns a Reynolds number of 2.198987, past the limit. The band is a statement about the droplet and the water together rather than about the water alone, so a stream can hold droplets inside the band and droplets outside it at once.

## Two things this figure is not

It is not a treating answer. Nothing has been removed from anything yet, because a rise velocity says how fast a droplet travels and says nothing about whether the vessel gives it the room. It is also not the velocity of the oil. A population of droplets has a population of velocities, one for each size, and the figure above belongs to the median droplet of this particular stream. Coarse droplets in the same water rise faster and fine ones slower, which is exactly why a device removes a fraction rather than everything.

## What to do with it

Use it as a sanity check on the inputs. A rise velocity far from what the water and the crude would suggest usually means a density or a temperature was typed wrong, and that is much easier to see here than three devices further down a train.

{{panel:pw-water-explorer}}

## Exercise

Say what the Reynolds number printed beside a rise velocity adds that the velocity alone does not. Then explain why a single stream has many rise velocities rather than one, and which of them the studio is reporting.
