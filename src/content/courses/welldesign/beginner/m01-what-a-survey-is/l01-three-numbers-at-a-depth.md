# Three numbers at a depth

Everything a directional well knows about where it is comes from three measurements repeated every thirty metres.

## What is actually measured

A survey station is three numbers:

**Measured depth.** How much hole has been drilled, along the hole, from a fixed reference at surface. It is a length of pipe, counted at the rig floor.

**Inclination.** The angle between the hole and vertical, from 0 degrees straight down to 90 degrees horizontal and beyond. It comes from three accelerometers measuring the direction of gravity.

**Azimuth.** The compass direction the hole is heading, clockwise from north. It comes from three magnetometers measuring the direction of the earth's field, or from a gyroscope.

That is the whole raw dataset. Everything else in a well plan, every depth on every log, every target intersection, every distance to a neighbour, is COMPUTED from a list of those three numbers.

## What is not measured

True vertical depth is not measured. North and east displacement are not measured. Dogleg severity is not measured. Vertical section is not measured. The distance to an offset well is certainly not measured.

All of them are the output of a survey calculation method, applied to the station list, by somebody who chose that method. Different methods give different answers on the same stations, and the difference has been as large as twenty-five feet of true vertical depth in two thousand feet of hole.

That is the subject of the next module, and it is the reason this course starts here.

## Why every thirty metres

Surveys are taken when the pipe is stationary, which means at connections. A stand of drill pipe is about thirty metres or ninety feet, so the survey interval is set by the rig's pipe handling rather than by anything about the reservoir.

Between two stations nothing is measured at all. The calculation has to assume something about the shape of the hole in between, and every method in the next module is a different assumption about exactly that.

Shorter intervals cost rig time. Longer intervals leave more to the assumption. Ninety feet is the compromise the industry settled on, and it works because a bottom hole assembly cannot change direction quickly.

## The three references you must state

**The depth reference.** Measured depth from what? The rotary kelly bushing, the drill floor, mean sea level, the wellhead. A depth quoted without its reference is not a depth, and the difference between a rig floor and mean sea level is tens of metres offshore.

**The north reference.** Azimuth from which north? True, grid or magnetic. They differ by degrees, and degrees at a few thousand metres are hundreds of metres of position. The Expert tier is about this.

**The position reference.** North and east relative to what? The wellhead, the platform reference point, a field grid origin. Two wells cannot be compared for clearance unless they are in the same frame, which sounds obvious and is the commonest reason an anti-collision scan is wrong.

## The course in one line

This course takes a station list and produces, in order: a well path, a survey listing, a designed trajectory, an uncertainty on every position, and a separation from every neighbour. Each step is a calculation, each has a published reference, and each has a way of being wrong that has cost real wells.

## The misconception to avoid

"The MWD tool gives you the well path." The MWD tool gives you inclination and azimuth at a depth the driller counted. The well path is what a piece of software makes of a list of those, and this course is about what the software is doing.

## Exercise

A survey report lists a station at 2450 m MD, 34.2 degrees inclination, 118.6 degrees azimuth.

Write down the three references that report must also state before those numbers can be used, and for each one, say what goes wrong if it is assumed rather than stated.
