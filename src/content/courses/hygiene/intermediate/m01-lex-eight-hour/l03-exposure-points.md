# Exposure points

{{panel:hy-noise-dosimeter}}

One hundred noise exposure points is LEX,8h 85.000000 dBA. Fifty points is 81.989700 dBA and two hundred is 88.010300 dBA. Halving or doubling the points moves the daily level by about three decibels, because the points are a linear measure of the energy that LEX,8h expresses on a logarithmic scale.

| points | LEX,8h, dBA |
| --- | --- |
| 10.000000 | 75.000000 |
| 31.622777 | 80.000000 |
| 50.000000 | 81.989700 |
| 100.000000 | 85.000000 |
| 150.000000 | 86.760913 |
| 200.000000 | 88.010300 |
| 1000.000000 | 95.000000 |

## The formula and its pivot

HSE L108 Appendix 3 defines the points for one task as EP = 100 (t/8) 10^((L - 85)/10), with t in hours. The pivot is 85 dBA: eight hours at 85 dBA is exactly 100 points. The engine measures that pivot as 85.000000000000 dBA by asking for the LEX of 100 points. Two doors carry the conversion, `hseExposurePoints` for one task and `lexFromExposurePointsDbA` for a total.

## Why points exist at all

Points add. Decibels do not. A supervisor with a list of tasks can give each task its points, add them with ordinary arithmetic, and read the total against 100 for the upper action value. The EVWRENI eight-hour day shows it: its four tasks carry 45.638640, 16.534419, 82.235865 and 1.706800 points, and the engine totals them as 146.115723, which restates the day's LEX,8h of 86.646970 dBA.

| task | LAeq, dBA | hours | task points |
| --- | --- | --- | --- |
| 1 | 87.200000 | 2.200000 | 45.638640 |
| 2 | 80.900000 | 3.400000 | 16.534419 |
| 3 | 95.400000 | 0.600000 | 82.235865 |
| 4 | 73.800000 | 1.800000 | 1.706800 |

Task 3 lasts 0.600000 h and carries more than half the total on its own. That is the energy average of the previous lesson, made visible as a share you can point at on a task list.

## Reading the table backwards

The points table answers the planning question in reverse. The lower action value, 80.000000 dBA, sits at 31.622777 points. The upper action value, 85.000000 dBA, sits at 100.000000 points. A job list whose points already total 150.000000 has a LEX,8h of 86.760913 dBA, and every task you remove takes its own points away in plain subtraction. That is why the points are the planning tool and LEX,8h is the reporting figure. The two always agree, because each is the other restated, so a plan made in points and a report made in decibels can never drift apart unless someone rounds one of them.

## What the doors refuse

A points total of zero has no level, and a task with negative time has no points. The engine refuses both in its own words:

> exposurePoints must be a finite number above zero

> durationH must be a finite number of hours, zero or more

## Exercise

Using the EVWRENI task table, add the four task points and compare your total with the 146.115723 the engine reports. Then use the points and LEX table to bracket the day: name the two printed rows whose points sit either side of your total, and state the LEX,8h of each. Finally, say which single task you would change first to bring the day under 100 points, and why the points column tells you so.
