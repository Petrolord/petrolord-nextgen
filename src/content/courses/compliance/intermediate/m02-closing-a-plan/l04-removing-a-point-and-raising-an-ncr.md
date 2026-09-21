# Removing a point, and raising an NCR

A plan changes in two further ways besides a decision on a point. A point can be removed from it, and an NCR can be raised against it. Both go through a gate, and both gates read the plan's status first. This lesson reads canRemoveCheckpoint and canRaiseNcr on QAP-2026-014.

{{panel:compliance-plan-explorer}}

## Removing a point

The course asks to remove points from the plan at three stages of its life.

| request | plan status | answer |
| --- | --- | --- |
| H-08, a pending hold point | Active | REFUSED |
| W-09, a pending witness point | Active | ALLOWED |
| R-04, a passed review point | Active | REFUSED |
| H-08 | Draft | ALLOWED |
| W-09 | Closed | REFUSED |

The refusal for H-08 on the Active plan:

"A hold point cannot be removed once its plan has left Draft. Record it as Not applicable with the reason, so the plan shows who set it aside and why."

The refusal for R-04:

"Item R-04 has a result recorded (Passed). A recorded result is evidence and stays on the plan."

The refusal for W-09 once the plan is Closed:

"This plan is closed. Its inspection points are the record it was finished on."

## Three rules in five rows

Read the rows together and three rules come out.

A hold point may be taken off a Draft plan, and H-08's removal from the Draft plan is ALLOWED. Once a plan is in force, a hold point that no longer applies is set aside with a date, a name and a reason, the route module one walked for H-11, so the plan keeps its trace.

A point with a result stays. R-04, the NDT procedure review, Passed, and the refusal names the item and the result a removal would erase. The refusal says why in its own words: a recorded result is evidence and stays on the plan.

A closed plan is frozen. W-09 may be removed from the Active plan while it is pending, and the same point may not be removed from the Closed plan. A closed plan's points are the record of what it was finished on.

## Raising an NCR

canRaiseNcr reads the plan's status too.

| request | answer |
| --- | --- |
| against the Active plan | ALLOWED |
| against no plan at all | ALLOWED |
| against the plan once Closed | REFUSED |

The refusal:

"QAP-2026-014 is closed. Raise the non-conformance against the plan now in force, or with no plan."

An NCR may stand on its own with no plan, because a defect can be found in material or work that no inspection plan covers. What an NCR may not do is attach itself to a plan that has already closed. Lesson three showed why: closure required every NCR against the plan to be closed or voided. An NCR raised against a closed plan would reopen a finished record behind the gate that closed it.

## A request changes nothing until it is allowed

Every refused row in this lesson leaves the plan as it was. H-08 is still on the Active plan after the refused removal, R-04 still reads Passed, and no NCR has attached itself to the Closed plan. The gate is the only door, and a refusal is an answer that keeps the record intact.

## Exercise

Read the two rows for H-08 in the removal table, one against the Active plan and one against the Draft plan. Then read the two rows for W-09, one against the Active plan and one against the Closed plan. Say what the pairs show about how the plan's status and the point's type decide whether a removal is allowed, and where the refused H-08 is sent instead.
