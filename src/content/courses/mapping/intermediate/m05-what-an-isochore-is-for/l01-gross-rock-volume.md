# Gross rock volume

An isochore is a map of thickness. Multiply it by area and it becomes a volume. This lesson does that arithmetic on the Ekene SAND and is careful about what the answer is.

## The calculation

Every live node stands for one cell of the grid. At a 100 m cell that is $100 \times 100 = 10{,}000$ m² of ground, and the thickness at that node applies across it.

The volume under one node is thickness times cell area. The volume under the whole map is the sum:

$$V = \sum_{i \in \text{live}} t_i \, A_{cell} = \bar{t}_{map} \times N_{live} \times A_{cell}$$

The second form is the same sum rewritten, because the mean is the total divided by the count. On Ekene:

$$V = 32.25429068 \times 201 \times 10{,}000 = 64{,}831{,}124\ \mathrm{m^3}$$

About 64.8 million cubic metres, or 0.065 km³.

## Check the pieces

Three numbers went into that and each of them should be quotable on its own.

**The mean thickness**, 32.254 m, area-weighted over the live nodes. The previous module was about why this is the right mean and not the well mean.

**The live node count**, 201, which the capstone grades exactly. It is the count of nodes the mask left, and it is a setting as much as a fact.

**The cell area**, 10,000 m². Change the cell size and this changes, but so does the node count, in the opposite direction. At a 50 m cell the map has 794 live nodes of 2,500 m² each, giving a mapped area of 1.985 km² against the 2.010 km² at a 100 m cell. The two agree to about one percent, and the small difference is the mask boundary being drawn at a different resolution.

## What area is being claimed

The mapped area is $201 \times 10{,}000 = 2{,}010{,}000$ m², or 2.01 km².

That area is the convex hull of six wells, clipped to 800 m from the nearest well. It is not a licence block, not a fault block, and not a hydrocarbon accumulation. It is the area those six wells constrain, and the volume above is the gross rock in that area and nowhere else.

Anything outside it is not zero volume. It is **unquantified** volume, and the difference matters enormously in a report. A field that extends beyond the well pattern has rock that this calculation does not claim and does not deny.

## What the number is and is not

**It is gross rock volume**: all of the SAND interval, over the mapped area, regardless of what is in the pore space.

**It is not net rock volume.** No net-to-gross has been applied. Shale beds inside the interval, if any, are still in this number.

**It is not pore volume.** No porosity has been applied.

**It is not a hydrocarbon volume.** No contact and no saturation have been applied, so this figure includes rock below any oil or water contact and rock that is entirely wet.

Each of those steps multiplies the number by a fraction less than one, so the gross rock volume is the largest number in the chain and the one most easily quoted out of context.

## The honest sentence

> The Ekene SAND has a gross rock volume of 64.8 million cubic metres over the 2.01 km² constrained by six wells, from an isochore with a mean thickness of 32.25 m at a 100 m cell and an 800 m extrapolation limit.

Every qualifier in that sentence is load-bearing. Remove the area and the number floats. Remove the mask setting and it cannot be reproduced. Remove the word gross and it will be mistaken for something eight or ten times smaller.

## Worked example

The extrapolation limit is widened to 1200 m and the live node count rises to 260. Does the gross rock volume rise by the same proportion?

Not quite. The area rises from 2.01 to 2.60 km², a factor of 1.29, but the added nodes sit at the edges of the hull where the surface is least constrained, and on this field the far edges are toward the thinnest well. So the mean thickness falls slightly and the volume rises by a little less than 29 percent.

More importantly the extra volume is the least defensible part of the total, since every added node is more than 800 m from any well. A volume that grew because the mask was widened has grown in confidence terms not at all.

## Exercise

Compute the gross rock volume of the Ekene SAND from the capstone numbers, state the mapped area, and list three multipliers that stand between this figure and a recoverable hydrocarbon volume.

As a self-check: $32.25429068 \times 201 \times 10{,}000 = 64{,}831{,}124$ m³ over a mapped area of $201 \times 10{,}000 = 2.01$ km². Between it and a recoverable volume stand at least net-to-gross, which removes non-reservoir rock inside the interval, porosity, which reduces rock volume to pore volume, and hydrocarbon saturation together with a contact, which restrict the pore volume to the part actually holding hydrocarbons; a recovery factor and a formation volume factor follow after those.
