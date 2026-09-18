# In force and not in force

A controlled document is a procedure, plan, standard or philosophy that people are expected to work to, and each one is due for review on a date. Document Control derives a review state for it the way the register derives an obligation's status. The first question it asks is whether the document is in force at all.

## Seven document statuses, two in force

documentControl.DOC_STATUSES holds seven words: Draft, In Review, Approved, Published, Superseded, Obsolete and Rejected. Only two of them mean the document is in force. documentControl.EFFECTIVE_STATUSES holds Published and Approved. Those are the two statuses a document carries once it has been signed off for people to work to.

A document in any other status is Not in force, and the review state says exactly that. reviewState reads only documents in force.

## Five review states

The review states are Review overdue, Review due soon, Review scheduled, No review scheduled and Not in force. The first four apply to documents in force. The window for Review due soon is documentControl.REVIEW_LEAD_DAYS, which is 30.

The IKORO document library at the as-of date of 2026-10-15:

| number | title | status | next review | days until | review state |
| --- | --- | --- | --- | --- | --- |
| HSE-PRO-0007 | Produced water sampling procedure | Published | 2026-09-30 | -15 | Review overdue |
| OPS-PLA-0002 | Terminal emergency response plan | Published | 2026-11-02 | 18 | Review due soon |
| ENG-STD-0011 | Tank inspection standard | Approved | 2027-06-30 | 258 | Review scheduled |
| OPS-PHI-0001 | Flare management philosophy | Published | none | none | No review scheduled |
| OPS-PRO-0004 | Custody metering procedure (old issue) | Superseded | 2020-01-06 | -2474 | Not in force |
| HSE-PRO-0012 | Oily waste handling procedure | Draft | none | none | Not in force |
| ENG-PRO-0019 | Hydrotest procedure | In Review | none | none | Not in force |

{{panel:compliance-register-explorer}}

## Reading the four in force

The produced water sampling procedure's review date, 2026-09-30, is 15 days behind the as-of date, and it reads Review overdue. The terminal emergency response plan's review is 18 days away and reads Review due soon. The tank inspection standard, Approved, is 258 days from review and reads Review scheduled. The flare management philosophy is Published with no review date on the record, and reads No review scheduled.

That last state deserves attention. A document in force with no review date is not safe. It is a document nobody has committed to looking at again. The library shows it as its own state so that it can be found and given a date. A review date written as the text tbc reads No review scheduled as well.

## Reading the three not in force

The old issue of the custody metering procedure has a review date of 2020-01-06, which is -2474 days from the as-of date. It reads Not in force. It has been superseded, and nobody works to it, so reviewing it would be wasted work, and calling it Review overdue would put a dead document at the top of a live queue. The draft oily waste procedure and the hydrotest procedure in review have no review dates at all, and they read Not in force too.

## Why in force comes first

Document Control asks the same question the register asks of an obligation's lifecycle. Is this record live? If it is not, its dates do not drive a warning. That keeps the review queue to the documents people are actually working to, which is the list a document controller has to act on.

## Exercise

Read the status and the review state of HSE-PRO-0007 and of OPS-PRO-0004. Both review dates have passed. Say why one reads Review overdue and the other reads Not in force, naming the list that decides it. Then read OPS-PHI-0001 and say what its review state asks the document controller to do.
