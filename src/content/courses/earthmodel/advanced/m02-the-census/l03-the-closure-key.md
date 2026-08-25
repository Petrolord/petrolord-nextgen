# The closure key

326 plus 174 equals 500. The sentence looks like arithmetic; this lesson argues it is the tier's most important quality control, and shows what it guards against.

## Partition, not selection

Labelling assigns every node exactly one label: 0 or 1, nothing skipped, nothing doubled. That property, being a PARTITION, is what makes per-block statistics meaningful. The census closing to the frame's 500 is the visible certificate of the partition, and every downstream per-block quantity inherits a closure test of the same shape: block 0's cells plus block 1's cells must equal the total's cells; block 0's bulk plus block 1's bulk must equal the whole-model bulk. Module six runs those and gets zero, exactly, and the reason it CAN is that the labelling is a partition and the volume engine sums each node into its block's register and the total register in one pass.

## What breaks partitions in practice

The golden model's partition is trivially clean; the value of the key is knowing the realistic threats it screens.

Overlapping polygons: two compartments drawn with a sliver of overlap. First-wins assigns the sliver to the earlier polygon; the census still closes, because first-wins is itself a partition rule. What breaks is the MODELLER'S intent, and the screen is comparing each polygon's standalone containment count against its assigned census: polygon 2 containing 60 nodes but being assigned 52 reveals an 8 node overlap with polygon 1.

Gaps between compartments: polygons meant to tile a fault-bounded field but drawn with a gap. The gap's nodes land in block 0, the "outside" label. The census closes again; the tell is block 0's count being larger than the geology says the unfaulted background should be. Closure plus per-label plausibility, together, catch what either alone misses.

Boundary nodes: a polygon edge running exactly along a node line, where the strict inequalities of the inside test decide. The count is deterministic but convention-dependent; drawn 25 m off the lattice, as here, the question never arises. The screen is checking whether any node sits within epsilon of any edge, a cheap sweep worth automating on real polygons.

## The key at one remove: control points

The same partition logic applies to the four control points, labelled by the same test: three in block 0, one in block 1, three plus one equals four. Trivial as it looks, this is the closure that would catch a control point silently dropped by a broken containment test, and it is why the panel's provenance tile reports the WELLS count per block: 3 and 1, summing to the well set.

## Worked example

Construct the failure the key catches best. Suppose block labelling ran against a stale frame of 25 by 21 nodes after someone extended the model north, while volumes ran on the new 25 by 20. The label array has 525 entries, the thickness grid 500; depending on the plumbing this is an exception if you are lucky and a silent misalignment if not, with every node's label shifted off by a row's worth after the mismatch point. The census key fails immediately and specifically: labels sum to 525 nodes against a 500 node frame. Every deep chassis in this course family runs this exact class of length-consistency check, and the volume engine itself throws when a property grid's length disagrees with the thickness grid, for the same reason.

## Exercise

Write the three-line closure audit you would run after ANY relabelling of a multi-polygon model: the three sums you would compute and what each must equal. Then state which of the three realistic threats above your audit does NOT catch, and what one additional check closes that hole.
