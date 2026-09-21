# Between two entries

{{panel:supply-tank-explorer}}

## A dip rarely lands on an entry

AK-01's table has an entry every 250 mm. The morning dip on AK-01 read 9318 mm, which is not one of them. The table has 9250 mm and it has 9500 mm, and the product stands somewhere between. The engine has to give a volume for a height the table does not list.

volumeAtDip does this in the simplest way available. It finds the entry just below the dip and the entry just above, draws a straight line between the two, and reads the volume off that line at the dip. That is linear interpolation, and it is the whole of what volumeAtDip does between entries.

## The three morning dips

These are the entries that bracket each AKODO dip, and the volume the engine interpolates between them:

| tank | dip mm | entry below | entry above | volumeAtDip m3 |
| --- | --- | --- | --- | --- |
| AK-01 | 9318 | 9250 mm = 3516.228 m3 | 9500 mm = 3611.261 m3 | 3542.077 |
| AK-02 | 5406 | 5250 mm = 1055.575 m3 | 5500 mm = 1105.841 m3 | 1086.941 |
| AK-03 | 1847 | 1800 mm = 50.925 m3 | 1900 mm = 54.279 m3 | 52.501 |

Read the AK-01 row. The entry below is 9250 mm at 3516.228 m3 and the entry above is 9500 mm at 3611.261 m3. The dip of 9318 mm reads 3542.077 m3, a point on the straight line joining those two entries. Nothing else about the tank enters the reading: two entries and one dip are the whole input.

The AK-02 and AK-03 rows read the same way. AK-02's dip of 5406 mm lies between entries at 5250 mm and 5500 mm and reads 1086.941 m3. AK-03's dip of 1847 mm lies between entries at 1800 mm and 1900 mm, one step of its 100 mm table, and reads 52.501 m3.

## When the straight line is exact

A straight line between two entries is exact only when the tank's volume really does rise in a straight line with height between them. A vertical cylinder does exactly that: every millimetre of height adds the same slice. For AK-01 this lesson shows it directly. Its 250 mm table and the same tank strapped every 10 mm agree at the dip to the litre: 3542.077 m3 and 3542.077 m3. On a vertical tank, a coarser step costs nothing at the dip.

A horizontal cylinder does not rise in a straight line, and lesson five shows what interpolation does to AK-03.

## The dip swept up AK-01

Here the engine reads AK-01's own table at several heights, including two that sit on entries and one between:

| dip mm | the engine answers |
| --- | --- |
| 0 | 0.000 m3 |
| 125 | 47.517 m3 |
| 250 | 95.033 m3 |
| 9318 | 3542.077 m3 |
| 9500 | 3611.261 m3 |

At 0 mm, 250 mm and 9500 mm the dip lands on an entry and the engine returns that entry's volume. At 125 mm and 9318 mm it interpolates.

Use the panel to slide AK-01's dip between 9250 mm and 9500 mm. Watch the two bracketing entries stay fixed while the interpolated volume moves along the line between them.

## Exercise

Read the AK-02 row of the morning table: the entries at 5250 mm and 5500 mm, their volumes, the dip of 5406 mm and the volume 1086.941 m3. Say what the two entries do and what the engine does with them to produce the figure.

Self check: the entries at 5250 mm (1055.575 m3) and 5500 mm (1105.841 m3) bracket the dip. volumeAtDip draws a straight line between them and reads 1086.941 m3 off it at 5406 mm.
