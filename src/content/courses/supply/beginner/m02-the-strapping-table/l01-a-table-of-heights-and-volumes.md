# A table of heights and volumes

{{panel:supply-tank-explorer}}

## What strapping means

A tank is calibrated once, carefully, and the result is written down as a table. Each row pairs a height above the tank's datum, in millimetres, with the volume the tank holds when liquid stands at that height, in cubic metres. The name comes from the old practice of measuring a tank's circumference with a steel strap at several rings, but the table can come from a strap, from an optical survey or from the tank's drawings. What matters for this course is what the table is: the only thing that links a dip to a volume for that one tank.

A strapping table belongs to a tank and to nothing else, and each AKODO tank carries its own. terminalDepot ships no table and refuses a dip when the tank has none:

REFUSED: No strapping table for this tank.

## The AKODO tables

AKODO's three tanks each come with a table. The vertical tanks' tables are built from the tank geometry; the horizontal tank is a bullet whose volume is not linear in height.

| tank | product | shape | size | entries | step mm | first entry | last entry |
| --- | --- | --- | --- | --- | --- | --- | --- |
| AK-01 | PMS | vertical | diameter 22 m, strapped to 14750 mm | 60 | 250 | 0 mm = 0.000 m3 | 14750 mm = 5606.957 m3 |
| AK-02 | AGO | vertical | diameter 16 m, strapped to 12000 mm | 49 | 250 | 0 mm = 0.000 m3 | 12000 mm = 2412.743 m3 |
| AK-03 | DPK | horizontal | diameter 3 m, length 11.5 m | 31 | 100 | 0 mm = 0.000 m3 | 3000 mm = 81.289 m3 |

Read a row from left to right. AK-01 is a vertical tank of diameter 22 m, strapped to 14750 mm. Its table has 60 entries, one every 250 mm. The first entry is 0 mm at 0.000 m3, the empty tank, and the last is 14750 mm at 5606.957 m3.

AK-03 is different in shape and in step. It lies on its side, 3 m across and 11.5 m long, and its table has 31 entries one every 100 mm, from 0 mm at 0.000 m3 to 3000 mm at 81.289 m3. A dip of 3000 mm on a bullet 3 m across is the top of the shell, so its last entry is the tank full.

## Three things every table states

Each table states where it starts. All three AKODO tables start at 0 mm with 0.000 m3, the empty tank, so any dip from the floor upward has an entry beneath it. A table that starts higher leaves the bottom of the tank uncovered, and lesson three reads what the engine does with a dip down there.

Each table states where it stops. The last entry is the highest height the calibration covers, and lesson four reads what happens above it.

Each table states its step, the height between neighbouring entries. A dip rarely lands on an entry, so the engine must read between two of them, which is the next lesson. How well that reading matches the tank depends on the tank's shape, and lesson five shows the difference on AK-03.

## Exercise

Read the first and last entries of AK-02's table. Say which heights the table covers, what volume it gives for an empty tank, and what the engine would need before it could give any volume for a dip on a tank that has no table at all.

Self check: AK-02's table covers 0 mm to 12000 mm, from 0.000 m3 at the empty tank to 2412.743 m3 at the top entry. A tank with no table cannot be read at all: the engine refuses with "No strapping table for this tank." and needs the tank's own calibration.
