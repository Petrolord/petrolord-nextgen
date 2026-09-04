# Profiles against endpoints

The arrival is a closed form, so a profile adds no accuracy to it whatsoever. What a profile adds is the shape between the ends, and the shape is where a verdict lives.

{{panel:pd-line-explorer}}

## Stations are resolution and nothing else

A derived sweep on the published 105600.0 ft case, moving only the station count: at 2, 3, 5, 11, 21, 51, 101 and 501 stations the arrival is 43.35769344274401 degF, a difference of 0.0000e+0 degF from the 21 station answer at every count including the ugly two station one. Refining a profile buys resolution in the middle of a line and buys nothing at its end.

## What two endpoints cannot say

The published profile runs from 180.0000000000 degF to 43.3576934427 degF. Four of its 21 stations, with the fraction of the inlet excess still remaining:

| x, ft | Temperature, degF | Fraction of inlet excess |
| --- | --- | --- |
| 0.00 | 180.0000000000 | 1.000000000000 |
| 26400.00 | 95.0942515249 | 0.393530368035 |
| 52800.00 | 61.6812610792 | 0.154866150566 |
| 105600.00 | 43.3576934427 | 0.023983524591 |

A straight line drawn between the two ends leaves half the inlet excess at the halfway station. The exponential leaves 0.154866150566 of it there. Interpolating between endpoints puts the middle of a line far warmer than it is, and it is the middle of a line that a tie-in, a spool or a shut valve sits on.

## A profile with a boundary on it

TEACHING LINE AKASO SPUR returns 21 stations over 60000.0 ft at 3000.00 ft spacing against a teaching flowing boundary of 71.00 degF. Its inlet margin is 124.0000000000 degF and its arrival margin is 18.3160299527 degF. The station at which it first falls below the boundary is none of the 21, and the coldest point is the arrival at 89.31602995 degF.

Both ends outside the boundary is not the finding. Every station between them outside it is the finding, and only the profile carries that.

## The mistake

Two of them, in opposite directions. Quoting a coarse profile as a provisional answer, when the arrival on two stations is the arrival on 501. And rerunning at 501 stations to firm up a tight margin, when the number that was tight has not moved by 0.0000e+0 degF.

## What it costs and what it refuses

The cost is nothing, so run the stations. `steadyStateProfile` refuses a zero length and a zero U with one message: the profile needs a length, a mass rate, a heat capacity and a heat transfer coefficient. It does not refuse a U that describes a different pipe, and it does not know where any boundary is.

## Exercise

Run AKASO SPUR at two stations and then at 21, and write down both arrivals.

Then say what the 21 station run told you that the two station run did not, and name the station where you would put a valve.
