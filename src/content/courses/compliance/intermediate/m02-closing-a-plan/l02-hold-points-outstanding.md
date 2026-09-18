# Hold points outstanding

Once no failed point remains, canClosePlan asks about hold points. A hold point stops work, and a plan cannot be finished while one is still waiting for its verification. This lesson reads that refusal, the two points it names, and what the gate does not ask about at all.

{{panel:compliance-plan-explorer}}

## The refusal

With H-05 re-inspected and Passed, the engine refuses to close QAP-2026-014:

"2 hold points still outstanding (H-08, H-11). A hold point stops work until it is verified, so the plan cannot be finished over one."

The refusal names its points. H-08 is the hydrostatic test and H-11 is the pre-commissioning release. At the as-of date 2026-10-15 both read Pending, resolved false and overdue false. H-08 is planned for 2026-10-20 and H-11 for 2026-11-05.

## Outstanding and overdue are two readings

Neither hold point is overdue at the as-of date, and both block the plan. The gate reads resolved, and it does not read the planned date. A plan whose hold points are all on schedule is still a plan with work that has not been released.

The overdue reading lives elsewhere. SECTION 12 prints the plan's summarise at the as-of date: checkpoints 12, outstanding 6, overdue 3, hold points outstanding 3, failed 1. The overdue three are H-05, S-10 and R-12. Of those, H-05 is the only hold point. S-10 and R-12 are overdue, and the closure gate does not stop on either of them.

| point | type | status at 2026-10-15 | overdue | stops closure |
| --- | --- | --- | --- | --- |
| H-08 | Hold point | Pending | false | yes, named in the refusal |
| H-11 | Hold point | Pending | false | yes, named in the refusal |
| S-10 | Surveillance point | In progress | true | no |
| R-12 | Review point | Notified | true | no |

## How the two are cleared

The walk clears them the only way this gate accepts: H-08 and H-11 Passed as well. Module one showed what passing a hold point needs, a date and a verifier, and what setting one aside needs, a date, a name and a reason. Either route resolves the point. Removal is not a route: the engine refuses to remove a hold point from a plan that has left Draft.

With both passed the hold point refusal is gone, and a third one appears, about the non-conformances raised against the plan. Lesson three reads it.

## What the gate leaves open

When the walk reaches ALLOWED, planProgress reads resolved 9 of 12, percent 75, and W-09, S-10 and R-12 are still open. A witness point, a surveillance point and a review point stand unresolved on a plan the engine lets close. S-10 and R-12 are overdue at the as-of date and still do not stand in the way.

That is the plan's own design. The stops work column is true for hold points alone, and the closure gate asks about exactly those points. An engineer who wants every witness point closed before sign-off has to ask for it in the procedure. The engine will not enforce it through canClosePlan.

## Exercise

Read two figures from SECTION 12: overdue 3 and hold points outstanding 3. Name the points behind each. Then read the hold point refusal's count, 2, and its two names. Say what the three readings show: which points appear in both lists, which appear in only one, and whether a point being overdue decides whether it stops the plan from closing.
