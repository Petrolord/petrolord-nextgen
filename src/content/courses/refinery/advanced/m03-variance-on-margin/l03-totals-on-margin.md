# Totals on margin

Each ODIOMA line now carries a margin effect. This lesson reads the totals the engine builds from them, the headline it chooses, and the number it declines to show as a headline.

{{panel:refinery-variance-explorer}}

## Three totals

The engine prints three rows of totals over the eight matched lines, each split into the same four columns.

| total | volume variance | price variance | unexplained | total variance |
| --- | --- | --- | --- | --- |
| on margin (the headline) | -3949690.00 | -1290760.00 | -212000.00 | -5452450.00 |
| cost lines, as recorded | -20622400.00 | 1020050.00 | 212000.00 | -19390350.00 |
| revenue lines, as recorded | -24572090.00 | -270710.00 | 0.00 | -24842800.00 |

The headline is on margin, and the engine names its rule: "margin: a revenue gap counts as it is, a cost gap with its sign reversed". A revenue line's volume variance counts as it is. A cost line's volume variance counts with its sign reversed. The same holds for the price and unexplained columns, and for the total.

## Reading the headline

The month's variance on margin is -5452450.00. That is what the gaps, taken together, did to ODIOMA's margin over the matched lines. The split says where it came from:

- volume variance on margin: -3949690.00, the barrels that moved differently from the plan, priced at plan prices;
- price variance on margin: -1290760.00, the price per barrel differing from the plan on the barrels that moved;
- unexplained on margin: -212000.00, the money that moved with no barrels.

A volume problem sends the reader to supply and to the units. A price problem sends the reader to purchasing and to sales. An unexplained figure sends the reader to the invoices.

## The number with no meaning

Adding every line's total variance as recorded, cost and revenue together, gives -44233150.00. The margin total is -5452450.00. The engine prints the margin total as the headline.

The first figure adds money spent less to money received less, as if both were the same kind of change. They are not. Money spent less helps the margin and money received less hurts it. The -44233150.00 mixes the two and describes nothing a refinery can act on. That is the trap this tier is built on: a sum that looks like a variance and carries no meaning.

The two rows as recorded remain useful. The cost row reads -19390350.00 and says what happened to spending. The revenue row reads -24842800.00 and says what happened to sales. Only the margin row is a statement about the refinery.

## The headline leaves something out

The margin row is built from the eight matched lines. The lpg delivery of module 2 is unmatched and sits in no line, so it is in none of these three totals. dualLedgerTotals reads each whole ledger apart, with margin = revenue - cost: the plan's cost 80049000.00, revenue 84825300.00 and margin 4776300.00; the actual's cost 60658650.00, revenue 60423500.00 and margin -235150.00. Each reads the same margin as reconcilePeriod: true. The next lesson reads those ledger margins, which do count the lpg, and prints the gap.

## Why the engine signs before it adds

A positive gap on a delivery helps the margin and the same gap on a receipt hurts it. The engine signs each line before it adds, so a total is only ever a sum of figures that mean the same thing. That order is what lets a single figure, -5452450.00, stand as the month's answer.

## Exercise

Read the three rows of totals. For the margin row, say what each of its four figures tells a manager and where each one would send them. Then read the sum of every line's total variance as recorded, -44233150.00, beside the margin total, and say why the engine does not make the first its headline.
