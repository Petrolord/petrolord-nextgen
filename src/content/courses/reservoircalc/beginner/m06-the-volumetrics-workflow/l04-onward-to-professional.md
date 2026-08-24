# Onward to Professional

This tier taught one accumulation. You took six wells with two picks each, gridded both surfaces at a 100 m cell with an 800 m extrapolation limit to leave 201 live nodes, clipped the oil column against a contact at 1560 m to get 169 oil cells and a maximum column of 20.2818603515625 m, summed a gross rock volume of 22.269036 million m3, and carried it through NTG, porosity, water saturation and the formation volume factor to 12.139208 MMstb of STOIIP. Then you learned to report that number with the contact it assumes and the range around it.

That is a complete skill, and it is deliberately narrow in two directions. The tiers above widen it in exactly those two, and it is worth knowing what they are before you decide whether to climb.

## Professional: the accumulation is not one tank

Everything at this tier treated the field as a single connected body of rock. The Professional tier removes that assumption by putting a sealing fault through it.

The fault runs north to south at an easting of 1800 m, which cuts the Ekene accumulation into a western block and an eastern block. Nothing about the map, the contact or the properties changes. The only new instruction is that each cell now belongs to a block, and the volumes are summed per block instead of over the field.

| Block | Oil cells | STOIIP (MMstb) |
| --- | --- | --- |
| West | 117 | 9.855617 |
| East | 52 | 2.283591 |
| Field | 169 | 12.139208 |

The arithmetic is reassuring. The cells add up and the barrels add up to the same 12.139208 MMstb this tier booked. That is the first thing the tier makes you check, because a partition that does not sum is a partition with a bug in it.

The engineering is not reassuring at all, and that is the lesson. The field total is unchanged and the meaning of it has changed completely. A sealing fault means the eastern block does not drain to a well in the west, so the two blocks need their own wells, their own contacts in principle and their own development cases. A block holding 2.283591 MMstb may not carry a well at all, in which case part of the number this tier booked is not going to be produced by anybody. Volumes add. Decisions do not.

That tier also takes up what happens when the two blocks turn out to have different contacts, which is common where a fault seals, and what a partition does to the checks you learned in this module.

## Expert: the properties are not constants

The second narrow assumption was the property set. NTG 0.8, porosity 0.20, Sw 0.35 and Bo 1.2 were handed over as constants, as a lab would hand them out, and module four said out loud that real rock does not work that way.

The Expert tier replaces the constant porosity with a trend surface fitted to the porosity measured at each of the six wells, so every grid node carries its own value. Run the same clip at the same 1560 m contact and the booking becomes 12.796077 MMstb against the 12.139208 MMstb this tier produced, a difference of plus 0.656868 MMstb.

Two things are worth noticing about that number before you meet it properly. It is not large next to the contact sensitivity you have already seen, which supports everything module five argued about where the leverage sits. And it is not zero either, and its sign has a cause you can point at: across the 169 oil cells the fitted porosity averages 0.209368, above the 0.20 constant used at this tier, so the rock the volume is actually claiming is a little better than the constant assumed.

That tier also has to deal with a question this one could avoid entirely. When a property varies from node to node, an average is no longer a single defensible number, and the average that belongs in a volume calculation is the one weighted by the rock the volume is actually claiming.

## The shape of the ladder

Put the three tiers in one line. The beginner books one volume from one map and one contact. The professional splits that volume between compartments that will be developed separately. The expert lets the properties vary across the field and measures what that does to the answer.

Each tier makes the one below it more demanding rather than replacing it. Splitting an accumulation means the map underneath it has to be good enough to place a fault. Varying the properties means the quality control checks in the last lesson have to be reworked, because the chain is no longer a single multiplication by a constant.

The same widening runs sideways, across courses. Correlation feeds the picks in, mapping turns them into surfaces, and this course turns the surfaces and a contact into barrels. What follows is the reserves and economics work that decides how many of those barrels are recoverable and worth recovering, and that work inherits every assumption made here. A contact assumed carelessly at this stage becomes a development plan built on rock nobody has seen.

## Exercise

Write one sentence for each tier saying what it does that the tier below it cannot. As a self check: this tier books a single field volume from a mapped surface and a contact; the Professional tier partitions that volume across a sealing fault, giving 117 cells and 9.855617 MMstb in the west and 52 cells and 2.283591 MMstb in the east; and the Expert tier lets porosity vary across the field, moving the booking from 12.139208 to 12.796077 MMstb. Then answer in one sentence: if the fault splits the field without changing the total, why does it change the development case? Because a sealing fault stops the eastern block draining to a western well, so the two blocks have to be developed separately and the smaller one may not justify a well at all.
