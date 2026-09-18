# Setting a hold point aside

Sometimes a planned check turns out not to apply to the job, and the plan records it as Not applicable. For a surveillance point that is a light act. For a hold point it is the heaviest request the plan can receive, because the point stops work and setting it aside releases the work without a check. The engine asks for three things before it allows it, and it asks for them in order.

{{panel:compliance-plan-explorer}}

## Three requirements, one at a time

H-11 is the pre-commissioning release on QAP-2026-014, a Hold point, Pending at the as-of date 2026-10-15, planned for 2026-11-05. The digest walks a request to set it Not applicable from an empty record to an allowed one.

| request | canDecideCheckpoint |
| --- | --- |
| nothing recorded | REFUSED |
| a date and a name, no reason | REFUSED |
| a date, a name and a reason | ALLOWED |

With nothing recorded, the engine refuses:

"Setting a hold point aside needs the date and who decided it, the same record a waiver needs."

With a date and a name but no reason, it refuses again:

"Say why this hold point does not apply. It stops work until released, so setting it aside needs a reason on the record."

With all three, the answer is ALLOWED. Each refusal names only the next thing missing. The learner who brings a date and a name has cleared the first sentence and meets the second, and nothing reaches the plan until the third request.

## The same act on a surveillance point

S-10 is site surveillance, a Surveillance point, In progress at the as-of date and overdue true against its planned date of 2026-10-01. Asked to set S-10 Not applicable with nothing recorded, the engine answers ALLOWED.

So the gate treats the same status differently by type. A surveillance point stops nothing, and setting it aside asks for no date, no name and no reason. A hold point stops work until released, and setting it aside asks for all three. M-07, the daily fit-up monitoring, already reads Not applicable on the plan, resolved true.

## Why a hold point cannot simply leave

A hold point that no longer applies still cannot be deleted from a live plan. Asked to remove H-08 from the Active plan, canRemoveCheckpoint refuses:

"A hold point cannot be removed once its plan has left Draft. Record it as Not applicable with the reason, so the plan shows who set it aside and why."

The engine sends the request to exactly the route this lesson walked. Removal would leave no trace that the hold point was ever planned. Setting it aside leaves the point on the plan with its date, its name and its reason, and module two reads the removal gate in full.

## What the record buys

Once H-11 is set aside with all three, it counts as resolved under CHECKPOINT_RESOLVED_STATUSES, and it no longer stands between the plan and closure. That is exactly why the engine asks so much. A release this large has to carry the person and the reason that justify it.

## Exercise

In the plan explorer, set H-11 Not applicable three times: with nothing, with a date and a name, then with a date, a name and a reason. Then set S-10 Not applicable with nothing recorded. Read the four answers against SECTION 10. Say what they show about the relationship between a point's type and what the gate asks for before the same status can be recorded.
