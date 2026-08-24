# The oil water contact

A mapped surface tells you where the rock is. It says nothing about what is in the pores. Sand at 1545 m and sand at 1595 m look the same on a depth map, and one of them can be full of oil while the other is full of water.

The object that separates them is the fluid contact. On an oil accumulation it is the oil water contact, the OWC: the depth below which the pore space holds water rather than producible oil. Everything this course computes is bounded by it, so it deserves a lesson of its own before any volume is calculated.

## What a contact is

Oil is less dense than the formation water it displaced, so it is buoyant. It migrates up through connected pore space until something stops it, and it accumulates from the top of the trap downwards. The result is a body of oil sitting on water, with a boundary between them.

That boundary has a depth, and the depth is what makes it useful. Above it, inside the reservoir rock and inside the closure, you have oil. Below it, in the same rock, you have water. One number divides rock that is worth something from rock that is not.

On Ekene this course uses a contact at 1560 m. Check it against the six wells and the consequences are immediate. Ekene-1 tops the sand at 1548 m, which is 12 m above the contact. Ekene-3 tops at 1541 m, 19 m above. Ekene-6 tops at 1546 m, 14 m above. Ekene-5 tops at 1552 m, 8 m above.

Ekene-2 tops at 1565 m and Ekene-4 at 1590 m. Both of those are below 1560 m, so the entire sand section in those two wells sits beneath the contact. They are dry wells at this contact, and they are dry despite carrying 36 m and 25 m of sand, which are the thickest and the thinnest sands in the field. Two of the six wells in the fixture find no oil.

## Why it is a plane here

In this course the contact is a horizontal plane at a single depth. Every node on the grid is tested against the same 1560 m, and the surface of the water is flat everywhere in the field.

That is a teaching simplification, and you should know what it leaves out.

Real contacts tilt. Regional aquifer flow, or hydrodynamics, can drag a contact off horizontal by tens of metres across a field. Real fields can have several contacts, one per fault block, when the blocks are not in pressure communication. Real contacts are not sharp: capillary forces hold water in the smaller pores well above the free water level, so there is a transition zone in which saturation grades from irreducible water at the top to full water below, and the thickness of that zone depends on pore size and on the density contrast between the fluids.

None of that is in the Associate fixture. A single flat plane at 1560 m is the simplest object that still teaches the thing that matters, which is that a volume is bounded from below by an interpretation rather than by rock. The Intermediate tier introduces a sealing fault and the possibility of separate blocks. Saturation modelling above a free water level belongs to the Professional path.

## The contact is an interpretation

This is the sentence to carry out of the lesson. Nobody measures an oil water contact.

What is measured comes in fragments, and each fragment has to be read. Logs in a well can show the saturation profile changing with depth, which brackets a contact but does not locate a surface. Pressure measurements taken at intervals down a well give two gradients, a lighter one in the oil leg and a steeper one in the water leg, and the depth at which the two lines cross is an inferred contact rather than a sampled one. Fluid samples confirm what is present at the depths that were sampled and say nothing about the depths in between. Seismic can occasionally show an amplitude response at a contact, which is again an inference from a response rather than a depth read off a rule.

Each of those is evidence. The contact you write on the map is a judgement about all of it, made by a person, and it can be revised the day a new well is drilled. On a field with no well below the oil leg, the contact may be nothing more than the deepest known oil in one well, in which case the true contact is somewhere below it and nobody knows how far.

## Everything downstream is hostage to it

Gross rock volume is the rock between the top surface and the contact. Move the contact and you do not adjust the volume, you rebuild it, because a deeper contact adds rock in two ways at once. Every cell that already held oil gets a taller column, and cells that held none begin to hold some as the contact drops past their top.

The properties handed to you at this tier behave nothing like that. Net to gross, porosity, water saturation and the formation volume factor each enter as a single multiplication, so a 10 percent error in any of them moves STOIIP by 10 percent and no more. The contact is the only input in the whole calculation whose effect on the answer is not a straight proportion.

Module 5 puts numbers on that, using the same fixture at three different contacts. For now, treat the contact as the assumption you would interrogate first when someone hands you a volume, and expect the person who produced it to be able to say where their contact came from.

## Exercise

Using the contact at 1560 m, list which of the six Ekene wells are oil bearing and which are dry, and give the oil column at each of the wells that has one. Then write two sentences: one saying what evidence you would ask for to defend a contact depth, and one saying why a thick sand can still be worth nothing.

Self check: Ekene-1, Ekene-3, Ekene-5 and Ekene-6 are oil bearing, with columns of 12, 19, 8 and 14 m respectively. Ekene-2 and Ekene-4 are dry, because their TOP_SAND picks at 1565 m and 1590 m are both below the contact. For evidence you should be asking for log saturations through the interval, pressure gradients from the oil and water legs and the depth at which they intersect, any fluid samples, and the depth of the deepest known oil and the shallowest known water. A thick sand is worth nothing when all of it sits below the contact: Ekene-2 carries the thickest sand in the field at 36 m and contributes no oil at all.
