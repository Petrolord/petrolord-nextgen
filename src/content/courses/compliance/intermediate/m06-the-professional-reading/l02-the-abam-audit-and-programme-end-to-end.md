# The Abam audit and programme end to end

This lesson reads AUD-2026-007 and the programme it belongs to as one record at the as-of date 2026-10-15. The audit sits at Fieldwork complete with its checklist not yet finished, and the programme around it has four audits outstanding. Every figure below is the engine's and true at that date.

{{panel:compliance-plan-explorer}}

## The checklist

checklistProgress over the 14 questions prints: total 14, answered 10, outstanding 4, conformant 6, nonconformant 2, observations 1, notApplicable 3, percent 71. unansweredItems lists 10, 11, 13 and 14.

Two readings stand out. Items 10 and 11 carry the result Not applicable, with no reason, so they are counted in notApplicable 3 and left out of answered 10. Items 2 and 6 are critical questions answered Nonconformant. With AF-2026-018 raised from item 2, criticalAnswersWithoutFindings lists 6.

## What the audit needs next

The reporting walk, read in order, is the audit team's list of work:

| step | what the engine asks |
| --- | --- |
| 1 | answer items 13 and 14, and give items 10 and 11 their reasons |
| 2 | raise a finding from item 6 |
| 3 | write the audit conclusion |
| 4 | ALLOWED |

The order is the engine's. The checklist comes first, because a finding is raised from an answer. The findings come next, and the conclusion comes last, because it has to account for both. A lead auditor must be named throughout, and must not be the auditee. After reporting, closure asks for the major findings to be closed and for any finding that stopped work to be closed as well.

AUD-2026-007 reads overdue true against its planned end of 2026-10-09. Finishing the fieldwork has not cleared that. Reporting the audit will.

## The programme around it

| code | status | overdue |
| --- | --- | --- |
| AUD-2026-001 | Closed | false |
| AUD-2026-002 | Reported | false |
| AUD-2026-003 | Closed | false |
| AUD-2026-004 | Cancelled | false |
| AUD-2026-005 | In progress | true |
| AUD-2026-006 | Planned | true |
| AUD-2026-007 | Fieldwork complete | true |
| AUD-2026-008 | Planned | false |

programmeProgress prints total 8, reported 3, cancelled 1, outstanding 4, overdue 3, percent 38. canCompleteProgramme refuses as recorded and names the four outstanding audits, AUD-2026-005 to AUD-2026-008.

The programme summarise brings the audits and the checklist together: audits outstanding 4, overdue 3, reported 3, cancelled 1, answers 10, answers outstanding 2, nonconformances 2, notApplicable 3, open findings 1, open major 1, stop-work open 1.

## Two counts of outstanding answers

checklistProgress prints outstanding 4, and summarise prints answers outstanding 2. The digest says what summarise was given: the programme, the 8 audits, the 12 recorded answers and the finding. Items 13 and 14 have no answer recorded at all, so they are not among the 12. Among the 12 recorded answers, the two without an accepted answer are items 10 and 11, the Not applicable answers with no reason. checklistProgress reads all 14 questions and counts all four.

Neither figure is wrong. Both are engine readings of the same audit at the same as-of date. They count different things, and a reader who puts one beside the other has to know which records each was given.

## What the programme manager should hear

The programme reads reported 3 of total 8, percent 38. AUD-2026-004 is cancelled and counts in neither reported nor outstanding. Three audits are overdue, and AUD-2026-007 has its fieldwork complete, with its checklist, one finding and a conclusion between it and the report. One finding is open on the programme, and summarise counts it in open major 1 and stop-work open 1 as well.

## Exercise

Read checklistProgress's outstanding 4 and summarise's answers outstanding 2. Name the items behind each. Say what the pair shows about what each function was given to count, and which of the two figures the reporting gate's first refusal agrees with.
