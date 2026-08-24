# Which nodes hold oil

The clipping rule is now applied to the whole grid. Every one of the 201 live nodes on the Ekene map is tested against the contact at 1560 m, and each one comes back either with an oil column or with nothing. This lesson reads the result.

## The count

Of the 201 mapped nodes, 169 hold oil at the 1560 m contact. The other 32 do not, because their TOP_SAND value is below the contact, so the clipped column comes out zero or less and the node is discarded.

Those 32 nodes are not blank. They are fully mapped, they carry a top and a base, and the mapping course would report them as live. They are ground where the sand lies entirely beneath the water. Two counts now travel with the map, and they answer different questions.

| Count | Value | What it measures |
| --- | --- | --- |
| Live nodes | 201 | how much ground the map is entitled to describe |
| Oil bearing cells | 169 | how much of that ground holds oil at 1560 m |

The first number belongs to the wells and the extrapolation limit. The second belongs to the contact. Quote either one without saying which it is and a reader will take it for the other.

## The dry wells

The well control says the same thing the grid does. Ekene-2 tops the sand at 1565 m and Ekene-4 at 1590 m, both below the contact, so both wells are dry at 1560 m. Ekene-1, Ekene-3, Ekene-5 and Ekene-6 have columns of 12, 19, 8 and 14 m.

So two of the six wells in this field contribute nothing to the booking, and the whole of the 169 cell accumulation rests on four. That is worth sitting with. When you read a volume computed from six wells, ask how many of them actually saw oil, because the answer is not always six and the map does not announce it.

You should expect the 32 dry nodes to lie in the part of the field around Ekene-2 and Ekene-4, where the top surface is deepest, and the panel will show you whether that is so.

## The area

Each node stands for one cell of 100 by 100 m, which is 10,000 square metres. So

$$169 \times 10{,}000 = 1{,}690{,}000 \text{ square metres} = 1.69 \text{ km}^2$$

That is the oil area: the footprint of the accumulation at this contact. Area is the quantity worth quoting, for the reason the mapping course gave when it dealt with live node counts. A count depends on the cell size you happened to choose, and an area does not. If someone regridded Ekene at 50 m the cell count would go up by roughly a factor of four and the area would land in the same place.

The oil area is also the number a facilities engineer or a well planner will ask for first, because it says how much ground has to be drained and therefore how the wells might be spaced across it.

## The finding that decides this course

Now the result that matters most in this module, and it is a result about the base surface.

At all 169 oil bearing nodes, BASE_SAND is deeper than the contact. Not most of them. All of them. Every single oil bearing node on Ekene at 1560 m is contact limited, and not one is base limited.

Go back to the clipping rule and see what that means arithmetically. The minimum of base and contact returns the contact at every node that survives, so

$$\text{column} = \min(\text{base},\ \text{contact}) - \text{top} = 1560 - \text{top}$$

everywhere in the accumulation. The base surface, which was gridded from six picks with the same care as the top and which sits on the same mask, contributes nothing at all to this booking. You could delete it from the calculation and the gross rock volume, the pore volume and the STOIIP would not change by a single barrel.

That is not a criticism of the base surface and it is not a reason to stop mapping it. It is a statement about this contact.

## When the base would start to matter

The threshold is exact and you can read it off the mapped extremes. The shallowest value anywhere on BASE_SAND is 1570 m. As long as the contact stays shallower than 1570 m, the contact is shallower than the base everywhere on the map, so the minimum always returns the contact and the accumulation is contact limited across its whole extent.

Push the contact deeper than 1570 m and that stops being true. The crestal cells, where the base is shallowest, begin to fill with oil all the way to the floor of the sand, and their columns stop growing when the contact drops further. Those cells become base limited, the sand is full, and the accumulation can only spread outward from then on rather than downward at the crest.

This is the reason the base surface is in the fixture at all. At 1560 m it is inert. At a contact 10 m deeper it starts doing work, and a volumetric workflow that had quietly dropped it would keep adding rock below the reservoir floor and would not report an error. The base surface is a guard you carry whether or not it fires.

Set the contact in the panel below and watch the oil bearing cell count change while the live node count stays at 201.

{{panel:rc-volume-explorer}}

## Exercise

State the two node counts at the 1560 m contact and say what each one depends on. Convert the oil bearing count to an area. Then answer two questions in one sentence each. Why does the base surface contribute nothing to the volume at this contact, and what is the exact contact depth at which that would begin to change?

Self check: the map has 201 live nodes, which depends on the six well positions and the 800 m extrapolation limit, and 169 oil bearing cells, which depends on the contact at 1560 m as well. At 10,000 square metres per cell that is 1,690,000 square metres, or 1.69 km2 of oil area. The base contributes nothing because BASE_SAND is deeper than the contact at all 169 oil bearing nodes, so the minimum in the clipping rule always returns the contact and the column reduces to 1560 minus the top everywhere. That changes once the contact is deeper than 1570 m, the shallowest mapped value on BASE_SAND, at which point the crestal cells fill to the base and become base limited.
