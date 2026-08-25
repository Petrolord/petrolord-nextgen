# The block panel map

This lesson is a tour of the instrument. The block explorer is the only panel this tier uses, every later module reads numbers from it, and a few minutes spent understanding what each control does will save an hour of confusion later.

{{panel:rc-block-explorer}}

## The three controls

The fault easting moves the partition from 800 m to 2300 m in 100 m steps. Those steps match the grid spacing on purpose, so each step moves exactly one column of nodes from one block to the other. Beyond 2300 m nothing changes, because no oil bearing cell lies east of 2200 m.

The west block contact and the east block contact are set independently. Both default to 1560 m, the contact the Associate tier used and the one the capstone books against. Setting them to different values is the subject of module five, and until then leave them equal.

The controls interact in one direction only. The contacts decide which cells hold oil and how much column each one carries. The fault decides which block owns each of those cells. Moving the fault never changes the total number of oil bearing cells, and changing a contact almost always does.

## The map

Each coloured rectangle is one grid node's cell, 100 m square, that carries oil at the contact its block was given. Blue is the west block and amber the east. Blank ground is either outside the mapped area, which is everything more than 800 m from a well, or has its top below the contact.

The colour saturation carries the oil column. A pale cell holds a sliver, a strong one holds close to the maximum column in the field. Reading the map for saturation rather than for colour is how the block difference becomes obvious: the west is mostly strong, the east is mostly pale.

The dashed red line is the fault, drawn at the easting you selected. Cells to its left are blue and cells to its right amber, and the line is drawn through the boundary the labelling test actually uses so that what you see is what the engine did.

Wells are posted as circles with a label carrying the well name and a W or an E for its block. A white circle is a well with oil at its block's contact and a red circle with a hollow centre is a dry well, meaning its top pick lies below the contact. Notice that a well can change from oil to dry when you move its block's contact, and that a well can change block when you move the fault.

## The tiles

Twelve tiles sit under the map, arranged in pairs so that the west and east values of the same quantity sit side by side.

The cell counts come first. These are counts of oil bearing cells and they always add to the field total, which is printed as the denominator.

Gross rock volume and STOIIP follow for each block. Those four are four of the six numbers the capstone asks for, so at the default settings you can read the capstone answers straight off the panel. That is deliberate. This tier is not trying to make the capstone hard to find; it is trying to make it impossible to report without understanding.

The mean oil column for each block explains the previous pair whenever the barrels and the cells disagree about the split.

The last four tiles are the checks. Blocks added is the sum of the two block STOIIP figures printed to six decimals. Field total is what the engine reports for the whole partition. Share of cells and share of barrels give the two percentages that module three compares.

## What to notice at the default settings

Set the fault to 1800 m and both contacts to 1560 m, then read across the tiles.

The cell counts read 117 and 52 of 169. The gross rock volumes read 18.0799 and 4.1892, which add to 22.2690. The STOIIP figures read 9.8556 and 2.2836.

Now compare the last two check tiles. Blocks added reads 12.139208 and field total reads 12.139208. They agree at every digit shown, which is the answer you want. Module three shows you where they stop agreeing and why that is not a defect.

Finally compare the two share tiles: 69.2 percent of the cells and 81.2 percent of the barrels sit in the west block. Any time those two percentages differ, the blocks hold different shapes of rock, and the size of the gap is a measurement of how different.

## Worked example

Here is a two minute exercise with the panel that previews the whole tier.

Leave both contacts at 1560 m and step the fault from 1700 m to 1800 m and then to 1900 m. Watch the west cell count go 104, 117, 130 and the west STOIIP go 8.8064, 9.8556, 10.7570.

Each of those steps moves one column of thirteen oil bearing cells and roughly one million barrels. The fault is a line drawn on a map with some uncertainty attached, and one grid column of uncertainty in its position is worth about eight percent of the field booking. Nothing about the rock changed while you did that.

## Exercise

Set the fault to 1800 m, leave the west contact at 1560 m, and set the east contact to 1550 m. Record the east cell count and the east STOIIP, then set the east contact to 1570 m and record them again. Explain in one sentence why the west tiles did not move.

Self check: at an east contact of 1550 m the east block falls to 18 cells and 0.327859 MMstb; at 1570 m it rises to 73 cells and 5.810977 MMstb. The west tiles do not move because the two blocks are booked independently, and the west block's cells were clipped against the west contact, which you did not change.
