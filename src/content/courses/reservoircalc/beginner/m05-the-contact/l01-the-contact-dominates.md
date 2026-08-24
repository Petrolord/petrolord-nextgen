# The contact dominates

Module four went through the four properties one at a time and asked how far each could move the booked volume. The answer was: not far. At this tier every property is a constant that multiplies the chain exactly once, so an error of ten percent in any of them is an error of ten percent in the STOIIP and nothing worse.

This module is about the input that does not behave that way.

## Three contacts, one field

Nothing about the Ekene field changes across the three rows below. The same six wells, the same TOP_SAND and BASE_SAND picks, the same 100 m cell, the same 800 m extrapolation limit, the same 201 mapped nodes and the same four properties. The only thing that moves is the depth at which oil gives way to water.

| OWC (m) | Oil cells | Max column (m) | GRV (million m3) | Pore (million m3) | HCPV (million m3) | STOIIP (MMstb) |
| --- | --- | --- | --- | --- | --- | --- |
| 1550 | 128 | 10.2818603515625 | 7.036696 | 1.125871 | 0.731816 | 3.835815 |
| 1560 | 169 | 20.2818603515625 | 22.269036 | 3.563046 | 2.315980 | 12.139208 |
| 1570 | 190 | 30.2818603515625 | 40.439926 | 6.470388 | 4.205752 | 22.044451 |

Read the last column on its own. Ten metres deeper takes the field from 3.835815 to 12.139208 MMstb. Another ten metres deeper takes it from 12.139208 to 22.044451 MMstb. The booking roughly triples, then roughly doubles.

Ten metres is not a large uncertainty on a contact. It is about the gap you would expect between a contact drawn at the deepest known oil in one well and a contact drawn at the shallowest known water in another, when nothing was drilled through the interval in between. Two interpreters working the same field, both careful, both honest, can easily differ by that much. On Ekene they would hand you bookings that differ by a factor of three.

## What the contact actually decides

The contact does two jobs at once, and it is worth separating them.

First it decides membership. Of the 201 mapped nodes, only those whose TOP_SAND sits above the contact hold any oil at all. At 1560 m that is 169 nodes, and the remaining 32 have their top below the contact and hold none. Move the contact and the membership list changes.

Second it decides thickness. At every node that qualifies, the oil column at this contact is the contact depth minus the mapped top, so raising or lowering the contact raises or lowers the column at every one of those nodes together.

You can see both jobs in the well table. At 1560 m, Ekene-2 with a top of 1565 m and Ekene-4 with a top of 1590 m are dry, because their tops are below the contact. The other four wells carry columns of 12, 19, 8 and 14 m, and each of those columns is the contact minus that well's own pick.

## Compare that with the properties

Put the leverage side by side. STOIIP scales linearly with NTG, with porosity, with the hydrocarbon fraction and inversely with Bo, because each enters as a plain multiplication by a constant. To pull the booking down from 12.139208 MMstb to the 3.835815 MMstb of the shallow contact case using porosity alone, you would need the porosity to be wrong by roughly a factor of three. A core lab does not hand you 0.20 for rock that is a third as porous as that.

A contact that is ten metres too deep, on the other hand, is an ordinary interpretation that nobody would flag in a review. That is the whole point of this module. The input with the widest realistic range of values is also the input the answer is most sensitive to, and it is the one input that no measurement in the dataset pins down.

## How to work when one input dominates

Three habits follow.

Establish the contact before you polish anything else. Time spent refining a porosity estimate while the contact is still an assumption is time spent on the wrong end of the problem.

Never book a single contact. Compute the volume at a low, a mid and a high contact and carry all three, which is exactly what the table above does.

When you read someone else's volume, the first question is always what contact it assumes and what evidence puts it there. If the report does not say, you have not been given a volume. You have been given a number.

Try it yourself: move the contact in the panel below across the three cases and watch the STOIIP.

{{panel:rc-volume-explorer}}

## Exercise

A colleague sends you a one line result for Ekene: 22.044451 MMstb of STOIIP, with a note saying the porosity is well constrained by six core plugs and the net to gross is from a good log suite. Write down the single question you would ask before quoting that number to anyone, and say what you expect the answer to change.

Self check: ask what contact the booking assumes. The number is the 1570 m case from the table above, and if the contact is instead at 1560 m the same map and the same properties give 12.139208 MMstb, while at 1550 m they give 3.835815 MMstb. The quality of the porosity and the net to gross is not the issue, because both enter the chain as single multipliers and neither can move the answer by anything like that much. The contact can, and until you know which contact was used, the confidence in the properties tells you almost nothing about the confidence in the volume.
