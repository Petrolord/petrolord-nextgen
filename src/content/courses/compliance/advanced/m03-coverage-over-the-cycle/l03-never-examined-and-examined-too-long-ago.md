# Never examined, and examined too long ago

Lessons 1 and 2 decided which audits count. This lesson reads what the engine does with the ones that do. clauseCoverage walks the 12 applicable ORASHI clauses, finds each one's last counting examination, and reads it against the certification cycle of 3 years at the as-of date 2026-10-15. Every clause lands in one of three places: covered, stale, or never examined.

{{panel:compliance-readiness-explorer}}

## Three outcomes, three rows

| clause | last examined | days until it (negative is past) | by audit | covered | stale |
| --- | --- | --- | --- | --- | --- |
| 8.1 | 2024-05-16 | -882 | ISA-2024-001 | true | false |
| 4.3 | 2023-09-20 | -1121 | ISA-2023-002 | false | true |
| 7.2 | never | none | none | false | false |

Clause 8.1 was last examined by a counting audit inside the cycle, and it reads covered true. Clause 4.3 was last examined by a counting audit, and that examination falls before the cycle began: it reads covered false and stale true. Clause 7.2 has no counting examination at all. It reads never, with covered false and stale false.

Read the day counts as the engine prints them. The engine does not convert -882 or -1121 into years, and neither should you. The engine has already read each date against the cycle, and the covered and stale flags are its answer.

## Stale and never are two different conditions

Clause 7.2 reads stale false. That is not good news. A clause can only be stale if it was once examined. A clause nobody has examined has nothing to be stale about, so the engine gives it its own outcome and its own count.

The readiness list in module 5 keeps the two apart and ranks them differently:

- blocking: "3 applicable clauses have never been examined by an internal audit. ISO 14001:2015 §9.2 requires the organization to audit its own system."
- serious: "1 clause was last audited before this certification cycle began."

At a cycle of 3 years, the lab's table of cycle lengths prints covered 8, stale 1 and never examined 3. The three clauses that read never are 6.1.2, 7.2 and 7.5.3.

## A register verdict is not an audit

Look at clause 7.5.3, Control of documented information. In the register from module 1 it reads Conformant, with claims conformity, evidence record and assessed all true. In the coverage table it reads never. Both statements are on the record at once.

The register verdict is the clause owner's assessment, evidenced, dated and named. Coverage asks whether an internal audit has examined the clause. The first is the organization saying it conforms. The second is the organization checking that it does. ISO 14001:2015 §9.2 asks for the second, and a well-evidenced verdict does not stand in for it.

Clause 6.1.2 is the same case: Partially conformant in the register, with evidence, and never examined by a counting audit. Clause 7.2 is never examined and Not assessed as well, and the readiness list counts it twice, once for each.

## What the flags prevent

Without the stale flag, a clause examined once, long ago, would read covered for ever. Without its own never examined outcome, a clause nobody has looked at would hide among the stale ones, and the list would rank it lower than it deserves.

## Exercise

At 2026-10-15, with a cycle of 3 years, read the rows for clauses 4.3, 7.5.3, 8.1 and 8.2 in the coverage table. For each, give its last examined date, the audit and the covered and stale values. Then read clause 7.5.3's row in the module 1 register and say what the two tables together tell you about that clause. Do not convert any day count into years.
