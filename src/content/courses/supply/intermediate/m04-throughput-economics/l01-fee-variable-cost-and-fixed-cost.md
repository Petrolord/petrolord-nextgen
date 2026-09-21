# Fee, variable cost and fixed cost

A depot that stores and loads other companies' product earns a throughput fee on every cubic metre that passes through it. The engine's `throughputEconomics` turns that fee and the depot's costs into a margin for a period. This lesson reads the arithmetic and marks what the figure is and what it is never used for.

{{panel:supply-depot-explorer}}

## The inputs, and where they come from

Every money figure in this module is in US dollars, and every rate and cost is invented for this course. None is a published tariff, and none describes any real depot's charges. IBAFO's invented inputs for the period:

| input | IBAFO (invented) |
| --- | --- |
| throughput m3 | 2640.000 |
| fee USD/m3 | 7.80 |
| variable cost USD/m3 | 2.35 |
| fixed cost USD for the period | 9400.00 |

The throughput is the same 2640.000 m3 that the tank farm used as its daily liftings. Here it is the volume the period's fee is earned on.

## The arithmetic

The engine computes:

revenue = throughput x fee
margin = revenue - throughput x variable cost - fixed cost

For IBAFO:

| item | USD |
| --- | --- |
| revenue | 20592.00 |
| margin | 4988.00 |
| margin per m3 | 1.89 |

Money prints to two decimals of a dollar. The lab prints the margin per m3, 1.89 USD/m3, beside the margin and gives it no formula of its own, so quote it as printed and with its period.

## Three kinds of number

The fee is charged per cubic metre and scales with throughput. The variable cost is spent per cubic metre and scales the same way: power for the pumps, additive, the consumables of loading. The fixed cost is spent whatever passes: staff, insurance on the site, the maintenance calendar. The engine's formula keeps the three apart: margin = revenue - throughput x variable cost - fixed cost, and revenue = throughput x fee. The fee and the variable cost enter once for every cubic metre. The fixed cost enters once for the period, 9400.00 USD at IBAFO, whatever the throughput.

## A blank input

The money answer needs the throughput and the fee. A blank cost or loss is taken as zero, and the engine names it:

| what is blank | the engine answers |
| --- | --- |
| the throughput | REFUSED: Throughput and the throughput fee are both needed for the money answer. |
| the fee | REFUSED: Throughput and the throughput fee are both needed for the money answer. |
| the fixed cost | margin 14388.00 USD; assumedZero: fixed cost |
| nothing | margin 4988.00 USD; assumedZero: none |

With the fixed cost blank the margin reads 14388.00 USD, and assumedZero says which zero the engine assumed. A margin quoted from that row without its assumedZero line is a margin with the fixed cost silently left out.

## A period's margin

The margin is a period's margin. It is never a valuation of the depot. It does not discount anything, and it says nothing about whether building the depot was worth it. Those are questions for the Economics courses, which own discounting and investment appraisal. This course teaches no NPV or IRR, and a report should not stretch a throughput margin into one.

What the margin does say is whether the fee covers the costs for the period at the stated volume. At IBAFO it does, by 4988.00 USD.

## The other ledger

The same call computes a second ledger from the same volumes: the weight of the product lost in the period and the emissions that weight implies. The next two lessons read it, and the last lesson in the module puts the two ledgers side by side.

## Exercise

Read IBAFO's throughput, fee, variable cost and fixed cost, and say which are invented. Read the blank fixed cost row and say what assumedZero tells you. Then read the revenue, margin and margin per m3 and say which input enters the margin once for the period, and why the margin is a period's figure and never a valuation.
