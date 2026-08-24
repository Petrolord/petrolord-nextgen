# Gross rock volume

Gross rock volume is the first number in the chain and the only one in it that is pure geometry. It is the volume of rock that sits above the oil water contact and inside the mapped area. No rock property has entered yet. Nothing has been said about how much of that rock is sand, how much pore space it holds, or what fluid fills the pores. GRV is the container, measured before anyone asks what is in it.

That is why it comes first, and it is also why an error here is the most expensive error in the whole workflow. Every later step is a multiplication of GRV by a fraction. If GRV is wrong by a factor, the booked barrels are wrong by that same factor, and no amount of care with porosity will rescue it.

## The cell is the unit of accounting

The mapping course left you with a gridded surface rather than a smooth mathematical shape, and volumetrics works with what mapping produced. The grid has a 100 m cell, so each live node stands for one square cell of

$$100 \times 100 = 10{,}000 \text{ square metres}$$

The engine does not integrate a surface analytically. It walks the nodes, works out an oil column at each one, multiplies that column by the cell area, and adds the results up. GRV is a sum of little rectangular boxes, one per cell, each 100 m by 100 m in plan and as tall as the oil column at that node.

Writing that as a formula, with $h_j$ the oil column at node $j$ and $A$ the cell area:

$$\mathrm{GRV} = \sum_j h_j \, A$$

That is the entire calculation. Everything else in this lesson is about which nodes get into the sum and what $h_j$ is at each one.

## Which nodes hold oil

The Ekene map has 201 live nodes. Those are the nodes that survived the 800 m extrapolation limit and carry a depth on both surfaces. They are the only nodes that can contribute anything, because a node with no mapped depth has no column to compute.

At the capstone contact of 1560 m, 169 of those 201 nodes have TOP_SAND above the contact. The other 32 have their top below 1560 m, which means the entire sand at that location is under the contact and full of water. They hold no oil and drop out of the sum.

So the accumulation covers 169 cells. Its plan area is

$$169 \times 10{,}000 = 1{,}690{,}000 \text{ square metres} = 1.69 \text{ km}^2$$

Two of the six wells sit on that dry ground. Ekene-2 picked TOP_SAND at 1565 m and Ekene-4 at 1590 m, both below the contact, so both are dry at this contact. Four wells have oil. That is worth holding on to, because a learner who assumes the field must be productive everywhere it was mapped will count 201 cells and overstate GRV by about a fifth.

## The column at a cell

At a node that has oil, the column is the vertical distance from the top of the sand down to whichever comes first, the base of the sand or the contact:

$$h_j = \min(\text{base}_j, \text{OWC}) - \text{top}_j$$

At the capstone contact, BASE_SAND is deeper than 1560 m at every one of the 169 oil cells, so the minimum is always the contact and the expression collapses to $h_j = 1560 - \text{top}_j$. The accumulation is contact limited everywhere. The base surface contributes nothing to this booking. It would only start to matter if the contact were deeper than the base crest of 1570 m, at which point some cells would run out of sand before they ran out of oil column.

The largest column is at the crest of the mapped surface:

$$1560 - 1539.7181396484375 = 20.2818603515625 \text{ m}$$

That crest, as the mapping course explained at length, is 1.2819 m shallower than any well pick, because a spline bending through six control points rises slightly above its highest pin. The maximum oil column therefore inherits an artefact of the interpolator. It is the right answer to the question the capstone asks, and it is also a reminder that the tallest column on a map is usually the least supported number on it.

## The sum

Adding the 169 columns, each multiplied by 10,000 square metres, gives

$$\mathrm{GRV} = 22.26903564453125 \text{ million m}^3$$

## The mean column check

There is a quick arithmetic check on any GRV, and you should run it every time. Divide the volume by the area and you must get back the mean column:

$$\frac{22{,}269{,}035.64453125}{1{,}690{,}000} = 13.176944 \text{ m}$$

That identity is exact by construction, since GRV is the sum of column times a constant area, so dividing by the total area recovers the average column. Its value is that the answer has to be plausible as a thickness. A mean oil column of 13.176944 m across 1.69 square kilometres, with a maximum of 20.2818603515625 m at the crest, describes a body of rock that a geologist can picture. If the same division had returned 1300 m or 0.13 m, you would know at once that a unit slipped or an area was wrong, and you would know it before the number reached a report.

Note also that the mean column is well below the maximum. That is the normal shape of a contact limited accumulation. Column goes to zero all around the edge, where the top surface meets the contact, so the average sits somewhere near the middle of the range rather than near the crest.

The panel below builds the grid, applies the contact you choose, and reports the volumetrics.

{{panel:rc-volume-explorer}}

## Exercise

Using only the cell count and the cell size, work out the plan area of the accumulation at the capstone contact in square metres and in square kilometres. Then divide the gross rock volume by that area and say what the result is, and what it would have told you if it had come out at 1300.

Self check: the area is $169 \times 10{,}000 = 1{,}690{,}000$ square metres, which is 1.69 square kilometres. Dividing 22,269,035.64453125 cubic metres by that area gives a mean oil column of 13.176944 m, which is a sensible thickness for this sand and sits comfortably below the maximum column of 20.2818603515625 m. A result of 1300 would mean the volume and the area disagree by a factor of about a hundred, so one of the two was entered in the wrong units.
