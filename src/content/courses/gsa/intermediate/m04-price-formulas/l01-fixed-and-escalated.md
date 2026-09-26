# Fixed and escalated prices

{{panel:gsa-ledger-calculator}}

The ledger needs a contract price and a take-or-pay price for every year. This module computes them. A price formula turns a monthly index series, or none, into a price for every delivery month, and the year's prices are then read off those months. The two simplest formulas need no index at all.

## Fixed

A fixed price is one number for every month. The engine's `priceSeries` takes it as `{ type: "fixed", price }`. On the golden case with a stated price of 2.18, each of the three months priced returns 2.180000, the price stated. The power plant fixture works the same way: it holds the reported 2026 domestic base price flat in every year as a stated planning assumption.

## Escalated

An escalated price starts from a base price in a base month and steps up by a stated percentage on each anniversary. The engine takes `{ type: "escalated", basePrice, baseMonth, ratePctPerYear }` and computes P = basePrice x (1 + rate / 100) raised to the whole years since the base month. On the golden case, 2 from 2027-04 at 2.5 percent a year:

| months | price |
| --- | --- |
| 2027-04 to 2028-03 | 2.000000 |
| 2028-04 onward, to 2029-03 | 2.050000 |
| 2029-04 onward | 2.101250 |

The step lands on the anniversary and in no other month. A month before the base month has no whole year to count from, and the engine refuses it:

> from must be a month at or after formula.baseMonth 2027-04; got "2027-01"

## From months to a year

The Commonwealth model gas sales agreement (2025, Creative Commons Attribution 4.0, read 2026-09-26) prints alternatives for the price a year's take-or-pay is settled at, among them:

> "the arithmetic average of the Contract Price for each Month during such Contract Year." (Commonwealth model GSA (2025), Article 15.2.6, Alternative 1)

> "the Contract Price for the last Month of such Contract Year." (Commonwealth model GSA (2025), Article 15.2.6, Alternative 2)

The engine returns both for every calendar year it prices: the annual average price and the last month price. The contract states which one the ledger uses.

| year | annual average price | last month price |
| --- | --- | --- |
| 2027 | 2.000000 | 2.000000 |
| 2028 | 2.037500 | 2.050000 |
| 2029 | 2.075625 | 2.101250 |

In 2028 three months at 2.000000 and nine at 2.050000 average to 2.037500, while the last month reads 2.050000. The 2029 row averages the six months this case prices, to 2029-06. On a rising price, Alternative 2 gives the seller the higher figure; on a falling one, the buyer. Neither is the law: the contract chooses.

## Exercise

Work in the course's own ledger calculator, on the view "Contract prices month by month". It starts with the export feed price; you will replace its `formula` and timing.

1. Set `formula` to `{ "type": "escalated", "basePrice": 2, "baseMonth": "2027-04", "ratePctPerYear": 2.5 }`, `from` "2027-04", `to` "2029-06", `averagingMonths` 1, `lagMonths` 0, `resetMonths` 1, `rounding` "none", and delete `reopeners`. Check both tables above.
2. Change `from` to "2027-01" and read the refusal.
3. Set a fixed formula with a stated `price` of your own and read the annual rows. Say why the two alternatives agree.
4. For the escalated case, write which alternative a buyer would prefer for 2028 and why.
