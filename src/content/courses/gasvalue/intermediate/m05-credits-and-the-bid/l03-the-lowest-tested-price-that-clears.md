# The lowest tested price that clears

The breakeven is one price. creditSensitivity also tests the prices the study types, one by one, and reports the lowest of them that clears. A third price sits beside them in the table, and it is neither.

{{panel:gasvalue-route-explorer}}

## The prices, in the order typed

EGBEMA's CNG route against the diesel counterfactual, with a hurdle of 24500000 and a gross margin of 21008150.00. The study typed four credit prices, in this order: 40, 8, 20, 12.

| credit price (input, in the order typed) | creditRevenuePerYear | totalMarginPerYear | clearsHurdle |
| --- | --- | --- | --- |
| 40 | 8721314.60 | 29729464.60 | true |
| 8 | 1744262.92 | 22752412.92 | false |
| 20 | 4360657.30 | 25368807.30 | true |
| 12 | 2616394.38 | 23624544.38 | false |

Each row prints the credit revenue a year at that price, the total margin a year, and whether the total clears the hurdle. The dollar figures print to two decimals. Two prices clear: 40 and 20. Two do not: 8 and 12.

## Three prices on one case

| field | value |
| --- | --- |
| breakevenCreditPrice ((hurdle minus margin) over net tonnes) | 16.0152 |
| lowestTestedClearingPrice | 20 |
| the first price in the order typed that clears | 40 |

The breakeven is the price at which the route just clears its hurdle, in closed form; the lowest tested price that clears is reported beside it; the first price in the order typed that clears is a third figure again, and it is neither.

**lowestTestedClearingPrice, 20.** Of the prices the study typed, 40 and 20 clear. The lower of the two is 20. It is a price from the study's own list.

**The first price in the order typed that clears, 40.** Read the table from the top: 40 is the first row, and it clears. That is the figure a reader gets by stopping at the first true. It depends on the order the prices were typed in. lowestTestedClearingPrice is the engine's field. The first price in the order typed that clears is printed beside it under a plain label, with no field name.

**breakevenCreditPrice, 16.0152.** The closed form. It is none of the four typed prices.

## The trap in the order

This tier's trap includes the first clearing price in the order typed: it gives a figure that looks finished. Here it reads 40. The engine's field reads 20, and the breakeven reads 16.0152. Three figures sit on one case, and two of them carry field names: lowestTestedClearingPrice and breakevenCreditPrice.

Read the two fields together. The lowest tested price that clears is chosen from the prices the study tested. The breakeven is (hurdle minus margin) over net tonnes, and its formula carries no typed price.

## Reading the false rows

The prices 8 and 12 each print clearsHurdle false. Their total margins print 22752412.92 and 23624544.38, beside a hurdle of 24500000. The prices 40 and 20 print true, with total margins of 29729464.60 and 25368807.30.

In the panel, type the credit prices in another order and read lowestTestedClearingPrice. Then add a price of your own to the list and read the field again, with the breakeven beside it.

## Exercise

Read the credit price table. Name the prices that clear and the prices that do not, with the total margin each prints. Give the lowest tested price that clears, the first price in the order typed that clears, and the breakeven. Then quote the sentence that says how the third figure relates to the other two.
