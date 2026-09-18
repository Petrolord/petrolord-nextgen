# The Ikoro library end to end

The IKORO terminal keeps a document library beside its obligation register. This lesson reads the whole library at the as-of date of 2026-10-15, with the queue, the counts and the rules from module five, and ends with the questions a document controller would take away from it.

## The queue

| order | number | title | status | next review | days until | review state |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | HSE-PRO-0007 | Produced water sampling procedure | Published | 2026-09-30 | -15 | Review overdue |
| 2 | OPS-PLA-0002 | Terminal emergency response plan | Published | 2026-11-02 | 18 | Review due soon |
| 3 | ENG-STD-0011 | Tank inspection standard | Approved | 2027-06-30 | 258 | Review scheduled |
| 4 | OPS-PHI-0001 | Flare management philosophy | Published | none | none | No review scheduled |
| 5 | OPS-PRO-0004 | Custody metering procedure (old issue) | Superseded | 2020-01-06 | -2474 | Not in force |
| 6 | HSE-PRO-0012 | Oily waste handling procedure | Draft | none | none | Not in force |
| 7 | ENG-PRO-0019 | Hydrotest procedure | In Review | none | none | Not in force |

{{panel:compliance-register-explorer}}

summarise prints in review 1, published 3, review overdue 1 and review due soon 1.

## The four in force

The sampling procedure's review date passed 15 days before the as-of date, and it reads Review overdue. It is Published, so people are working to it now. A document controller would put it first, as the queue does.

The emergency response plan is 18 days from review and reads Review due soon, the state whose window REVIEW_LEAD_DAYS sets at 30. A review date is earned at issue, so if the plan is corrected before 2026-11-02 the review date does not move.

The tank inspection standard is Approved, one of the two statuses in force, and reads Review scheduled at 258 days. It is live and has a date on the record, so for now the only work is to keep that date.

The flare management philosophy is Published with no review date, and it reads No review scheduled. It has no issue date recorded either, so nextReviewDate has nothing to count from, and a review period on its own gives it no date. The fix is a review date on the record, or an issue date for a review period to count from.

## The three not in force

The old custody metering procedure is Superseded, and its review date of 2020-01-06 does not put it in the queue ahead of anything live. The draft oily waste procedure and the hydrotest procedure in review have no review dates yet and read Not in force.

The hydrotest procedure is the one in review, and its review task is governed by the rule from module five. Its reviewer must be somebody other than its author, and only the assigned reviewer may decide the task. The digest's example revision, rev-0019-10 of ENG-PRO-0019, takes the procedure from its current revision '09' to its next revision '10'. It is authored by u-adaeze, and it shows each refusal the engine gives.

## What the controller takes away

Three actions come out of this library. Review the sampling procedure, which is overdue. Start the review of the emergency response plan, which is due soon. Put a review date, or an issue date, on the flare management philosophy. Everything else is scheduled or not live. Each action was read off a review state the engine derived from a date and the as-of date.

## Reading the library and the register together

Both are derived the same way: a dated record, one as-of date and a fixed list of states read worst first. In the register a Superseded obligation is not counted down. In the library a Superseded document is Not in force. In both, a missing date is shown as its own state, No date set in one and No review scheduled in the other, so a gap is visible instead of hidden.

## Exercise

Read the four headline counts from summarise and the review states of the four documents in force. Name the three actions the library asks of a document controller at 2026-10-15, and say what a correction to the emergency response plan before its review date of 2026-11-02 would do to that date.
