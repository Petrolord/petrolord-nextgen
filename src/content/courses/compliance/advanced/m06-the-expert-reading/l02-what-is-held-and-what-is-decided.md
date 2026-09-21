# What is held and what is decided

This course lists the owner decisions in force, the ambiguities recorded and left as they are, five rules the engine keeps from ASC-0 and three more from ASC-1. None of it is a graded field. This lesson reads it as stated policy and as limits.

{{panel:compliance-readiness-explorer}}

## Owner decisions in force

The owner decisions of AS15:

- Q1: an unreadable today makes deriveStatus throw.
- Q2: evidence counts towards Compliant only for the current period.
- Q4: ISO coverage counts only Reported or Closed audits.
- Q5: every examiner is checked for independence, through canExamineClause.
- Q6: an expired certificate is a serious readiness item, one inside the lead window a watch item.
- Q11: a Not applicable answer without a reason is not an answer, and a cancellation without a reason does not complete a programme.
- D1: a document review task is decided only by its assigned reviewer, never by the author.

Q4 is module 3 of this tier, Q5 is module 2 and Q6 is module 5. Q1, Q2 and D1 belong to the Associate tier, and Q11 to the Professional.

## Held limits

Four ambiguities are recorded and not changed. Each is a limit, never a figure to compute with.

- A document review period missing from a call to nextReviewDate returns no date. The default of DEFAULT_REVIEW_PERIOD_MONTHS is the caller's to apply.
- A complete audit programme that contains a cancelled audit reads below one hundred percent, by design, because the programme counts reported audits only.
- A templated audit passed with no checklist items passes the unanswered-items rule vacuously. The database counts the template itself.
- An unreadable today is refused by complianceStatus alone. Two other modules answer as though nothing were due.

The last limit matters most: an app that shows no overdue review has told you nothing if the date it was given could not be read.

## Five rules the engine keeps

- R1, one rule for outstanding. On four audits, one of them cancelled with no reason, programmeProgress counts 2 outstanding and summarise counts 2.
- R2, a percent rounds half up on the exact fraction. checklistProgress on 57 answered of 200 prints 29, and planProgress on 23 resolved of 40 prints 58.
- R3, expired and expiring are two separate flags. A certificate with certificateDays -15 reads certificateExpiring false and certificateExpired true.
- R4, a filed One-off says it is discharged. REG-2026-006 reads Compliant, and its reason says nothing further is due.
- R5, a sentence names the register's own standard. The readiness list for ISO 14001:2015 carries 1 item naming ISO 14001:2015 and 0 naming ISO 9001.

## Three more rules

From ASC-1:

- An audit is overdue only while it is undelivered, in both modules. Both modules read false for a Reported audit whose planned end has passed.
- A readiness sentence names what an unevidenced claim lacks. The engine prints it for clause 5.2, which lacks evidence reference.
- The Due soon reason says when the default lead time applies, as REG-2026-012's reason does.

## Exercise

Reread this lesson. For each of Q4, Q5 and Q6, name the module of this tier where you met the rule at work and one figure or verdict from that module that shows it. Then take the four held limits and, for each, say what a reader of the app's screen could wrongly conclude if they did not know the limit.
