# A nonconformant verdict needs two of the three

Lesson 2 showed the gate asking for evidence, a date and an assessor before it lets a clause read Conformant. A Nonconformant verdict is a different statement, and the gate asks for less. This lesson reads the two Nonconformant requests the digest prints, on clause 7.2 of the ORASHI register, and the one ORASHI clause that carries the verdict, at the as-of date 2026-10-15.

{{panel:compliance-readiness-explorer}}

## The two requests

canSetClauseStatus on clause 7.2, with the ISO 14001:2015 record passed:

- Nonconformant with no date: REFUSED: Record the date this was assessed and who assessed it.
- Nonconformant with a date and an assessor: ALLOWED.

The second request carries no evidence reference, and the gate allows it. So a Nonconformant verdict needs two of the three things a Conformant claim needs: the date and the name. The evidence reference is the one it does not ask for.

## Why the rule is shaped this way

A Conformant status asserts that documented information shows a requirement is met. The assertion stands on the document, so the document has to be named. A Nonconformant status asserts that the requirement is not met. The register does not need a document proving the gap before the gap may be recorded. What it does need is when the clause was assessed and who assessed it, because a verdict with no date cannot be placed in a cycle and a verdict with no name cannot be checked against the owner of the clause.

A problem therefore needs less on the record than a claim of conformity does.

## Clause 6.1.3 in the ORASHI register

Clause 6.1.3, Compliance obligations, is owned by u-tari. Its row reads:

| status | claims conformity | evidence record | assessed | next review |
| --- | --- | --- | --- | --- |
| Nonconformant | false | false | true | 2027-06-12 |

Assessed reads true and evidence record reads false. That is the pattern the gate allows: a verdict with its date and assessor, and no evidence reference. Claims conformity reads false, because a Nonconformant clause makes no claim of conformity.

The readiness counts print nonconformant 1, and module 5 shows the blocking item this clause raises: "1 clause is assessed nonconformant and not yet resolved." The verdict is on the record, dated and named, and the list keeps it in front of the reader until it is resolved.

## What the digest does not print

The digest prints gate rows for Conformant, Nonconformant and Not applicable. It prints no row setting a clause to Partially conformant. Clause 6.1.2 reads Partially conformant in the register, with claims conformity, evidence record and assessed all true, and that tells you what this one clause carries. It does not tell you what the gate demands for that status. This course does not say which of the three the gate asks of a Partially conformant clause, and you should not infer it from the one row.

## Exercise

At 2026-10-15, read the rows for clauses 5.2, 6.1.3 and 7.2. For each, name the status and the values of claims conformity, evidence record and assessed. Then say which of the three rows the canSetClauseStatus requests printed in this module would allow as recorded, and which of the three things each one lacks. Say why the digest gives you no answer for clause 6.1.2's status.
