# Porosity and pore volume

The net rock volume is 17.815229 million cubic metres of reservoir quality rock above the contact. It is still rock. Sand grains do not hold oil. The oil sits in the spaces between the grains, and porosity is the fraction of the rock that those spaces occupy.

## What porosity is

Porosity, written $\phi$, is void volume divided by total volume:

$$\phi = \frac{\text{volume of pore space}}{\text{total volume of rock}}$$

It is dimensionless, quoted either as a fraction or as a percentage, and for a clastic reservoir it usually lands somewhere between 0.10 and 0.30. The teaching value here is

$$\phi = 0.20$$

which means a fifth of the net rock is open space and four fifths is grain. That is a good sandstone. Compaction, sorting and cementation are what push the number around. A well sorted, shallowly buried sand keeps high porosity. The same sand at 4000 m with quartz overgrowths in the pore throats may keep only half of it.

Porosity as used here is effective porosity, meaning connected pore space that a fluid can actually move through and out of. Isolated pores exist in some rocks and hold fluid that will never be produced. The distinction matters more in carbonates than in the sand you are booking, but it is part of why the petrophysicist's number is a result rather than a measurement.

## The step

Multiplying the net rock volume by porosity gives the pore volume:

$$\text{pore} = \text{net} \times \phi$$

$$17.815229 \times 0.20 = 3.563046 \text{ million m}^3$$

The engine carries more digits than that and reports the pore volume as 3.563045809312045 million cubic metres, which is the figure the capstone grades.

That is the total volume of connected void space in the reservoir quality rock above the contact. It is the first quantity in the chain that is not rock at all. Everything up to here measured solid material. From this point on you are counting space, and then fluid in that space.

Pore volume is worth pausing on because it is the quantity that most later reservoir engineering hangs off. Material balance works in pore volume. Compressibility acts on pore volume. Injection targets are quoted as fractions of pore volume displaced. It is the size of the tank, before anyone says what fraction of the tank is oil.

## Porosity applies to the net rock

The number 0.20 is the porosity of the reservoir quality rock. It is not the average porosity of the whole gross interval, because the gross interval contains shales and cemented streaks whose effective porosity is close to zero. Averaging those in would give a smaller figure, and that smaller figure belongs to a different volume.

There are two self consistent ways to arrive at the same pore volume, and exactly one way to get it wrong.

The consistent pairings are:

| Volume you multiply | Porosity you must use |
| --- | --- |
| Net rock volume, 17.815229 million m3 | Porosity of the net rock, 0.20 |
| Gross rock volume, 22.269036 million m3 | Gross average porosity, which already includes the non net rock |

The inconsistent pairing is any mix of the two. Gross volume with net porosity overstates the pore volume, because the shales get credited with reservoir porosity. Net volume with a gross average porosity understates it, because the dilution from the shales has been applied twice, once when NTG removed them and again inside the average. This is the same double count the previous lesson warned about, wearing a different hat.

The habit from that lesson carries over unchanged. Before you multiply, name what the fraction is a fraction of, and check that it matches the volume in your hand.

## Why the order matters even though it does not

Here is a point that sounds like a contradiction and is not.

The chain so far is a product of a volume and two constants:

$$\text{pore} = \mathrm{GRV} \times \mathrm{NTG} \times \phi$$

Multiplication commutes. You could apply porosity first and net to gross second and the arithmetic would land on exactly the same pore volume. Nothing in the numbers cares about the order.

The order still matters, for two reasons that have nothing to do with arithmetic.

The first is that the order encodes the physical story, and the story is what you defend in a review. Gross rock is what the map and the contact enclose. Net rock is the part of that which is reservoir. Pore space is the part of the net rock that is void. Each step names a real subset of the previous one, and each intermediate value is a quantity a geologist can picture and challenge. Reordering the multiplications produces intermediate values that correspond to nothing, such as the pore volume of the shales, and a number that corresponds to nothing cannot be sanity checked.

The second reason is that the commuting stops as soon as the constants stop being constants. At higher tiers, NTG and porosity vary node by node, and the engine multiplies them cell by cell before it sums. A sum of products is not the same as a product of sums, so once properties vary spatially, applying an average porosity to a total net volume gives a different answer from applying each cell its own porosity. The order and the level at which you multiply both become real. Learning the chain in its physical order now means nothing has to be unlearned then.

## Exercise

You are given the gross rock volume of 22.269036 million cubic metres and told that the gross average porosity over the whole interval, shales included, is 0.16. Work out the pore volume from those two numbers alone, then compare it with the value obtained in this lesson and explain what you have shown.

Self check: 0.16 is the net porosity of 0.20 diluted by the net to gross of 0.8, so multiplying the gross rock volume by it applies both fractions in one step and returns the same 3.563046 million cubic metres. What you have shown is that the two consistent pairings agree, and that the danger is never the order of the multiplications but the mixing of a fraction with a volume it does not belong to.
