# Only reported results count

Lesson 1 read the type condition. This lesson reads the status condition. isoCompliance.COVERAGE_COUNTING_STATUSES holds two words: Reported and Closed. An internal audit counts towards coverage only when it has reached one of them. Owner decision AS15 Q4 states the same rule in SECTION 23: ISO coverage counts only Reported or Closed audits. The as-of date is 2026-10-15.

{{panel:compliance-readiness-explorer}}

## The two internal audits that do not count

Two ORASHI audits are of type Internal and still read counts towards coverage false:

| audit | type | status | ended | counts towards coverage |
| --- | --- | --- | --- | --- |
| ISA-2026-002 | Internal | In progress | none | false |
| ISA-2025-003 | Internal | Cancelled | none | false |

The three that do count are two Closed audits, ISA-2023-002 and ISA-2024-001, and one Reported audit, ISA-2026-001.

## An audit in progress

ISA-2026-002 is In progress. Its examiners may already have recorded results. Until it is reported, none of them moves a clause's last examined date. Until then the audit's conclusion has not been written, and nothing on the record says what the audit as a whole found. Coverage waits for the report, because the report is the audit's deliverable and the only statement an auditee or a certification body can hold the organization to.

The ISO module refuses to report an audit whose scope still has clauses without a result. For ISA-2026-002, with three clauses in scope and two not yet examined, canReportAudit answers:

REFUSED: 2 clauses in scope have no result yet (7.2, 8.1).

And for an audit with nothing in scope:

REFUSED: This audit has no clauses in its scope. An audit that examined nothing has nothing to report.

So the path to coverage runs through both gates. Every clause in scope needs a result before the audit can be reported, and only the reported audit counts. Clause 8.1, named in that refusal, reads last examined 2024-05-16 by ISA-2024-001 in the coverage table, and the audit in progress does not change it.

## A cancelled audit

ISA-2025-003 is Cancelled, and its ended column reads none. A cancelled audit has no report, and it counts for nothing in coverage, whatever its examiners may have looked at before it was stopped. The Professional tier read the same rule from the other side: a programme's delivered percent counts reported audits only, and a cancellation never counts as delivery.

## Why the rule is a status rule

A status is a statement the audit's owner has made on the record. Reported says the report is written. Closed says everything the audit raised has been dealt with. The coverage count reads those statements and nothing earlier, so a clause is never counted as covered by an audit whose conclusion does not yet exist.

## The trap, stated once

The header of this tier's seed states it: an examination is not coverage until the audit that made it is internal and reported. An examination by the certification body, by an audit still in progress or by one later cancelled does not move a clause's last examined date. Lesson 1 read the first. This lesson read the second and the third.

## Exercise

At 2026-10-15, read the five Internal rows of the ORASHI audits table and name the status of each. Say which three count and which two do not, and which status word decides each case. Then read the canReportAudit refusal for ISA-2026-002 and clause 8.1's last examined date in the coverage table, and say what would have to happen, in order, before ISA-2026-002 could move any clause's date.
