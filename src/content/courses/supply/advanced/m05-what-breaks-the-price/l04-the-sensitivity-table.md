# The sensitivity table

A sensitivity table is easy to over-read. This lesson reads the BADAGRY exchange rate table as a whole: its columns, what it holds fixed, what it adds beside the breakeven, and what it cannot say.

{{panel:supply-price-explorer}}

## The table, once more

Every rate behind it is invented for this course, including the cap of 1150.0000 naira a litre and every exchange rate in the first column.

| naira to the dollar | pump price naira/L | shortfall naira/L | cap covers |
| --- | --- | --- | --- |
| 1200.0000 | 876.2757 | -273.7243 | true |
| 1350.0000 | 969.2294 | -180.7706 | true |
| 1500.0000 | 1062.1833 | -87.8167 | true |
| 1650.0000 | 1155.1370 | 5.1370 | false |
| 1800.0000 | 1248.0908 | 98.0908 | false |
| 1950.0000 | 1341.0445 | 191.0445 | false |
| 2100.0000 | 1433.9982 | 283.9982 | false |

breakeven: found true, at 1641.7105 naira to the dollar, after 18 bisection steps.

The breakeven was searched over the bracket from the lowest to the highest value swept, 1200.0000 to 2100.0000 naira to the dollar.

## Column by column

The first column is the driver, the one input the table moves. The second is the pump price the engine builds at that value, a full re-pricing of the chain from the dollar landed cost to the nozzle. The third is the shortfall against the invented cap, the price less the cap, negative where the cap is above the price. The fourth is the verdict.

On every row of the table the verdict follows the sign of the shortfall. The verdict is what a decision reads. The shortfall is what an argument reads, because it says how many naira a litre separate the chain from the cap at that rate. At 1650.0000 naira to the dollar the shortfall is 5.1370 naira a litre. At 2100.0000 it is 283.9982.

## What the table holds fixed

The table moves one input. Every other input is held at its BADAGRY value: the FOB price, the ocean loss, every invented import rate, every invented margin, the invented levies and the invented value added tax. Held inputs are not held amounts. The table prints the chain at each rate, element by element:

| naira to the dollar | landed naira/L | Government naira/L | pump price naira/L |
| --- | --- | --- | --- |
| 1200.0000 | 698.2441 | 63.0816 | 876.2757 |
| 1650.0000 | 960.0857 | 80.1013 | 1155.1370 |
| 2100.0000 | 1221.9272 | 97.1210 | 1433.9982 |

The landed cost and the Government share both move with the rate, because the tax is levied on a running total that holds the landed cost. A table like this answers one question, which is what the exchange rate alone does to the price. It says nothing about what a change in freight, duty or dealer margin does, and nothing about two inputs moving together.

This tier runs another single-driver sweep on the same cargo, the ocean loss in the third module. It holds the landed total fixed and moves the cost of a litre sold. The two sweeps are separate tables. Neither says what happens when the ocean loss and the exchange rate move at once.

## What it adds beside the breakeven

The breakeven is one figure, 1641.7105 naira to the dollar. The table puts it in context. It shows the verdicts on either side and the size of the shortfall at the rows around it. The breakeven alone says nothing about how far the chain is from the cap at the rates either side of it.

## What it cannot say

The table assigns no likelihood to any row. It does not say which exchange rate is expected, how probable a move to 1800.0000 is, or what the chain is worth. It is a set of re-pricings at stated values, and it is read row by row. A valuation of the chain, or a probability over the exchange rate, is outside this course.

## Exercise

Record the shortfall at 1500.0000, at 1650.0000 and at 2100.0000 naira to the dollar, and the breakeven exchange rate. Say what the shortfall column, read against the verdict column, shows about why a report on a capped price should carry both the breakeven and the table around it.
