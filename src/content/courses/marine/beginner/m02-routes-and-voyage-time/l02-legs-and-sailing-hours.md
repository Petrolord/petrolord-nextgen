# Legs and sailing hours

{{panel:marine-voyage-calculator}}

A milk run is built from legs. Each leg is a stated distance between two points of the route, and the vessel's sailing time is the sum of the legs' distances over its speed. This lesson reads the legs of the Ekene milk run, the rules the engine checks before it sails them, and what a leg of zero means.

## One leg more than the stops

A milk run with four stops has five legs: base to the first stop, three from stop to stop, and the last stop back to the base. The engine reads the stops in the order stated and the legs in the same order, so a leg is always the distance from the point before it to the point after it. Change the order of the stops and the legs must be restated to match; the engine cannot know the distance from EKB to EKA unless you give it.

## The Ekene legs

| leg | from | to | NM | calm hours |
| --- | --- | --- | --- | --- |
| 1 | base | EKA | 62.000000 | 5.636364 |
| 2 | EKA | EKJ | 9.000000 | 0.818182 |
| 3 | EKJ | EKB | 12.000000 | 1.090909 |
| 4 | EKB | EKF | 28.000000 | 2.545455 |
| 5 | EKF | base | 95.000000 | 8.636364 |

Added up, the calm sailing is 18.727273 hours over 206.000000 NM at 11 knots. With the rainy-season factor of 1.2 on sailing, the voyage plan shows 22.472727 sailing hours; the next module explains the factor.

## What the engine checks

The stops must name each installation once, in the order sailed. Leave one out and the engine refuses:

> route.stops must be an array naming each of the 4 installations once, in the order sailed; got ["EKA","EKJ","EKB"]

Name one twice:

> route.stops[2] repeats "EKA"; a milk run visits each installation once

Name one that does not exist:

> route.stops[3] must be an installation id (EKA, EKJ, EKB, EKF); got "EKX"

State four legs for four stops:

> route.legsNm must be an array of 5 leg distances in nautical miles (base to the first stop, stop to stop, the last stop back to the base); got [62,9,12,28]

A negative distance is refused too. Each of these messages starts with the field it refuses, so the panel points you to the input to fix.

## A leg of zero

Two installations at one location, such as a platform and a jack-up working beside it, are a leg of 0 NM, and the engine accepts it. On the small teaching case "A leg of zero", legs of 30, 0 and 30 NM at 10 knots give 6.000000 sailing hours and 12.000000 hours in all.

## Exercise

In the voyage and fleet calculator, set View to "The voyage plan" and Start from to "Ekene PSV milk run, rainy season". Clear the "leg 5, NM (stated)" control and read the refusal; compare the list it prints with the four legs left, then type 95 back. In "Stops in the order sailed (stated)", type EKA, EKJ, EKA, EKF and read the refusal, then restore the four stops. Finally, set Start from to "A leg of zero" and check the sailing hours in the voyage table against the figure above.
