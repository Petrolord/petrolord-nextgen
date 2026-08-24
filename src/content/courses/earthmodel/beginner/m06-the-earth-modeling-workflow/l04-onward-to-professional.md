# Onward to Professional

This tier taught one framework. You fixed a model frame of 25 by 20 nodes at 50 m cells with its origin at (1000, 2000), which is 500 nodes each carrying 2500 m2. You took three surfaces that arrived on a 40 x 32 grid, a 27 x 27 grid and a 30 x 25 grid, none of them matching the frame or each other, and resampled all three onto it so that all 500 nodes came up live on all three. You applied the depth-down monotonic clamp and read its counts of 0, 0 and 180 rather than silencing them. You differenced the stack into zone A, with a mean thickness of 36 m over 500 nodes and a maximum of 42 m, and zone B, with a mean of 10.24 m over 500 nodes or 16 m over the 320 where it exists. Then you turned those into 45,000,000 m3 and 12,800,000 m3 of gross rock, and handed them on.

That is a complete skill and it is deliberately narrow in two directions. Everything you built is a container, and everything you built is a single unbroken block of rock with no wells in it. The two tiers above close exactly those gaps, and it is worth knowing what they are before you decide whether to climb.

## Professional: tie the wells to the framework

The Professional tier puts four wells into this same model and ties every one of them to the framework you built.

A well is not a vertical line, and the tier starts by making that concrete. Each well's path is reconstructed from its survey by minimum curvature, the standard method for turning measured depth, inclination and azimuth into a three dimensional trajectory. One of the four wells, W2, carries a real 45 degree build rather than a token deviation, so the difference between measured depth along the hole and true vertical depth below datum is large enough to matter at every pick.

With the trajectories built, each formation top picked in a well is landed in 3D and compared against the framework surface at that position. The difference is the tie residual, and the tie table of residuals is what tells you whether the surfaces you mapped agree with the rock the wells actually found.

The headline of that tier is one number. The worst residual in the well set is the deviated well's BaseB at 45.028 m, and the reason is the deviation. A 45 degree build moves the bottom of the hole a long way sideways from the surface location, so the well meets BaseB somewhere the framework did not expect it. The residual is a statement about geometry rather than a mistake in either the well or the surface.

Two things you already know become load bearing there. The clamp you learned to read decides what BaseB is at the point a well meets it, and where the clamp has moved BaseB down onto TopB the tie is being taken against a pinched-out zone. And the frame you chose sets the resolution at which a surface can be compared to a well at all.

## Expert: cut the model into blocks and fill them

The Expert tier introduces a fault and everything that follows from one.

A fault polygon is laid over the model and every node of the frame is labelled with the block it belongs to. The census on this model is 326 nodes in one block and 174 in the other, hand counted, and those two counts account for the frame's 500 nodes.

Once the model is in blocks, properties can be populated per block rather than smeared across a structural break. That tier uses two methods on the same data. A plane trend fits a regional gradient through the control points and evaluates it anywhere. Simple kriging honours the control points themselves, so a prediction taken at a well returns the well's own value. Running both on one model is how you see the difference between a trend that describes the field and an estimator that respects the data.

Volumes are then computed per block. The two zone A block volumes on this model are 31.00125 and 13.99875 in units of 10^6 m3, and they sum back to the 45 x 10^6 m3 anchor you computed at this tier. That closure is the reason your Beginner number matters: a per-block volume that did not sum back to it would mean the block labelling had lost or double counted nodes.

## The shape of the ladder

Put the three tiers in one line. The Beginner tier builds the container: a frame, a clamped surface stack, two thickness grids and two bulk rock volumes. The Professional tier ties wells to that container and measures how far the surfaces are from the rock. The Expert tier cuts the container into fault blocks, fills them with properties and reports volume block by block.

Each tier makes the one below it more demanding rather than replacing it. A tie residual is only meaningful against a framework whose clamp you can explain, so module three matters more at the Professional tier, not less. A per-block volume is only checkable because a whole-model volume exists to check it against, which is the Beginner anchor doing work two tiers up.

The same widening runs sideways. Well data, correlation and mapping feed this course its surfaces and its zone definitions. This course hands its bulk rock volume to the ReservoirCalc course, where a contact, net-to-gross, porosity, saturation and a formation volume factor turn gross rock into hydrocarbon in place. None of that changes what you built. It consumes it.

## Exercise

Write one sentence for each tier saying what it does that the tier below it cannot. Then answer in two sentences: what is the worst tie residual on this model and why is it that well, and what do the two per-block volumes sum back to?

As a self check: this tier builds the container, giving a TopB mean of 1575.5 m, clamp counts of 0, 0 and 180, zone thicknesses of 36 m and 10.24 m over 500 nodes, and bulk volumes of 45,000,000 m3 and 12,800,000 m3; the Professional tier builds minimum-curvature trajectories for four wells and ties their picks to those surfaces; and the Expert tier cuts the model with a fault polygon, populates properties per block by trend and simple kriging, and reports volume per block. The worst residual is the deviated well's BaseB at 45.028 m, and it is that well because a real 45 degree build moves the bottom of the hole away from the surface location. The two zone A block volumes, 31.00125 and 13.99875 in units of 10^6 m3, sum back to the 45 x 10^6 m3 anchor.
