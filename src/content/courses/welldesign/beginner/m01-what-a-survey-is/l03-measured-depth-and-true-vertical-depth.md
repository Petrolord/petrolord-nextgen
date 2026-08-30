# Measured depth and true vertical depth

Two depths, one hole, and the arithmetic that connects them.

{{panel:wd-survey-explorer}}

## The distinction

**Measured depth** is length along the hole. It is what the driller counts, what the pipe tally says, and what every downhole tool records against.

**True vertical depth** is the vertical distance below the depth reference. It is what pressure depends on, what a geological surface is mapped at, and what a fluid contact is quoted against.

In a vertical well they are the same number. In a horizontal well they diverge without limit: the golden feet well in the panel reaches 4000 ft of measured depth at a true vertical depth well short of that, and a modern lateral can add several kilometres of measured depth at no true vertical depth at all.

## Why TVD is the one that matters physically

Pressure is a vertical integral. A pore pressure, a fracture pressure, a mud weight, a hydrostatic column: every one of them depends on how far below the reference you are, not on how much hole was drilled to get there.

So a mud weight quoted against measured depth in a deviated well is a mistake with a magnitude, and the magnitude is the difference between the two depths. That mistake appears again in the well control course and again in the cementing course.

## How TVD is computed

Station by station. Between two stations the calculation assumes a shape, works out how much of the interval was vertical, and adds it up:

    TVD = sum over intervals of (interval length) x (something between cos(inc1) and cos(inc2))

The "something" is the whole argument of the next module. Every method computes that factor differently, and the differences accumulate down the hole.

## The other computed quantities

The same station list gives four more, all of them in the listing the panel shows:

**North and east displacement** from the wellhead, by the same interval-by-interval accumulation with the azimuth included.

**Dogleg severity**, the total angle change per unit length, which is what the drill pipe feels.

**Vertical section**, the displacement projected onto one chosen azimuth, which is what a well is drawn against on a section view.

**Closure**, the straight-line horizontal distance and direction from the wellhead to the point.

## The tvd of a target is not a depth you can drill to

Worth saying once, early. A target is usually specified as a TVD and a position. The driller drills measured depth. Converting between them requires the survey calculation, which requires the surveys, which only exist behind the bit.

So a well is landed by projecting ahead, and the projection is checked at every station. The engine's TVD-crossing function exists for exactly this: given a station list and a TVD, it returns every measured depth at which the path crosses that plane, and there can be more than one.

## The misconception to avoid

"TVD is measured depth times the cosine of the inclination." That is true for one straight interval at a constant inclination, and false for a well. Inclination changes between stations, and applying one station's cosine to a whole interval is precisely the tangential method that the next module shows landing twenty-five feet out.

## Exercise

Open the panel on the feet well and read the total measured depth and the true vertical depth at total depth.

Compute the difference. Then find, in the listing, the first station at which the two differ by more than one foot, and say what the inclination was doing at that depth.
