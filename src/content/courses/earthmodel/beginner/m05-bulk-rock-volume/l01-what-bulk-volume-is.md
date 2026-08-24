# What bulk volume is

Four modules have built a container without once mentioning oil. You took three surfaces that arrived on three different grids, resampled them onto one model frame of 25 by 20 nodes at 50 m cells, clamped the stack so that no deeper surface sits above a shallower one, and differenced pairs of surfaces into two zone thickness grids. This module turns those grids into the single number the framework exists to produce, and then hands that number to somebody else.

## Gross rock and nothing else

Bulk rock volume is the gross volume of rock enclosed by a zone's geometry. It is thickness integrated over area, and that is the whole of the definition.

Nothing else is inside it. There is no fluid in a bulk rock volume. There is no separation of reservoir rock from the shale interbedded with it, so no net-to-gross. There is no porosity, so the grains and the pores are counted together. There is no water saturation, so nothing has been set aside for the water in those pores. And there is no conversion from reservoir conditions to surface conditions, so nothing in it is a barrel or a standard cubic metre.

A zone's bulk rock volume is the same number whether the zone is full of gas, full of water, or barren. It answers one question: how much rock does this zone occupy?

## Thickness integrated over area

Written as an integral, bulk volume is

$$V_{bulk} = \iint t(x,y)\, dA$$

over the footprint of the zone, where $t$ is the zone thickness in m. On a gridded model that integral becomes a sum. Each node of the frame carries a thickness in m and a fixed patch of map area in m2, and the volume is the sum of thickness times area across the nodes.

On this model the arithmetic is comfortable because the frame is regular. Every node carries 2500 m2 of area, since the frame is at 50 m cells, and there are 500 nodes in the frame. Nothing is irregular, nothing is truncated, and no node carries a different weight from its neighbour. The next lesson turns that regularity into a check you can run without a computer.

## Why it is the right thing to hand over

Three properties make bulk rock volume the natural hand-off object between a structural workflow and an economic one.

It is purely geometric. Nobody has to agree on a fluid property, a contact, or a log cut-off before it can be computed, so it can be produced, reviewed and signed off on its own.

It is auditable. Every input to it is visible: the frame, the resampling, the clamp, the zone definition and the thickness grid. Two people with the same surfaces and the same frame will get the same volume, and where they disagree the disagreement can be traced to a decision rather than a preference.

It is stable in the right way. Structural inputs change when a new surface is mapped, which is not often. Fluid parameters change whenever a new well is logged or a new saturation model is preferred, which is frequently. Keeping the container separate means the frequently changing work does not force the container to be rebuilt each time.

## It is bigger than anything anyone will ever produce

Zone A on this model has a bulk rock volume of 45,000,000 m3, which is 45 x 10^6 m3. Nobody will ever produce 45 million cubic metres of anything out of zone A, and nobody should expect to.

Every step after this one takes something away. A contact clips the volume to the part that holds hydrocarbon. Net-to-gross removes the rock that is not reservoir. Porosity removes the grains and keeps the pore space. Saturation removes the water in those pores. A formation volume factor shrinks what is left as it comes to surface. Each of those is a multiplication by a number smaller than one, so the sequence only ever runs downhill from the bulk volume.

That has a consequence worth carrying. Because every later step is a multiplication, a proportional error in the bulk volume survives the entire chain in the same proportion. A container that is too large by some fraction produces a hydrocarbon volume too large by the same fraction, and no amount of care in the fluid work will reveal it, because the fluid work never looks back at the geometry. The bulk volume is the last place a structural error can be caught.

## The two volumes this course produces

The Beginner tier ends with two numbers and their frame.

| zone | bulk rock volume | what is in it |
| --- | --- | --- |
| A | 45,000,000 m3 | gross rock between TopA and TopB |
| B | 12,800,000 m3 | gross rock between TopB and BaseB, pinch-out included |

Together the two zones hold 57.8 x 10^6 m3 of gross rock. Zone B's figure carries the pinch-out inside it, because the 180 nodes where the zone has been clamped to zero thickness contribute nothing to the sum while still being counted in the frame. That is the honest way to carry a pinch-out, and the next two lessons show why.

## Exercise

Write the definition of bulk rock volume in one sentence, then list the five things that are not in it and name, for each one, the quantity that would introduce it. Then answer in one sentence: why can an error in bulk rock volume never be cancelled by careful work further down the chain?

As a self check: bulk rock volume is the gross rock in a zone, thickness integrated over area, and it holds no fluid, no net-to-gross, no porosity, no saturation and no formation volume factor. Those five would be introduced by a contact and a net-to-gross ratio, a porosity, a saturation, and a formation volume factor respectively. On this model zone A is 45,000,000 m3 and zone B is 12,800,000 m3, giving 57.8 x 10^6 m3 across both. An error cannot be cancelled downstream because every step after the bulk volume multiplies it by a fraction, so a proportional error passes through all of them unchanged in proportion, and none of those steps ever re-examines the geometry that produced it.
