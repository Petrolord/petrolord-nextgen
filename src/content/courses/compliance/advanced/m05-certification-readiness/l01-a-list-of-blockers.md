# A list of blockers

Every module of this tier has built towards one question: is the ORASHI management system ready for certification? certificationReadiness answers it for ISO 14001:2015 at the as-of date 2026-10-15. Its answer is ready false, and a list. This lesson reads the list as a whole. It carries no percentage and no score.

{{panel:compliance-readiness-explorer}}

## The answer

| severity | count | text |
| --- | --- | --- |
| blocking | 1 | 1 major nonconformity is open. A certification body will not recommend certification over one. |
| blocking | 3 | 3 applicable clauses have never been examined by an internal audit. ISO 14001:2015 §9.2 requires the organization to audit its own system. |
| blocking | 1 | 1 clause is marked conformant with no evidence reference recorded. |
| blocking | 1 | 1 clause is assessed nonconformant and not yet resolved. |
| serious | 1 | 1 clause was last audited before this certification cycle began. |
| serious | 1 | 1 applicable clause has never been assessed at all. |
| serious | 1 | 1 corrective or preventive action is past its due date. |
| watch | 1 | 1 minor nonconformity is open. |
| watch | 1 | 1 clause review is past due. |
| watch | 1 | 1 finding is past its due date. |
| watch | 1 | The certificate expires in 85 days. Book the recertification audit before then. |

## Why a list

certificationReadiness returns a verdict, ready false, and a list of items. Each item carries a severity, a count and a sentence. It returns no percent: SECTION 23 names checklistProgress, programmeProgress and planProgress as the three exports that print a percent, and certificationReadiness is not one of them. The first blocking item names the open Major nonconformity and adds: "A certification body will not recommend certification over one."

Every item is counted, named in words, and given a severity. The reader sees what stands in the way and how many of each. The Associate tier learned that a status is derived from a dated record. This tier ends with the same idea at the scale of a whole system: readiness is derived, and it is derived as a list of what the record still lacks.

## Every item points back to a module

Each line of the list is a rule you have already read:

- the open major nonconformity, module 4, lessons 2 and 4;
- the never examined clauses and the one examined too long ago, module 3;
- the conformant clause with its record incomplete, and the nonconformant clause, module 1;
- the clause never assessed, module 1, clause 7.2;
- the action and the finding past their due dates, module 4, lesson 4;
- the clause review past due, module 1, lesson 4;
- the certificate, lesson 3 of this module.

Nothing on the list is new. The list is the whole tier, read at one date.

## The certificate is one item

The certificate appears on the list as a watch item, in the same table as the others and in the same form: a count and a sentence. It is not a gate the rest of the list sits behind, and it does not stand apart as a headline. A certificate with months to run says nothing about an open Major nonconformity, and the list keeps both in view. Lesson 3 reads the certificate item at its edges, including the expiry dates at which it leaves the list altogether.

## A register with nothing in it

The engine prints one more case. A standard with no clauses in the register reads ready false, with a single blocking item of count 0:

"This standard has no applicable clauses in the register yet, so there is nothing to be ready with."

An empty register is not ready by default. The engine does not let the absence of problems pass for readiness when there is nothing to have problems with.

## Exercise

At 2026-10-15, read the eleven items on the ORASHI readiness list. Group them by severity and give the count printed beside each. For each item, name the module of this tier that taught the rule behind it. Then read the empty register's single item and say why its count of 0 still leaves ready false. Do not add the counts together or turn them into a percentage.
