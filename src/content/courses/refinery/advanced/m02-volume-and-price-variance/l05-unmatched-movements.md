# Unmatched movements

The ODIOMA actual ledger has nine rows and the plan ledger eight. One actual movement found no plan line to meet. This lesson reads what the engine does with a movement in one ledger only, and why it will not force it into a variance line.

{{panel:refinery-variance-explorer}}

## The row

| material | type | present in | quantity (bbl) | value |
| --- | --- | --- | --- | --- |
| lpg | delivery | actual | 9000.00 | 441000.00 |

The plan sells gasoline, jet, diesel and fuel oil. The month also sold 9000.00 bbl of lpg for 441000.00. No plan line has lpg as its material and delivery as its type, so the match on material and type finds nothing.

## Listed, and folded into nothing

Movements in one ledger and not the other are listed as unmatched and folded into no variance line. The engine shows the row with the ledger it came from, its quantity and its value. It does not add it to another delivery line, and it does not put it into a volume, price or unexplained figure.

The reason sits in the formulas. A volume variance needs a plan unit value to price the barrel gap. A price variance needs a plan unit value to compare against. An lpg delivery has no plan line, so it has no plan unit value, and neither term can be formed. Any figure the engine produced for it would rest on a price nobody planned.

The same holds in the other direction. A movement in the plan that the month never recorded at all would be listed as unmatched with its plan ledger marked. In ODIOMA every plan line found an actual line, including Forcados, whose actual line records 0.00 bbl and a bill.

## Unmatched does not mean ignored

The row is outside the variance lines, and it is inside the ledger. That distinction comes back in module 3. The engine reads the margin of each ledger over every movement, and the actual ledger's margin counts the lpg sale. The variance lines count only the matched movements. So the ledger's margin variance and the lines' margin total differ. The engine prints the margin variance less the margin total of the matched lines as 441000.00, and it prints the unmatched movements, deliveries counted as revenue and the rest as cost, as 441000.00.

A reader who sees that gap should find its cause in this list. A reader who sees an unmatched list should expect it in the gap.

## What an unmatched row asks

An unmatched delivery raises commercial questions. Was lpg a product the plan should have carried? Was it recovered from a stream the plan left in fuel? Was it sold from stock that belongs to another period? The engine cannot answer, and the plan's configuration offers no lpg product to compare it with. The row is there so the planner can take the question into the next month's plan.

An unmatched receipt or unit run would raise the same question on the cost side: what was bought or run that the plan never intended?

## Exercise

Read the unmatched row's material, type, ledger, quantity and value. Say why the engine cannot compute a volume variance or a price variance for it. Then say which ledger margin counts it and which total leaves it out, and read the figure the engine prints for the gap between those two totals.
