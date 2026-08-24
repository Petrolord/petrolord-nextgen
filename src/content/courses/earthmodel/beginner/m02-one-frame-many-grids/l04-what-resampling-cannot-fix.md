# What resampling cannot fix

At the end of the last lesson the three surfaces sat on one frame with all 500 nodes live on each of them. That is real progress, and it is easy to mistake it for being finished. It is not. Putting three surfaces on one frame makes them comparable. It does not make them consistent.

## Comparable is not consistent

Comparable means the arithmetic is now defined. Node 137 on TopA, node 137 on TopB and node 137 on BaseB all refer to the same place on the ground, so subtracting one from another produces a number that belongs to that place. Before the resample that subtraction had no meaning at all.

Consistent means something stronger: that the numbers you get from those subtractions describe rock that could exist. Depth in this model is positive down, so a deeper surface should carry a larger depth value than the surface above it at every node. When it does, each zone thickness is zero or positive and the stack is a stack. When it does not, the surfaces have crossed, and the thickness at that node comes out negative.

Resampling has nothing to say about that. It treats each surface separately, reads values from that surface's own source grid, and writes them to the frame. It never looks at the surface above or the surface below. Three surfaces can be resampled perfectly onto one frame and still describe an impossible geometry.

## Why surfaces cross

Crossing is not exotic and it is not usually a blunder. Four ordinary causes produce it.

Independent gridding. Each surface was interpolated on its own, from its own control, with its own smoothing. Where two surfaces run close together, small independent differences in how the interpolators filled the gaps are enough to swap their order.

Genuine pinch out. Where a zone thins to nothing, the top and base of that zone converge. Any noise at all on either surface can then put the base fractionally above the top. Here the crossing is not a mistake in the data, it is the data telling you the zone has ended, expressed in a form the arithmetic cannot use directly.

Different pick quality. A strong reflector picked confidently and a weak one picked with difficulty carry different amounts of error. Add a coarse grid under the weak pick and the two surfaces will cross somewhere.

Resampling itself. The smoothing described in the last lesson moves both surfaces slightly, by different amounts, since they came from different source cell sizes. Two surfaces that just about kept their order on their own grids can lose it on the model frame.

## What it looks like on this model

The golden model does exactly this. After resampling, BaseB sits above TopB at a substantial number of nodes, and it does so for the second reason on that list: zone B pinches out across part of the field.

Left alone, that has real consequences. Every crossed node gives zone B a negative thickness. Negative thicknesses sum into a bulk volume as negative contributions, so the volume comes out too small, and nothing in the output announces that this has happened. The number is smaller and it still looks like a volume.

The fix is the depth down clamp, and it is the whole subject of module 3. The short version is that the clamp walks the stack from the shallowest surface to the deepest at each node and refuses to let a deeper surface be shallower than the one above it, pulling it down onto the surface above where necessary. On this model the clamp reports what it had to do as three counts, one per surface: 0 nodes fixed on TopA, 0 on TopB, and 180 on BaseB.

Sit with that number rather than skipping over it. It is 180 out of 500 nodes, and it is not a warning that something went wrong in your workflow. It is a measurement. Module 3 shows why a clamp count is one of the most informative diagnostics in a framework build, why it has to be reported rather than silenced, and what this particular count says about zone B.

## What else resampling cannot fix

The clamp is not a general repair tool either, and it is worth being clear about the class of problems that survive both operations.

A wrong pick stays wrong. If a horizon was picked on the wrong loop over part of the survey, the resampled surface is a faithful rendering of a mistake, and the clamp will happily enforce order on a wrong surface.

A datum error stays. If one surface was delivered in metres below a rotary table and the others in true vertical depth below sea level, the surfaces are offset by a constant that no amount of gridding will notice. The clamp may even hide it, by forcing surfaces into a plausible looking order that has nothing to do with the geology.

Missing data stays missing. Where a source grid had a hole, the frame nodes over that hole have no value to read, and no amount of resampling creates one.

The habit that catches all three is the same. After any framework build, look at the numbers it reports: live node counts per surface, clamp counts per surface, and the mean and range of each surface and each thickness. Then ask whether the geology you believe in would produce those numbers. On this model the surface means come out at 1539.5 m for TopA, 1575.5 m for TopB and 1585.74 m for BaseB, each averaged over all 500 nodes of the model frame. Those three means, in that order, with the deepest surface deepest, are a stack that hangs together.

The panel below runs the whole build, so you can see the three clamped surfaces, the two thickness grids and the framework statistics on one frame before module 3 takes the clamp apart.

{{panel:em-framework-explorer}}

## Exercise

State the difference between comparable and consistent for a stack of surfaces, and give the operation that delivers each. Then say what would happen to the zone B bulk volume if the crossed nodes were left as they are, and why nobody would notice from the output alone.

Self check: comparable means every surface is on one frame so that the same node index refers to the same ground on all of them, and resampling delivers that. Consistent means no deeper surface is shallower than the surface above it at any node, so no thickness is negative, and the depth down clamp delivers that. If the crossed nodes were left alone, each would contribute a negative thickness to the zone B sum and the bulk volume would come out smaller than the truth. Nobody would notice from the output alone, because a slightly smaller volume is still a plausible volume, and no error is raised. The only way to catch it is to look at the diagnostics the build reports, which on this model means the clamp count of 180 nodes on BaseB.
