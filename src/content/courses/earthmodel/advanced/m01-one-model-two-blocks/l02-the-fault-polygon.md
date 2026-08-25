# The fault polygon

The model's fault arrives as a polygon in world XY: six vertices, traversed in order, closed implicitly from the last back to the first. This lesson reads the golden polygon and the validation rules that stand between a vertex list and a usable fault.

## The golden polygon

$(975, 1975) \to (1575, 1975) \to (1575, 2430) \to (1275, 2430) \to (1275, 2975) \to (975, 2975)$

Plot it mentally against the frame, which spans x 1000 to 2200 and y 2000 to 2950. The polygon is an L shape hugging the model's west side: a wide panel in the south, from x 975 to 1575, up to y 2430, and a narrower panel continuing north from x 975 to 1275. Block 1 will be the inside of the L; block 0 the rest of the frame.

Look at the coordinates themselves: 975, 1575, 2430, 1275, 2975. Every one sits 25 m off the frame's node lattice, whose lines run at multiples of 50 from (1000, 2000). That is a fixture design choice with a purpose: no node of the frame lies ON a polygon edge, so the inside test never has to adjudicate a boundary case and the census is unambiguous. Real fault polygons enjoy no such courtesy, and a node exactly on an edge lands wherever the inequality conventions put it; the golden model simply refuses to depend on that.

## Validation before use

The engine validates a polygon before labelling with it, and each rule exists because of a specific failure it prevents.

At least three vertices, all finite numbers: fewer cannot enclose anything, and a NaN vertex poisons every containment test silently.

Non-degenerate area: the shoelace sum must be nonzero. A polygon whose vertices are collinear has zero area and would put nothing inside; the engine throws rather than labelling everything block 0 as if the fault were not there.

No self-intersection: edges may not cross. A bowtie polygon has no consistent inside; the even-odd test would label its two lobes oppositely to what any geologist drawing it intended. The engine checks every non-adjacent edge pair and refuses.

Note what is NOT validated: orientation. Clockwise and counterclockwise both work, because the even-odd test is orientation-blind. Nor is convexity required; the golden L is deliberately concave, and concavity is exactly what real fault traces look like.

## A polygon is a model of a fault, not a fault

A real fault is a 3D surface with throw and dip; this engine's polygon is its map-view trace, treated as a vertical curtain: a node is in or out regardless of depth. That is the v1 modelling decision, documented in the engine, and its cost is knowable: a dipping fault's trace moves with depth, so a vertical-curtain block assignment is exact only for vertical faults and an approximation otherwise. The golden model's fault is vertical by fiat. When the Seismolord ladder hands you fault sticks with real dip, the difference between a curtain and a surface becomes a modelling decision you make consciously.

## Worked example

Compute the polygon's area by the shoelace formula, as the validator does. Summing $x_i y_{i+1} - x_{i+1} y_i$ around the six vertices gives twice the area; the result is 873,000, so the area is 436,500 m2. Keep that number: next module compares it against the node census times the cell area, 174 times 2500 equals 435,000 m2, and the 1,500 m2 gap between the two is a lesson in what a census is.

## Exercise

State what the validator does with each of these three vertex lists, and why: the list $(1000, 2000), (1500, 2000), (2000, 2000)$; the golden list with its second vertex's x replaced by NaN; and the bowtie $(1000, 2000), (1500, 2500), (1500, 2000), (1000, 2500)$. One sentence each, naming the rule that fires.
