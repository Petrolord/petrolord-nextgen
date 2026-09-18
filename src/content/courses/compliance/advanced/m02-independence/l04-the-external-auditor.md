# The external auditor

Two rules in this course print the same allowed row. The isoCompliance lead auditor check allows "an external lead auditor named in text", and the auditManagement rule allows "an external lead auditor named in text, with no account". This lesson reads what those rows show and what they leave to the people running the audit.

{{panel:compliance-readiness-explorer}}

## What the two rows say

In SECTION 19, over the planned internal audit with clauses 8.1, 8.2, 9.1.1 and 9.2 in scope: an external lead auditor named in text: ALLOWED.

In SECTION 16, the lead auditor against the auditee: an external lead auditor named in text, with no account: ALLOWED.

Both checks compare names held on the record. The clause owners in the ORASHI register are accounts: u-nneka, u-obinna, u-tari, u-kalu. An external auditor named in text, with no account, matches none of them, and both gates answer ALLOWED.

## What ALLOWED means here

ALLOWED says the engine found no conflict among the names it holds. It is the right answer, because an external auditor is exactly the kind of person who owns nothing in the register. The row is still worth reading closely. The engine allows the external name because it has nothing to compare it with. The digest prints the verdict and nothing more, so what an external auditor's independence rests on in fact is outside what these rows show. That judgement stays with the people who appoint the auditor, and the audit record should say who they are and on whose behalf they examine.

## An external audit is a different thing

An external lead auditor on an internal audit is one case. An audit carried out by an external body is another, and module 3 of this tier reads it. The ORASHI record holds one audit of type Surveillance, ISA-2026-S01, Closed, ended 2026-07-24. Its row in the audits table reads counts towards coverage false.

So an external person may lead an internal audit, and that audit counts towards coverage once it is reported. An audit of type Surveillance does not count towards coverage whatever its status. The first is about who examines. The second is about what kind of audit it is. The readiness list's blocking item for never-examined clauses quotes the reason: "ISO 14001:2015 §9.2 requires the organization to audit its own system."

## Reading the rows together

| row | where | verdict |
| --- | --- | --- |
| external lead auditor named in text | SECTION 19 lead auditor check | ALLOWED |
| external lead auditor named in text, with no account | SECTION 16 auditIndependence | ALLOWED |
| ISA-2026-S01, Surveillance, Closed | SECTION 20 audits table | counts towards coverage false |

The first two rows answer a question about independence. The third answers a question about coverage. None of them answers the other's question.

## Exercise

Read the three rows in the table above. Say what each engine check compared, what it found, and what its verdict does and does not tell you. Then say, using only the audits table, which ORASHI audit type the coverage count reads, and why an external lead auditor on an internal audit is a different case from ISA-2026-S01.
