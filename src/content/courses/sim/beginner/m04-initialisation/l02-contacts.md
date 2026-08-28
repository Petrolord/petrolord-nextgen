# Contacts

A contact is a depth at which the fluid in the pore space changes. It is one number in EQUIL and it is one of the highest-leverage numbers in the whole deck.

## Ekene's contact

$$\text{OWC} = 5118.110236220472 \text{ ft} = 1560 \text{ m}$$

That depth came from the geoscience courses. It is where the mapping put the oil-water contact, and every volumetric number the field has ever booked rests on it.

## What the simulator does with it

Above the contact, oil. Below it, water. In a block-centred model that decision is made per cell, and it is made on the cell's CENTRE depth, not on where the contact cuts through it.

So a cell straddling the contact is entirely oil or entirely water depending on which side its middle falls. There is no partial cell. The contact in the model is therefore a staircase following the cell centres rather than a plane, and its roughness is the layer thickness.

That is a real consequence of gridding and it is why the Professional tier spends a module reconciling this model's oil volume against the booking.

## The gas-oil contact

Ekene has no gas cap. The reservoir started at 3200 psia against a bubble point of 2000 psia, so it was undersaturated throughout and no free gas existed anywhere.

The deck still has to say so. With no gas-oil contact supplied, the composer places one 100 ft above the shallowest column top, which puts it above all the rock. A contact outside the model is a contact that never applies, and the whole box stays in the oil leg.

That is the idiomatic way to say "no gas cap" in a deck: not by omitting the contact but by putting it somewhere it cannot bite.

## Capillary pressure at the contact

EQUIL also carries the capillary pressure at each contact, and this deck sets both to zero.

Zero capillary pressure at the contact means the contact IS the free water level: the depth where oil and water pressures are equal is the depth where the water saturation reaches one. With a non-zero entry pressure those two depths separate, and the SCAL course made a lesson of exactly that separation.

Setting it to zero here is consistent with setting the capillary pressure columns in SWOF and SGOF to zero. A deck that carried a Pc curve in PROPS and zero in EQUIL would be describing two different rocks.

## What a contact error costs

The oil column at the crest is about 62 ft. Move the contact 10 ft deeper and you have added roughly a sixth to the column at the crest, and more than that in area, because a deeper contact also brings more columns into the oil leg.

Contacts are usually the single most uncertain input in a volumetric calculation, and they are also the cheapest thing in a deck to change. That combination is why a contact sensitivity is standard practice and why a study that quotes one contact without a range is quoting half a result.

## The misconception to avoid

"The contact in the deck is the contact that was logged." The logged contact is a depth in a wellbore. The contact in the deck is a plane across the whole field, which assumes the contact is flat and that the mapping carried it correctly between wells. Tilted contacts, perched water and compartment-specific contacts all exist, and none of them can be expressed by the single number this deck carries.

## Exercise

First, the crest is at 5055.774278215223 ft and the contact at 5118.110236220472 ft. Compute the maximum oil column, then recompute it for a contact 10 ft deeper and state the percentage change.

Second, explain in two sentences why setting the capillary pressure to zero in EQUIL is consistent with setting the Pc columns of SWOF and SGOF to zero, and what would be inconsistent about doing one and not the other.
