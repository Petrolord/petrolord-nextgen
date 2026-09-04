# Four bars and a crank

Six lengths, no iteration, and an answer that is either exact or refused.

{{panel:pd-string-explorer}}

## Six numbers are the whole unit

| Dimension | Published conventional unit |
| --- | --- |
| front arm A | 106.6667 in |
| rear arm C | 64 in |
| pitman P | 80 in |
| crankshaft behind the saddle bearing | 92.8 in |
| crankshaft below the saddle bearing | 60.8 in |
| crank radius R | 28.8 in |

Nothing else about the unit enters. No beam weight, no bearing friction, no motor.

## The closure is an intersection, not a fit

The equalizer bearing has to sit at radius C = 64 in about the saddle bearing and at radius P = 80 in about the crank pin at the same instant. Two circles, and intersecting them is the solution. There is no residual to drive down, which is why the miss distances the engine reports are at round-off: on the published unit they read 1.421e-14 in on the rear arm and 0.000e+0 in on the pitman at crank 0.0 deg, 0.000e+0 in and -1.421e-14 in at crank 30.0 deg, and 0.000e+0 in on both at crank 45.0 deg and crank 60.0 deg. Across the whole revolution the largest miss on either circle is -2.842e-14 in.

A residual that size is arithmetic, not convergence. No tolerance was used, so none can be loosened.

## What the crank pin does to the beam

The pitman carries the crank pin's position to the equalizer bearing, the rear arm turns that into a beam angle, and the front arm turns the beam angle into polished rod travel. The beam angle on the published unit runs from -1.318254129 rad at crank 0.0 deg to -2.318392661 rad at crank 195.0 deg and back, a sweep of 1.000197032783 rad.

## The mistake

Expecting the engine to cope with a geometry that does not close. It does not cope, it reports. Shorten the pitman on the published unit to 20 in and the return is `ok = false` with a message: "The linkage does not close at every crank angle: with these dimensions the pitman cannot reach the beam. Check the crank radius, the pitman length and the crankshaft position."

Grow the crank instead and the same wall arrives. The published unit closes at a crank radius of 32.000 in, giving a stroke of 125.499172938 in, and at 34.000 in it does not close at all. There is no clamped beam angle and no partial answer.

## What it refuses

It refuses to invent a dimension. Every one of the six lengths must be given, and a designation string that is not a designation returns null rather than a guess.

## Exercise

Read the closure residuals on the published unit at crank 0.0, 30.0, 45.0 and 60.0 deg in the panel and write them down.

Then shorten the pitman to 20 in and record what comes back instead of a number.
