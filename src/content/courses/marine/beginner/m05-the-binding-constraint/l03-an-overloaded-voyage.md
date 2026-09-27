# An overloaded voyage

{{panel:marine-voyage-calculator}}

Sometimes the cargo does not fit. The engine does not refuse such a voyage. It plans it, marks it as not feasible, and names every constraint the cargo overloads. This lesson reads overloaded voyages on small cases and on the Ekene cluster, and marks where the line between a fit and an overload sits.

## Above capacity at twelve digits

A constraint is overloaded when its load is above its capacity, compared at twelve significant digits. A load exactly at capacity is feasible. That is the engine's stated reading; the alternative would read a load at capacity as overloaded. The small cases show both sides of the line:

| case | binding | utilisation | feasible |
| --- | --- | --- | --- |
| A load exactly at capacity | deck area | 1.000000 | true |
| One tonne over the deck load | deck load | 1.012500 | false |
| Ekene deck cargo doubled | deck area | 1.800000 | false |

One tonne over an 80 t deck load is enough to overload it. The engine's reasons, verbatim:

> the binding constraint is deck load: 81 t of 80 t (101.25%)

> overloaded: deck load needs 81 t against a capacity of 80 t

## The same cargo on the AHTS

The Ekene milk run's cargo fits the PSV with deck area binding at 0.900000. Put the same cargo on the AHTS Ekene Tide and three constraints are overloaded: deck area, deadweight and tank water. Deck area binds at 1.309091. The engine's reasons, verbatim:

> the binding constraint is deck area: 540 m2 of 412.5 m2 (130.909091%)

> overloaded: deck area needs 540 m2 against a capacity of 412.5 m2

> overloaded: deadweight needs 2390 t against a capacity of 2200 t

> overloaded: tank water needs 745 m3 against a capacity of 600 m3

The first reason prints the utilisation as a percentage; the field the course reasons with is 1.309091. The binding constraint is the most overloaded one, and the remaining reasons list every other constraint the cargo breaks, so a planner sees the whole problem at once.

## A result with its reasons

An overloaded voyage is a result. The engine returns its hours, days and fuel as for any voyage, because those do not depend on whether the cargo fits, and adds the verdict and the reasons. That is useful: a planner can see what the voyage would cost and what would have to change. Moving some cargo to another voyage, choosing the larger vessel, or splitting the milk run are all answers the reasons point toward.

A refusal is different. The engine refuses an input it cannot plan with at all, such as a load of a product the vessel has no tank for, the subject of the next lesson.

## Exercise

In the voyage and fleet calculator, set View to "The voyage plan" and Start from to "One tonne over the deck load". Read the feasible column and the reasons. Set Start from to "A load exactly at capacity" and confirm that it is feasible. Then set Start from to "Ekene AHTS milk run" and list the overloaded constraints the reasons name. Change "Usable deck fraction (stated)" to 1 and predict, before reading, whether the voyage becomes feasible and which constraint binds. Check your prediction against the reasons.
