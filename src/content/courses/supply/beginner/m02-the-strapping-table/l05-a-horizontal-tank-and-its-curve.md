# A horizontal tank and its curve

{{panel:supply-tank-explorer}}

## A cylinder on its side

AK-03 is a bullet: a cylinder 3 m in diameter and 11.5 m long, lying on its side. Near the bottom and the top, a millimetre of liquid covers a narrow strip; near the middle it covers the full width of the shell. The volume held per millimetre of height changes all the way up, so the volume of a bullet is not linear in height.

volumeAtDip does not know the shape of any tank. It reads a table and draws a straight line between two entries. On a vertical cylinder the straight line is the truth, because every millimetre adds the same slice. On a bullet the truth between two entries is a curve, and the straight line cuts across it.

## The same bullet, two tables

The digest measures what that costs. It straps the same bullet every 10 mm (301 entries) and reads it against its own table every 100 mm:

| height mm | volumeAtDip on the 100 mm table m3 | volumeAtDip on the 10 mm table m3 | the 100 mm table less the 10 mm table m3 |
| --- | --- | --- | --- |
| 1847 | 52.501 | 52.508 | -0.007 |
| 41 | 0.341 | 0.220 | 0.120 |

At the morning dip, 1847 mm, the 100 mm table reads 52.501 m3 and the 10 mm table reads 52.508 m3. The 100 mm table less the 10 mm table is -0.007 m3.

At 41 mm, the height of AK-03's free water this morning, the 100 mm table reads 0.341 m3 and the 10 mm table reads 0.220 m3. The 100 mm table less the 10 mm table is 0.120 m3. The sign of that difference says the coarse table reads the higher volume at 41 mm.

Both tables describe one geometry. The only thing that differs is how often the curve was sampled.

## Compare the vertical tank

AK-01 is a vertical cylinder, which is linear in height. Its 250 mm table and the same tank strapped every 10 mm agree at the dip to the litre: 3542.077 m3 and 3542.077 m3. A vertical tank's step can be coarse without cost at the dip. A horizontal tank's step is part of the answer.

## What this means for a stock

The figures above give the difference at two heights only. They say nothing about any other height, and you should not guess one.

The water cut sits at the very bottom of the bullet, where the curve is tightest, and 41 mm is AK-03's water height this morning. Module three reads that water through the table.

The engine never ships a table, so it cannot sample the curve more finely by itself. The terminal chooses how finely to strap its tanks.

In the panel, open AK-03 and switch between the 100 mm and 10 mm tables. Slide the dip down to 41 mm and read both volumes.

## Exercise

Read the two rows of the bullet table, at 1847 mm and at 41 mm, and the AK-01 comparison. Say what the printed differences show about interpolating a horizontal tank and what the AK-01 figures show about a vertical one.

Self check: on the bullet the 100 mm table less the 10 mm table is -0.007 m3 at 1847 mm and 0.120 m3 at 41 mm, so a straight line between entries departs from the curve by a measured amount at each height. On the vertical AK-01 the two tables give 3542.077 m3 and 3542.077 m3, so interpolation there matches the finer table to the litre.
