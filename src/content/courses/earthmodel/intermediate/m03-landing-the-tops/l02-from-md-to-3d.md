# From MD to 3D

Landing a pick means converting its one dimensional address, an MD along the hole, into a three dimensional position in the model's world: x, y, TVDSS. The machinery is exactly module two's, applied at one number, and this lesson runs the complete landing for every pick in the fixture so that the tie table's left half is fully derived before the surfaces enter.

{{panel:em-tie-explorer}}

## The landing algorithm

For a well and a pick MD: build the trajectory from the survey (once per well), find the segment containing the MD, interpolate linearly in MD within it, return x, y, TVD and TVDSS. For a vertical well the trajectory is a single vertical segment, so the landing is the wellhead's x and y with TVDSS equal to MD minus KB. For W2, the landings were computed in module two.

The complete landed set, which is the left half of the tie table:

| Well | Pick | MD | x | y | TVDSS |
| --- | --- | --- | --- | --- | --- |
| W1 | TopA | 1530 | 1100 | 2100 | 1505 |
| W1 | TopB | 1565 | 1100 | 2100 | 1540 |
| W1 | BaseB | 1595 | 1100 | 2100 | 1570 |
| W2 | TopA | 1580 | 1568.4455110683407 | 2200 | 1496.6634373420557 |
| W2 | TopB | 1700 | 1653.2983248107264 | 2200 | 1581.5162510844414 |
| W2 | BaseB | 1760 | 1695.7247316819194 | 2200 | 1623.9426579556343 |
| W3 | TopA | 1580 | 1900 | 2700 | 1560 |
| W3 | TopB | 1625 | 1900 | 2700 | 1605 |
| W3 | BaseB | 1655 | 1900 | 2700 | 1635 |
| W4 | TopA | 1584 | 2050 | 2150 | 1556 |
| W4 | TopB | 1630 | 2050 | 2150 | 1602 |
| W4 | BaseB | 1660 | 2050 | 2150 | 1632 |

## Two comparisons worth making

W2 and W3 pick TopA at the SAME measured depth, 1580 m. Their landed depths differ by 63 m: W3 at 1560 (vertical, KB 20), W2 at 1496.66 (deviated, KB 30). Same cable depth, different rock. Nothing exposes the difference between MD and position faster than this pair, and the fixture arranged it deliberately.

Second, within W2, the x column is doing as much work as the depth column. Its three picks land 168, 253 and 296 m east of the wellhead. When the next lesson reads surfaces at these landings, it will read them at three DIFFERENT places on the map, not three depths at one place. A deviated well samples the model along a line, not at a point.

## In the panel

Select W2. Each orange dot in the section is a row of the table above, drawn at its landed x and TVDSS. Now select W3: the dots stack vertically at x 1900, and their TVDSS values are the integers of the table. The dashed bars, the surfaces, and everything to do with residuals belong to the next module; for now the point is that the left half of the tie table is pure trajectory, computed without ever looking at a surface.

## Worked example

Land a pick that does not exist in the fixture, to test the machinery: suppose W2 had picked a marker at 1500 m MD exactly. That MD is exactly at a station, the build's end, so no interpolation is needed: the landing is the station itself, x 1511.876968573417, y 2200, TVDSS 1440.0948948471319. A pick at a station is the degenerate case of the interpolation with fraction 0, and the engine's formula lands it on the station to the last digit, because $f = 0$ leaves the station values untouched.

## Exercise

Using the table, compute for each of W2's three picks how far east of the wellhead it landed, and confirm the spacing between consecutive picks' x values against the hold-section rule of $\Delta MD / \sqrt{2}$ from module two. The TopA to TopB spacing spans 120 m of hole; the TopB to BaseB spacing spans 60 m. Explain why the x spacings are in exactly the ratio 2 to 1.
