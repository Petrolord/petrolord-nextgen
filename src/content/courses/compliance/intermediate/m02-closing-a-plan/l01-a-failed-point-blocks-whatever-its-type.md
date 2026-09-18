# A failed point blocks whatever its type

Closing a plan is a request like any other, and canClosePlan answers it one requirement at a time. The digest walks QAP-2026-014 from the plan as recorded at the as-of date 2026-10-15 to a plan the engine allows to close. Each refusal names the first thing still in the way, and the first thing it checks is failure.

{{panel:compliance-plan-explorer}}

## The first refusal

Asked to close the plan as recorded, the engine refuses:

"1 checkpoint has failed and has not been resolved. A failed inspection is the most outstanding item on a plan."

The failed point is H-05, the radiography of the tie-in welds, a Hold point that reads Failed, resolved false and overdue true against its planned date of 2026-09-10. planProgress counts it in failed 1.

Read the words of the refusal. It counts checkpoints, and the hold point rule is a separate sentence the engine gives only once the failure is cleared. On this plan the one failed point happens to be a hold point, so the digest does not print a failed witness or review point meeting the gate. What the digest does show is the order: failure is refused before anything about hold points is asked.

## Why a failure outranks a pending point

A pending point is a check that has not happened yet. A failed point is a check that happened and found the work wrong. The engine calls it "the most outstanding item on a plan", and the phrase is exact: something is known to be wrong with the work, and the plan has no record yet of what was done about it.

The refusal also says "has not been resolved". A failure is resolved in the way the walk shows next: H-05 is re-inspected and Passed. Once that is on the record the failure refusal no longer appears, and the gate moves on to what remains.

## The next refusal

With H-05 re-inspected and Passed, the engine refuses again, for a new reason:

"2 hold points still outstanding (H-08, H-11). A hold point stops work until it is verified, so the plan cannot be finished over one."

Lesson two reads that refusal. For now, notice that the count in it is 2, while planProgress at the as-of date prints hold points outstanding 3. The difference is H-05, which the re-inspection has resolved.

## A failure is still counted after closure

SECTION 14 prints one more reading of the same points. Summarised under the plan marked Closed, they read outstanding 0, overdue 0 and failed 1. The closed status stops the engine from reporting anything as still outstanding or overdue on the plan, and the failure count survives it. A plan's history of failure stays visible on a closed plan.

## Exercise

Read three figures from the digest: failed 1 from planProgress at the as-of date, the count 2 in the refusal after H-05 is re-inspected and Passed, and hold points outstanding 3 at the as-of date. Say what the three together show about which point the re-inspection resolved, and then read the Closed summarise line, outstanding 0, overdue 0 and failed 1, and say what it keeps that the other two counts give up.
