# Where a contact comes from

Two lessons have shown that the contact carries the booking. The obvious next question is where the number comes from, and the honest answer for this course is uncomfortable enough to be worth stating first.

## In this fixture the contact is given

The Ekene dataset does not contain a contact. The wells carry a TOP_SAND pick and a BASE_SAND pick and nothing else. The capstone tells you to set the oil water contact to 1560 m, and the panel offers 1550, 1560 and 1570 m as options. None of those three depths was measured. They were chosen so that you could see what a contact does.

This is a teaching simplification and it should be named as one, because the way it fails is subtle. Look at the well table and it is tempting to read the oil columns of 12, 19, 8 and 14 m at Ekene-1, Ekene-3, Ekene-5 and Ekene-6 as evidence about the contact. They are not evidence. Every one of those columns was produced by subtracting the well's top from the assumed contact of 1560 m. They are consequences of the assumption, not support for it. The same goes for the observation that Ekene-2 and Ekene-4 are dry, which is true only because their tops of 1565 m and 1590 m happen to lie below the depth somebody chose.

Circular support of that kind is common in real projects too, usually in the form of a contact that was set years ago, propagated through every later document, and is now quoted as though it were data. In real work the contact comes from one or more of four kinds of evidence, and each of them has a characteristic uncertainty.

## Logs through the transition zone

The resistivity and saturation logs across a well that penetrates the contact show hydrocarbon saturation falling with depth and water saturation rising, over an interval rather than at a knife edge. That interval is the capillary transition zone, and its height depends on the pore throat size and on the density difference between the fluids. A tight rock can carry tens of metres of transition.

So a log gives you a zone and you have to decide what to call the contact within it. Common choices are the lowest known oil, the depth of the deepest clearly oil bearing reading, and the free water level, the depth at which capillary pressure goes to zero. Those are different depths and they book different volumes. The uncertainty here is not measurement noise, it is definition.

## Pressure gradients

Repeat formation tester pressures plotted against depth fall on straight lines whose slopes are the fluid densities. The oil line and the water line intersect at the free water level, and the intersection can be found even when no single well drilled through the contact, because each line only needs points in its own fluid.

This method is powerful and it is the one most often quoted with a false air of precision. The intersection depth is only as good as the two slopes, and a slope fitted through a handful of points spread over a short interval can swing the crossing point by metres. A gradient analysis should always be reported with the depth range of the points that constrained each line.

## Fluid samples

A sample recovered at a stated depth tells you what was there. Samples bracket the contact: the deepest sample that came back as oil and the shallowest that came back as water put hard limits on it. Between those two limits nothing is known, and that gap is often exactly the ten metres this module has been using as its example.

Samples are the least ambiguous of the four and also the most expensive, so you will usually have few of them.

## A seismic flat spot

A flat, horizontal reflector cutting across the dipping structural reflectors is the acoustic response of a fluid contact, and it is the only one of the four that sees between the wells. It reads at a two way time that must be converted to depth, so its accuracy inherits the accuracy of the velocity model. It also needs the impedance contrast to be visible at all, which many contacts are not.

## What to do with all this

You will rarely have one clean answer. You will have a transition zone from a log, a gradient crossing that sits a few metres away from it, one bracketing sample and possibly an ambiguous flat spot. The professional response is to take the range those methods span and carry it as the low, mid and high contact, which is the reason the previous two lessons insisted on three cases rather than one.

And when the contact is given to you rather than derived, as it is here, say so in the report. An assumed contact is a legitimate input. An assumed contact quoted as though it were a measurement is not.

## Exercise

You are handed a different field, not Ekene, with one well through the reservoir. Its logs show oil above 2040 m, a transition zone from 2040 to 2058 m, and clean water below. A pressure gradient analysis puts the free water level at 2061 m. Write down which contact depth you would use for a low case and which for a high case, and say in one sentence what you would report alongside the volumes.

Self check: use 2040 m for the low case, since that is the deepest depth clearly holding oil, and 2061 m for the high case, since the gradient crossing at the free water level is the deepest depth the fluids can support. The mid case sits inside the transition zone between them. Report the two volumes with the contact each assumes and the evidence behind it, and state that the spread comes from the definition of the contact rather than from any disagreement about the rock properties.
