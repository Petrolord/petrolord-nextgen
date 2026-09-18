# Not applicable needs a reason

An audit checklist asks questions, and an auditor answers each one. The auditManagement module accepts four answers: Conformant, Nonconformant, Observation and Not applicable. Three of them say what the auditor found. The fourth says the question did not apply, and the engine counts it as an answer only when the reason is written beside it.

{{panel:compliance-plan-explorer}}

## AUD-2026-007

AUD-2026-007 is the pipeline contractor HSE audit on the Abam tie-in. At the as-of date 2026-10-15 its status is Fieldwork complete and its checklist holds 14 questions. Three of them carry the result Not applicable:

| item | question | criticality | result | note | answered |
| --- | --- | --- | --- | --- | --- |
| 9 | Excavation shoring inspected | Major | Not applicable | No excavation open during the audit. | true |
| 10 | Waste segregated at source | Minor | Not applicable | blank | false |
| 11 | Confined space entry attendant present | Critical | Not applicable | none | false |

Item 9 has its reason: "No excavation open during the audit." It reads answered true. Item 10's note is blank and item 11 has no note at all, and both read answered false. The result column says Not applicable on all three rows. The answered column separates them.

## What the engine counts

checklistProgress prints notApplicable 3 and answered 10. The first figure counts every Not applicable result, items 9, 10 and 11. The second leaves items 10 and 11 out. unansweredItems at the as-of date lists 10, 11, 13 and 14: the two Not applicable answers with no reason, and items 13 and 14, which have no answer at all.

So to the engine, a Not applicable with no reason sits with the questions nobody answered. A blank note counts the same as a missing one. Item 10's note is blank, and it is treated exactly as item 11's, which is absent.

## Why the reason is the answer

"Not applicable" is a claim about the site: there was no excavation, no confined space entry, no waste stream to segregate. A claim like that can be checked, and the reason is what an auditor or a certification body checks it against. Without the reason, a Not applicable cannot be told apart from a question the auditor skipped, and the engine refuses to treat the two differently when the record makes them look the same.

Item 11 shows why this matters most. It is a Critical question, confined space entry attendant present, and it reads Not applicable with nothing written. If the work involved no confined space entry, one line says so. If it did, the checklist has left a critical question unexamined and called it answered.

## What it stops

The unanswered items do not stay a quiet gap. Asked to report AUD-2026-007 as recorded, canReportAudit refuses:

"4 checklist items have no answer yet (10, 11, 13, 14). An audit reported with its checklist half blank says nothing about the items nobody looked at."

The four items the refusal names are the four in unansweredItems. Module five walks the reporting gate step by step, and the next step it reads is "every item answered, and the two blank Not applicable answers given reasons". Giving items 10 and 11 their reasons is part of what moves the audit forward.

## Exercise

Read two figures from checklistProgress at the as-of date, notApplicable 3 and answered 10, and the unansweredItems list, 10, 11, 13 and 14. Say what the readings show about how a Not applicable result with no reason is counted, which figure includes items 10 and 11 and which leaves them out, and what item 9 has that they lack.
