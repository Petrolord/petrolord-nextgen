# A plate pack, and what the plates buy

A basin buys its cut size with floor area, and floor area is expensive. A plate interceptor buys the same thing by stacking settling surfaces inside a much smaller box.

## The same physics, more area

The argument is identical to the basin. A droplet has to rise to a surface in the time the water is inside, and the cut size is the inversion of that balance at the design rise velocity. What changes is the area the flow is divided by. Instead of the footprint of the vessel, it is the projected area of every plate in the pack added together, multiplied by a factor for the fraction of that area which actually settles.

| plates | effective area m2 | design rise m/s | cut micron |
| --- | --- | --- | --- |
| 10 | 21.000000 | 0.002453507638 | 149.908299 |
| 30 | 63.000000 | 0.000817835879 | 86.549597 |
| 60 | 126.000000 | 0.000408917940 | 61.199807 |
| 120 | 252.000000 | 0.000204458970 | 43.274798 |

The UZERE pack of 30 plates of 3 m2 reaches an effective area of 63.000000 m2 and a cut size of 86.549597 micron. This is the same physics with the pack multiplying the settling area, which is why a plate interceptor is far smaller than a basin for the same cut.

## The factor that is worth a large part of the answer

That efficiency factor is 0.7, meaning seven tenths of the projected plate area is credited as settling area. It is a declared constant with no source in this repository, and it sits directly in the middle of the chain: the effective area, the design rise velocity and therefore the cut size all move with it. A reader should hold the plate pack answer a little more loosely than the basin answer for that reason, and should know exactly which number is responsible.

## An independent check on the geometry

The published plate cases carry something beyond a cut size. The oracle marches the same pack at two different channel heights and reports the difference, and it comes out at 2.21e-14, 2.19e-14 and 2.15e-14 on the three cases. A plate pack cut size must not depend on how the pack is sliced into channels, because the settling area is the same either way, and those three figures are the proof of it rather than the claim.

That is the same class of evidence as the median identity from the droplet module. Nobody had to find a published pack and match it. The requirement follows from what the device is, and the engine either meets it or does not.

## Where this tier stops

A plate pack is where plan area runs out of road. Stacking more plates keeps working and keeps costing, and no arrangement of settling surfaces reaches the finest droplets a produced water stream carries. The devices that go further stop relying on gravity alone as the driving force, and they are the subject of the next tier of this course.

{{panel:pw-water-explorer}}

## Exercise

Explain what a plate pack changes about the basin argument and what it leaves alone. Then say which single declared number carries most of the uncertainty in the plate cut size, and what the channel height check proves that a published comparison could not.
