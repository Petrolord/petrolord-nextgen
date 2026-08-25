# Survey stations

A directional survey is not a curve. It is a short list of measurements taken at stations down the hole, and everything between stations is a modelling assumption. This lesson is about what a station contains and what the engine does with the list before any geometry happens.

## What a station is

At each station a survey tool records three numbers: the measured depth MD, the inclination, which is the hole's angle from vertical in degrees, and the azimuth, its compass direction in degrees clockwise from north. Zero inclination means the hole is heading straight down and azimuth is then physically meaningless, whatever number the file carries.

W2's survey is three stations:

| MD (m) | Inclination | Azimuth |
| --- | --- | --- |
| 1200 | 0 | 0 |
| 1500 | 45 | 90 |
| 1900 | 45 | 90 |

Read as history: still vertical at 1200, built to 45 degrees heading due east by 1500, holding that attitude at 1900.

## The implied start

The list does not begin at the surface, and it does not need to. The engine prepends an implied station at MD 0 with zero inclination: every trajectory starts vertical at the wellhead. For W2 this creates the segment from 0 to 1200 m, and since both ends of that segment are at zero inclination, the whole segment is a vertical line. The choice matters: a survey that starts at 1200 m says nothing about the hole above 1200 m, and "assume vertical above the first station" is a convention, stated in the engine's documentation, not a fact the data forced.

The engine also drops stations whose MD does not increase over the previous one. A survey with a repeated or out of order MD would otherwise produce a zero length segment and divide by it. Dropping is silent by design here because the golden fixtures are clean; on real data you would want the QC step that reports what was dropped, a theme this course family returns to often.

## Segments, not points

Geometry is computed per segment, from each station to the next, and each segment needs both endpoints' attitudes: the position increment from 1200 to 1500 m MD uses inclination and azimuth at 1200 AND at 1500. This is the difference between minimum curvature and naive methods that use only one end. The tangential method, for instance, would treat the whole 1200 to 1500 segment as if it already pointed 45 degrees east, landing the station 300 sin 45, or 212.13 m, east of where it started, when the true build only travels 111.87696857341697 m east. Using both ends is what lets a smooth arc replace that crude corner.

W2 therefore has three segments: 0 to 1200 (vertical to vertical, trivially a line), 1200 to 1500 (vertical to 45 degrees east, a genuine arc, next lesson), and 1500 to 1900 (45 east to 45 east, a straight slanted line, lesson three).

## Worked example

How many segments does W1's trajectory have, and what are they? W1's survey is a single station at MD 2000, inclination 0. With the implied start at MD 0, that is one segment, 0 to 2000, with zero inclination at both ends: a vertical line 2000 m long. Every vertical well in the fixture set is exactly this, which is why the engine can treat "vertical well" and "deviated well" with the same code path and no special cases. The vertical well is not a different kind of object, only a survey whose angles happen to be zero.

## Exercise

Suppose W2's survey had a fourth station at MD 1900 (repeated) with inclination 50. State what the engine does with it and why the trajectory is unchanged. Then say, in one sentence each, what the segment list would look like if the fourth station were instead at MD 2100 with inclination 50, azimuth 90.
