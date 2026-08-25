# Feeding volumetrics

The isochore is not the end of a workflow. It is an input to one, and the course that consumes it has its own capstone on the same field. This lesson is about the hand-off: what crosses the boundary, in what form, and what does not.

## The chain

Four courses share the Ekene field and they run in order.

**Well correlation** produced the picks. TOP_SAND and BASE_SAND in six wells are correlation products, and a pick wrong on the section is wrong everywhere downstream.

**Mapping**, this course, turns picks into surfaces and surfaces into an isochore.

**Volumetrics**, in ReservoirCalc Pro, turns surfaces plus a contact plus rock properties into a hydrocarbon volume.

**Economics** turns that into a decision.

Each link consumes the previous one without re-deriving it. That is what makes the honesty of each link matter: nobody downstream will rediscover a bad pick or an over-extrapolated node.

## What crosses the boundary

Three things, and it is worth being exact about them.

**The top surface**, because the contact cuts it. Where the top is shallower than the contact there is a hydrocarbon column; where it is deeper there is none.

**The isochore**, because it limits the column. A hydrocarbon column cannot be thicker than the reservoir it sits in, so the volume at any node is the smaller of the column height and the sand thickness.

**The mask**, because it defines the area the calculation may claim. Every blank node in the isochore is a node the volume calculation must leave out.

What does **not** cross is any statistic. The volumetrics calculation wants the grids, node by node, not the mean thickness or the mapped area. Averages are for reports; the calculation works on the arrays.

## Where the boundary sits

This course stops at gross rock volume of the whole interval. Contacts, saturations, porosity, net-to-gross, formation volume factors and recovery are the volumetrics course's material and are not developed here.

That boundary is deliberate and it runs the other way too. The volumetrics course does not re-grid anything. It takes the surfaces as given and its capstone reproduces exactly this field.

The two numbers are worth putting side by side because they are so different and so easily confused.

| Quantity | Value | What it covers |
| --- | --- | --- |
| Gross rock volume of the SAND, this course | 64.83 million m³ | The whole interval, over the whole mapped area |
| Oil-column gross rock volume at a 1560 m contact, volumetrics course | 22.27 million m³ | Only the part of the interval above the contact |

The second is a third of the first, and neither is wrong. The contact throws away every node where the top surface is deeper than 1560 m, and at the nodes it keeps it counts only the column above the contact rather than the full sand thickness.

## Why the isochore is still needed

If the contact does the limiting, why does volumetrics want the thickness map at all?

Because near the crest the column is limited by the **sand**, not by the contact. At a node where the top is at 1542 m and the contact at 1560 m, the column would be 18 m if the sand were thick enough, and the isochore says the sand there is 34 m, so it is. Move the contact to 1590 m and the implied column becomes 48 m at that node, which is more sand than exists; the isochore caps it at 34 m.

So the pair sets the answer: **column height is the smaller of contact minus top and the isochore thickness**, node by node. Neither map alone can compute it.

## Worked example

At P-1 the top surface is 1542.62 m and the isochore is 34.05 m. What is the oil column at a contact of 1560 m, and at a contact of 1600 m?

At 1560 m the contact is $1560 - 1542.62 = 17.38$ m below the top, and the sand is 34.05 m thick, so the column is 17.38 m and the contact is doing the limiting.

At 1600 m the contact is 57.38 m below the top, which is more than the 34.05 m of sand available, so the column is 34.05 m and the **sand** is doing the limiting. Deepening the contact further adds nothing at this location.

That switch, from contact-limited to sand-limited, is the reason the isochore has to travel with the top surface.

## Exercise

Name the three things this course hands to volumetrics and say why a statistic is not one of them. Then state which of the two limits applies at a node where the top is at 1550 m, the isochore reads 28 m and the contact is at 1570 m.

As a self-check: the top surface, the isochore and the mask cross the boundary, and a statistic does not because the volume calculation works node by node on the arrays, where a mean would already have destroyed the spatial variation the calculation integrates. At that node the contact sits $1570 - 1550 = 20$ m below the top and the sand is 28 m thick, so 20 m is the smaller of the two and the column is contact-limited at 20 m.
