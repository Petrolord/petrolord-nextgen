# Eight stages in order

The Associate tier read a risk. This tier reads a change. In the Suite, the Management of Change app keeps every change record, and it asks one engine, `managementOfChange`, what that record means: which stage it may move to next, whether it may go onto the facility, whether it has expired, and whether an emergency decision has been ratified. The engine stores nothing: the app holds the record and the engine answers questions about it.

Everything in this tier starts from one list.

## The eight stages

The engine carries its stages in workflow order:

| order | stage |
| --- | --- |
| 1 | "Draft" |
| 2 | "Screening" |
| 3 | "Review" |
| 4 | "Approval" |
| 5 | "Implementation" |
| 6 | "Closed" |
| 7 | "Rejected" |
| 8 | "Cancelled" |

Read the names exactly as the engine spells them. A report that calls "Implementation" something like "executing" has made up a stage the engine does not have.

Workflow order is a reading order. It does not promise that every change passes through all eight. The next lesson reads the moves the engine allows.

## Three lists over the same eight names

The engine sorts its stages into three groups, and each later rule in this tier reads one of them:

- **Active**, still live work: "Draft", "Screening", "Review", "Approval", "Implementation".
- **In effect**, on the facility: "Implementation", "Closed".
- **Terminal**: "Closed", "Rejected", "Cancelled".

The lists overlap. "Implementation" is both active and in effect: the change is running on the plant and there is still work to finish. The Closed stage is both in effect and terminal: the change is part of the facility and the record is finished. "Rejected" and "Cancelled" are terminal and outside the in-effect list, whatever stage the change reached before it ended there.

Lesson four of this module names the rule that reads each list.

{{panel:rc-change-explorer}}

## Three types of change

Every change also carries a type: "Permanent", "Temporary" or "Emergency". The type does not change the stage list; every type moves through the same eight stages. What the type changes is what a stage demands:

- "Temporary" and "Emergency" are the two types that must carry an expiry date.
- "Emergency" has its own route into "Implementation", on its first signature, with the rest of the approvals to follow inside a window. Module five reads that route.
- "Permanent" carries no expiry, and its expiry state reads "Permanent change".

## Why a list comes first

Every verdict in this tier is a rule over the stage list and the type, so learn the eight names and the three lists before anything else.

## Exercise

Write down the eight stages in workflow order, exactly as the engine spells them. Beside each, mark whether it is active, in effect, terminal, or more than one of these. Name the two stages that sit in two lists, and the two types that must carry an expiry date. Say in one sentence which rule from this lesson told you each answer.
