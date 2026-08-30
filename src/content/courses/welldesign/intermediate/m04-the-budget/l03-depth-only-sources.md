# Depth-only sources

Three of the twenty-seven, and why they behave differently from all the rest.

## Which they are

**Depth reference.** The zero of the depth measurement, relative to the datum the well is reported against. A single offset applied to everything.

**Depth scale factor.** A proportional error in the counting: stretch under tension, thermal expansion, a mis-calibrated depth wheel. It grows with depth.

**Depth stretch.** The elastic extension of the drill string under its own weight and the tension it carries, which varies down the hole.

The engine identifies them structurally rather than by name: a source is depth-only if its sensitivity has a depth component everywhere and no inclination or azimuth component anywhere. Three sources satisfy that on the standard model.

## Why they are different

Every other source perturbs the DIRECTION of the well. A depth source perturbs the LENGTH.

A direction error swings the position sideways about the point where it entered, and the displacement grows with the lever arm. A depth error slides the position along the hole, and it does not grow with anything except depth itself.

So depth errors land almost entirely in the along-hole component of the borehole frame, and contribute almost nothing to the lateral component that anti-collision cares about.

## The consequence for the ellipse

In a vertical well, along-hole is vertical, so depth errors are vertical errors and they do not appear in the plan-view ellipse at all.

In a horizontal well, along-hole is horizontal, so depth errors DO appear in the plan-view ellipse, along the well's own direction. That is why the semi-minor axis of the validation well's plan ellipse is so close to its along-hole sigma.

The same physical error therefore shows up in the reported plan ellipse of a horizontal well and not of a vertical one. Nothing about the depth measurement changed.

## Their size

On the validation well the along-hole sigma at 8000 m is about ten and a half metres, which is a little over one part in a thousand.

That is representative of a pipe tally. A wireline depth is better; a coiled tubing depth is worse. Real-time depth from a drawworks encoder without proper stretch correction is worse again.

## Where they matter most

**Casing points and formation tops.** A shoe set on a measured depth lands where the depth counter says, and the true vertical depth it reaches follows from the survey. Ten metres of along-hole error on a shoe that has to land in a specific shale is a real problem.

**Perforation intervals.** A perforating gun is run to a measured depth. If the depth reference differs between the logging run that picked the interval and the run that shoots it, the guns fire in the wrong place, and depth matching between runs exists to prevent exactly that.

**Correlating between wells.** Two wells whose depth references differ have their formation tops offset by that difference, and a structural map built from them has a step in it.

## Where they matter least

Anti-collision, most of the time. Two wells' depth errors move them along their own axes, and unless the wells are nearly parallel and nearly touching, sliding along the axis does not close the gap.

The exception is exactly that case: two nearly parallel wells, where along-hole error does translate into a change in which parts of the two wells are adjacent.

## The misconception to avoid

"Depth is the one thing we measure accurately." It is measured better than azimuth, and it is not exact: one part in a thousand at 8000 m is over eight metres, it is systematic, and it does not improve with more stations. It also has a reference, and reference errors between runs are one of the commonest sources of real trouble.

## Exercise

A well is drilled to 4000 m measured depth with a depth scale factor uncertainty of one part in a thousand and a reference uncertainty of 0.3 m.

Compute the along-hole sigma at total depth, treating the two as independent. Then say how it would change at 8000 m, and which of the two terms dominates at each depth.
