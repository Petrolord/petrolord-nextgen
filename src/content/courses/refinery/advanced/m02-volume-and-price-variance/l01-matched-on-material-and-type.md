# Matched on material and type

The ODIOMA plan ledger has eight lines. The month's actual ledger has nine. This lesson reads what the month recorded and how attributeVariance lays the two ledgers side by side.

{{panel:refinery-variance-explorer}}

## What the month did

The actual ledger holds one aggregated movement for each material and type. A delivery's value is what it sold for. Every other event's value is what it cost.

| material | type | quantity (bbl) | value |
| --- | --- | --- | --- |
| escravos | receipt | 735000.00 | 58947000.00 |
| forcados | receipt | 0.00 | 212000.00 |
| cdu | unit_run | 735000.00 | 1080450.00 |
| reformer | unit_run | 131000.00 | 419200.00 |
| gasoline | delivery | 112660.00 | 12628000.00 |
| jet | delivery | 101200.00 | 10534900.00 |
| diesel | delivery | 244000.00 | 24009600.00 |
| fuel_oil | delivery | 210000.00 | 12810000.00 |
| lpg | delivery | 9000.00 | 441000.00 |

Escravos (illustrative) and Forcados (illustrative) remain labels on invented figures.

## The match key

attributeVariance matches the two ledgers on material and type. A plan line and an actual line are the same line only when both the material and the type agree. The escravos receipt in the plan meets the escravos receipt in the actuals. The cdu unit_run meets the cdu unit_run.

Both halves of the key matter. Material alone would not do: a site can receive a material and also deliver it, and a receipt of a material and a delivery of the same material are different movements with opposite directions. Type alone would not do either: every product is a delivery, and four products share that type. The pair names one kind of movement exactly once, and a reader can say of every line which material moved and in which direction.

## Eight matched lines and one unmatched

Eight of the actual rows find a plan line: the two crude receipts, the two unit runs and the four product deliveries. Each of those eight becomes a variance line with a plan quantity, an actual quantity, a plan value and an actual value.

The ninth actual row, an lpg delivery of 9000.00 bbl with a value of 441000.00, has no plan line. The plan sells four products and lpg is not one of them. Movements in one ledger and not the other are listed as unmatched and folded into no variance line. Lesson 5 of this module reads that row.

## Direction on each line

Every matched line also carries a direction. A delivery line is revenue. A receipt line and a unit_run line are cost. The direction comes from the event type, exactly as the sign of an event did in module 1, and it is fixed before any variance is computed. Module 3 uses it to put every gap on the same footing, so that a cost line and a revenue line can be read together.

## What a line holds

For the escravos receipt the line holds a plan quantity of 600000.00 bbl, an actual quantity of 735000.00 bbl, a plan value of 47340000.00 and an actual value of 58947000.00. The next three lessons split the gap between those values into its parts: a volume variance, a price variance and an unexplained term.

## Exercise

Read the actual ledger and the plan ledger of module 1. List the eight material and type pairs that appear in both, and name the one row that appears in only one ledger and which ledger that is. Then say why matching on material alone would be unsafe for a site that both receives and delivers the same material.
