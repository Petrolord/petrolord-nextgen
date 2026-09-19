# The plan ledger

The actuals are read against a plan ledger. For ODIOMA that ledger is the month's plan, cascaded from the period start 2027-03-01 over 31 days with a cargo size of 350000.00 bbl, then summed by material and type. This lesson reads the configuration the plan is solved on and the ledger it becomes.

{{panel:refinery-variance-explorer}}

## The configuration

ODIOMA, Odioma Petroleum Refining Ltd, runs two crudes through a crude unit and a naphtha reformer and sells four products. The grade names are labels on invented yields and prices.

| crude | cost ($/bbl) | available (bbl) |
| --- | --- | --- |
| Escravos (illustrative) | 78.9000 | 700000.00 |
| Forcados (illustrative) | 76.8000 | 400000.00 |

| unit | capacity (bbl) | operating cost ($/bbl) | feed |
| --- | --- | --- | --- |
| Crude distillation | 1200000.00 | 1.4000 | (none: the crude unit) |
| Naphtha reformer | 190000.00 | 3.1000 | naphtha |

| product | price ($/bbl) | ceiling (bbl) |
| --- | --- | --- |
| Gasoline | 110.5000 | 200000.00 |
| Jet A-1 | 104.9000 | 160000.00 |
| Diesel | 100.6000 | 400000.00 |
| Fuel oil | 60.2000 | 500000.00 |

The crude distillation unit has no feed stream. It is the feedless unit, so it is the crude unit and carries every barrel of crude, the owner decision in force that the Professional tier taught.

The plan solves to a total crude of 1000000.00 bbl, a margin of 4776300.00 and a gross margin per barrel of 4.7763.

## The ledger

The scheduled events are summed by material and type. That is the grain the variance matches on.

| material | type | events | quantity (bbl) | value | value per bbl |
| --- | --- | --- | --- | --- | --- |
| escravos | receipt | 2 | 600000.00 | 47340000.00 | 78.9000 |
| forcados | receipt | 2 | 400000.00 | 30720000.00 | 76.8000 |
| cdu | unit_run | 5 | 1000000.00 | 1400000.00 | 1.4000 |
| reformer | unit_run | 5 | 190000.00 | 589000.00 | 3.1000 |
| gasoline | delivery | 5 | 163400.00 | 18055700.00 | 110.5000 |
| jet | delivery | 5 | 136000.00 | 14266400.00 | 104.9000 |
| diesel | delivery | 5 | 334000.00 | 33600400.00 | 100.6000 |
| fuel_oil | delivery | 5 | 314000.00 | 18902800.00 | 60.2000 |

## Reading it

Three things are worth checking in the rows.

First, the value per barrel on each line is the configuration's own figure: 78.9000 and 76.8000 for the crudes, 1.4000 and 3.1000 for the units, and each product's price. The plan ledger prices every movement at the price the plan was solved with. That plan unit value is the price the volume variance uses in module 2.

Second, the crude unit line reads 1000000.00 bbl, and the plan's total crude reads 1000000.00 bbl. Every barrel of crude runs through the crude unit. The reformer line reads 190000.00 bbl, and the reformer's capacity in the configuration reads 190000.00 bbl.

The crude lines are worth reading beside the availability. The plan receives 600000.00 bbl of Escravos, which has 700000.00 bbl available, and 400000.00 bbl of Forcados, which has 400000.00 bbl available. The quantities are the plan's choice for this configuration and these prices. When the month's record arrives, the crude lines are where the actual supply is compared with that choice, and module 2 shows that one of the two crudes did not arrive at all.

Third, the event counts show the schedule's shape. Each crude arrives in 2 cargo events, and each unit run and each product delivery is spread over 5 events across the month. The variance never reads those events one by one. It reads the sum on each line, so a cargo that lands a day late inside the month moves no line.

The Professional tier read the plan's margin and its schedule. This tier reads them as a ledger: eight lines, each a material and a type with a quantity and a value, waiting for the month's record to be laid beside them. Nothing in the ledger is recomputed when the actuals arrive; it is the fixed side of every comparison.

## Exercise

Read the plan's total crude and the crude unit line's quantity, and say what their agreement shows about the crude unit. Then read the reformer line's quantity beside the reformer's capacity in the configuration. Finally, read the value per barrel on the gasoline line and the gasoline price in the product table, and say which price the plan ledger holds every movement at.
