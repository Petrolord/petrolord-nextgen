# What this course will not certify

Five things this engine does not do, taught here and graded nowhere.

## Why state it

Because a course that teaches a topic implies it is worth learning, and a course that CERTIFIES a topic implies the learner can produce the answer and that the answer is worth producing. Those are different claims, and this series separates them deliberately.

The go-live migration for this course asserts the separation: it refuses to run if any graded field key names one of the topics below.

## Transient and surge dynamics

Every calculation here is a steady state. Starting and stopping the pumps, accelerating the string out of the slips, and the pressure wave that travels down a compressible mud column are all outside it.

The acceleration term alone can be comparable to the steady surge pressure, which makes a computed surge an optimistic number rather than a slightly imprecise one.

## Temperature and compressibility

One density and one rheology, both at the values supplied at surface. No thermal model, no temperature-dependent rheology, and no pressure-dependent density.

On a deep hot well the thermal effect is worth five to fifteen percent of the circulating uplift, and it and the compressibility effect are of similar size and opposite sign.

## Gel strength and break circulation

The Herschel-Bulkley yield stress has no time in it. A real mud gels at rest and the gel grows for minutes, and the pressure to break it is the largest routine transient in drilling.

## Eccentricity and pipe rotation

The annulus is concentric and the pipe is stationary. Neither is true in an inclined hole while drilling, and the errors go in opposite directions for the pressure and the cleaning.

Eccentricity in particular makes the computed cleaning substantially optimistic, on top of the missing inclination term the Professional tier established.

## Cuttings beds and inclination

The transport model is a falling particle in a rising fluid with no angle term at all. The engine returns identical transport ratios for a 40 degree well and a 90 degree one, which is the clearest possible statement of the limitation.

Cuttings beds are the dominant hole cleaning mechanism above about 30 degrees and there is nothing here that describes them.

## What IS certified

The steady-state hydraulics of a specified method on a concentric non-rotating annulus with a stated Herschel-Bulkley mud: pressure loss in every element, the pump pressure and its split, the equivalent circulating density profile, the vertical-transport cuttings calculation, and the surge and swab pressures.

That is a well defined and useful thing, and stating its edges is what makes it usable by somebody who was not in the room.

## Exercise

For each of the five omissions, name a well type where it would be the one that decided the outcome.

Then say which one you would implement first, and what data it would need that a normal well already has.
