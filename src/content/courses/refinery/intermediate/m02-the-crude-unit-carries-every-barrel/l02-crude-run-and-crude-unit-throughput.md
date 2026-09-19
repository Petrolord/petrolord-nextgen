# Crude run and crude unit throughput

Lesson 1 gave the rule: crude run = crude unit throughput. This lesson reads ABUA's plan and finds the rule holding to the barrel, crude by crude.

{{panel:refinery-plan-explorer}}

## The crudes the plan runs

| crude | volume (bbl) | available (bbl) | cost |
| --- | --- | --- | --- |
| Bonny Light (illustrative) | 329032.26 | 1500000.00 | 26750322.58 |
| Forcados (illustrative) | 1100000.00 | 1100000.00 | 85360000.00 |
| Brass River (illustrative) | 600000.00 | 600000.00 | 48240000.00 |

The plan chooses a volume of each crude up to its availability. The cost column is that volume at the crude's price in dollars a barrel: the plan prints it, and you do not need to recompute it.

Read the volume and available columns side by side. Forcados runs 1100000.00 bbl of 1100000.00 bbl available, and Brass River 600000.00 of 600000.00. Bonny Light runs 329032.26 bbl against 1500000.00 bbl available. The plan's own list says the same thing: crudes at their availability, Forcados (illustrative) and Brass River (illustrative). Why the plan stops short on Bonny Light is a question for Module 3 and Module 4.

## The two totals

The plan prints both sides of the equality row:

total crude 2029032.26 bbl; crude unit throughput 2029032.26 bbl; the two agree to the barrel: true

And the unit table:

| unit | crude unit | throughput (bbl) | capacity (bbl) |
| --- | --- | --- | --- |
| Crude distillation | true | 2029032.26 | 2600000.00 |
| Naphtha reformer | false | 407677.42 | 420000.00 |
| Diesel hydrotreater | false | 650000.00 | 650000.00 |

The Crude distillation throughput, 2029032.26 bbl, is the crude run. It is not a separate decision. The other two units choose their throughputs from their feed streams. The crude unit's throughput is whatever crude the month buys.

## Across the five changes

SECTION 13 runs ABUA under five changes. The total crude column is the crude unit's throughput in every row, by the same equality:

| change | total crude (bbl) |
| --- | --- |
| the plan as typed | 2029032.26 |
| the diesel hydrotreater typed as shut for a turnaround (capacity 0) | 735294.12 |
| the diesel hydrotreater capacity left blank (no limit) | 2082608.70 |
| the crude unit at 1900000 barrels for the month | 1900000.00 |
| the Forcados cargo cancelled (availability typed 0) | 1747826.09 |
| a jet floor of 300000 and a fuel oil floor of 700000 | 2267857.14 |

Notice the fourth row. With the crude unit's capacity set at 1900000 barrels for the month, the total crude reads 1900000.00. The crude unit's capacity has become the crude run. That is the equality row at work: a limit on the unit is a limit on crude.

Notice the second row too. Nothing about crude changed. The hydrotreater was shut, and the crude run reads 735294.12 bbl. A downstream unit reaches back through the streams to the crude the month can use, and the crude unit runs exactly that.

## Why the plan prints both

If the two are one number, why print them twice? Because they come from two different places in the plan. The total crude is the sum of the plan's crude decisions, read from the crude table. The crude unit throughput is the unit table's reading of what the crude unit ran. The digest sets one beside the other and prints a flag, so that a reader never has to take the equality on trust. A planner who exports a plan to a spreadsheet should make the same check.

## The reading to carry

Crude run and crude unit throughput are one number printed twice. When they disagree, the configuration has no crude unit, and Lesson 1 showed what that looks like: throughput 0.00 beside a crude run of 2029032.26.

## Exercise

Read the three crude volumes, 329032.26, 1100000.00 and 600000.00 bbl, and the total crude, 2029032.26 bbl, beside the crude unit throughput, 2029032.26 bbl, and the flag printed with them. Say what the flag confirms. Then read the row for the crude unit at 1900000 barrels for the month and say what its total crude of 1900000.00 shows about the crude unit's capacity.
