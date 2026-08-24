# The closed form check

A modelling package will hand you a bulk rock volume with ten digits after the point and no indication of whether it is right. Volumes are the easiest number in a framework to get wrong, because they combine a thickness, a count and an area, and each of those three has its own way of going astray. This lesson gives you a check that costs no software at all.

On a regular frame, bulk rock volume is mean thickness times the number of nodes times the cell area. You can run that in your head against any framework anyone shows you.

## Where the formula comes from

The bulk volume is the sum, across nodes, of thickness times the area each node carries:

$$V_{bulk} = \sum_{i} t_i A_i$$

When every node carries the same cell area, $A_i$ is a constant $A$ and comes out of the sum:

$$V_{bulk} = A \sum_{i} t_i = A \cdot N \cdot \bar{t}$$

because the sum of the thicknesses is the node count times the mean thickness, which is what a mean means. So the volume is

$$V_{bulk} = \bar{t} \times N \times A$$

with mean thickness in m, node count as a plain count, and cell area in m2. The product lands in m3.

That last step is worth pausing on, because it is the reason the check works at all. It holds because every node carries exactly one cell of area, and every cell on this frame is the same size. The frame is at 50 m cells, so each node carries 2500 m2, and there are 500 nodes.

## Zone A on this model

Zone A has a mean thickness of 36 m over all 500 nodes of the frame. Put the three numbers in:

36 x 500 x 2500 = 45,000,000 m3

That is 45 x 10^6 m3, and it is the graded capstone value for zone A's bulk rock volume with a tolerance of 0.01 in that unit. The engine, running the full pipeline over the thickness grid node by node, returns the same figure. There is no approximation anywhere in the agreement. The closed form and the node sum are the same arithmetic written two ways.

## What the check catches

Run the closed form against a reported volume and the differences you find are diagnostic rather than mysterious.

A volume that is off by a factor of fifty says the cell area was taken as the cell size. A 50 m cell is 2500 m2 of area, not 50, and the confusion between a length and an area is the single most common volume error there is.

A volume that is off by a factor of a million says a length went in as km somewhere while the rest of the chain stayed in m.

A volume that is off by a factor of $500/320$ on zone B says the mean was taken over one node set while the count was taken over another. The next lesson is entirely about that case, because on this model it happens by design.

A volume that is a little off, without a clean factor, usually says nodes were dropped. If the engine skipped null nodes in the sum but the reported count is the full frame, the two disagree by however many nodes were skipped. On this model that check passes cleanly: all 500 nodes are live on all three surfaces, so nothing was dropped and nothing had to be.

## Quote it with its parts

The formula is also a reporting discipline. If you write the volume as the product rather than as a single number, every input is on the page:

| part | zone A | unit |
| --- | --- | --- |
| mean thickness | 36 | m |
| node count | 500 | count |
| cell area | 2500 | m2 |
| bulk rock volume | 45,000,000 | m3 |

Anyone reading that table can check the arithmetic in a moment and can see exactly which input to argue with. A lone figure of 45,000,000 m3 invites neither.

## Where the check stops working

The closed form is exact on a regular frame with uniform cell area, which is what this course builds and what a great many practical models use. It stops being exact in three situations, all of which belong to later tiers.

Where the frame has variable cell sizes, or is a corner point grid whose cells differ node by node, $A$ cannot come out of the sum and the volume has to be accumulated cell by cell.

Where part of the frame is inactive or has been clipped, the count in the formula must be the count actually summed over, not the full frame.

Where beds dip steeply, map area and true bed area are different things, and a volume built from vertical thickness on a map frame is a different quantity from one built on true stratigraphic thickness. On this model the surfaces are gentle and the distinction does not arise.

In all three cases the discipline survives even when the shortcut does not. Say what you averaged, say how many nodes you summed, and say what area each node carried.

Try it yourself: read the zone A mean thickness and the frame size from the panel below, then multiply them out before you look at the volume it reports.

{{panel:em-framework-explorer}}

## Exercise

Take the closed form and run it on zone A from the three inputs alone, then say what factor you would expect to see in the reported volume if a colleague had entered the cell area as 50 rather than 2500. Then answer in one sentence: what property of the model frame makes mean thickness times node count times cell area exact rather than approximate?

As a self check: 36 x 500 x 2500 = 45,000,000 m3, which is 45 x 10^6 m3 and the graded capstone value at a tolerance of 0.01 in that unit. Entering 50 in place of 2500 would report a volume fifty times too small, since 2500 m2 is the area of a 50 m cell rather than its side length. The formula is exact because every node of the frame carries exactly one cell of the same area, so the cell area is a constant that factors out of the sum, leaving the node count times the mean thickness, which is the definition of a mean.
