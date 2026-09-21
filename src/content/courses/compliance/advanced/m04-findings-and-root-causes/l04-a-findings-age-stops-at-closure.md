# A finding's age stops at closure

Every ORASHI finding carries an age in days. The age is derived, and it is read against the as-of date 2026-10-15 while the finding is open. Once it is closed or voided, it stops. This lesson reads the age and the overdue flag of each finding and each action, and the audit overdue rule two modules share.

{{panel:compliance-readiness-explorer}}

## The ORASHI findings

| code | type | status | raised | due | closed | open | overdue | age in days |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| ISF-2026-004 | Major nonconformity | Action in progress | 2026-06-12 | 2026-09-30 | none | true | true | 125 |
| ISF-2026-005 | Minor nonconformity | Open | 2026-06-12 | 2026-12-11 | none | true | false | 125 |
| ISF-2026-001 | Major nonconformity | Closed | 2026-02-03 | 2026-04-30 | 2026-04-21 | false | false | 77 |
| ISF-2026-002 | Observation | Voided | 2026-06-10 | none | 2026-06-13 | false | false | 3 |
| ISF-2026-003 | Opportunity for improvement | Open | 2026-06-12 | none | none | true | false | 125 |

## Open findings age to the as-of date

The three open findings were all raised 2026-06-12, and all three read 125. Their age runs from the day they were raised to 2026-10-15. Read at a later as-of date, all three would read more. The age of an open finding is a statement about one date. Quote it with its as-of date, or it says nothing a reader can check.

## Closed and voided findings stop

ISF-2026-001 was raised 2026-02-03 and closed 2026-04-21. It reads 77, and it will read 77 at any as-of date after its closure. ISF-2026-002 was voided: its closed column reads 2026-06-13, and its age reads 3. A voided finding stops ageing at the date it was voided, in the same column a closed finding uses. The Professional tier read the same rule on NCRs, where the age runs to the as-of date while open and to the closed date once closed or voided.

Why stop the clock? The age of a closed finding answers a fixed question: how long did it take to close? That answer should not grow with every day the register is read. The age of an open finding answers a different question: how long has it been waiting? The status says which question a row answers.

## Overdue needs a due date

ISF-2026-004 is due 2026-09-30, open, and reads overdue true. ISF-2026-005 is due 2026-12-11 and reads overdue false. ISF-2026-003 has no due date and reads overdue false: a finding with no due date cannot fall overdue. ISF-2026-001's due date, 2026-04-30, has passed, and it reads overdue false because it is closed.

The readiness list's watch item "1 finding is past its due date." counts the one row that reads overdue true.

## Actions follow the same rule

| action | finding | status | due | open | overdue |
| --- | --- | --- | --- | --- | --- |
| ac1 | ISF-2026-004 | In progress | 2026-10-02 | true | true |
| ac4 | ISF-2026-004 | Complete | 2026-09-01 | false | false |

ac4's due date has passed, and it reads overdue false because it is complete. ac1 is open past its due date and reads overdue true. The readiness list counts it as a serious item: "1 corrective or preventive action is past its due date."

## One audit overdue rule in two modules

For an audit whose planned end has passed, the two modules print isAuditOverdue:

| status | isoCompliance | auditManagement |
| --- | --- | --- |
| Planned | true | true |
| In progress | true | true |
| Fieldwork complete | true | true |
| Reported | false | false |
| Closed | false | false |
| Cancelled | false | false |

The two modules agree on every row. The engine also reports that the two AUDIT_TRANSITIONS tables agree on every status, and the course states the rule both keep: an audit is overdue only while it is undelivered. isoCompliance.AUDIT_UNDELIVERED_STATUSES names the three statuses an audit can be overdue in: Planned, In progress and Fieldwork complete. Reported is not among them.

The ORASHI audits show both sides at 2026-10-15. ISA-2026-001 is Reported with a planned end of 2026-06-12, and reads open true and overdue false. ISA-2026-002 is In progress with a planned end of 2026-10-09, and reads open true and overdue true.

## Exercise

At 2026-10-15, read the age, open and overdue columns for all five findings. Say which ages will change if the as-of date moves and which will not, and why. Then read ISA-2026-001 and ISA-2026-002 in the ORASHI audits table, both open with planned ends before 2026-10-15, and say what their statuses show about which one reads overdue.
