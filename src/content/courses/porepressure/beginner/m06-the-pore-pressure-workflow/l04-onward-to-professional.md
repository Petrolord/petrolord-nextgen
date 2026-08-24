# Onward to Professional

This tier taught one well. You fixed its references at 4000 m of section below the mudline in 100 m of water, with seawater at 1025 kg/m3, pore fluid at 1030 kg/m3 and gravity at 9.80665 m/s2. You built a hydrostatic column of 41.408579625 MPa at 4000 m below mudline out of two parts you can add by hand. You integrated a density that runs from 1900 kg/m3 at the mudline to 2505.265301734371 kg/m3 at total depth into an overburden of 91.12306695073282 MPa there. You learned Gardner's fallback, 1960.612149304395 kg/m3 at 1600 m/s. You evaluated the well's own compaction trend at 2500 m below mudline as 317.2847498247154 us/m, and you fitted a trend to twelve shale picks that returned 650.0000000000014 us/m and 0.7000000000000015 per km rather than the header's 656 us/m and 0.6 per km. Then you read the frame and found where the log leaves the trend.

That is a complete skill and it is deliberately narrow in one direction. Everything you built is a frame. Nothing you built is a pore pressure. The two tiers above close exactly that gap, and it is worth knowing what they are before you decide whether to climb.

## Professional: turn the departure into pressure

The Professional tier takes the same sonic log and the same trend and runs a full Eaton prognosis over them with an exponent of $n = 3$.

Eaton's method works on the ratio between the transit time the log actually reads and the transit time the trend says it should read at that depth. Where the two agree, the ratio is one and the method returns the hydrostatic. Where the log runs slow, the ratio departs from one, the effective stress carried by the grain framework is reduced, and the difference is handed to the pore fluid as overpressure. The frame you built is what makes that subtraction possible, because the method needs an overburden to subtract from and a hydrostatic to reference against.

The tier's headline result on this well is a closed loop. The sonic below 2500 m was constructed by encoding a pressure ramp into the transit times, and the prognosis run over that log recovers the imposed pressures exactly. The overpressure at total depth comes out at exactly 6 MPa, which is the 4 kPa per m ramp acting over the 1500 m below 2500 m.

That exactness is the point of a synthetic well. On a real well you never learn whether your prognosis was right, because there is no answer key, only a handful of pressure measurements and a drilling record. On this one the answer is known in advance, so the tier can demonstrate that the method is sound before it is pointed at data whose truth nobody holds.

Two things you already know become load bearing there. The trend you pick decides what counts as normal, so a fit through the wrong points shifts the whole pressure curve. And the departure you learned to read at this tier is the only input the method has, so the quality of the sonic below 2500 m sets the quality of every pressure the tier reports.

## Expert: turn pressure into a drilling decision

The Expert tier takes the prognosis and turns it into the numbers a driller actually uses at total depth: the mud-weight window.

A pore pressure in MPa does not tell anyone what mud to pump. Mud is specified as a density, so pressures are converted to equivalent mud weight in kg/m3, referenced to sea level. You have already met the two figures that bound that conversion on this well. The hydrostatic at total depth is an equivalent mud weight of 1029.878049 kg/m3 and the overburden is 2266.333384 kg/m3, and every pressure the well can hold sits between them. The window the Expert tier computes lives inside that bracket, with the pore pressure as its floor and the fracture pressure as its ceiling.

The tier also cross-checks the physics with a second method entirely. Bowers relates velocity to effective stress directly, and it comes in two forms, a loading curve for rock that has only ever been buried, and an unloading curve for rock whose effective stress has been reduced after burial. Running both against the same well tests whether the overpressure here is a dewatering story or an unloading story, which are two different mechanisms that a single Eaton run cannot separate.

## The shape of the ladder

Put the three tiers in one line. The Beginner tier builds the frame: a hydrostatic reference, an overburden ceiling, a compaction trend and a stated departure depth. The Professional tier converts the departure into pore pressure at every sample. The Expert tier converts that pressure into a mud-weight window and tests the mechanism behind it.

Each tier makes the one below it more demanding rather than replacing it. A prognosis is only as good as the trend it references, so the picking and fitting discipline of module four matters more at the Professional tier, not less. A mud-weight window is only as good as the prognosis under it, and a well is drilled on that window. Both lower tiers are load bearing by the time anybody is deciding what to pump.

The same widening runs sideways across courses. Well data makes the logs trustworthy, petrophysics decides which points are shale, this course turns those points into a frame, and the drilling programme is where the whole chain is finally tested against rock. A water column forgotten here becomes a mud weight that is wrong by a known amount three steps later.

## Exercise

Write one sentence for each tier saying what it does that the tier below it cannot. Then answer in one sentence: on this well, what is the overpressure at total depth that the Professional tier recovers, and why is it possible to state it exactly?

As a self check: this tier builds the frame, giving 41.408579625 MPa and 91.12306695073282 MPa at 4000 m below mudline, a trend value of 317.2847498247154 us/m at 2500 m and a fit of 650.0000000000014 us/m and 0.7000000000000015 per km; the Professional tier runs the Eaton prognosis at $n = 3$ over the same sonic and converts the departure below 2500 m into pore pressure; and the Expert tier converts that into the mud-weight window at total depth and cross-checks it against Bowers loading and unloading. The overpressure at total depth is exactly 6 MPa, and it can be stated exactly because the well is synthetic: a 4 kPa per m ramp was encoded into the transit times over the 1500 m below 2500 m, and the prognosis recovers what was put in.
