# The container not the barrels

There is a division of labour in subsurface volumetrics that is worth stating in plain words on the first day, because learners who do not know where the line runs spend a lot of energy trying to finish a calculation that was never theirs to finish.

This course builds the container. The container is the framework of surfaces, the zones between them, the thickness of each zone at every node, and the bulk rock volume that follows. It stops there. Fluids, contacts, saturation and the booking of oil in place belong to the ReservoirCalc course, and the object handed across the line between the two is bulk rock volume.

## What a container is

Bulk rock volume is the volume of rock in a zone. All of it, without asking what is in the pores, whether any of it is reservoir quality, or where the oil water contact sits. It is geometry and nothing else: a thickness at every node, multiplied by the ground area each node accounts for, summed over the frame.

On the golden model the arithmetic is exact and worth seeing once now, even though module 5 is where it is built properly. Zone A has a mean thickness of 36 m averaged over all 500 nodes of the model frame, and each node accounts for a cell area of 2500 square metres. So the zone A bulk rock volume is 36 times 500 times 2500, which is 45,000,000 m3, or 45 x 10^6 m3. Zone B, on the same frame, comes to 12,800,000 m3. Together the two zones hold 57.8 x 10^6 m3 of rock.

Notice what those numbers do not say. They do not say that any of that rock is porous. They do not say that any of it holds oil rather than water. They do not say that any of the oil is producible. A bulk rock volume is an honest statement about geometry and a deliberately silent one about everything else.

## Where the other half lives

The other half of the calculation is the ReservoirCalc course, and you have already met it. That course starts from a bulk volume and works down: how much of the rock is reservoir rather than shale, how much of the reservoir is pore space, how much of the pore space holds hydrocarbon rather than water, where the contact cuts the structure, and what a volume at reservoir conditions becomes at the surface. Each of those steps is a fraction or a conversion applied to the volume that arrived from the model.

That is why the hand-off is the bulk volume. It is the last quantity that is purely geometric, and the first input the fluids side needs. Everything upstream of it is interpretation and gridding. Everything downstream of it is petrophysics, fluids and economics.

You will not see a barrel in this course. You will not see a saturation, a formation volume factor or a recovery factor either. If you find yourself reaching for one, you have crossed the line and you should go back to the volume.

## Why the split exists

The split is not administrative tidiness. It has three practical reasons behind it.

The first is that the two halves change at different times and for different reasons. A new well moves the surfaces and therefore the bulk volume. A new fluid study or a revised contact moves the saturation side and leaves the geometry untouched. Keeping the two apart means that when the in place number moves, you can say which half moved it. When the two are tangled inside one spreadsheet, nobody can.

The second is that the two halves are owned by different people. The framework is built by geologists and geophysicists from picks and grids. The property side is built by petrophysicists and reservoir engineers from logs, core and fluid samples. A hand-off with a clean interface lets each side be reviewed by the people qualified to review it.

The third is that the container is the part that has a right answer. Given the surfaces and the frame, the bulk volume is arithmetic and can be checked to the last digit, which is exactly what the golden model in this course does. The property side carries genuine uncertainty in every term. Mixing a checkable calculation into an uncertain one makes the whole thing look uncertain, and it hides errors in the half that should have been exact.

## What the hand-off must carry

A bulk volume handed across the line is not just a number. It has to carry three things with it or the receiving side cannot use it.

It has to carry its units, which in this course are always m3 or 10^6 m3, and always written down. It has to carry its zone, because a model with two zones produces two volumes and they are not interchangeable. Most importantly it has to carry its denominator, which means a statement of what was averaged over what.

That last point is the habit this course drills hardest. Zone B has a mean thickness of 10.24 m averaged over all 500 nodes of the frame, and a mean thickness of 16 m averaged over only the 320 nodes where the zone is actually present. Both describe the same rock and both are correct. Quote either one without saying which nodes it covers and you have handed the next person a number they will use wrongly. Module 4 takes that apart in detail.

## Exercise

Write down, in two columns, which of the following belong to this course and which belong to the ReservoirCalc course: zone thickness, oil water contact, cell area, net to gross, bulk rock volume, hydrocarbon saturation, the model frame, formation volume factor. Then state in one sentence what the interface between the two courses is and why it sits where it does.

Self check: zone thickness, cell area, bulk rock volume and the model frame are this course. The oil water contact, net to gross, hydrocarbon saturation and the formation volume factor are the ReservoirCalc course. The interface is the bulk rock volume, per zone, in m3, with the nodes it was computed over stated. It sits there because bulk rock volume is the last purely geometric quantity in the chain and the first input the fluid side needs, so it is the natural place to change owners.
