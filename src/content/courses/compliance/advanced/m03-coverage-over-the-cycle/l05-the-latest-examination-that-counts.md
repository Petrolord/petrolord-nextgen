# The latest examination that counts

A clause may be examined by several audits over the years. clauseCoverage keeps one of them: the latest examination made by an audit that counts. This lesson reads the last examined, by audit and result columns of the ORASHI coverage table at the as-of date 2026-10-15, and what each column does and does not decide.

{{panel:compliance-readiness-explorer}}

## The last examined date is the clause result's date

| clause | last examined | by audit | result | covered |
| --- | --- | --- | --- | --- |
| 4.1 | 2026-06-10 | ISA-2026-001 | Conformant | true |
| 5.2 | 2026-06-09 | ISA-2026-001 | Observation | true |
| 6.1.3 | 2026-06-11 | ISA-2026-001 | Nonconformant | true |
| 10.2 | 2026-06-12 | ISA-2026-001 | Conformant | true |
| 4.3 | 2023-09-20 | ISA-2023-002 | Conformant | false |

The first four rows were examined by ISA-2026-001, each on its own date. The audits table gives ISA-2026-001's end as 2026-06-12. Clause 10.2 carries that date. Clauses 4.1, 5.2 and 6.1.3 carry earlier ones. The last examined date is the date the clause was examined within the audit. The audit's end date is a separate field.

The same holds for clause 4.3, examined 2023-09-20 by ISA-2023-002, an audit that ended 2023-09-22.

## The result does not decide coverage

Read the result column against the covered column. Clause 5.2's latest counting result is an Observation, and it reads covered true. Clause 6.1.3's latest counting result is Nonconformant, and it also reads covered true.

Coverage asks whether the clause was examined by a counting audit inside the cycle. It does not ask what the examiner found. A Nonconformant result is an examination as surely as a Conformant one: somebody looked, and the record says what they saw. What happens to a Nonconformant result is the business of findings and of the register verdict, which module 4 and module 5 read. It is not the business of coverage.

## Only counting audits compete to be latest

The latest examination is chosen among counting audits only. An audit that does not count is not a candidate, however recent its dates. That is how the two conditions from lessons 1 and 2 reach the table. Clause 4.3's latest counting examination is 2023-09-20. ISA-2026-S01, of type Surveillance, ended 2026-07-24, and ISA-2026-002 is In progress. Neither is a counting audit, so neither can become clause 4.3's latest examination.

The table of what each audit examined shows two more. ISA-2026-002 examined clause 5.2, Conformant on 2026-10-06, and 5.2's last examined date stays at 2026-06-09, by ISA-2026-001, because ISA-2026-002 is In progress. ISA-2025-003 examined clause 7.5.3 on 2025-11-12 and is Cancelled, and 7.5.3 reads never.

Clause 8.1 shows the same thing from the other side. Its latest counting examination is 2024-05-16, by ISA-2024-001. ISA-2026-002 has 8.1 in scope, and its canReportAudit refusal names 8.1 among the clauses with no result yet. Until that audit reports a result, 8.1's date stays at 2024-05-16.

## Why the rule picks the latest

A clause's coverage is a statement about how recently it was examined. The latest counting examination is the only one that answers that question. An earlier examination of the same clause adds nothing to it. Clauses 8.1 and 8.2 read last examined 2024-05-16 by ISA-2024-001, and that is the one date the cycle reads for each. The cycle is then read against that one date, which is what lessons 3 and 4 did.

## Exercise

At 2026-10-15, read the last examined, by audit, result and covered columns for clauses 4.1, 5.2, 6.1.3 and 10.2. Compare each last examined date with ISA-2026-001's end date in the audits table and say which clause shares it. Then say why clauses 5.2 and 6.1.3 read covered true, and name the two audits on the table that cannot become clause 4.3's latest examination and the reason for each.
