# Boundaries, rule by rule

{{panel:marine-base-calculator}}

{{panel:marine-variability-calculator}}

Every rule in the engine has an edge, and the edges are not all alike. Some are inclusive: a load exactly at a capacity is feasible. Some are strict: a draw is short only above the planned capacity. Some are read at twelve significant digits, and one moves a printed figure to the side the engine accepts. No boundary is global, so a planner reads each rule's edge where the rule is taught.

## The edges of the earlier tiers

| rule | at the boundary | one past it |
| --- | --- | --- |
| capacity | load = capacity: feasible | one tonne over: overloaded |
| the binding tie | equal utilisations: deck area named | |
| voyages rounded up | exactly 3 is 3 (2.1 over 0.7 is 3) | 300.001 over 100 is 4 |
| demand and minimum visits | equal: demand named | more visits: minimum visits named |
| vessels to the nearest | 1.5 rounds to 2 | 1.416667 rounds to 1, shortfall reported |
| available days | equal to the period: accepted | above the period: refused |
| a deck fit | an exact fill: fits | heavier than the deck load: overflow |

These belong to the voyage, fleet and deck calculators, and this tier uses them as they were taught.

## The edges of this tier

| rule | at the boundary | one past it |
| --- | --- | --- |
| the steady state | utilisation 0.9995: accepted | utilisation 1: refused, printing 19.999999 |
| a printed bound | 26.666666 is printed (accepted) | 26.666667 would be refused |
| the berth target | wait = target: met | target 0: unreachable, reported |
| short in the Monte Carlo | need = planned capacity: not short | one vessel fewer: always short |
| iterations times voyage sets | 181818 with 11 sets: accepted | 181819: refused |
| the weather factor | 1: accepted | 0.9 and 10.5: refused |

## Reading the base edges

The steady state is strict because the model is: at a berth utilisation of 1 no average exists. Just below it, on base-just-below-saturation at 0.999500, the engine returns a mean wait of 999.250063 hours, which is its way of saying the edge is a cliff. The berth target is inclusive, reading eight, so a wait of 9.000000 against a target of 9 meets it, while a target of 0 is never met and is reported with no berth count. That report is a result with a reason, and the refusal belongs to a negative target.

## Reading the Monte Carlo edges

Short is strict, reading nine: a need exactly at the planned capacity is covered, and the alternative, short at equality, would count every draw of variability-at-capacity-is-not-short as short. The draws cap is an edge on work done, with 181818 draws accepted at 11 voyage sets and 181819 refused. The weather factor keeps a calm floor of 1 and a cap of 10 inside a triangular as well as outside it.

## Why the kinds differ

Each edge follows what the rule is for. A capacity that can be filled exactly should accept the exact fill. A shortfall is a need above what the fleet gives, so equality is covered. A queue at saturation has no steady state to report. The engine states each choice, and the readings among them are taught with their alternatives. No capstone field depends on one of them.

## Testing an edge yourself

A boundary is checked with two runs: one exactly at the edge and one just past it, with every other input held. Read which side the engine puts each run on, and whether the second is a result with a reason or a refusal. A result with a reason (a berth target no count meets, a draw that is short) is still a result, and the calculator prints its figures. A refusal returns no figures at all, only the engine's message naming the field. Keeping those two apart is most of the work of reading an edge.

## Exercise

Open the shore base calculator on the view "The berth queue" and start from "Just below saturation"; read the Berth utilisation and Mean wait, hours tiles. Start from "A target met exactly" and then "A target of zero", and read each reason. Open the variability calculator on the view "The fleet under weather and demand variability", start from "A need exactly at the planned capacity" and then "One vessel fewer", and read the Probability short tile. For each of the five runs, name the row of the second table it sits on.
