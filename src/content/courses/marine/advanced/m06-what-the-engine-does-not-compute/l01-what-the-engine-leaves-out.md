# What the engine leaves out

{{panel:marine-base-calculator}}

{{panel:marine-variability-calculator}}

A tool is only as trustworthy as the account it gives of its own limits. The marine logistics engine computes voyage plans, fleet sizes, deck plans, berth queues and the fleet under variability from stated inputs, and it declines a good deal more. Every figure in this course was quoted with its inputs for that reason: none of them is a schedule, a weather forecast or a promise that a berth will be free.

## The list

| not computed here | what the engine takes in its place | where it belongs |
| --- | --- | --- |
| a schedule by the clock | counts of voyages and vessel-days over a stated period | a planner's schedule |
| weather windows, wave heights, waiting on weather | one stated factor on the stated activities | always a stated input |
| a speed and fuel curve | a stated burn for each activity at the stated speed | always a stated input |
| vessel hire, port fees, a vessel contract | a stated fuel price only | the procurement course |
| stacking, deck shape, lanes, stability | an area bound with a stated usable fraction and deck load | the deck foreman's plan |
| a stowage factor for bulk | the user's net deadweight and stated densities | always a stated input |
| berth-specific cranes, shifts, priorities | one queue on the working-hour clock | none |
| the optimum deck packing | a stated rule and the area lower bound | none |
| stock levels, spares, reorder points | stated cargo and demand | the materials course |
| supplier performance, contract management | none | the contracts course |
| distributions, correlation, Monte Carlo as a subject | the canonical seeded sampler, applied to the fleet | the uncertainty course |
| discounting, NPV, a cash flow | none: the engine discounts nothing | the cash flow course |

## At the shore base

The base is one queue with identical berths. It does not know that berth two has the bigger crane, that bulk hoses reach only one quay, that the night shift is thinner, or that a drilling rig's vessel jumps the queue. Each of those makes a real base differ from both M/M/c and M/D/c. The engine's answer is to keep the model small, state it, and let the planner compare the two models it does offer.

## In the Monte Carlo

The variability calculator draws the weather and the demand independently, each from a triangular the planner states. It fits no distribution to past weeks, and it draws no correlation between a stormy week and a heavy one. Correlation, fitting and distributions as a subject belong to the uncertainty course, which the course names here once and leaves there.

## The courses beside this one

Hiring the vessels is the procurement course's subject, keeping the spares they carry is the materials course's, and managing the suppliers is the contracts course's. Putting a money value on the whole plan over time belongs to the cash flow course: this engine prices only fuel and discounts nothing.

## What this does for a plan

Knowing what is left out tells a planner what to state beside every figure, and which claims a figure cannot carry. A mean wait of 3.180124 hours on the Ekene base supports a berth count; it does not support a berth timetable for Tuesday. A P10 of 11.908677 vessel-days on seed 20260927 and 20000 draws supports a view of a heavy week; it does not support a claim about next week's weather. The limits are part of the figure, and the plan carries them with it.

## Left out on purpose

Each item in the list could be modelled by some tool. The course reads the list as a statement of scope: a figure whose inputs cannot all be stated is a figure no one could check against a source.

## Exercise

Open the shore base calculator on the view "The berth queue" and start from "Ekene supply base, M/M/c"; read the rule and Source lines beneath the result and list what the call assumes about the berths. Open the variability calculator on the view "The fleet under weather and demand variability" and start from "Ekene week, PSV milk run, weather and demand"; read its rule line. For each calculator, name two things a real plan would add, and the input that stands in for each today.
