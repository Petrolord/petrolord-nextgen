# The review queue

A document controller does not read a library one document at a time. They read a queue: the documents in the order they need attention. Document Control builds that queue with byReviewUrgency, and it summarises the library with summarise. Both are derived from the same records and the same as-of date, 2026-10-15.

## The library summarised

summarise over the 7 IKORO documents prints four headline counts: in review 1, published 3, review overdue 1, review due soon 1. Beside them it counts every document status:

| status | count |
| --- | --- |
| Draft | 1 |
| In Review | 1 |
| Approved | 1 |
| Published | 3 |
| Superseded | 1 |
| Obsolete | 0 |
| Rejected | 0 |

{{panel:compliance-register-explorer}}

The headline counts answer the questions a manager asks first. How many documents are waiting on a reviewer's decision? In review 1, the hydrotest procedure. How many are live and published? Published 3. How many are late for review, and how many are about to be? Review overdue 1 and review due soon 1. Obsolete and Rejected are printed with 0 so the reader can see they were counted, and a zero here is a finding in its own right.

## The queue

byReviewUrgency puts the library in order. Read the order column and the review state together:

| order | number | review state | next review |
| --- | --- | --- | --- |
| 1 | HSE-PRO-0007 | Review overdue | 2026-09-30 |
| 2 | OPS-PLA-0002 | Review due soon | 2026-11-02 |
| 3 | ENG-STD-0011 | Review scheduled | 2027-06-30 |
| 4 | OPS-PHI-0001 | No review scheduled | none |
| 5 | OPS-PRO-0004 | Not in force | 2020-01-06 |
| 6 | HSE-PRO-0012 | Not in force | none |
| 7 | ENG-PRO-0019 | Not in force | none |

The queue runs Review overdue, then Review due soon, then Review scheduled, then No review scheduled, then Not in force. The produced water sampling procedure is first. Its review date has passed and people are still working to it. The emergency response plan is second, with its review due soon. The tank inspection standard is third. Its review is 258 days away and reads Review scheduled, so there is nothing to do for it yet beyond keeping the date on the record.

The flare management philosophy is fourth. It is in force and has no review scheduled, and the queue places it after the three documents in force that have a review date and ahead of every document that is not in force. It is a live document without a plan to review it, and the queue keeps it in view.

The three documents not in force are last. The old issue of the custody metering procedure carries a review date of 2020-01-06, -2474 days from the as-of date, and it sits at fifth. A passed date on a document nobody works to does not raise it in the queue, because its review state is Not in force.

## Queue and register side by side

The review queue follows the same pattern as the obligation register's byUrgency. In both, the state comes first in deciding the order, states that need action lead the list, and records that are not live go to the bottom. A reader who has learned one can read the other. The next module reads both in full, end to end, as the Associate reading.

## Exercise

Read the four headline counts summarise prints for the library. Then read the queue and say why HSE-PRO-0007 is first, why OPS-PHI-0001 sits above every document not in force although it has no review date, and why OPS-PRO-0004 sits fifth although its review date of 2020-01-06 is -2474 days from the as-of date.
