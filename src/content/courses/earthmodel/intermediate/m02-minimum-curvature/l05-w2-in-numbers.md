# W2 in numbers

This lesson assembles the whole of W2 into one table and reads it against the panel. Nothing here is new; everything here is load bearing for the rest of the course, so it is worth one pass in which every number appears in one place.

{{panel:em-tie-explorer}}

## The trajectory table

Stations, with the implied start:

| MD (m) | x (m) | y (m) | TVD (m) | TVDSS (m) |
| --- | --- | --- | --- | --- |
| 0 | 1400 | 2200 | 0 | -30 |
| 1200 | 1400 | 2200 | 1200 | 1170 |
| 1500 | 1511.876968573417 | 2200 | 1470.0948948471319 | 1440.0948948471319 |
| 1900 | 1794.719681048036 | 2200 | 1752.9376073217509 | 1722.9376073217509 |

And the landed picks, all in the hold segment:

| Pick | MD (m) | x (m) | TVDSS (m) |
| --- | --- | --- | --- |
| TopA | 1580 | 1568.4455110683407 | 1496.6634373420557 |
| Zone A midpoint | 1640 | 1610.8719179395334 | 1539.0898442132484 |
| TopB | 1700 | 1653.2983248107264 | 1581.5162510844414 |
| BaseB | 1760 | 1695.7247316819194 | 1623.9426579556343 |

The y column never moves, because the hole heads due east; a section drawn at y 2200 therefore contains the entire well, which is exactly what the panel draws.

## Three readings worth making

First, the lateral reach. At the BaseB pick the hole is $1695.7247316819194 - 1400 = 295.72473168191937$ m east of the wellhead, and the panel's reach tile reports precisely this. The Associate tier's slogan, that deviation moves the bottom of the hole, now has a number, and the number is the horizontal size of six grid cells.

Second, MD against TVDSS. The BaseB pick is at 1760 m of hole but only 1623.94 m below datum: 136 m of the hole's length was spent travelling east. Between the TopA and BaseB picks the well crosses 127.28 m of rock using 180 m of hole.

Third, where the picks sit on the model frame. TopA lands at x 1568.4455110683407, which in frame columns (origin 1000, spacing 50) is column 11.368910221366814, row exactly 4. A landing point is almost never on a node, so reading a surface there will need the bilinear sampling of the next module. The y coordinate sits exactly on a node row only because this well happens to run along y 2200; the x never cooperates.

## Reading the panel against the table

Select W2 with the trajectory from the survey. The white path's kink at the top of the build and its straight run below station 1500 should now decompose in your eye into the three segments of the survey. The orange picks sit at the x positions of the table above. Hover mentally over the numbers: the TopA dot at x 1568 is west of the TopB dot at 1653, which is west of the BaseB dot at 1696; the picks march east with depth because the hold does.

## Worked example

How much of W2's 295.72 m of lateral reach was earned in the build, and how much in the hold before BaseB? The build contributes 111.87696857341697 m. From station 1500 to the BaseB pick is 260 m of hole in the hold, contributing $260/\sqrt{2} = 183.84776310850236$ m. Sum: $111.87696857341697 + 183.84776310850236 = 295.7247316819193$ m, agreeing with the direct subtraction to a rounding digit in the last place. The decomposition matters because it shows most of the reach, 62 percent, came from the hold, not the turn itself.

## Exercise

Using the tables, compute the vertical thickness of rock W2 crosses between its TopB and BaseB picks, and compare it with the 60 m of measured depth between them. Then check the ratio against $\cos 45^\circ$ and state why they agree to so many digits here, when in a real well they would agree only approximately.
