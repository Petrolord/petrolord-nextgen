# Labelling the nodes

With a validated polygon in hand, labelling is one question asked 500 times: is this node's centre inside? This lesson covers the test itself and the two conventions wrapped around it, because both conventions carry consequences.

## The even-odd test

The engine uses the classic even-odd ray crossing test, the PNPOLY formulation. Conceptually: shoot a ray from the query point toward increasing x and count how many polygon edges it crosses; an odd count means inside, even means outside. The implementation walks the edges once, toggling a boolean whenever an edge straddles the query point's y and the crossing sits to the point's right.

The test's virtues are exactly what a labelling engine needs: it is orientation-blind, so clockwise and counterclockwise polygons agree; it handles concave shapes like the golden L without special cases; and it costs a handful of comparisons per edge, so labelling 500 nodes against a six-edge polygon is trivial.

Its one soft spot is a query point exactly ON an edge or vertex, where the strict inequalities decide arbitrarily. The golden fixture's 25 m offset (last lesson) keeps every node away from that soft spot by construction.

## Convention one: node centres, in or out

A node is labelled by its CENTRE point, the exact (x, y) of the lattice position. A cell whose centre is inside but whose area straddles the boundary counts wholly inside; one whose centre is just outside counts wholly out. There is no partial membership and no area weighting. That is the same convention zone volumes already use, thickness at the node times full cell area, and consistency between the two is what will make per-block volumes close exactly in module six. A mixed convention, area-weighted labels with centre-valued volumes, would leak volume at every boundary cell.

## Convention two: first polygon wins

The engine accepts a LIST of polygons, and a node's label is 1 plus the index of the FIRST polygon containing it, 0 if none contains it. With overlapping polygons, earlier in the list beats later; the golden model has a single polygon, so the convention is invisible here, but it is the documented tiebreak and it makes polygon ORDER part of the model definition. Two compartments drawn with an overlap do not error; the overlap silently belongs to the first. The QC for that is comparing each polygon's standalone census against the assigned census, a check the exercise below rehearses.

## The labels on the golden model

Running the test over the frame: nodes at columns 0 through 11 are inside for rows 0 through 8, and columns 0 through 5 for rows 9 through 19. In world terms: the southern panel of the L captures x 1000 to 1550 up to y 2400, and the northern arm captures x 1000 to 1250 from y 2450 up. Everything else is block 0. The resulting census, 326 against 174, is next module's subject; here, note only that the boundary between the column 11 and column 12 nodes sits at the polygon edge x 1575, halfway between them, which is the 25 m offset doing its job on the west-east boundary, and likewise the y 2430 edge splits rows 8 and 9.

## Worked example

Run the test by hand for one node, W2's wellhead node at (1400, 2200), against the golden polygon. Cast the ray toward increasing x at y 2200 and walk the six edges: the edge from (1575, 1975) to (1575, 2430) straddles y 2200 and crosses at x 1575, right of 1400: one crossing. The edge from (975, 2975) to (975, 1975) also straddles y 2200, crossing at x 975, LEFT of 1400: not counted. Every other edge is horizontal at y 1975, 2430 or 2975, or vertical outside the straddle. Total: one crossing, odd, inside. The wellhead is in block 1, agreeing with the Professional tier's closing exercise.

## Exercise

Repeat the hand test for W2's zone A control point at (1610.8719179395334, 2200) and for W3's wellhead at (1900, 2700), giving the crossing count and verdict for each. Then state, in one sentence, why the two W2 locations disagreeing about their block is a property of the model rather than a bug in the test.
