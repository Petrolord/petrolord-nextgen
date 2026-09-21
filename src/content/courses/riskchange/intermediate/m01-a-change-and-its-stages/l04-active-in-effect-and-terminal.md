# Active, in effect and terminal

Lesson one gave three lists over the same eight stages. This lesson names the rule in this tier that reads each list, so you know which list to reach for when a verdict needs explaining.

| list | stages |
| --- | --- |
| active | "Draft", "Screening", "Review", "Approval", "Implementation" |
| in effect | "Implementation", "Closed" |
| terminal | "Closed", "Rejected", "Cancelled" |

## In effect decides expiry

Only a change in effect can expire. A temporary change still in "Screening" or "Review" is not running anywhere, so its expiry date is a plan. The engine prints the same expiry date, one day past, read across stages:

| type | stage | expiry state | counted expired |
| --- | --- | --- | --- |
| "Temporary" | "Implementation" | "Expired" | yes |
| "Temporary" | "Closed" | "Closed out" | no |
| "Temporary" | "Review" | "No expiry" | no |
| "Temporary" | "Cancelled" | "No expiry" | no |

"Implementation" and the Closed stage are both in effect, and they answer differently because the Closed stage is also terminal: a closed temporary change reads "Closed out". Module five reads all six expiry states.

## Before the facility decides a change's overdue flag

"Overdue" means several things in this course. Here it is the overdue flag on a change, measured against its target implementation date. A change is overdue only before it is on the facility: in "Draft", "Screening", "Review" or "Approval", with its target date passed. Those are the active stages that are not in effect.

In the ESANMI register, read on 2026-10-01, 5 changes are in "Implementation" and 5 are past their target date, and none reads overdue. Being in effect means the target was met or passed by the fact of it. Late work after that point shows as overdue actions, which is a different count with its own due dates.

## Finished decides whether actions are open work

Actions belong to a change. When the change is finished and locked, its actions stop counting as open work. In the ESANMI register the summary skips AC-06 on ES-06, which is in the Closed stage, and AC-07 on ES-09, which is "Cancelled". Both are terminal stages. The register carries no action on its one "Rejected" change, so this lesson shows this rule on two of the three terminal stages. Module four reads that count in full.

## Active is the live workload

The engine's summary prints an active count, and for ESANMI on 2026-10-01 it reads 8. The same register's stage counts are "Draft" 0, "Screening" 1, "Review" 1, "Approval" 1 and "Implementation" 5, and those five stages are exactly the active list: 0 + 1 + 1 + 1 + 5 = 8. The count agrees with the list it is built on.

{{panel:rc-change-explorer}}

## Two stages sit in two lists

The overlaps are where readers slip:

- **"Implementation"** is active and in effect. It is live work, so it counts as active, and it is on the facility, so it can expire and it cannot be overdue against its target.
- **The Closed stage** is in effect and terminal. It is on the facility, so a temporary change there reads "Closed out" rather than "No expiry", and it is finished, so its actions leave the open count.

If you are unsure why a verdict came out as it did, ask which list the rule reads, then check which lists the change's stage sits in.

## Exercise

For ES-02 ("Temporary", "Implementation") and ES-07 ("Temporary", Closed stage), record which of the three lists each stage sits in. Then record each one's expiry state from the ESANMI register on 2026-10-01 ("Expiring soon" and "Closed out"), and name the list whose rule produced each answer.
