# No checklist is no percentage

checklistProgress turns a checklist's answers into counts and a percent. Like planProgress, it counts from the record, and when there is no record it prints no percent at all. This lesson reads its counts on AUD-2026-007 and its answer on an empty checklist.

{{panel:compliance-plan-explorer}}

## The counts at 2026-10-15

At the as-of date 2026-10-15, checklistProgress over the 14 questions of AUD-2026-007 prints:

| count | value | items |
| --- | --- | --- |
| total | 14 | 1 to 14 |
| answered | 10 | 1 to 9, and 12 |
| outstanding | 4 | 10, 11, 13, 14 |
| conformant | 6 | 1, 3, 5, 7, 8, 12 |
| nonconformant | 2 | 2, 6 |
| observations | 1 | 4 |
| notApplicable | 3 | 9, 10, 11 |
| percent | 71 | |

The percent measures answering. It says how much of the checklist has an answer the engine accepts. It does not say how much of the site conformed. Items 2 and 6 are Nonconformant and both sit inside answered 10, so they lift the percent exactly as a Conformant answer does. A reader who wants to know what was found reads the result counts beside it.

The percent is a whole number the engine has already rounded, and this lesson quotes it as printed. SECTION 11 states the rounding rule for planProgress: half up on the exact fraction, so 3 of 8 prints 38 and 5 of 8 prints 63. Read 71 as the engine's figure and do not recompute it from the counts.

Read the outstanding count with it. Outstanding 4 names items 10, 11, 13 and 14, the same four canReportAudit names when it refuses to report the audit. Items 10 and 11 carry the result Not applicable and are still outstanding because no reason is written beside it. The percent rises only when those answers are completed, and a reason is part of an answer.

## An empty checklist

checklistProgress with no checklist at all prints percent null. There are no questions, so there is nothing answered and nothing outstanding, and the engine does not make up a fraction. It does not print zero, which would say the auditor answered nothing. It does not print one hundred, which would say every question was answered.

The same rule holds on the other two progress readings in this tier. planProgress over a plan with no points prints percent null, and programmeProgress over no audits prints percent null. An empty record has no progress to report.

## Why null matters on a screen

A percent is often drawn as a bar or a gauge, and a bar has to show something. A screen that draws null as an empty bar tells the reader that an audit has been started and nothing answered. A screen that draws it as a full bar tells them the audit is complete. Both are figures the engine refused to produce. The honest display for null is a statement that there is no checklist to measure.

## Exercise

Read three figures from checklistProgress at the as-of date: answered 10, nonconformant 2 and percent 71. Then read the line for no checklist at all, percent null. Say what the readings show about what the percent measures, whether the two Nonconformant answers raise or lower it, and what a display should show when the engine prints null.
