# The full curve

Modules 1 and 2 built the machine one depth at a time. This module runs it everywhere and reads the result the way a prognosis is actually read: as a curve, with a shape, an onset, and a handful of quoted values.

{{panel:pp-eaton-explorer}}

## Reading the shape

Put the panel on the capstone settings and look only at the red curve for a moment.

From the mudline to 2500 m it lies exactly on the dashed hydrostatic. Not near it: on it. Every sample above the ramp top has a ratio of exactly 1, so the method returns the hydrostatic to the last bit. On a real prognosis this section would wander a little around the hydrostatic, because a real log wanders around its trend; a section that hugs hydrostatic this perfectly is the signature of a synthetic well.

At the amber line the curve breaks right and pulls away from the hydrostatic at a steady rate. The steadiness is the encoded ramp: 4 kPa of overpressure per metre, a straight line in overpressure. In full pore pressure the curve is the hydrostatic gradient plus that ramp, so its slope steepens from about 10.1 kPa per metre to about 14.1 below the break.

It never threatens the overburden. At total depth the pore pressure is 47.408579625 MPa against an overburden of 91.12306695073282: the fluid has taken 12 percent of the budget, and the curve shows that proportion directly as the fraction of the gap it has crossed.

## The green curve rides above

The fracture pressure curve runs between pore pressure and overburden the whole way down. Above the ramp top it is parallel to neither: it is the two-thirds mixture of the other curves that module 5 derives. Below the ramp top it inherits a share of the pore pressure's break. For now, one observation to carry: the gap between red and green, which will become the Expert tier's mud window, NARROWS below the onset. Overpressure squeezes a well from both sides, raising the floor faster than the ceiling.

## The curve is 401 arithmetic problems

It cannot be said too often, because software makes curves look like objects rather than sums: every point of the red curve is module 2's five-step chain at one sample. The panel recomputes all 401 chains at every control change. Nothing is interpolated, smoothed or fitted. When a prognosis from any software package reaches you, the first question is always which of those steps its curve actually ran, and with what inputs; the second is which samples were screened out before the chain was allowed to run. This well needed no screening, which is precisely what makes it a training well.

## Quoting a curve

A prognosis is communicated as a handful of numbers, and the capstone's six are a standard set: where the overpressure starts, what the trend read at the deepest point, pressure at a mid-ramp depth, pressure at total depth, overpressure at total depth, and fracture pressure at total depth.

Notice what is NOT in the set: nothing above the onset. A prognosis has nothing to say where the well is normal beyond the fact that it is normal, and the frame already said that. The information content of the whole exercise lives below 2500 m, in six numbers and a slope.

## Worked example

Read the curve's slope below the onset from two quoted values, the way you would from a report. Between 3000 m and total depth the pore pressure goes from 33.307730125 to 47.408579625 MPa, a rise of 14.10084950 MPa over 1000 m, which is 14.1 kPa per metre.

Decompose it: the hydrostatic gradient contributes $1030 \times 9.80665 = 10.100849$ kPa per metre, and the ramp contributes 4 exactly. The prognosis slope below the onset is hydrostatic-plus-ramp, and reading slopes off a pressure plot in kPa per metre is a habit worth having, because a slope steeper than any plausible fluid gradient plus generation rate is how you spot an artefact from across the room.

## Exercise

From the curve on capstone settings: state the depth interval over which the pore pressure curve is exactly straight, and explain why the interval above the ramp top, where the curve is also straight, has a different slope. Give both slopes in kPa per metre.

Self check: the curve is straight from 2500 m to total depth at hydrostatic plus ramp, 14.100849 kPa per metre, straight because the encoded ramp is linear and the hydrostatic is linear in depth below the water column. Above the ramp top the curve is the hydrostatic itself, straight at 10.100849 kPa per metre, the pore fluid density times gravity. Both segments are straight but their slopes differ by exactly the 4 kPa per metre of encoding, and the kink at 2500 m is the single most informative point on the plot.
