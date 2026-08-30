# What changes it

Five inputs, and how much each one moves the answer.

{{panel:hy-rheology-explorer}}

## The flow rate

The largest lever by far. On the slant well with kcl_polymer, going from 0.015 to 0.035 m3/s takes the pump pressure from 5228695.19213203 to 20875441.5255568 Pa, a factor of four for a factor of 2.33 in rate.

## The mud

Slant well at 0.025 m3/s: kcl_polymer needs 11771089.324261548 Pa and light_wbm needs 9141977.538404413 Pa.

The lighter, thinner mud costs 22 percent less pump pressure. Two things are moving together there: the density, which enters every term linearly, and the rheology, which is thinner throughout.

## The string

Not varied in this course, and the largest lever nobody thinks of. The drill collars' 0.05715 m bore carries a large share of the pipe loss, which is two thirds of the total, so a bigger-bore assembly moves the pump pressure more than almost anything else.

## The nozzles

Moves the bit share and nothing else. At 0.025 m3/s, going from 0.0007 to 0.0003 m2 of total flow area takes the bit pressure from 1017581.5478545991 to 5540166.204986151 Pa, which is a factor of 5.4 for a factor of 2.3 in area, exactly the inverse square.

## The depth

Every metre of hole adds pipe and annulus length. Both losses are proportional to length at a fixed velocity, so the pump pressure grows roughly linearly with depth in a section of constant geometry.

That is why the pump pressure creeps up all through a hole section and jumps down when a smaller bit is picked up.

## The one that does not change it

The formation. Nothing about the rock enters the pump pressure calculation at all.

So a pump pressure that changes with no change to any of the five inputs above is telling you something changed in the string or in the mud: a washout, a plugged nozzle, a bit balling up, or a mud property drifting.

That is exactly what makes the comparison between measured and computed pump pressure a diagnostic.

## The ranking

Flow rate, then the string's bore, then the mud, then the nozzles, then depth. The first two are usually fixed by the time the question is asked, which is why the mud and the nozzles get the attention.

## Exercise

Compute the pump pressure ratio between the two muds at each of the three flow rates on the slant well.

If the ratio is roughly constant, the effect is multiplicative and you can quote one number. If it is not, say which flow rate the difference matters most at.
