# Moving the fault

The fault at 1800 m is given to you by the capstone. In real work its position is interpreted, and interpretations have uncertainty. This lesson maps out what that uncertainty is worth by walking the fault across the field.

## The sweep

Hold both contacts at 1560 m and step the fault east in 100 m increments. Every step transfers one column of nodes from the east block to the west.

| Fault easting (m) | West cells | East cells | West STOIIP | East STOIIP |
| --- | --- | --- | --- | --- |
| 1000 | 18 | 151 | 1.141959 | 10.997249 |
| 1200 | 41 | 128 | 2.986508 | 9.152700 |
| 1400 | 65 | 104 | 5.193290 | 6.945918 |
| 1500 | 78 | 91 | 6.434924 | 5.704284 |
| 1600 | 91 | 78 | 7.652518 | 4.486690 |
| 1800 | 117 | 52 | 9.855617 | 2.283591 |
| 2000 | 142 | 27 | 11.444229 | 0.694979 |
| 2200 | 165 | 4 | 12.117944 | 0.021264 |
| 2300 | 169 | 0 | 12.139208 | 0.000000 |

Three features of that table are worth naming.

## It is monotonic, and the total never moves

Every step east adds cells and barrels to the west and removes exactly the same from the east. That has to be true, because moving the fault only relabels cells, and it is the cheapest possible check that a partition routine is behaving.

Add any row across and you get 169 cells and 12.139208 MMstb. If a sweep like this ever fails to hold the total constant, stop and find the bug before interpreting anything.

## The cell counts mirror

Look at the rows for 1500 m and 1600 m. At 1500 m the split is 78 west and 91 east. At 1600 m it is 91 west and 78 east.

That is a genuine mirror, and it says something about the field rather than about the arithmetic: the accumulation is close to symmetric in area about an easting somewhere between those two lines. Its midpoint by cell count is around 1550 m.

The barrels do not mirror. At 1500 m the west holds 6.434924 against the east's 5.704284, and at 1600 m the west holds 7.652518 against 4.486690. Equal areas do not carry equal volumes, because the western cells carry taller columns. The point where the barrels split evenly lies further west than the point where the areas do, somewhere near 1450 m.

## It stops

From 2300 m eastward the east block holds nothing at all. No oil bearing cell lies east of 2200 m at this contact, so a fault placed out there partitions nothing and the west block is the whole field.

That end of the table is a reminder that a fault only matters where there is something to divide. At the other end, a fault at 1000 m leaves the west block with 18 cells and about a million barrels, which is very likely too small to carry a well.

## Reading it off the panel

Step the fault through the whole range and watch the two share tiles rather than the volume tiles.

{{panel:rc-block-explorer}}

The share of barrels in the west runs from about 9 percent at a fault of 1000 m to 100 percent at 2300 m. Somewhere around 1450 m it passes 50 percent. The share of cells passes 50 percent around 1550 m. The gap between those two crossings is the whole subject of the next module.

## Worked example

Suppose the seismic interpretation puts the fault at 1800 m with an uncertainty of plus or minus 100 m, which is optimistic for a fault at reservoir depth.

Read the table at 1700 m, 1800 m and 1900 m. The west block books 8.806373, 9.855617 and 10.757040 MMstb. The uncertainty on the west block from the fault position alone is therefore roughly plus 0.90 and minus 1.05 MMstb, or about plus or minus 10 percent.

The east block moves from 3.332835 to 2.283591 to 1.382168 MMstb over the same range. As a fraction of itself, the east block's uncertainty is plus 46 and minus 39 percent.

That asymmetry is the general rule and it is worth remembering: a given uncertainty in the position of a boundary is a small relative error for the large block and a large relative error for the small one. The compartment whose volume is most in doubt is usually the one whose economics are most marginal.

## Exercise

Using the table, find the fault position at which the two blocks hold the most nearly equal number of barrels, and state the position at which they hold the most nearly equal number of cells. Explain why the two answers differ.

Self check: barrels are closest to equal at a fault near 1500 m, where the split is 6.434924 against 5.704284; cells are closest to equal between 1500 m and 1600 m, where the split runs 78 against 91 and then 91 against 78. The barrel crossing sits west of the cell crossing because the western cells carry taller oil columns, so the west reaches half the field's volume before it reaches half its area.
