# Six statuses and the moves between them

An audit in the auditManagement module moves through six statuses, and the engine prints every move it allows. An audit's status therefore says where it stands in a fixed sequence, and each move away from that status passes a gate that reads the record.

{{panel:compliance-plan-explorer}}

## The workflow

nextAuditStatuses prints:

| from | may move to |
| --- | --- |
| Planned | In progress, Cancelled |
| In progress | Fieldwork complete, Cancelled |
| Fieldwork complete | Reported, In progress, Cancelled |
| Reported | Closed |
| Closed | final |
| Cancelled | final |

Four things stand out.

1. The forward path is Planned, In progress, Fieldwork complete, Reported, Closed. No status is skipped.
2. Fieldwork complete may move back to In progress. An auditor who finds a gap while writing up can return to the field.
3. Cancelled is reachable from Planned, In progress and Fieldwork complete, and not from Reported. Once an audit is reported its only move is to Closed.
4. Closed and Cancelled are final.

## A cancellation needs its reason

canCancelAudit refuses a cancellation with no reason given:

"Say why this audit is not being done. An audit that quietly disappears from the programme is the reason a programme cannot be trusted."

A reason made of spaces meets the same refusal, word for word. With a reason given, the answer is ALLOWED. A reason of spaces counts as no reason, so a box that looks filled and holds nothing meets the same answer as an empty one. A cancellation is a decision about the programme, and like every decision in this tier it carries the words that justify it. Lesson five shows what this rule does to a programme: a cancelled audit counts as cancelled only when its reason is written.

## Overdue is read from the status

isAuditOverdue in this module answers for an audit whose planned end has passed:

| status | overdue |
| --- | --- |
| Planned | true |
| In progress | true |
| Fieldwork complete | true |
| Reported | false |
| Closed | false |
| Cancelled | false |

An audit stops being overdue when it is Reported. The fieldwork being finished is not enough, because the report is the deliverable. A cancelled audit is not overdue either, since it is not being done. Closed follows Reported, so a closed audit reads false as well. The three statuses before the report all read true once the planned end has passed.

## AUD-2026-007 on the workflow

AUD-2026-007, the pipeline contractor HSE audit, reads Fieldwork complete at the as-of date 2026-10-15. In the programme table its planned end is 2026-10-09 and it reads overdue true. Its moves from here are Reported, In progress or Cancelled.

The fieldwork is done and the audit is still overdue, because the reading turns on the report. The programme table shows the same for AUD-2026-005, In progress with a planned end of 2026-09-25, and AUD-2026-006, Planned with a planned end of 2026-10-02: both read overdue true. AUD-2026-008, Planned with a planned end of 2026-11-27, reads overdue false at the as-of date, because its planned end has not yet passed.

Lesson two walks what AUD-2026-007 needs before the engine lets it move to Reported.

## Exercise

Read the isAuditOverdue table and AUD-2026-007's row in the programme table: status Fieldwork complete, planned end 2026-10-09, overdue true. Then read AUD-2026-008's row, Planned, planned end 2026-11-27, overdue false. Say what the pair shows about the two things overdue reads, the status and the planned end, and which status an audit must reach before a passed planned end stops making it overdue.
