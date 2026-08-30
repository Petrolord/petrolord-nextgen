# What raises it

Five things, and how much each is worth.

{{panel:hy-cleaning-explorer}}

## The mud weight

Directly and completely: the equivalent circulating density is the mud weight plus an uplift, so a kilogram per cubic metre of mud weight is a kilogram per cubic metre of equivalent circulating density.

It is the largest term by far. The uplift on this well at ordinary rates is under 60 kg/m3 against a mud weight of 1440.

## The flow rate

Through the annulus loss, with an exponent of 0.7464092669494129. Sub-linear, because the annulus is laminar and the mud is shear thinning.

On the slant well, going from 0.015 to 0.035 m3/s takes the equivalent circulating density from 1483.5443226994705 to 1521.9582775037711 kg/m3. A factor of 2.33 in flow rate buys 38 kg/m3.

## The rheology

A thicker mud has a higher annulus loss at the same rate. Comparing the two muds at 0.025 m3/s on the slant well: kcl_polymer gives an annulus loss of 1434707.6543385487 Pa and light_wbm gives 1110436.3963266218 Pa.

That is a 23 percent difference from rheology alone, at the same rate in the same hole.

## The annulus size

Smaller annulus, higher velocity, higher loss. This is why a hole section that has been drilled to its limit, with the largest possible string in it, is the one where the equivalent circulating density is hardest to manage.

It is also why a washed-out hole has a LOWER equivalent circulating density than a gauge one, which is one of the few things a washout is good for.

## The cuttings

Not in this model. The mud in the annulus while drilling contains rock at 2600 kg/m3, and its bulk density is above the pumped mud's.

At a cuttings concentration of one percent by volume, the annulus density rises by about one percent of the difference between the cuttings and the mud, which for this mud is about 12 kg/m3. That is comparable to a substantial change in flow rate, and it is absent from the engine's answer.

## The ranking

Mud weight, then rheology, then flow rate, then the annulus size, then cuttings. The first is a decision, the second is a mud programme, the third is a knob on the rig floor, the fourth is fixed, and the fifth is not modelled.

## The one that is a surprise

The rheology. People think of equivalent circulating density as a flow rate problem, and on this well changing the mud is worth more than changing the rate over the whole practical range.

## Exercise

Compute the equivalent circulating density uplift for both muds at 0.025 m3/s on the slant well.

Then find the flow rate at which the light mud produces the same uplift the heavy one does at 0.025, and say whether that rate is achievable.
