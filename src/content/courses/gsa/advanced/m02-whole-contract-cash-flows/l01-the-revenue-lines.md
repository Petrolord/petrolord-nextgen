# The revenue lines of a contract year

{{panel:gsa-contract-calculator}}

The Professional tier ran the take-or-pay ledger year by year and read its net to the seller. This module puts that ledger into money for the whole term with `gsaCashFlows`, which takes the contract, the royalty terms, a discount rate and a base year. Its first job is to split each year's money into lines, so a reader can see where every dollar comes from.

## Five lines and one total

Each year of `gsaCashFlows` carries five revenue lines, and the seller revenue is their sum:

* **regular**: the quantity counted against the year's own take-or-pay quantity, at the contract price;
* **make-up**: make-up gas taken, at the stated make-up price;
* **deficiency payment**: the deficiency paid, at the take-or-pay price;
* **shortfall damages**: seller shortfall at the stated shortfall price, entered as a negative line because the seller pays it to the buyer;
* **refund**: make-up the seller refunds at the end of the term, also negative.

The seller revenue of each year equals the net to the seller on the take-or-pay ledger. The cash flow view is the same ledger, laid out as money.

## Two agreements, two make-up prices

The Ekene power plant agreement (synthetic) prices its gas at the fixture's held 2.18 US$ per MMBtu, the reported 2026 domestic base price held flat as a stated planning assumption, and its make-up price is 0.000000: make-up gas was paid for in the deficiency year and costs nothing when taken. The Ekene export feed agreement (synthetic) takes make-up at 10 percent of each year's contract price. So the make-up line is always zero on the power plant and positive on the export feed in a year with make-up.

| agreement and year | regular | make-up | deficiency payment | shortfall damages | refund | seller revenue |
| --- | --- | --- | --- | --- | --- | --- |
| power plant 2027 | 15794100.000000 | 0.000000 | 0.000000 | -7875.000000 | 0.000000 | 15786225.000000 |
| power plant 2028 | 11902800.000000 | 0.000000 | 1501584.000000 | 0.000000 | 0.000000 | 13404384.000000 |
| export feed 2029 | 139839071.650000 | 0.000000 | 31575852.662500 | 0.000000 | 0.000000 | 171414924.312500 |
| export feed 2030 | 208234123.650000 | 1941133.985000 | 0.000000 | 0.000000 | 0.000000 | 210175257.635000 |
| export feed 2036 | 167704753.860000 | 559064.334000 | 0.000000 | 0.000000 | -3700831.335000 | 164562986.859000 |

Every power plant figure rests on the fixture's held price, a stated planning assumption; change the price and every line moves with it.

## Seller revenue and delivered value

`gsaCashFlows` also returns the delivered value of each year: the quantity taken at the contract price. It is the base the gas royalty is charged on, which the next lesson reads. Delivered value and seller revenue part company whenever the year carries anything besides regular gas. On the export feed in 2029 the delivered value is 139839071.650000 while the seller revenue, with the deficiency payment, is 171414924.312500. In 2030 the delivered value is 227645463.500000, above the seller revenue of 210175257.635000, because make-up gas counts at its full contract price in the delivered value and at 10 percent of it in the make-up line.

## Where this sits

The cash flow course teaches the cash flow ledger and discounting as subjects in their own right; this module uses them for one purpose, the money a gas sales agreement produces.

## Exercise

Open the contract calculator on "The whole contract in money". It starts on the Ekene export feed. For 2029, 2030 and 2036 add the five lines and confirm each seller revenue. Then read each year's delivered value, and for every year where it differs from the regular line, name the line or the take that makes the difference. Finally set the make-up price of 2030 to 0 and state which lines of that year move.
