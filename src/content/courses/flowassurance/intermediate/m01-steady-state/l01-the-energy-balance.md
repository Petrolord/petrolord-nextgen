# The energy balance

A flowing line loses heat in proportion to the temperature it still has, so it gives up most of that temperature early and almost none late.

{{panel:pd-line-explorer}}

## One equation, and the rest is consequence

The balance puts m Cp dT/dx on the left, the heat the stream carries past a station, and minus U pi D times the excess over ambient on the right, the heat the wall hands to the sea there. With the ambient fixed the solution is an exponential in that excess. No pressure term, no clock and no phase change is in it.

## The teaching line, heat loss and nothing else

TEACHING LINE AKASO SPUR carries 90000.0 lb/hr at Cp 0.620 Btu/(lb degF) into a 9.562 in bore at 195.00 degF against a 45.00 degF seabed, over 60000.0 ft. It is a teaching construct, not a published case and not a real line.

Its overall U referred to the bore is 0.452972856617 Btu/(hr ft2 degF), its relaxation length is 49209.01299043 ft, and its ntu over the full length is 1.219288832549, so exp of minus that ntu is 0.295440199685. The inlet excess of 150.0000 degF arrives as 44.3160299527 degF, an arrival of 89.316029952695 degF. No pressures are passed, so the Joule-Thomson term is exactly zero.

## The heat leaves where the fluid is hottest

Four stations off the 21 station teaching profile at 3000.00 ft spacing.

| x, ft | Temperature, degF | Excess over the seabed, degF |
| --- | --- | --- |
| 0.00 | 195.0000000000 | 150.0000000000 |
| 6000.00 | 177.7816979418 | 132.7816979418 |
| 54000.00 | 95.0626561939 | 50.0626561939 |
| 60000.00 | 89.3160299527 | 44.3160299527 |

Equal lengths, unequal duty. The first 6000.00 ft of pipe costs far more excess than the last 6000.00 ft of the same pipe at the same U against the same seabed, because the driving force is the excess itself.

## The verdict rests on a number the engine never computes

The flowing hydrate boundary used here is 71.00 degF, a teaching laboratory input rather than an engine output. The module header says so: hydrate and wax boundaries are fluid properties, they come from a lab or a compositional flash, and the consumer supplies them. Against it the arrival sits 18.3160299527 degF outside the hydrate region, and none of the 21 stations falls below it, the coldest point being the arrival at 89.31602995 degF.

Move the laboratory number and the verdict moves with it while every engine output stays put. Quoting a margin as though the engine had computed both of its ends is the careful mistake here.

## What it refuses

`steadyStateProfile` refuses a zero length and a zero U with one message: the profile needs a length, a mass rate, a heat capacity and a heat transfer coefficient. It will not tell you where the hydrate boundary is, and it will not check the one you gave it. Neither refusal has anything to say about the answer being useful.

## Exercise

Run AKASO SPUR with no pressures set and record the arrival and its excess over the seabed.

Then say which 6000.00 ft of it loses the most degF, and why that holds for any inlet you choose.
