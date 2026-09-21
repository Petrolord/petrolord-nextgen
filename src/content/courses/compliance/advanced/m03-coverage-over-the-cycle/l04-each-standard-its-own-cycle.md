# Each standard its own cycle

Lesson 3 read the ORASHI register at its own cycle of 3 years. The cycle is an input, and a different input gives different counts. This lesson reads the same register at four cycle lengths, and then two clauses from two standards read against their own cycles on the same day. The as-of date is 2026-10-15 throughout.

{{panel:compliance-readiness-explorer}}

## The same register at four cycle lengths

| cycleYears | covered | stale | never examined |
| --- | --- | --- | --- |
| 1 | 6 | 3 | 3 |
| 2 | 6 | 3 | 3 |
| 3 | 8 | 1 | 3 |
| 4 | 9 | 0 | 3 |

Nothing in the register changes between these rows. The audits, their statuses and the examination dates are the same. Only cycleYears moves, and the covered and stale counts move with it.

Read the never examined column. It prints 3 in every row. The cycle decides how far back an examination may fall and still count. It cannot create an examination that does not exist, so no cycle length touches clauses 6.1.2, 7.2 and 7.5.3.

Read the covered and stale columns at 1 and 2 years. They print the same pair, 6 and 3. Do not infer from two identical rows that the cycle has no effect below 3 years in general. The table shows this register, and only the four lengths printed. The panel lets you move the cycle yourself; quote only the rows the table prints.

## Why the cycle is part of the answer

A coverage count means nothing without the cycle it was read against. "8 covered" is the ORASHI answer at 3 years. At 4 years the same register prints 9. A report that quotes a coverage count and leaves out the cycle has left out half of the figure, in the same way a status quoted without its as-of date has.

The cycle belongs to the standard. The ORASHI record states the cycle for ISO 14001:2015 as 3 years, and that is the length the engine reads for this register.

## Two standards on the same day

clauseCoverageByStandard reads each clause against its own standard's cycle. The lab prints ISO 14001:2015 at 3 years and ISO 45001:2018 at 1 year, and one clause from each, both last examined on the same day:

| standard | clause | last examined | covered | stale |
| --- | --- | --- | --- | --- |
| ISO 14001:2015 | 8.1 | 2025-10-14 | true | false |
| ISO 45001:2018 | 6.1.2 | 2025-10-14 | false | true |

The same examination date gives two different answers. Clause 8.1 is inside its 3 year cycle and reads covered. Clause 6.1.2 of ISO 45001:2018 is outside its 1 year cycle and reads stale. clauseCoverageByStandard reads each clause against its own standard's cycle, so one register can hold a 3 year standard and a 1 year standard side by side.

Note that clause 6.1.2 here belongs to ISO 45001:2018. It is a different requirement from ORASHI's clause 6.1.2 of ISO 14001:2015, which shares its number and reads never in lesson 3. A clause number means something only beside its standard, which is why every refusal and every readiness sentence in this tier names the standard it was read against.

## Exercise

Read the four rows of the cycle table. Say which column never changes and why, which two rows print the same covered and stale counts, and what that does and does not tell you. Then read the two clauseCoverageByStandard rows at 2026-10-15 and say what differs between them to give two answers from one examination date.
