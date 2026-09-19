# Below the first entry

{{panel:supply-tank-explorer}}

## Where a table starts

AK-01's table starts at 0 mm with 0.000 m3. Its first entry is the empty tank, so there is no height inside the tank that lies below the table. Every dip from the floor upward has an entry at or beneath it.

Not every calibration starts on the floor. A tank may be strapped only over the range someone cared about at the time, or its lowest rings may be left out because the bottom is irregular. The digest builds such a case deliberately: the same AK-01 tank with a partial calibration that starts at 300 mm, where the volume is 114.040 m3, and ends at 800 mm. Its first entry is a real volume, and it is not the empty tank.

## What the engine does with a dip beneath it

Put dips to that partial table through dipToStandardVolume, with no water, and the engine answers:

| dip mm (stated) | water mm (stated) | the engine answers |
| --- | --- | --- |
| 180 | 0 | REFUSED: The dip is below the first strapping entry. The table does not cover this height; extend it down to the tank floor. |
| 300 | 0 | gross 114.040 m3 |
| 640 | 0 | gross 243.285 m3 |

At 300 mm the dip sits on the first entry and reads its volume, 114.040 m3. At 640 mm it sits between entries and the engine interpolates to 243.285 m3. At 180 mm the dip is beneath the first entry and the engine refuses.

The refusal says what is missing and what to do about it. The table has no entry below the dip, so there is no second point to draw a line to. One available shortcut would be to assume the tank is empty at 0 mm and draw a line from there, but that assumption is exactly what this table does not state. The bottom of a real tank holds a sump, a sloping floor and pipework, and the volume below the first entry is whatever the calibration would have measured there. So the engine sends you back to the calibration: extend it down to the tank floor.

## A negative dip

A dip below the datum is not a reading at all. Swept down AK-01's full table, the engine answers:

| dip mm | the engine answers |
| --- | --- |
| 0 | 0.000 m3 |
| -5 | REFUSED: A dip cannot be negative. |

A negative height usually means a reading typed with the wrong sign or taken from the wrong reference point. The engine does not clamp it to 0 mm, because 0 mm is the empty tank and that is a different claim.

## Two refusals, two causes

The two refusals below the table have different causes and different cures. A dip of 180 mm on the partial table is a real height that the calibration does not cover, and the cure is more calibration. A dip of -5 mm is a height that cannot exist, and the cure is a fresh reading. Both stop the chain at its first link, so nothing downstream is formed from them.

In the panel, switch AK-01 to its partial table and slide the dip down past 300 mm.

## Exercise

Read the three rows of the partial table at 180 mm, 300 mm and 640 mm. Say why 300 mm returns a volume and 180 mm does not, and what the refusal asks you to change.

Self check: 300 mm is the table's first entry, so it reads 114.040 m3. 180 mm lies beneath the first entry, where the table states nothing, so the engine refuses and asks for the table to be extended down to the tank floor.
