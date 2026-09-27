# A constant service time

{{panel:marine-base-calculator}}

M/M/c assumes service times spread like an exponential: many short calls, some long ones, and a spread as wide as the mean. A supply base whose calls are built from a stated number of lifts at a stated rate and a stated volume of bulk at a stated pump rate does not look like that. If every call lifts about the same cargo and pumps about the same bulk, the service time is much the same every time. M/D/c is the model for that case: Poisson arrivals, a constant (deterministic, the D) service time, c berths.

## Why the spread matters

A queue forms when arrivals bunch, and it lasts longer when a long call holds a berth. With exponential service, some calls run far past the mean and the vessels behind them wait. With constant service, no call runs long, so the same arrivals and the same mean service produce a shorter queue. The berth utilisation is the same in both models, because it depends on the service only through its mean. What changes is the wait.

## The Ekene base both ways

| model | berth utilisation (engine) | probability of waiting (engine) | mean wait, hours (engine) |
| --- | --- | --- | --- |
| M/M/c | 0.533333 | 0.371014 | 3.180124 |
| M/D/c | 0.533333 | not given | 1.665786 |

The same base waits 1.665786 hours as M/D/c against 3.180124 as M/M/c, a ratio of 0.523812. The engine returns no probability of waiting for M/D/c, and its basis says so in its own words, verbatim:

> working-hour clock: 3.2 arrivals a day over 24 working hours; service 8 hours = 2 fixed + 5 for lifts alongside 6 for bulk; M/D/c (Poisson arrivals, constant service) by an approximation; probabilityWait is not given for M/D/c

## The model is a stated choice

Neither model is the base. A real base sits somewhere between the two: its calls vary, though less than an exponential says. A planner who reads the two figures side by side learns the range the choice spans, and a plan that must not understate the wait can quote the M/M/c figure with its model named. The engine takes the model as a required input, and a plan names the model beside every queue figure. A model the engine does not offer is refused, verbatim:

> model must be one of "M/M/c", "M/D/c"; got "M/G/c"

and a call with no model is refused the same way, ending "got nothing".

## Exercise

Open the shore base calculator on the view "The berth queue" and start from "Ekene supply base, M/D/c". Read the Berth utilisation, Probability of waiting and Mean wait, hours tiles. Set the Queue model (stated) control to M/M/c and read them again; say which figure moved and which did not. Then set the control to "not stated" and read the refusal.
