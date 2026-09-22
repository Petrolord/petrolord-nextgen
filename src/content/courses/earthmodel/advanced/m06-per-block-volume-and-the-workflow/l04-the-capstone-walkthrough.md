# The capstone walkthrough

The Expert capstone gives you a fault polygon of its own, a variogram of its own, a probe point and a model row. It asks for six fields, all derived in this course. This lesson runs each from first principles on the golden fault and variogram, which are the teaching case, and names the wrong answer each field is built to catch. None of the golden numbers is a capstone answer.

The population explorer opens on the golden case. For the capstone, type the brief's polygon into the fault polygon box (vertices as x,y pairs separated by semicolons, block 1 inside), type its nugget and range, its profile row and its probe point.

{{panel:em-population-explorer}}

## Field one: the block 1 node count

On the golden fault: hand count from the L's two rectangles, 12 columns times 9 rows plus 6 columns times 11 rows, 108 plus 66, 174. The census tile confirms. A count is graded exactly, because counting is exact or broken. The classic wrong answers: one more or one fewer, an inequality solved with the wrong strictness at a boundary; or the other block's count, a reading slip. On a polygon of your own, hand count it the same way before you trust the tile.

## Field two: the trend porosity at the probe point

Three multiplications on the plane $0.38 - 0.00004x - 0.00001y$. At the golden probe (1250, 2250) that is 0.3075. The trend readout at the probe point carries it. Wrong answers: the kriged value read instead of the trend; gradients applied per kilometre, which moves the second decimal.

## Field three: the kriged porosity at the probe point

The four-well simple krige with the stated variogram, read from the probe readout with simple kriging selected. With the golden variogram at (1500, 2500) it is 0.2914277719922997, the probe lesson's anatomy. Wrong answers: the per-block map's value at the same point, the distinction lesson five flagged; the trend's value; or the field mean, which is what a range too short for the well spacing collapses to. Type the brief's nugget and range before you read it: module five showed how far both move the probe.

## Field four: the porosity jump across the fault on the stated row

The per-block kriged map with the stated variogram, read along the stated row: the block 0 node beside the fault minus the block 1 node beside it, sign kept. The jump tile prints it to six decimals and the subtitle names the two nodes. On the golden case, on the y = 2200 row, it is block 0's kriged value at x 1600 less block 1's constant 0.315. The wrong answers it hunts: the magnitude without its sign; the trend seam or the constant seam, which are the same tile read with the method switched; and the jump at a neighbouring nugget or range, which moves it by as little as a ten-thousandth.

## Field five: zone A weighted porosity in block 0

The MD-weighted mean over the zone A control points that fall outside the polygon. On the golden fault that is W2, W3 and W4: $60.411814793890244 / 211 = 0.28631191845445614$. Wrong answers: the unweighted mean; the four-well weighted mean, meaning a well crossed the fault in the bookkeeping, the exact error module three exists to prevent; and thickness-reweighting of a deviated well, a defensible convention that is not this engine's. On a polygon of your own, list which wells fall inside it first.

## Field six: zone A bulk volume in block 1

In millions of cubic metres. On the golden fault it is 13.99875, from the census route (174 nodes' thickness times cell area) or from closure (45 minus 31.00125). The volume tile and the closure tile carry both. Wrong answers: the other block's volume; the node count times the field mean thickness, the mean-without-its-denominator error; and a value in raw m3.

## The shape of the exam

Notice the coverage: one counting field, one regression field, two kriging fields separated by exactly the concepts that distinguish them, one weighted-statistics field, one volume field with closure available as a check. Every field has at least one wrong answer that is a CORRECT computation of a DIFFERENT question, and the differences are this course's modules.

## Exercise

For each of the six fields, write the one-line provenance note you would attach in a report: what was computed, from which data, under which convention. Six lines, each under twenty words, no number without its recipe.
