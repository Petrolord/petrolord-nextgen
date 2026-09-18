# A valve near its seat does not control

A valve sized for the maximum flow has to control at the minimum one as well, and the two cases sit at different places on its travel. Where the minimum case lands is the question this module asks.

## The three travels of one valve

The engine checks a valve at three flows and reports the travel at each. On the case where all three flows are given, the minimum duty sits at 47.956430 percent open, the normal duty at 74.737770 percent open and the maximum duty at 83.997848 percent open. All 3 of the checks ran, the verdict is true and there are 0 warnings.

That is what a healthy valve looks like on this screen. The whole operating range sits in the part of the travel where the trim is properly engaged, and there is some room left above the maximum case.

## The case that fails

Now the same valve with a minimum flow hard against the seat. The minimum travel reads 0.000000 percent open, the normal duty is still at 74.737770 percent open and the maximum at 83.997848 percent open. All 3 checks ran, and the verdict is false with 1 warning.

A valve at 0.000000 percent open is shut. What that means in practice is that the loop has no proportional control at the low end at all. The controller asks for a little less flow, the plug reaches its seat, and from there the only thing available is a sequence of openings and closings that the process sees as a cycle rather than as control. Seats are also damaged by exactly that duty, because the trim is being landed repeatedly under a full pressure drop.

There is a second reading of the healthy case worth taking. The maximum duty sits at 83.997848 percent open, which leaves travel in hand above it. A valve that reaches its design flow only at the very top of its stroke has nothing left for a fouled exchanger, a worn pump or an off design day.

## Where the valve range comes from

The travel a required coefficient corresponds to depends on the inherent characteristic and on the valve's rangeability, which is the span between the largest and the smallest coefficient the trim can meter with. The figures above are on equal percentage trim at a rangeability of 50.

Both of those are properties the vendor states for the specific trim. A rangeability assumed rather than confirmed will move every travel figure the check produces, and the low end is precisely where the verdict turns.

## Exercise

Write down the minimum, normal and maximum travels for the case where all three flows are given, and the minimum travel for the case where the minimum flow is hard against the seat. Say how many of the checks ran on each and what verdict each returned. Then say in one sentence what a loop actually does when its minimum duty lands on the seat.
