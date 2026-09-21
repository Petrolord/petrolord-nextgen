# Progress counted from the points

A plan's progress is a figure the engine counts from the points. Nobody types a percent into the plan. planProgress reads every point's status, sorts it into resolved or outstanding, and prints the counts beside the percent they produce. Reading those counts together is the skill of this lesson.

{{panel:compliance-plan-explorer}}

## The counts at the as-of date

At the as-of date 2026-10-15, planProgress over QAP-2026-014 prints:

| count | value |
| --- | --- |
| total | 12 |
| resolved | 6 |
| failed | 1 |
| outstanding | 6 |
| hold points | 5 |
| hold points outstanding | 3 |
| percent | 50 |

The resolved six are H-01, W-02, H-03 and R-04, which Passed, W-06, which is Waived, and M-07, which is Not applicable. Those three statuses make up CHECKPOINT_RESOLVED_STATUSES. The outstanding six are H-05, H-08, W-09, S-10, H-11 and R-12.

## A failed point is outstanding

H-05, the radiography of the tie-in welds, reads Failed. It is not in the resolved list. It is counted in failed 1, and it is counted again among the outstanding six. A failure does not finish a point. The inspection happened and the result was a reject, so the point still needs a resolution, and the plan counts it with the points still waiting on something.

The engine names the weight of this in the first refusal module two reads: "A failed inspection is the most outstanding item on a plan."

## Every resolved status counts alike

W-06 is waived and M-07 is not applicable, and planProgress counts both inside resolved 6 alongside the passes. The percent therefore says how many points no longer need anything. It does not say how many were checked and found good. A reader who wants that has to read the status column.

The percent is also a whole number the engine has already rounded. planProgress rounds half up on the exact fraction of resolved points, and SECTION 11 prints four cases: 1 of 8 prints 13; 23 of 40 prints 58; 3 of 8 prints 38; 5 of 8 prints 63. Quote each percent as the engine prints it and do not round one yourself.

## A plan with no points

planProgress over a plan with no points prints percent null. The engine does not print zero and it does not print one hundred. An empty plan has no points to have resolved, so there is no fraction to take, and the engine says there is nothing to report. A dashboard that shows a blank plan as zero percent complete, or as fully complete, has invented a figure the engine refuses to make.

## The same counts after the closure walk

Module two walks the plan to a closure the engine allows. At that point planProgress reads resolved 9 of 12, percent 75, and W-09, S-10, R-12 are still unresolved. The percent moved because H-05, H-08 and H-11 were resolved, and all of them are hold points. The plan closed with a witness point, a surveillance point and a review point unresolved, because none of those types stops work. SECTION 12 prints the plan's own summarise at the as-of date as well: checkpoints 12, outstanding 6, overdue 3, hold points outstanding 3, failed 1. The overdue three are H-05, S-10 and R-12.

## Exercise

Read two lines from this lesson: planProgress at the as-of date, resolved 6 with percent 50, and planProgress after the closure walk, resolved 9 of 12 with percent 75. Name the points that moved between them and their type. Then say what the pair shows about which points a plan can close with still open, and what percent 75 does and does not tell a reader about W-09, S-10 and R-12.
