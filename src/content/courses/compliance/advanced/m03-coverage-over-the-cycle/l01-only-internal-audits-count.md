# Only internal audits count

A clause is covered when an audit has examined it recently enough. Module 3 reads the engine's coverage count one condition at a time, and the first condition is the kind of audit. isoCompliance.COVERING_AUDIT_TYPES holds one word: Internal. This lesson reads what that one word does to the ORASHI register at the as-of date 2026-10-15.

{{panel:compliance-readiness-explorer}}

## The audits ORASHI holds

| audit | type | status | ended | counts towards coverage |
| --- | --- | --- | --- | --- |
| ISA-2023-002 | Internal | Closed | 2023-09-22 | true |
| ISA-2024-001 | Internal | Closed | 2024-05-17 | true |
| ISA-2026-001 | Internal | Reported | 2026-06-12 | true |
| ISA-2026-002 | Internal | In progress | none | false |
| ISA-2025-003 | Internal | Cancelled | none | false |
| ISA-2026-S01 | Surveillance | Closed | 2026-07-24 | false |

Six audits, and three of them count. This lesson reads the one that fails on its type. Lesson 2 reads the two that fail on their status.

## The surveillance audit

ISA-2026-S01 is a Surveillance audit, Closed, ended 2026-07-24. Its row reads counts towards coverage false, and its status does not rescue it: Closed is one of the two counting statuses, and the type alone keeps it out.

A surveillance audit is carried out by the certification body. It examines the management system from outside. The coverage count asks a different question: has the organization examined its own system? The readiness list's blocking item names the requirement behind the question, in the register's own standard: "ISO 14001:2015 §9.2 requires the organization to audit its own system."

## What the surveillance audit does not move

The trap this tier is built on sits here. An examination by the certification body does not move a clause's last examined date, however late it falls. Clause 4.3 reads last examined 2023-09-20, by ISA-2023-002, and it reads stale true. A surveillance audit ended in 2026 sits on the same table, and 4.3's last examined date stays where it is.

The digest does not print which clauses ISA-2026-S01 examined. This course does not claim that it examined clause 4.3 or any other. Whatever it examined, its type keeps it out of every clause's coverage, and that is all the rule needs.

## Why the rule matters

An organization that relies on the certification body's visits to cover its own clauses has handed its internal audit programme to the body that certifies it. The rule keeps the two apart. A surveillance audit still reports what it saw, and the organization still answers it. It does not stand in for the organization's own audit of a clause. When the certification body arrives for recertification, it will ask to see the internal audits, and a register whose coverage leans on the body's own visits has nothing of its own to show.

## The external auditor from module 2

Module 2 read an external lead auditor named in text, allowed on an internal audit. Such an audit is still of type Internal, and it counts once it is reported. The type of the audit decides coverage. The employer of the person leading it does not. Module 2 and this module ask two separate questions of the same audit: who examined, and what kind of audit it was.

## Exercise

Read the six rows of the ORASHI audits table at 2026-10-15. For each, name its type and status and read its counts towards coverage value. Then say which one row fails only on its type, and why clause 4.3's last examined date, 2023-09-20, is unaffected by that audit. Say what the digest does not tell you about ISA-2026-S01's scope.
