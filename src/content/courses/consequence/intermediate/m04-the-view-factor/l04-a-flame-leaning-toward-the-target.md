# A flame leaning toward the target

{{panel:cq-fire}}

Module three showed that wind tilts a pool fire downwind. For a target downwind, that tilt brings the flame closer and turns more of its surface toward the target. The engine switches from the upright Raj form to the tilted Mudan form as soon as the tilt is not zero, and this lesson reads what the lean does to the view factor.

## The tilted model

With a tilt the engine names its model "tilted cylinder view factor (Mudan), target at ground level; Fmax the vector sum of Fv and Fh". The inputs are the same ratios as before, a = L / R and b = X / R, plus the tilt from the vertical toward the target. The base of the cylinder stays a circle of radius D/2 on the ground; only the axis leans.

## The same flame at three tilts

The stated flame of radius 10 m and length 30 m, with targets at the same distances from the axis:

| distance from axis m, stated | Fmax at 0 degrees | Fmax at 20 degrees | Fmax at 40 degrees |
| --- | --- | --- | --- |
| 30 | 0.166740705537 | 0.229458544930 | 0.326573126713 |
| 50 | 0.073136774631 | 0.094301715956 | 0.118733812581 |
| 80 | 0.030449735411 | 0.035425592907 | 0.037104050657 |
| 120 | 0.013690703409 | 0.014822895951 | 0.014034019286 |

## Tilt toward the target raises the view factor

At 50 m, Fmax rises from 0.073136774631 upright to 0.094301715956 at 20 degrees and 0.118733812581 at 40 degrees. At 30 m the rise is steeper still, to 0.326573126713 at 40 degrees. A leaning flame puts its top closer to the target and presents its side more squarely, and both raise the fraction of the view it fills. The horizontal factor responds most. At 30 m and 40 degrees Fh is 0.219644967041, against 0.071282105127 for the upright flame at the same distance.

## Far away, the gain fades

At 120 m the three tilts give nearly the same Fmax, and the 40 degree value, 0.014034019286, sits below the 20 degree value, 0.014822895951. Far from the fire, leaning the flame over also brings its top down toward the ground and shortens its apparent height, and that can offset the gain from coming closer. The lesson is to read the engine's number at the distance that matters and never assume the lean always helps or always hurts.

In a real fire the wind sets the tilt and the flame length at once. More wind means a shorter flame, which lowers the view factor, and a larger tilt, which raises it downwind. The view factor function reads both, so the chain carries the trade for you. A note that tilts the flame without also shortening it, or shortens it without tilting it, has broken the chain.

## Why the tilted form can be graded

The tilted view factor rests on a second route. The engine's validation record integrates numerically over the visible flame surface and compares. For the golden case tilt-40-toward the two routes agree exactly:

| golden case | engine Fv | route B Fv | engine Fh | route B Fh |
| --- | --- | --- | --- | --- |
| tilt-40-toward | 0.241673530915 | 0.241673530915 | 0.219644967041 | 0.219644967041 |

Those are the 30 m, 40 degree values in the sweep above. The golden also carries cases tilted away from the target, which the same integration confirms.

## Exercise

In the fire panel's view factor view, enter the stated flame at 50 m and step the tilt through 0, 20 and 40 degrees, confirming each Fmax. Then repeat at 120 m. Write two sentences comparing the gain from tilting at the two distances, citing the six numbers you read.
