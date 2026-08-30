# Crossing a TVD

Finding the measured depth of a horizon, and the answer that is not unique.

{{panel:wd-survey-explorer}}

## The question

A geologist gives you a horizon at a true vertical depth. The driller works in measured depth. At what measured depth does the well cross that horizon?

## Why it is not one division

TVD is not proportional to MD, so there is no factor to divide by. The answer is found by walking the station list, finding the interval that brackets the target TVD, and solving within it.

The engine does this on the exact minimum-curvature arc rather than by linear interpolation between stations. On a 30 m interval in a build that difference is decimetres, and the well control course has a note about exactly this: interpolating TVD linearly between stations misses by decimetres on an arc, which matters when the number is a shoe depth in a kill sheet.

## Why there can be more than one answer

A well that builds past 90 degrees and comes back, or an S profile, or a lateral that undulates, crosses a given TVD plane more than once.

The engine returns a LIST of measured depths, not a single one. On the course's test well, five different TVD planes are checked and each returns its published crossings.

That plural return is the correct contract. A function that returned the first crossing would silently answer a different question than the one asked, and the second crossing is often the one that matters: it is where the well leaves the reservoir.

## The horizontal case

Once the well is horizontal, a TVD plane is either never crossed or crossed along a whole interval.

A lateral planned at exactly 90 degrees sits at one TVD for kilometres, and asking for the measured depth of that TVD has no unique answer at all. In practice laterals are never exactly 90 degrees, so there is a slow crossing, but the sensitivity is extreme: at 89.9 degrees, one metre of TVD is 573 m of measured depth.

That is the landing problem from module 4 seen from the other side, and it is why horizontal wells are steered on formation evaluation rather than on computed depth.

## What it is used for

**Casing points.** A shoe is specified at a TVD and set at a measured depth.

**Formation tops.** The depth at which a log shows a top is a measured depth; the map wants a TVD; the survey converts, and this function goes the other way when a predicted top is converted to a drilling depth.

**Pressure calculations.** Every pressure in the well control and hydraulics courses is at a TVD, and every measurement is at a measured depth.

**Reservoir intersections.** Where the well enters and leaves the pay, which is the length of the completion interval.

## The precision available

The engine reproduces its published crossings to about two parts in ten billion, on a 131-station well, because the crossing is solved on the arc rather than interpolated.

That precision is not needed for a casing point. It IS needed for the identity to hold: a function that finds a TVD crossing and a function that computes TVD at a measured depth must be inverses of each other, and if they are not, the well plan quietly disagrees with itself.

## The misconception to avoid

"TVD and MD are interchangeable with a correction factor." There is no factor. The relationship is an integral along the path whose local slope is the cosine of the inclination, it varies from 1 to 0 down the well, and in a lateral it is zero. Any spreadsheet that carries a single conversion is describing a vertical well.

## Exercise

Open the panel's survey listing and pick a TVD partway down one of the golden wells.

Find the two stations that bracket it, and estimate the crossing measured depth by linear interpolation between them. Then say whether the true arc solution would be deeper or shallower, and why.
