# An open NCR blocks the plan

A non-conformance report, an NCR, records work or material found not to meet its requirement. On the Abam tie-in six NCRs sit beside the plan. When every failed point and every hold point on QAP-2026-014 is resolved, canClosePlan still refuses, and the reason is the NCRs.

{{panel:compliance-plan-explorer}}

## The third refusal

With H-05 re-inspected and Passed, and H-08 and H-11 Passed as well, the engine refuses to close the plan:

"3 non-conformances raised against this plan are still open."

The ABAM NCR table at the as-of date 2026-10-15 shows which three:

| code | severity | status | open |
| --- | --- | --- | --- |
| NCR-2026-031 | Major | Actions in progress | true |
| NCR-2026-027 | Minor | Open | true |
| NCR-2026-019 | Critical | Disposition agreed | true |
| NCR-2026-022 | Observation | Closed | false |
| NCR-2026-011 | Major | Voided | false |
| NCR-2026-006 | Minor | Closed | false |

The three rows reading open true are the three the refusal counts. Being open is a reading of the status. Actions in progress, Open and Disposition agreed all read open true, and Closed and Voided read open false.

## What clears it

The walk's last step is: "and every NCR against it closed or voided: ALLOWED". Two statuses finish an NCR for the plan's purposes. Closed means the NCR went through its own closure gate, which module three reads in full. Voided means the NCR was withdrawn. Both read open false, and the plan gate counts neither.

This makes the plan and its NCRs one record. A plan cannot be closed while a defect found on it is still being dealt with, even when every inspection point has been resolved. The plan's inspection points say what was checked. The NCRs say what was found wrong, and the plan is not finished until those are finished too.

## The plan's own workflow

Closure is also a move in the plan's status workflow, and nextPlanStatuses prints every move the engine allows:

| from | may move to |
| --- | --- |
| Draft | Under review, Active, Cancelled |
| Under review | Active, Draft, Cancelled |
| Active | Closed, Superseded, Cancelled |
| Superseded | final |
| Closed | final |
| Cancelled | final |

Closed is reachable only from Active. Asked to move a plan from Draft straight to Closed, canAdvancePlan refuses: "A plan that is draft can only move to Under review, Active, Cancelled." Closed, Superseded and Cancelled are final, and a plan in any of them makes no further move.

## Reading the order of the walk

The four steps of the walk, in the order the engine answers them:

1. as recorded: refused on 1 failed checkpoint;
2. H-05 Passed: refused on 2 hold points outstanding;
3. H-08 and H-11 Passed as well: refused on 3 open non-conformances;
4. every NCR closed or voided: ALLOWED.

Each refusal names one missing thing, so a person working towards closure is told the next thing to bring and nothing further ahead. The counts in the refusals are the engine's own at each step: 1, then 2, then 3, and none of them is a figure anybody typed onto the plan. The NCR check comes last in the walk, and it is the only one that reads a record outside the plan's own points.

## Exercise

Read the open column of the NCR table at the as-of date and the count in the third refusal, 3. Say what the pair shows about which NCR statuses the plan gate treats as still open. Then read NCR-2026-011's row, Voided and open false, and say whether a voided NCR would stand in the way of closing the plan.
