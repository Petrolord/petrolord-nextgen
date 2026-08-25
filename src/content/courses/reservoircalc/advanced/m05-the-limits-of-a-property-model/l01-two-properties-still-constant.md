# Two properties still constant

This tier replaced one of the four constants. Three remain, and two of them have as good a claim to vary as porosity did. This lesson is about what was left undone and what it is worth.

## What is still a constant

Net to gross is 0.8 everywhere. Water saturation is 0.35 everywhere. The formation volume factor is 1.2 everywhere.

The formation volume factor is the one that genuinely deserves to be a constant. It is a fluid property, set by the composition, pressure and temperature of the oil, and within a single accumulation in pressure communication it really is close to uniform. Where a field has compartments that never communicated, as the tier below showed, that argument weakens.

The other two do not deserve it.

## Net to gross

Net to gross varies for the same depositional reasons porosity does. Sand bodies thin and split laterally into interbedded sand and shale, so the reservoir fraction falls away from the depocentre.

It would enter the chain the same way porosity did, one step earlier, multiplying the gross rock volume node by node. Everything this tier established about three means, weighting and decomposition would apply to it unchanged.

There is one difference worth noting. If both net to gross and porosity vary, the weight in the volume weighted porosity average is no longer the column alone; it is the column times net to gross. The two properties interact, and the effective porosity of a model with a varying net to gross is not the same as the effective porosity computed with net to gross held constant.

## Water saturation, the one that matters most

Water saturation is the property with the strongest reason to vary and the largest likely effect.

It varies with height above the free water level. Capillary equilibrium means the buoyancy pressure supporting the oil column rises with height, so saturation falls upward. A cell with a 20 m column above the contact holds less water at its top than a cell with a 2 m column holds anywhere.

That is a systematic, physical, predictable variation, and it is not small. In a typical sandstone the water saturation might run from close to 1 at the contact to 0.15 or 0.20 at 30 m above it.

A single value of 0.35 for the whole accumulation is a thickness weighted average of that curve, and it is being applied uniformly to cells whose columns range from a sliver to 20.28 m. The thin cells near the contact should carry far more water than 0.35 and the thick crestal cells far less.

## Which way the error runs

The direction is predictable and it is the opposite of what the porosity model gave.

Oil saturation enters as $1 - S_w$. Under a capillary model the thick cells hold higher oil saturation, so the volume weighted oil saturation would exceed the constant, and the booking would rise again.

But the correlation with column is far stronger than the porosity correlation of +0.462, because saturation is a direct function of height above the contact rather than a trend that happens to point the same way. A property whose variation is driven by the same geometry that sets the weights is the strongest case there is for weighting mattering.

So the constant most likely to be understating the Ekene booking is the one this tier did not touch.

## Why the tier stopped where it did

Two honest reasons.

Porosity has a direct measurement at each well, so a property model for it can be built from data. A saturation height model needs capillary pressure measurements on core, a free water level and a rock typing scheme, which is a different body of work.

And the point of the tier is the machinery of a spatially varying property, which is identical whichever property varies. Having learned it on porosity, applying it to saturation is a change of input.

## Worked example

Estimate the scale of the saturation effect without building the model.

Suppose a simple saturation height relationship gives $S_w = 0.20$ at 20 m above the contact rising to 0.60 at 2 m, and that this averages to about 0.35 over the field as a whole, matching the constant.

The volume weighted oil saturation would then be pulled toward the value at the tall cells, because tall cells carry the weight. If the effective oil saturation came out at 0.70 rather than 0.65, the booking would scale by $0.70 / 0.65 = 1.077$, giving

$$12.796077 \times 1.077 = 13.78 \ \mathrm{MMstb}$$

That is an uplift of roughly 1 MMstb, larger than everything the porosity model achieved. The estimate is illustrative rather than computed, and its size is the point: the property that was left constant is probably worth more than the one that was modelled.

## Exercise

State the weight that belongs in the volume weighted average of water saturation, given that net to gross and porosity may also vary.

Self check: the weight is whatever the saturation term multiplies, which is the pore volume of each cell, that is column times net to gross times porosity. Weighting saturation by column alone would be correct only if net to gross and porosity were both uniform.
