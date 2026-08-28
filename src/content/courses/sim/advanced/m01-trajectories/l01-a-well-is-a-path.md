# A well is a path

The six vertical wells were described by two numbers, k1 and k2. A deviated well cannot be, and the difference is the whole of this module.

## Why k1 and k2 stop working

They assume the well is a vertical line through one column. Give a simulator k1 = 1 and k2 = 5 and it knows exactly which five cells are meant: the five layers of column (i, j).

A deviated well crosses columns as it descends. There is no single (i, j), and the set of cells it passes through is not a contiguous run of layers in anything. So the completion has to be a LIST, and producing that list is a geometry problem rather than a bookkeeping one.

## What a trajectory is

A sequence of points in three dimensions: easting, northing, and true vertical depth. In practice it comes from a directional survey, which measures inclination and azimuth at intervals along the hole and is integrated into positions by a minimum-curvature calculation.

Ekene's side-track is described by two points, a heel and a toe:

| point | easting (m) | northing (m) |
|---|---|---|
| heel | 1900 | 1800 |
| toe | 1500 | 2100 |

with the depth running from the top of the sand at the heel to the base of the column at the toe. It starts at Ekene-6 and drives north-west toward the crest.

## The problem to solve

Given that path and the grid, which cells does it pass through, in what order, and how much of the path is in each.

That is an intersection problem, and it has a standard answer: walk along the path in small steps, ask which cell each step is in, and accumulate. The next lesson does exactly that.

## Why the answer is a list with structure

Each connection needs three things beyond its cell indices.

**A length.** How much of the wellbore is in that cell. Two cells clipped by the same well are not equally connected if the path spends 200 ft in one and 30 ft in the other.

**A direction.** Whether the path crossed the cell mostly horizontally or mostly vertically. That decides which of the cell's dimensions the well index formula treats as the flow length.

**An order.** Connections are listed heel to toe, which is the order fluid would travel.

None of those is optional, and none of them is something you can write down by inspecting a map.

## What a deviated well buys

Contact. A vertical well in this field touches five cells. The side-track touches eleven, across eight different columns, so it drains a larger area of the reservoir from one wellbore.

That is the usual reason to drill one, and in a layered reservoir it has a second benefit: a well that crosses several columns intersects the fast layer over a longer interval, which changes both the productivity and the water breakthrough behaviour.

## The misconception to avoid

"A deviated well is a vertical well with more completions." It is a well whose completions are in different COLUMNS, which means it is draining laterally separated rock. A vertical well with fifteen completions is still draining one 100 m by 100 m column; the side-track is draining eight of them. The count is not the point, the spread is.

## Exercise

First, the side-track runs from (1900, 1800) to (1500, 2100). Compute the horizontal distance it covers and compare it against the cell size, and state roughly how many columns you would expect it to cross.

Second, name the three things a connection carries beyond its cell indices, and say what each is used for.
