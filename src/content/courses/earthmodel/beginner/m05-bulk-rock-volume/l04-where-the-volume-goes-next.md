# Where the volume goes next

This course stops at bulk rock volume. That is not an omission and it is not a limit of the tier, it is the boundary the curriculum was drawn along. The Earth Modeling course owns the container: the surfaces, the model frame, the clamp, the zones, the thickness grids and the gross rock those imply. Fluids, contacts, saturation and the booking of hydrocarbon volumes belong to the ReservoirCalc course. The bulk rock volume is the object that passes between them.

This lesson names the chain that picks the volume up on the other side, so that you can see the join clearly, and so that you know which parts of it are not yours.

## The chain after the hand-off

Zone A leaves this course as 45,000,000 m3 of gross rock, and zone B as 12,800,000 m3. What happens next, in the ReservoirCalc workflow, is a sequence of reductions and one conversion.

A contact clips it. A fluid contact is a depth, and it cuts the zone into the part above the contact and the part below. Only the part above is of interest, so the gross rock volume of the zone becomes the gross rock volume above the contact.

Net-to-gross reduces it. Not all of the rock in a zone is reservoir. Shale beds, cemented streaks and intervals below a log cut-off are gross rock but not net rock, and the net-to-gross ratio is what converts one to the other.

Porosity reduces it again. Net rock is grains plus pores, and only the pores can hold anything. Porosity turns net rock volume into pore volume.

Saturation reduces it once more. Pore volume holds water as well as hydrocarbon, so the hydrocarbon saturation is what leaves hydrocarbon pore volume behind.

A formation volume factor converts it. What remains is a volume at reservoir pressure and temperature, and a volume at surface is a different quantity. The formation volume factor is the conversion between them, and it is the step that finally produces a number in barrels or standard cubic metres.

Contact, net-to-gross, porosity, saturation, formation volume factor. That is the chain, and every link in it belongs to the ReservoirCalc course.

## None of that is this course's job

Say that plainly, because the temptation to reach forward is real. You have a thickness grid and a frame in front of you, and applying a porosity to it looks like one more multiplication.

It is not one more multiplication, because none of those five quantities is a property of the geometry. A contact comes from pressure data and from what wells actually found. Net-to-gross comes from a petrophysical cut-off applied to logs. Porosity comes from log or core measurement and from a population model. Saturation comes from a saturation-height function or from log analysis. A formation volume factor comes from a fluid study. Each of those has its own data, its own uncertainty and its own owner, and none of them can be inferred from a surface stack.

The framework you have built is agnostic about all five. That is its strength. The same 45,000,000 m3 of zone A supports a pessimistic fluid case and an optimistic one without being rebuilt, and it stays valid when the saturation model is revised next quarter.

## Why the split holds up in practice

The two halves change on different clocks. A container is revised when a surface is remapped or a new well moves a pick, which is a structural event. The fluid parameters are revised whenever a new log is analysed or a new interpretation is preferred, which happens far more often.

If the two lived in one workflow, every fluid revision would drag the container through a rebuild, and every rebuild is a chance for the frame, the clamp or the zone definition to shift quietly. Keeping the bulk volume as a formal hand-off means the container has a version, the fluid case has a version, and anybody can say which pair produced a given result.

## What travels with the number

A bulk rock volume on its own is not a hand-off. It is a figure with no provenance. Send these with it, every time.

| item | zone A on this model |
| --- | --- |
| bulk rock volume | 45,000,000 m3 |
| model frame | 25 by 20 nodes at 50 m cells |
| node count and cell area | 500 nodes, 2500 m2 each |
| zone definition | TopA to TopB |
| mean thickness with its denominator | 36 m over all 500 nodes |
| clamp counts | 0, 0 and 180 across the three surfaces |

Zone B travels the same way, as 12,800,000 m3 with its mean of 10.24 m over all 500 nodes, or 16 m over the 320 nodes where the zone exists, and with the note that its 180 zero-thickness nodes are the same nodes the clamp fixed on BaseB. Somebody applying a contact to zone B needs to know that the zone is absent over 180 nodes, because a contact applied to a pinched-out zone does nothing there and the arithmetic will not warn them.

## Exercise

Write the five steps that follow the hand-off in order, and beside each one name the kind of data it comes from. Then answer in one sentence: why is a bulk rock volume a better thing to hand to the fluids workflow than a hydrocarbon volume computed here?

As a self check: a contact clips the gross rock, from pressure data and well results; net-to-gross reduces gross to net, from a petrophysical cut-off on logs; porosity converts net rock to pore volume, from log or core measurement; saturation converts pore volume to hydrocarbon pore volume, from log analysis or a saturation-height function; and a formation volume factor converts the reservoir volume to a surface volume, from a fluid study. None of those five is a property of the geometry, so none of them can be produced by this course. The bulk rock volume is the better hand-off because it depends on no fluid assumption at all, so it stays valid across every fluid case and every revision of them, and the container never has to be rebuilt when a saturation model changes.
