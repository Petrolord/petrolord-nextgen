# The BASE_SAND picks

Everything in this tier rests on a second set of six picks. This lesson looks at them before any gridding happens, because a great deal of what the isochore does later is already visible in the six numbers.

## The picks

| Well | x | y | TOP_SAND | BASE_SAND | Thickness |
| --- | --- | --- | --- | --- | --- |
| Ekene-1 | 1000 | 1000 | 1548 | 1580 | 32 |
| Ekene-2 | 2200 | 1150 | 1565 | 1601 | 36 |
| Ekene-3 | 1400 | 2300 | 1541 | 1570 | 29 |
| Ekene-4 | 2600 | 2500 | 1590 | 1615 | 25 |
| Ekene-5 | 600 | 1900 | 1552 | 1583 | 31 |
| Ekene-6 | 1900 | 1800 | 1546 | 1580 | 34 |

These are the same wells at the same coordinates as the Associate tier. Nothing about the map geometry changes; only the number of picks per well does.

## What the thicknesses say on their own

The interval ranges from 25 m at Ekene-4 to 36 m at Ekene-2, a spread of 11 m on a mean of 31.17 m. That is a variation of about a third, which is substantial for a single depositional unit and worth a moment's thought before any map is drawn.

Look at where the thin and thick wells sit. Ekene-4, the thinnest at 25 m, is at (2600, 2500), the far northeast corner of the well pattern, and it is also the **deepest** well with a TOP_SAND at 1590 m. Ekene-2, the thickest at 36 m, is at (2200, 1150), the southeast, and is the second deepest at 1565 m.

So the thin well is deep and the thick well is also deep. Thickness and depth are not simply related on this field, which already rules out the easiest interpretation, that the sand thins uniformly onto a high.

## The two surfaces are not parallel

If the sand had a constant thickness, BASE_SAND would be TOP_SAND plus a constant and the two surfaces would be parallel. Test it: the differences are 32, 36, 29, 25, 31 and 34. They are not constant, so the surfaces are not parallel, and the isochore will be a real map rather than a flat sheet.

That test is worth running before every isochore. A thickness map with a range of 11 m carries information. A thickness map with a range of 0.2 m over the same wells is telling you that within the precision of your picks the interval is uniform, and any structure the contours appear to show is interpolation noise.

## Two picks, two chances to be wrong

The Associate tier warned that a pick wrong on the section is wrong on the map. With two surfaces that exposure doubles, and it does so asymmetrically.

An error in TOP_SAND moves the depth map **and** the thickness map, in opposite directions: a top picked 3 m too deep makes the structure look 3 m lower and the sand 3 m thinner.

An error in BASE_SAND moves only the thickness map, by the full amount.

An error in both, in the same direction and by the same amount, moves the depth map and leaves the thickness map untouched, which is the case most likely to survive a review unnoticed. A systematic datum error of that kind, from a mis-set kelly bushing or a depth-shifted log, is invisible in the isochore.

That is why the isochore is a good quality-control tool for the picks and a bad one for the datum, and it is why the well correlation course, which produced these picks, is the place a datum problem should have been caught.

## Worked example

Suppose Ekene-6's BASE_SAND were re-picked from 1580 m to 1586 m. What changes?

Its thickness goes from 34 m to 40 m, so the well mean rises from 31.167 m to 32.167 m. The TOP_SAND map is untouched, so the crest, the depth at P-1 and every depth contour stay exactly as they were. The isochore changes everywhere the spline reaches, and most at Ekene-6 itself, which is the only interior well and therefore the one whose value the surrounding map leans on most.

Nothing about the depth map would announce that anything had happened.

## Exercise

Using the table above, state which well has the largest thickness and which the smallest, and check whether the thickest well is also the shallowest. Then say what it would mean if all six thicknesses were within 0.5 m of each other.

As a self-check: Ekene-2 is thickest at 36 m and Ekene-4 thinnest at 25 m, and the thickest well is not the shallowest; the shallowest well is Ekene-3 at 1541 m with a thickness of 29 m, which is second thinnest. If all six thicknesses agreed within 0.5 m the interval would be effectively uniform at the precision of the picks, the isochore would be a nearly flat sheet, and any structure in its contours would be interpolation rather than geology.
