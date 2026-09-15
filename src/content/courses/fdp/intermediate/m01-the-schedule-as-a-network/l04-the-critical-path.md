# The critical path

The critical path is the chain of activities whose float is 0. On EGINA it runs a1, a3, a4, a7, a8, and it is 870 days long.

{{panel:ec-schedule-explorer}}

## The zero float chain

| activity | duration | early start | late start | float |
| --- | --- | --- | --- | --- |
| a1 Project sanction | 0 | 0 | 0 | 0 |
| a3 Long lead procurement | 300 | 0 | 0 | 0 |
| a4 Hull conversion | 420 | 300 | 300 | 0 |
| a7 Integration and commissioning | 150 | 720 | 720 | 0 |
| a8 First oil | 0 | 870 | 870 | 0 |

Their durations of 0, 300, 420, 150 and 0 sum to 870, which is the network duration. That is what a critical path is: the longest route through the logic, and therefore the one with no room in it. Delay any of these five activities by a day and first oil moves by a day.

## What is not on it

Three activities sit off the path: detailed engineering with 180 days of float, topsides fabrication with 180 and subsea installation with 480.

Length is not criticality. Topsides fabrication is 330 days of work against the 150 days of integration and commissioning, and integration is on the critical path while topsides is not. Subsea installation carries the most float on EGINA at 480 days, and it is still 180 days of real work that has to happen.

## Ties, and more than one path

A published diamond network returns a duration of 10 days with A, B, C, D all critical, and two paths, A to B to D and A to C to D. Both routes are 10 days long, so both carry float 0 and four names appear on a critical list that describes two paths. A count of critical activities is not a count of paths.

The extremes go the other way. A published twelve activity chain returns 78 days with all twelve critical on one path, because a chain has no alternative route. Four unlinked activities return 7 days with all four critical across four single activity paths, because nothing was ever linked.

## The published references

| case | duration | critical activities |
| --- | --- | --- |
| textbook network | 14 days | A, B, D, F |
| example schedule from 2026-01-01 | 330 days | act-1, act-3, act-4, act-6, act-7 |
| dated four activity plan | 179 days | a, b, d |

Each of these agrees with a golden reference computed independently of the engine, on the duration and on the names. That is what makes them useful as checks: a network whose answer is known from outside the code is the only kind that can tell you the code is wrong.

The dated four activity plan is the smallest of them that still has an activity off the path.

## The mistake

Calling every activity critical. Before EC6-0 the engine did exactly that: on the six activity textbook network it reported all six at float 0, when the method puts the path at A, B, D, F and hands C and E four days of float each. The failure was not a wrong path, it was no path at all, and it reads as a plan under tension everywhere. A critical list holding every row in the schedule is a result to distrust before it is one to act on.

## Exercise

List the five EGINA activities on the critical path and add their durations to 870. Then say why topsides fabrication at 330 days is not on it while integration and commissioning at 150 days is, and explain what the diamond case shows about counting critical activities.
