# The damage factor

The pack in the well never performs like the pack in the cell, and the engine says so with a single honest multiplier.

## What it multiplies

The catalogue gives the pack permeability of 20/40 ISP ceramic as 250, 180, 120 and 70 darcy at closure stresses of 2, 4, 6 and 8 thousand psi. Those are laboratory values, interpolated log-linearly between the tabulated points and clamped at the ends of the table rather than extrapolated beyond it.

The engine then multiplies that permeability by a damage factor. On this case the factor is 0.5 and the closure stress is 38131950.890444934 Pa, giving a retained permeability of 6.512770069532134e-11 m2 and a conductivity of 9.84433461550515e-14 m3 once the propped width is applied.

Half the laboratory permeability is gone before the well has produced a barrel.

## Where it goes

**Gel residue.** The carrier fluid was a crosslinked polymer, and the breaker never breaks all of it. What is left is an unbroken gel filling the void network of the pack, which is precisely the space the permeability describes.

**Fines.** Grains crush at the contact points under closure stress, and formation fines migrate into the pack from the fracture face. Both fill pores with particles far smaller than the grains, and a small volume of fines closes a disproportionate share of the flow paths.

**Embedment.** The closure stress presses the grains into the fracture walls. In a soft formation the outermost layer of grains sinks into the rock, and the pack loses width it was counted on having.

**Filter cake and multiphase flow.** The wall cake stays on the face, and the pack often flows gas and liquid together at high velocity near the well.

## Why it is an input and not a prediction

Every one of those mechanisms is real, and not one of them is calculable from the inputs a design carries. The residue depends on the breaker schedule and the reservoir temperature. The fines depend on the formation. The embedment depends on rock strength that a frac design does not know.

So the engine does not pretend. It takes the factor as a stated input, requires it to lie in the range above 0 and no greater than 1, and applies it once and visibly. A factor of 1 is a claim that the well reproduces the laboratory, which is a claim you should be prepared to defend.

The value carries straight through to conductivity, to dimensionless conductivity and to the pseudo-skin. Halve it and you halve all three. So state it, source it, and quote it beside the answer rather than burying it.

## Exercise

Write down the retained permeability and conductivity that a damage factor of 1 would give, from the published values above.

Then list the evidence you would need from a service company before you would accept a factor above 0.5 in a design you signed.
