# Units against plan

The variance lines explain the matched movements. Two more readings finish the month: the margin of each ledger, which counts every movement, and each unit's throughput against its plan. reconcilePeriod gives both.

{{panel:refinery-variance-explorer}}

## The ledger margins

reconcilePeriod reads the margin of each ledger: deliveries less everything else that carries a value.

| reading | figure |
| --- | --- |
| plan margin | 4776300.00 |
| actual margin | -235150.00 |
| margin variance | -5011450.00 |
| the plan's own margin | 4776300.00 |
| plan gross margin per barrel | 4.7763 |

The plan ledger's margin reads 4776300.00, and the plan's own margin, from the plan solved in module 1, reads 4776300.00. The ledger built from the schedule and the plan it came from give the same figure, which is the check that the cascade lost no money. The actual ledger's margin is -235150.00: over the month the refinery's deliveries brought in less than its receipts and unit runs cost.

## Two variances, one gap

The margin variance across the ledgers is -5011450.00. The margin total of the matched lines, from the previous lesson, is -5452450.00. They are not the same figure, and the engine prints why:

margin variance - margin total of the matched lines = 441000.00; the unmatched movements, deliveries counted as revenue and the rest as cost, come to 441000.00.

The ledger margins count every movement. The variance lines count only the matched ones. ODIOMA's one unmatched movement is the lpg delivery with a value of 441000.00, a sale the plan never carried. The ledger margin counts it and the line total cannot. A reader who holds both variances and the unmatched list can close the gap exactly.

## Each unit against plan

| unit | planned (bbl) | actual (bbl) | difference (bbl) | utilisation of plan (percent) |
| --- | --- | --- | --- | --- |
| cdu | 1000000.00 | 735000.00 | -265000.00 | 73.50 |
| reformer | 190000.00 | 131000.00 | -59000.00 | 68.95 |

The crude unit ran 735000.00 bbl against a plan of 1000000.00 bbl, a difference of -265000.00 bbl and 73.50 percent of plan. The reformer ran 131000.00 bbl against 190000.00 bbl, a difference of -59000.00 bbl and 68.95 percent of plan.

Utilisation of plan is measured against the plan's throughput for the unit. It is a different figure from utilisation against capacity, which the Professional tier read. The crude unit's capacity in the ODIOMA configuration is 1200000.00 bbl, and its plan was 1000000.00 bbl. This table reads the actual against the plan.

## The app reports the gap

The app reports the gap and does not say why it happened. A crude unit at 73.50 percent of plan might have been short of crude, down for repair, or held back by a product it could not sell. The table cannot tell those apart.

For ODIOMA the other lines of the month suggest where to look. The escravos receipt reads 735000.00 bbl and the crude unit ran 735000.00 bbl, and the Forcados receipt reads 0.00 bbl. That points at crude supply. It is a reading of the evidence, and the engine does not draw it. The course's engines state their own limits too: the schedule models no tank capacity, jetty window or turnaround, so a unit held down by any of those shows only as a shortfall here.

## Exercise

Read the plan margin, the actual margin and the margin variance, then the margin total of the matched lines from the previous lesson. Say what the printed gap of 441000.00 is and which list explains it. Then read the crude unit's utilisation of plan and its capacity, and say why 73.50 percent of plan is not a statement about capacity.
