# Water saturation and hydrocarbon pore volume

The pore volume is 3.563046 million cubic metres of connected void space in the reservoir quality rock above the contact. Not all of that space holds oil. Some of it holds water, and it always does, everywhere, including at the crest of the best reservoir you will ever book.

## Why there is water above the contact

Sandstone is water wet. Before any hydrocarbon arrived, the pore system was completely filled with formation water, and the grain surfaces were coated with it. When oil migrated into the trap it displaced water out of the larger pores, but it could not displace all of it. A film of water stayed bound to the grain surfaces by capillary forces, and water stayed trapped in the smallest pores and pore throats where the capillary entry pressure was higher than the buoyancy pressure the oil column could supply.

That remaining water is connate water, also called irreducible water when the reservoir is well above the transition zone. It does not flow. It will not be produced. It occupies pore space that would otherwise hold oil, and the volumetric calculation has to account for it.

Water saturation, written $S_w$, is the fraction of the pore space that water occupies:

$$S_w = \frac{\text{volume of water in the pores}}{\text{total pore volume}}$$

The value used here is

$$S_w = 0.35$$

meaning 35 percent of the pore space holds water that is not going anywhere. That is a fairly typical figure for a moderate quality sandstone. Finer grained rock with smaller pore throats holds more, and clean coarse sand at a high column height may hold as little as 0.10.

## The complement is what you want

The chain needs the fraction of the pore space that holds hydrocarbons, and that is the complement of the water saturation:

$$S_o = 1 - S_w = 1 - 0.35 = 0.65$$

Hydrocarbon pore volume is the pore volume multiplied by that complement:

$$\mathrm{HCPV} = \text{pore} \times (1 - S_w)$$

$$3.563046 \times 0.65 = 2.315980 \text{ million m}^3$$

The engine reports the hydrocarbon pore volume as 2.3159797972902343 million cubic metres, which is the figure the capstone grades.

That is the volume of oil in the reservoir, measured at reservoir conditions, in cubic metres. It is the first quantity in the chain that is oil rather than rock or space. Everything before it was a container and everything after it is a change of units.

## The step where beginners book the water

The complement step is the single most common arithmetic mistake in volumetrics, and it is worth naming exactly.

If you multiply the pore volume by $S_w$ instead of by $1 - S_w$, you have not made a small error. You have computed the volume of water in the pore system and then called it oil. Every barrel you go on to book is a barrel of connate water that cannot flow.

The size of the error depends on where the saturation sits. At $S_w = 0.35$ the mistake would give a figure a little over half the correct one, which is wrong enough to sink a project economics but not absurd on the page. At $S_w = 0.5$ the two numbers are identical and the error is invisible. At $S_w = 0.7$ the mistake would more than double the booking, and the resulting number would look wonderful in a report right up to the moment a well was drilled.

There are three defences, and you should carry all three.

Sanity check the direction. A higher water saturation must always give less oil. If you change $S_w$ from 0.35 to 0.45 and your answer goes up, you have used the wrong fraction, and you can catch that in seconds.

Sanity check the magnitude. Ask whether the hydrocarbon fraction you multiplied by is plausible as an oil saturation. In a producing reservoir well above the transition zone, oil saturation is usually the larger part of the pore space. If the number you used is 0.35 and you would not defend an oil saturation of 0.35 in a good sand, you have picked up the water figure.

Name the fraction out loud. This is the same discipline as the previous two lessons. NTG is the fraction of gross rock that is net. Porosity is the fraction of net rock that is pore. The saturation term is the fraction of pore that is hydrocarbon, so the number that goes into the multiplication is the oil saturation, and $S_w$ is only the route to it.

## What the contact does and does not do

One clarification that saves confusion later. The oil water contact defined where the accumulation stops. Below 1560 m at Ekene, the sand is water bearing and no cell contributes. Above it, the sand is oil bearing, and it still contains 35 percent water by pore volume.

Those are two different waters. The water below the contact is mobile formation water in a fully water saturated rock. The water above the contact is immobile connate water sharing the pore system with oil. The contact removed the first kind by excluding cells. The $1 - S_w$ term removes the second kind by taking a fraction of what is left. Neither step can do the other's job, and both are needed.

In reality the boundary between them is not a plane but a transition zone, over which water saturation falls from 1.0 at the free water level to its irreducible value some tens of metres higher. Treating the contact as a sharp surface with one saturation above it is a simplification, and it is the right one at this tier.

## Exercise

Take the pore volume of 3.563046 million cubic metres. Work out the hydrocarbon pore volume for a water saturation of 0.35, then say without recomputing the volume whether an $S_w$ of 0.45 would give a larger or a smaller answer, and state what a colleague has done if their answer went up.

Self check: with $S_w = 0.35$ the hydrocarbon fraction is $1 - 0.35 = 0.65$, so the hydrocarbon pore volume is $3.563046 \times 0.65 = 2.315980$ million cubic metres, reported by the engine as 2.3159797972902343 million cubic metres. An $S_w$ of 0.45 leaves a hydrocarbon fraction of 0.55, which is smaller, so the answer must fall. A colleague whose answer rose has multiplied by the water saturation itself and has booked connate water as oil.
