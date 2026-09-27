# Checking a plan before it sails

{{panel:marine-voyage-calculator}}

A voyage plan is only as good as the inputs behind it and the care with which its results are read. This lesson turns everything in this tier into one checklist, in the engine's own terms, and applies it to a plan of your own.

## The checklist

Before a plan is sent to the vessel, check each of these in turn.

1. Every product has a stated tank and a stated density, with a tank of 0 where the vessel has none.
2. The route names every stop once, in the order sailed, with one more leg than stops; or, for dedicated voyages, a distance for every installation.
3. The weather factor and the activities it slows are both stated.
4. The voyage is feasible; if it is not, the reasons name each overloaded constraint.
5. The binding constraint and its utilisation are read off and recorded.
6. The days fit the time the vessel has.
7. The fuel and its cost are read with the price they rest on.

The first three are about inputs, and the engine enforces them: an input that breaks one is refused by name. The last four are about reading, and only the planner can do them.

## The Ekene PSV milk run against the list

| check | the Ekene PSV milk run in the rainy season |
| --- | --- |
| tanks and densities | six products, six tanks, six densities |
| route | EKA, EKJ, EKB, EKF; five legs, 206.000000 NM |
| weather | factor 1.2 on sailing and field time |
| feasible | true |
| binding | deck area at 0.900000 |
| days | 2.586364 |
| fuel and cost | 19.876364 t, 17292.436364 at 870 a tonne |

## Why the sixth check needs the planner

The engine reports the voyage's days but does not know how long the vessel is available, because a voyage plan states no period. A voyage of 2.586364 days fits comfortably inside a week; a much longer one might not fit between the vessel's crew changes. At this tier the check is a planner's judgement. The Professional tier states the period and the days available, and the engine then reports a voyage longer than the days available as a result with its reason.

## What a plan must name

A plan quoted to a colleague names its figures with their inputs: the voyage's hours with its route, speed and weather; its fuel cost with its burns and price; its binding utilisation with the capacity behind it. That way the next person can rerun it, and the reader can see which input to question.

## Exercise

In the voyage and fleet calculator, set View to "The voyage plan" and Start from to "Ekene PSV, dedicated voyages". Work through the checklist for the four dedicated voyages, reading every answer off the panel. Then make the plan your own: change the route back to a milk run with "Route (stated)", put the stops in an order of your choice in "Stops in the order sailed (stated)", type a distance into each of the five leg controls, and run the checklist again. Until every leg is stated, read the refusal the panel shows. Record which checks the engine enforced for you and which you had to make yourself.
