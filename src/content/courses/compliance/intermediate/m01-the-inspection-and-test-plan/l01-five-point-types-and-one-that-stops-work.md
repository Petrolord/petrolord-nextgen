# Five point types, and one that stops work

An inspection and test plan lists the moments at which a piece of work is checked, and says how hard each check binds. The qualityAssurance module knows five point types: Hold point, Witness point, Review point, Monitor point and Surveillance point. Its list of the types that stop work, BLOCKING_POINT_TYPES, holds one entry. That entry is Hold point, and this tier's reading of a plan turns on it.

{{panel:compliance-plan-explorer}}

## The Abam plan

QAP-2026-014 is the quality plan for the Abam flowline tie-in. Its status is Active and it carries twelve points. The digest reads every point against one as-of date, 2026-10-15, so each status and each overdue flag quoted in this tier is true at that date and at no other. In this plan every item code starts with the letter of its type.

| type | items | stops work |
| --- | --- | --- |
| Hold point | H-01, H-03, H-05, H-08, H-11 | true |
| Witness point | W-02, W-06, W-09 | false |
| Review point | R-04, R-12 | false |
| Monitor point | M-07 | false |
| Surveillance point | S-10 | false |

planProgress over the plan prints hold points 5. Every hold point row reads stops work true, and every other row reads false. Nobody ticks that column. The engine derives it from the type, so a point cannot be a hold point that lets the work run on, and a witness point cannot quietly start holding the job.

## What each type asks for

A hold point is a check the work may not pass until it is verified: the radiography of the tie-in welds, the hydrostatic test, the pre-commissioning release. The engine states the consequence in its own words when a plan tries to close over one: "A hold point stops work until it is verified, so the plan cannot be finished over one."

The other four types are checks the plan still records and still dates. A witness point invites somebody to watch a test, such as W-02, the weld procedure qualification test. A review point is a check of paperwork, such as R-04, the NDT procedure review. M-07 monitors the daily fit-up and S-10 is site surveillance. Their stops work column reads false, and module two shows what that means in practice: the plan reaches a closure the engine allows while planProgress lists W-09, S-10, R-12 as still unresolved.

## The hold points at the as-of date

At 2026-10-15 the five hold points read: H-01 Passed, H-03 Passed, H-05 Failed, H-08 Pending, H-11 Pending. planProgress prints hold points outstanding 3, and the three are H-05, H-08 and H-11, the rows whose resolved column reads false.

Being outstanding is separate from being overdue. H-05 was planned for 2026-09-10 and reads overdue true. H-08 is planned for 2026-10-20 and H-11 for 2026-11-05, and both read overdue false at the as-of date. All three still stop work. A hold point does not wait until its planned date has passed to hold the plan.

## Exercise

Open the plan explorer at the as-of date 2026-10-15. Read two figures from planProgress, hold points 5 and hold points outstanding 3, and name the points behind each. Then read the overdue column for H-05, H-08 and H-11. Say what the pair of readings shows: which of the three stop work, which are overdue, and whether the overdue flag decides whether a hold point is still holding the plan.
