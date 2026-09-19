# Every temperature a crude measured

The blend's curve needs temperatures to stand on. The engine takes them from the crudes, all of them.

{{panel:crude-valuation-explorer}}

## Two grids that do not line up

Kwale Light was measured at 75, 190, 370, 530, 720, 1030 and 1350 F. Ughelli Medium was measured at 90, 265, 480, 650, 860, 1200 and 1470 F. The two assays share no temperature. A laboratory reports the temperatures at which it reached round volume percents, so two crudes almost never land on the same grid.

blendDistillationCurves does not pick one crude's grid and throw the other away. It forms the blend's curve at every temperature any component measured. The digest prints the count: the blend's curve has 14 points, every temperature either crude measured.

| temperature F | Kwale Light volume percent | Ughelli Medium volume percent | blend volume percent (blendDistillationCurves) |
| --- | --- | --- | --- |
| 75 | 0.0000 | 0.0000 | 0.0000 |
| 90 | 1.3043 | 0.0000 | 0.7174 |
| 190 | 10.0000 | 5.7143 | 8.0714 |
| 265 | 18.3333 | 10.0000 | 14.5833 |
| 370 | 30.0000 | 19.7674 | 25.3953 |
| 480 | 43.7500 | 30.0000 | 37.5625 |
| 530 | 50.0000 | 35.8824 | 43.6471 |
| 650 | 62.6316 | 50.0000 | 56.9474 |
| 720 | 70.0000 | 56.6667 | 64.0000 |
| 860 | 79.0323 | 70.0000 | 74.9677 |
| 1030 | 90.0000 | 80.0000 | 85.5000 |
| 1200 | 95.3125 | 90.0000 | 92.9219 |
| 1350 | 100.0000 | 95.5556 | 98.0000 |
| 1470 | 100.0000 | 100.0000 | 100.0000 |

## Where the other crude was not measured

On every row, one crude was measured and the other was not. The figure for the unmeasured crude is read off its own curve with volumePercentAt, which the Associate tier taught: linear between measured points, and outside the measured range only where the curve says so itself.

Three kinds of reading appear in the table.

Between two measured points, the value is interpolated. At 90 F Kwale Light has no measured point; its curve runs from 0 at 75 to 10 at 190, and the engine reads 1.3043 percent there. At 190 F Ughelli Medium reads 5.7143 percent, from its own points at 90 and 265.

Below a first point at 0 percent, nothing has distilled. Ughelli Medium's first point is 0 at 90, so at 75 F it reads 0.0000 percent. The curve says so itself.

Above a last point at 100 percent, everything has. Kwale Light's last point is 100 at 1350, so at 1470 F it reads 100.0000 percent.

With both crudes known at every row, each blend figure is the volume-weighted sum of the two at 55 and 45.

## Why keep every temperature

A measured point is information the laboratory paid for. Build the blend only on Kwale Light's grid and every bend in Ughelli Medium's curve between those temperatures is lost; build it on Ughelli Medium's and the reverse. Taking the union keeps every measured point from both crudes on the blend's curve. Between two of the blend's points the curve is again read linearly, so the more real points it stands on, the less of it is a straight line drawn across an unmeasured gap.

The union is also what lets the blend's curve start where the lightest crude starts and end where the heaviest ends. The first row, 75 F, is Kwale Light's first point. The last, 1470 F, is Ughelli Medium's last.

Every row here could be read for both crudes, because both assays are whole curves that start at 0 percent and finish at 100. A partial assay breaks that, and the next lesson shows what the engine does with a temperature where one crude's curve says nothing.

## Exercise

Take the row at 265 F. Say which crude was measured there and which was read by interpolation, and name the two measured points of the other crude that the interpolation runs between. Then say what the blend's figure of 14.5833 percent on that row is formed from, and on what basis.
