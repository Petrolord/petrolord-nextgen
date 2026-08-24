# What interpolation invents

Time to count. The Ekene map at a 100 m cell covers a 25 by 20 lattice, which is 500 nodes. Of those, 201 carry a value and 299 are masked out as unsupported, which is the subject of the next module. So the finished map is 201 numbers.

Those 201 numbers rest on six measurements. At most six of the nodes coincide with a well, so roughly 195 of the values on the map were produced by the thin-plate spline and by nothing else. That is about 97 percent of the map. Every one of those 195 values is reasonable, every one is the output of a defensible method applied consistently, and not one of them was observed.

This lesson is the honest accounting of that fact, and it is the point of the whole module.

## The ratio is normal, not scandalous

It is tempting to read 195 out of 201 as evidence that the map is mostly fiction and should be distrusted. That is the wrong conclusion. Six wells over a few square kilometres is a perfectly ordinary amount of control for a field at this stage, and a real development map may rest on a similar ratio over a larger area. The alternative to interpolating is not a better map, it is no map, and a table of six depths cannot be contoured, differenced or turned into a volume.

So the ratio is not an argument against mapping. It is a permanent label on the product, and the discipline is remembering the label when the map is used.

## What the invented values are good for

Quite a lot, in fact. The invented values do real work that the picks alone cannot do.

They make contouring possible. A contour is a line of constant depth traced across a continuous field, so the contour at 1550 m exists only because there are values everywhere for it to pass through. On the Ekene map with a 10 m contour step, most of the length of every contour line runs across interpolated ground.

They make differencing possible. Subtract the top surface from the base and you get an isochore thickness at every node. That operation needs both surfaces defined at the same nodes, which means interpolated values on both sides.

They make volume possible. Gross rock volume is the mapped surface integrated against a contact over an area. An integral needs a value at every node in the area, so the volume is, quite literally, a sum over mostly invented numbers.

They make prediction possible, which is the thing an exploration or development decision actually buys. A proposed location gets a predicted depth, and that prediction comes from a node no bit has reached.

## What they are not

They are not evidence. An interpolated value cannot confirm anything, cannot resolve a disagreement about structure, and cannot be quoted back as support for the model that produced it. This last one is the trap. The map was built from an assumption about smoothness, so reading a value off the map and offering it as proof that the surface is smooth is circular. The map can only ever give back the assumption you gave it, dressed as a number with four decimal places.

Precision is part of the trap. A mapped depth of 1542.6199 m looks far more authoritative than a well pick written as 1546 m, because it carries more digits. The digits come from float arithmetic, not from knowledge.

## The case the capstone grades

Location P-1 sits at (1600, 1600). There is no well there. The mapped depth at P-1 is 1542.6199 m. Its nearest control is Ekene-6, at (1900, 1800), about 361 m away, where the pick is 1546 m.

A learner who understands this module can say two things about that number at the same time, without flinching at the tension between them.

First, 1542.6199 m is the best available estimate of the depth of TOP_SAND at P-1. It came from an exact interpolator honouring all six picks, it is well inside the supported part of the grid at 361 m from control, comfortably within the 800 m extrapolation limit this fixture uses, and there is no better number on offer. If a well is to be planned at P-1, this is the depth that goes on the prognosis.

Second, the map cannot prove it. No measurement at P-1 exists. The value is about 3.4 m shallower than the nearest well's pick, and that difference is entirely the spline's account of how the surface behaves between wells. A different method would give a different number, and none of them could be checked until something is drilled.

Both statements are true. Refusing the first makes you useless, because decisions still have to be made. Forgetting the second makes you dangerous, because a prognosis stated with no uncertainty gets planned against as if it were certain.

## The rule to carry forward

Quote map values with their support, never with the authority of a pick.

In practice that means a sentence rather than a number. Not "TOP_SAND at P-1 is 1542.62 m" but "TOP_SAND at P-1 is estimated at about 1543 m from the gridded map, with the nearest control 361 m away at Ekene-6, which picked 1546 m." The second version takes ten seconds longer to say and tells the reader everything they need to judge it. It also gives you an answer when the map is later proved wrong, which sometimes it will be.

Try it yourself: every coloured node in the panel below carries a value the spline produced, and only a handful of them sit on a well.

{{panel:mp-map-explorer}}

## Exercise

Write the one-sentence prognosis statement for a location 700 m from the nearest well on this fixture, in the style above, and note whether it is still inside the extrapolation limit. Then answer: of the 201 live nodes on the Ekene map, how many are measurements and how many are inventions, and why is that ratio not a reason to reject the map? As a self-check: 700 m is inside the 800 m limit, so the node is live but weakly supported and your sentence should say so; at most six of the 201 nodes are measurements, leaving about 195 invented; and the ratio is normal for six wells over this area, because the alternative to interpolating is having no continuous surface at all, and therefore no contours, no thickness and no volume.
