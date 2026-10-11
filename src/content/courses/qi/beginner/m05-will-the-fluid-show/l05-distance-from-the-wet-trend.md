# Distance from the wet trend

The wet trend gives the brine background; distance says how far an interface sits from it. A hydrocarbon sand moves its top interface off the trend towards one side, and the signed distance measures that move as one number that can be compared with the same rock carrying brine.

## The distance

`distanceFromLine` returns the signed perpendicular distance of a point (A, B) from the line B = m A:

distance = (B - m A) / sqrt(1 + m^2)

Negative is below and to the left of a falling line, which is the side a hydrocarbon sand moves to. A point on the trend has distance zero; a point far to the negative side is a candidate fluid anomaly.

## The top of the Ekene Sand at Ekene-1

The top is read as an interface between two layers by their means: the cap rock over the oil leg as it is (in situ), and the cap rock over the oil leg taken to brine. Both interfaces share the mean cap rock of 130 samples: Vp 1964.449431 m/s, Vs 673.669215 m/s and density 2391.320769 kg/m3. The substituted oil leg's means are Vp 3050.844953 m/s, Vs 1630.554630 m/s and density 2339.039854 kg/m3.

| interface | A | B | distance from the fitted line | distance from the published line |
| --- | --- | --- | --- | --- |
| cap rock over the oil leg (in situ) | 0.170742 | -0.563558 | -0.072091 | -0.458460 |
| cap rock over the oil leg taken to brine | 0.205564 | -0.475316 | -0.004519 | -0.363599 |

The fitted line is the wet trend of the previous lesson, block length 16 ft, slope -2.257963.

## What the numbers say

Against the fitted line, the top with brine sits almost on the trend, at -0.004519. The top as it is, with oil, sits at -0.072091, 0.067572 further to the hydrocarbon side. The rock is the same in both rows, so the oil moves the point off the trend.

Against the published line, both tops sit far to the negative side, at -0.458460 and -0.363599. The published line assumes one Vs/Vp for every boundary. The in situ top still lies further to the negative side than the brine top, so the direction of the oil's move survives; its size depends on the line.

## The line is a stated choice

Which line a distance is read from is a stated choice, and the two lines give different distances. So do the choices behind each figure: the block length and the conditions build the fitted line, and the cut-off, the cap rock thickness and the conditions set the top interface. The wet trend is fitted on the blocked logs, so the cut-off and the cap rock thickness move the top point and leave the trend where it is. A verdict that quotes a distance names the line, the block length and the selections with it.

{{panel:qi-feasibility-explorer}}

## Exercise

In the feasibility explorer, set View to "Wet trend and distance" and Data to "Ekene pack: Ekene-1". Find the red and green points on the crossplot and check the top-interface table against this lesson. Change "Cap rock thickness above the top, ft (stated)" from 65 and record how far the two distances move, then restore 65. Change "Block length, ft (stated)" to 8 and say whether the in situ top stays clearly off the trend. Restore 16, then read the distances at Ekene-3.
