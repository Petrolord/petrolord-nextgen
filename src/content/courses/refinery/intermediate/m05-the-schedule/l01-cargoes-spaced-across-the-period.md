# Cargoes spaced across the period

A plan says how much crude the month runs. It does not say when the crude arrives. The schedule does. This module reads ABUA's plan cascaded into dated events, and this lesson reads the first kind of event, the crude receipt.

{{panel:refinery-plan-explorer}}

## The cascade

The digest cascades ABUA's plan from period start 2027-03-01, a period of 31 days, with a cargo size of 400000.00 bbl. The engine's rule, in the digest's words: crude arrives in whole cargoes evenly spaced; each unit runs and each product lifts in equal weekly events.

Every date in this module is counted from that period start. None of them is the reader's own date, and none depends on when the schedule is built. Lesson 3 explains why that is a rule and how it is kept.

The whole cascade makes 41 events: crude receipts 6, unit runs 15, product lifts 20.

## The six receipts

| id | date | material | quantity (bbl) | value | part |
| --- | --- | --- | --- | --- | --- |
| rcpt-1 | 2027-03-01 | bonny_light | 329032.26 | 26750322.58 | 1 of 1 |
| rcpt-2 | 2027-03-01 | forcados | 366666.67 | 28453333.33 | 1 of 3 |
| rcpt-3 | 2027-03-11 | forcados | 366666.67 | 28453333.33 | 2 of 3 |
| rcpt-4 | 2027-03-21 | forcados | 366666.67 | 28453333.33 | 3 of 3 |
| rcpt-5 | 2027-03-01 | brass_river | 300000.00 | 24120000.00 | 1 of 2 |
| rcpt-6 | 2027-03-16 | brass_river | 300000.00 | 24120000.00 | 2 of 2 |

Read each crude in turn.

**Bonny Light.** The plan runs 329032.26 bbl, and the schedule delivers it as one cargo, part 1 of 1, on 2027-03-01.

**Forcados.** The plan runs 1100000.00 bbl. The schedule delivers it in three equal parts of 366666.67 bbl, dated 2027-03-01, 2027-03-11 and 2027-03-21. Each part carries an equal share of the crude. The digest prints the parts and the cargo size side by side. It does not print the rule that counts the parts, so read the count from the part column.

**Brass River.** The plan runs 600000.00 bbl, delivered in two parts of 300000.00 bbl on 2027-03-01 and 2027-03-16.

The value of each receipt is its share of that crude's cost. The Forcados receipts carry 28453333.33 each, and the plan's Forcados crude cost is 85360000.00.

## Evenly spaced

Each crude's cargoes start on the period start and are spread across the 31 days. Forcados, in three parts, arrives on the first, the eleventh and the twenty-first. Brass River, in two, arrives on the first and the sixteenth. Every crude has a cargo on 2027-03-01. A real terminal may not be able to take three crude cargoes on one day, and Lesson 5 reads what the schedule leaves out.

## The cargo size is a control

The digest runs the same plan with a cargo size of 150000 bbl: crude receipts 15, and Forcados arrives on 2027-03-01, 2027-03-04, 2027-03-07, 2027-03-10, 2027-03-13, 2027-03-16, 2027-03-19 and 2027-03-22. The crude is the same. At 400000.00 bbl the cascade made crude receipts 6. At 150000 bbl it makes crude receipts 15, and the Forcados dates list above is its answer for one crude.

The cargo size changes the schedule and leaves the plan alone. The plan's crude volumes, costs and margin are the same whatever cargo size is chosen, because the schedule is built from the plan and never feeds back into it.

## Exercise

Read the Forcados receipts at a cargo size of 400000.00 bbl: three parts of 366666.67 bbl, dated 2027-03-01, 2027-03-11 and 2027-03-21, from period start 2027-03-01. Then read the Forcados dates at a cargo size of 150000 bbl. Say what the cargo size decides about the receipts, and what it leaves unchanged in the plan.
