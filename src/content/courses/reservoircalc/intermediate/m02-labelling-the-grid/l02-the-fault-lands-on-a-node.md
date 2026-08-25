# The fault lands on a node

The Ekene fault runs at an easting of 1800 m. The grid has nodes at 400, 500, 600 and so on to 2800 m. So the fault does not run between two columns of nodes. It runs exactly through one.

This lesson is about that coincidence and why it is not really a coincidence at all.

## The arithmetic

The frame starts at 400 m and steps by 100 m, so a node lies at 1800 m if $(1800 - 400)$ divides by 100 without remainder. It does, fourteen times. The fault passes through column 14, counting the first column as zero.

That column is not empty. Of its 20 nodes, 13 carry oil at the 1560 m contact. Their columns sum to 165.363525 m, which at 10,000 square metres per cell is 1.653635 million cubic metres of gross rock volume, about 7.4 percent of the field.

So a full column of oil bearing rock sits exactly on the line, and it has to be given to one block or the other.

## Why it happens so often

It looks like bad luck. It is closer to the opposite: it is what usually happens.

Grid origins and cell sizes are chosen as round numbers, and so are fault positions when they are quoted rather than interpreted. A grid at 100 m spacing starting on a 100 m multiple has nodes on every 100 m easting in the frame, so any fault quoted to the nearest hundred metres lands on a node column. The same holds at 50 m spacing for any fault quoted to the nearest fifty.

You avoid it only by having a fault position that is genuinely irregular, which happens when the fault comes from an interpreted surface rather than from a number somebody wrote down. In that case the fault falls between columns and the assignment is unambiguous.

The lesson for your own models is not to hope for irregularity. It is to know which way your code breaks the tie and to say so.

## How this model breaks the tie

The rule this model uses is that a node belongs to the west block when its easting is strictly less than the fault easting.

Strictly less. A node at exactly 1800 m is not less than 1800, so it fails the test and goes east. The whole of column 14, all 13 of its oil bearing cells and all 1.653635 million cubic metres of its rock, belongs to the east block.

That is one defensible choice out of two. The other, giving the boundary column to the west, is equally defensible and is what a rule using "less than or equal" would produce. Neither is more correct as geology. The rock straddles the fault and the model has to put it somewhere.

## Reading it off the panel

Open the panel and set the fault to 1800 m with both contacts at 1560 m.

{{panel:rc-block-explorer}}

Look at the dashed red fault line and the column of cells it passes through. Those cells are amber, which is the east block's colour. The line is drawn through the boundary the engine actually tests, so what you see on the map is what the label array holds.

Now step the fault to 1900 m. The column that was on the line is now strictly west of the fault, so it turns blue, and the west cell count rises from 117 to 130. Those 13 cells are the same 13 cells. They did not move and their oil did not change. Only the comparison changed.

## Worked example

Confirm the column count from the cell counts alone, without trusting the claim.

At a fault of 1800 m the split is 117 west and 52 east. At 1900 m it is 130 and 39. The difference is 13 cells in each direction, and 13 is exactly the number of oil bearing nodes in the column at 1800 m, because moving the fault from 1800 to 1900 transfers precisely that column.

Check the volumes the same way. West gross rock volume goes from 18.079852 to 19.733488 million cubic metres, a rise of 1.653636 million, which matches the column's own 1.653635 million to the last figure printed. The partition is behaving exactly as a partition should: what one block gains, the other loses, and the field total never moves.

## Exercise

Suppose your grid started at an easting of 450 m instead of 400 m, with the same 100 m spacing, and the fault stayed at 1800 m. Would the fault still land on a node column? If not, which two columns would it fall between, and what would the tie break rule then decide?

Self check: no. With an origin of 450 m the node eastings are 450, 550, 650 and so on, so 1800 m falls halfway between the columns at 1750 m and 1850 m. Every node is then strictly on one side or the other, the tie break rule never fires, and the assignment is unambiguous. The 13 cells at 1750 m go west and the 13 at 1850 m go east.
