# A decision is made once

The last two lessons read who may decide an approval. This lesson reads when: once. An approval that has already been decided cannot be decided again, by anyone.

## Two refusals

The engine answers two probes against approvals that already carry a decision:

- REFUSED, deciding an approval that is already Approved: This approval is already approved.
- REFUSED, deciding an approval that is already Rejected: This approval is already rejected.

Both were also replayed through the module's independent oracle.

The rule holds for the assignee as well. These probes are not about the wrong person acting; they are about an approval whose status has already moved from "Pending". Of the four approval statuses, "Approved" and "Rejected" are decisions, and a decision stands.

## Why a decision cannot be redone

Consider what the rule prevents. An approver rejects a change. Later, somebody tries to decide the same approval again as "Approved". If the engine allowed a second decision, the rejected row would become an approved row, the set would read complete, and the record would no longer show that anyone ever objected.

Module two showed that a rejection anywhere stops the gate into "Implementation", with the refusal "An approver has rejected this change. It cannot be implemented." That protection would be worth very little if the rejection could be overwritten. The rule in this lesson is what keeps it in place.

The same holds in the other direction. An approval that has been given cannot be quietly withdrawn by deciding it again as "Rejected". What was signed stays signed in the record.

{{panel:rc-change-explorer}}

## Reading a decided row

When you read an approval set, a row's status is the whole of its story as far as the engine is concerned. A "Pending" row can still be decided, by its assignee alone. An "Approved" row signs its level and will stay signed. A "Rejected" row stops the gate and will stay rejected. A "Delegated" row signs nothing. Report each row by the status the engine reads, quoted exactly.

## What the engine does not model

The engine holds no rule for revisiting a decision. Measured by searching its 34 exports, the functions whose name mentions reopening, revisiting, undoing, revoking or withdrawing a decision number 0. Whether a decided approval can be reopened is the app's and the database's business, and this engine says nothing about it. So a decided approval is fixed as far as the engine is concerned, and its status is the answer the engine gives for it.

## Exercise

Record the engine's answer when somebody decides an approval that is already "Approved", and when somebody decides one that is already "Rejected". Quote both refusals exactly. Then say which of the four approval statuses count as decisions, and explain in two sentences how this rule protects the rejection rule from module two.
