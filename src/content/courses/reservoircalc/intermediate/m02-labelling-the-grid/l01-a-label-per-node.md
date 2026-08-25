# A label per node

Partitioning a field sounds like it ought to need new machinery. It does not. The volume engine already accepts a partition, and this lesson is about the exact form it takes, because knowing the form tells you what a partition can and cannot express.

## The argument that was always there

The engine that produced every number in the Associate tier takes four things: the frame, a thickness grid, a set of property grids, and a block label for each node. The Associate tier passed nothing for the labels, and the engine treated the whole field as a single block called zero.

At this tier the labels are supplied. They are an array of integers, one per node, in the same order as every other grid in the model. Node 0 is the south west corner, the array runs east along a row and then jumps to the start of the next row north, and the label at position $j$ says which block node $j$ belongs to.

For the Ekene fault the array holds only two values: 0 for nodes west of the fault and 1 for nodes east of it. Nothing in the engine requires there to be two. Three faults would give four blocks and four labels, and the engine would return four sets of volumes without any change to the code.

## What the engine does with them

The engine walks the nodes in order. At each node it checks whether the node carries a thickness and whether every property grid has a value there. If it does, the node contributes its bulk, net, pore and hydrocarbon pore volume, and the engine adds that contribution twice: once to the running total for the node's own label, and once to a running total called the total.

That second addition is worth pausing on. The field total is not computed at the end by summing the blocks. It is accumulated in parallel with them, in its own register, as the walk proceeds.

The distinction has no effect on what the numbers mean and it has a small effect on their last digits, which module three takes up. It also has one immediate practical consequence: the field total is available whether or not a partition was supplied, so the check that the blocks reproduce the field is a genuine check against an independent accumulation rather than a restatement of the same sum.

## What a label can and cannot express

A label is attached to a node, so a partition in this model is a partition of the grid. That fixes what the model can represent.

It can represent any division of the mapped area into regions, of any shape, as long as the boundary between regions follows the edges between cells. Two blocks, five blocks, a block that wraps around another one: all fine, all expressible as an integer per node.

It cannot represent a boundary that runs through the middle of a cell. The cell is the atom of the calculation, so a fault that crosses a cell diagonally is approximated by giving that whole cell to one block or the other. At a 100 m cell this granularity is 10,000 square metres of area, and multiplied by a typical column at Ekene it is on the order of 150,000 cubic metres of rock per cell.

It also cannot represent a boundary that varies with depth. The label belongs to the node, not to the node and a depth, so the fault in this model is vertical by construction. A real fault dips, and a dipping fault owns different map positions at the top and base of the reservoir. Representing that needs a different model, not a different label array.

## Worked example

Work out the label of a specific node by hand, because the indexing is where mistakes happen.

The frame starts at an easting of 400 m with 100 m spacing and 25 columns. Take the node at row 7 and column 12, counting from zero. Its position in the arrays is

$$j = 7 \times 25 + 12 = 187$$

and its easting is $400 + 12 \times 100 = 1600$ m. Since 1600 is less than 1800, the label at position 187 is 0 and the node belongs to the west block.

Now take column 15 in the same row: $j = 190$, easting $400 + 1500 = 1900$ m, which is greater than 1800, so its label is 1 and it belongs to the east.

Between them sits column 14 at an easting of exactly 1800 m, which is where the fault is. That node is the subject of the next lesson.

## Why this matters for reading a report

Anyone can write "the field is compartmentalised" in a report. The label array is what that sentence becomes when somebody has to compute with it, and knowing the form lets you ask better questions of somebody else's model.

Was the boundary snapped to cell edges, and how big were the cells? Was the fault treated as vertical? Were the labels built from the interpreted fault surface, or drawn by hand on a map? A partition is a modelling decision with a resolution attached, and the resolution is the cell size.

## Exercise

A colleague models a field with three faults that intersect, producing five compartments, on a grid with 50 m cells. State how many distinct label values their model needs, and state the largest area of rock that could be assigned to the wrong compartment by a single mislabelled cell.

Self check: five compartments need five distinct label values, conventionally 0 to 4. One mislabelled cell on a 50 m grid misassigns 2,500 square metres of area, and the volume that carries depends on the oil column there, so the volume error is 2,500 times the column in metres, in cubic metres.
