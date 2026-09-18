# A waiver carries its reason

A waiver accepts that a planned check will not be done and lets the work carry on anyway. The qualityAssurance module counts Waived as a resolved status, beside Passed and Not applicable, so a waived point moves the plan's progress exactly as a passed one does. The gate asks a waiver for one thing more than a pass: a reason.

{{panel:compliance-plan-explorer}}

## The refusal

W-09, the hydrotest chart review, is a Witness point, Pending at the as-of date 2026-10-15. Asked to waive it with no reason, canDecideCheckpoint refuses:

"Say why this point is being waived. A waiver is a deliberate acceptance of less assurance, and the reason is what makes it auditable later."

The sentence carries its own argument. A pass records that a check happened. A waiver records that a check did not happen and that somebody decided the plan could stand without it. An auditor can test a pass against its evidence. The only thing that can be tested about a waiver is the reason, so a waiver without one leaves nothing to audit.

## A waiver already on the plan

W-06, the coating holiday test, is the waived point on QAP-2026-014. At the as-of date its row reads status Waived, resolved true and overdue false, with a planned date of 2026-09-15. It is one of the six points planProgress counts as resolved, with H-01, W-02, H-03, R-04 and M-07.

So W-06 carries the plan forward as fully as H-01's passed material certificate review does. The percent the plan prints, 50, does not show which of the resolved points were checked and which were waived. The status column does, and the reason on the waiver is what tells an auditor why the difference is acceptable.

## What else a waiver needs

A reason alone is not enough. Asked to waive W-09 with a reason and no date or verifier, canDecideCheckpoint refuses:

"Record the date this was decided and who decided it."

So a waiver needs three things on the record: the date, who decided it, and why. The digest walks the same request on a hold point. H-08, the hydrostatic test, waived with a date, a verifier and a reason, is ALLOWED. H-08 waived with a date and a verifier and no reason is refused with the same waiver sentence W-09 met.

Read the allowed row plainly. canDecideCheckpoint has no rule that forbids waiving a hold point. A waived hold point with its record and reason is resolved, the same as a waived point of any other type. The engine asks a hold point waiver for its record and its reason, and it asks nothing more.

When you read a plan, treat each Waived row as a question with its answer attached: who decided that the check was not needed, on what date, and why.

## Exercise

In the plan explorer, ask to waive W-09 with no reason and read the refusal. Then read W-06's row at the as-of date. Two figures from planProgress bear on it: resolved 6 and percent 50. Say what the waived row and those two figures show together: whether W-06 is inside the resolved count, and what the percent alone cannot tell a reader about how the plan's points were resolved.
