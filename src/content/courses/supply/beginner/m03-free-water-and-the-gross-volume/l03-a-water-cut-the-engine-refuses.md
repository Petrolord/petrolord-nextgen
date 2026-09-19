# A water cut the engine refuses

{{panel:supply-tank-explorer}}

## Three ways a water cut can fail

The water cut goes through the same table as the dip, and it is one more measured height that can be wrong. This lesson reads three cases the engine refuses, each in its own words. None of them is turned into a dry tank.

## Water above the product

Water sits under the product, so its height cannot exceed the dip. On AK-02 dipped at 5406 mm:

| water mm | the engine answers |
| --- | --- |
| 5406 | water 1086.941 m3, gross 0.000 m3 |
| 5500 | REFUSED: The water cut is above the product dip. Check both readings. |

A water cut equal to the dip is possible: the tank holds only water, and the gross is 0.000 m3. A water cut above the dip describes a tank whose water layer stands higher than its liquid surface, which cannot happen. One of the two readings is wrong, and the engine cannot tell which, so it asks for both to be checked. It does not trim the water down to the dip, because that would pick the dip as the correct reading with no reason to.

## A negative water cut

| water mm | the engine answers |
| --- | --- |
| -3 | REFUSED: A water cut cannot be negative. |

A negative water cut is refused, just as a negative dip is. The engine does not clamp it to 0 mm, because a water cut of 0 mm is a real reading: on AK-02 it reads water 0.000 m3, gross 1086.941 m3.

## A water cut the table cannot convert

The third failure belongs to the table. Put to AK-01's partial calibration, which starts at 300 mm with 114.040 m3, a dip that the table covers and a water cut that it does not:

| dip mm (stated) | water mm (stated) | the engine answers |
| --- | --- | --- |
| 640 | 0 | gross 243.285 m3 |
| 640 | 150 | REFUSED: The water cut cannot be converted: The dip is below the first strapping entry. The table does not cover this height; extend it down to the tank floor. |
| 640 | 700 | REFUSED: The water cut is above the product dip. Check both readings. |
| 640 | -10 | REFUSED: A water cut cannot be negative. |

The dip of 640 mm is inside the table. The water at 150 mm is below its first entry, so the water volume cannot be read. Without the water volume there is no gross, so the whole call is refused, and the refusal carries the table's own sentence after its opening words.

This row is the one to remember. Water lives at the bottom of the tank, which is the part a partial calibration leaves out. A table that starts above the floor may read every dip a terminal ever takes and still be unable to take the water off.

## Why refuse the whole call

It would be possible to report the volume at the dip and leave the water out. That figure would count the water as product, and it would look like a normal gross. The engine keeps the rule simple: a gross observed volume has had its water taken off, or it is not reported.

In the panel, switch AK-01 to its partial table, set the dip to 640 mm and move the water cut from 0 mm up through 150 mm.

## Exercise

Read the four rows at a dip of 640 mm on the partial table. Say which row returns a gross volume and name what each of the other three rows needs corrected before a gross can be formed.

Self check: only the row with 0 mm of water returns a gross, 243.285 m3. At 150 mm the table must be extended down to the tank floor; at 700 mm one of the two readings is wrong and both need checking; at -10 mm the water reading itself is invalid.
