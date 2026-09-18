# A programme is delivered by its reports

An audit programme is the plan of audits for a period. programmeProgress reads it the way planProgress reads a quality plan: it counts from the audits' statuses, and nobody types a percent. The count that matters is reported audits, because a report is the deliverable.

{{panel:compliance-plan-explorer}}

## The Abam programme at 2026-10-15

| code | status | planned end | overdue |
| --- | --- | --- | --- |
| AUD-2026-001 | Closed | 2026-02-13 | false |
| AUD-2026-002 | Reported | 2026-04-17 | false |
| AUD-2026-003 | Closed | 2026-05-22 | false |
| AUD-2026-004 | Cancelled | 2026-06-19 | false |
| AUD-2026-005 | In progress | 2026-09-25 | true |
| AUD-2026-006 | Planned | 2026-10-02 | true |
| AUD-2026-007 | Fieldwork complete | 2026-10-09 | true |
| AUD-2026-008 | Planned | 2026-11-27 | false |

programmeProgress prints: total 8, reported 3, cancelled 1, outstanding 4, overdue 3, percent 38.

Reported 3 counts AUD-2026-001 and AUD-2026-003, which are Closed, and AUD-2026-002, which is Reported. A closed audit was reported on its way to closure, and it counts. Cancelled 1 is AUD-2026-004. Outstanding 4 is AUD-2026-005 to AUD-2026-008. Overdue 3 is AUD-2026-005, AUD-2026-006 and AUD-2026-007, whose planned ends have passed at the as-of date. The percent is a whole number the engine has already rounded, quoted as printed.

## A cancelled audit is not a delivered one

AUD-2026-004 is cancelled, and it is not outstanding. It is not in reported 3 either. The percent is counted from reported audits, so a cancellation does not raise it. An audit that did not happen delivered nothing. A programme manager who cancels an audit with its reason written has made a decision the record can show, and the percent still reports how many audits were delivered.

programmeProgress over no audits prints percent null, as the plan and checklist readings do over an empty record.

## Completing the programme

canCompleteProgramme reads the same audits. As recorded, the engine refuses:

"4 audits in this programme have not been reported or cancelled (AUD-2026-005, AUD-2026-006, AUD-2026-007, AUD-2026-008). A programme marked complete over audits that never happened is the document a certification body will ask for."

With every outstanding audit reported, the answer is ALLOWED. With the last one cancelled instead, and no reason written, the engine refuses again:

"1 audit in this programme has not been reported or cancelled (AUD-2026-008). A programme marked complete over audits that never happened is the document a certification body will ask for."

A cancellation with no written reason leaves the audit outstanding. The status may read Cancelled, and the engine still names AUD-2026-008 among the audits not dealt with.

One rule decides outstanding, and the digest proves it on four audits: Reported, Cancelled with no reason, Cancelled with a reason, and Planned. programmeProgress counts 2 outstanding, summarise counts 2, and canCompleteProgramme refuses on "2 audits in this programme have not been reported or cancelled." All three readings use the same rule. The reason is what turns a missing audit into a decision on the record, and lesson one showed the gate that asks for it.

## Approving the programme

The programme has its own workflow: Draft to Approved or Cancelled, Approved to In progress or Cancelled, In progress to Complete or Cancelled, and Complete and Cancelled final. Approval is a decision with a date and a name, like every decision in this tier. Approving with no date is refused with "Record the date the programme was approved." Approving with a date and no approver is refused with "Name who approved it." With both, the answer is ALLOWED.

## Exercise

Read two figures from programmeProgress, reported 3 and cancelled 1, and the percent, 38. Then read the second canCompleteProgramme refusal, which names AUD-2026-008 after it was cancelled with no reason. Say what the readings show about whether a cancelled audit counts towards the programme's delivered percent, and what a cancellation needs before the engine stops counting it as outstanding.
