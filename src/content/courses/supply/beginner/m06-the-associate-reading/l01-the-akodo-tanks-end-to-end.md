# The Akodo tanks end to end

{{panel:supply-tank-explorer}}

## One terminal, one morning

This lesson reads the AKODO tank chain in one pass and names, at each link, the input the engine never supplies. AKODO is an invented coastal terminal, and its tables, typed VCFs and densities are invented for this course.

| tank | dip mm | water mm | volume at the dip m3 | water m3 | gross observed m3 | VCF typed | standard m3 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| AK-01 | 9318 | 212 | 3542.077 | 80.588 | 3461.489 | 0.980300 | 3393.298 |
| AK-02 | 5406 | 95 | 1086.941 | 19.101 | 1067.840 | 0.987600 | 1054.599 |
| AK-03 | 1847 | 41 | 52.501 | 0.341 | 52.161 | 0.988400 | 51.556 |

total gross observed volume: 4581.490 m3. Total standard volume, the closing stock the day is closed on: 4499.452 m3.

## Link one: the dip

Each row starts from a tape: 9318 mm, 5406 mm and 1847 mm. The input is a measured height. Left blank or null, it is refused: "No dip reading." A blank is never read as 0 mm, the empty tank.

## Link two: the table

Each tank's own strapping table turns its dip into a volume, linear between two entries. AK-02's dip lies between 5250 mm at 1055.575 m3 and 5500 mm at 1105.841 m3, and reads 1086.941 m3. The input is the table. With none the engine refuses, and it refuses a dip beneath a partial table's first entry or above AK-01's last.

The shape of the tank enters here. On the vertical AK-01, a 250 mm table and a 10 mm table agree at the dip to the litre. On the bullet AK-03, the 100 mm table less the 10 mm table is -0.007 m3 at the dip and 0.120 m3 at 41 mm.

## Link three: the water

The water cut goes through the same table and comes off. AK-01's 212 mm of water reads 80.588 m3, leaving 3461.489 m3 gross observed. The input is the second tape reading. A cut above the dip, a negative cut, or a cut the table cannot convert is refused, and the whole call with it.

The engine never reads the table once at the dip less the water height. On AK-03 that shortcut gives 51.126 m3 against the gross 52.161 m3.

## Link four: the VCF

The gross observed volume is multiplied by a VCF to reach m3 at standard. The input is the VCF, or the coefficients to build one. The engine ships no coefficients and refuses without them. AKODO types a VCF off its own tables for each tank's density and temperature. Without one, the engine reports the gross and gives the standard volume as none.

## The chain, reversed

Now read AK-03 backwards from its last cell. 51.556 m3 at standard is 52.161 m3 gross observed times a typed 0.988400. 52.161 m3 is the volume at the dip less the water. Both came from one table read at 1847 mm and at 41 mm. Every cell traces back to a tape, a table or a typed figure.

In the panel, walk each tank from dip to standard, then break one link at a time.

## Exercise

Read the AK-01 row end to end. Name the measured or typed input behind each of its figures, and say what the engine returns for the standard volume if the typed VCF of 0.980300 is left out.

Self check: 9318 mm and 212 mm are tape readings; 3542.077 m3 and 80.588 m3 come from AK-01's table; 3461.489 m3 is the first less the second; 0.980300 is typed off AKODO's tables; 3393.298 m3 is the product. Without the VCF, the standard volume is none, and only the gross observed volume is reported.
