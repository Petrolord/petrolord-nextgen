# Ordering cost and holding cost

{{panel:materials-register-calculator}}

Every item that is bought in lots poses the same question: how many at a time? Order often in small lots and the paperwork, freight bookings and receiving pile up. Order rarely in big lots and the store fills with stock that ties up money and space. The economic order quantity balances those two costs. This lesson sets out each of them on the Ekene baryte.

## Three stated figures

The engine needs three: A, the cost of placing one order; D, the annual demand; and h, the cost of holding one unit for a year. For baryte the register states a demand of 300 tonnes a year and an order cost of 1800. It states the holding cost as a rate, 0.22 a year on a unit cost of 260, so h is 0.22 times 260, which the engine reports as 57.200000 a tonne a year. The register's note on the order cost, verbatim:

> order cost covers the purchase order, the marine freight booking and receiving at the Ekene shore base

## Ordering cost a year

If you order Q units at a time, you place D over Q orders a year, and each costs A. The ordering cost a year is A D / Q. Baryte ordered 140 tonnes at a time needs 2.142857 orders a year, one every 0.466667 years, and the ordering cost is 3857.142857 a year. Double the lot and the ordering cost halves.

## Holding cost a year

Stock arrives a lot at a time and runs down steadily to nothing before the next lot lands, so on average half a lot sits on the shelf. The holding cost a year is h Q / 2. Baryte ordered 140 at a time costs 4004.000000 a year to hold. Double the lot and the holding cost doubles.

| figure | baryte ordered 140 at a time |
| --- | --- |
| holding cost of a unit for a year | 57.200000 |
| orders a year | 2.142857 |
| cycle, years | 0.466667 |
| ordering cost a year | 3857.142857 |
| holding cost a year | 4004.000000 |
| purchase cost a year | 78000.000000 |

## What stays out

The purchase cost, demand times unit cost, is 78000.000000 a year for baryte. It is paid whatever the lot size, so it moves no order quantity, and the engine reports it separately from the ordering and holding costs. It matters again only when the price depends on the lot, which the Professional tier takes up with quantity discounts.

## Figures that cannot work

A demand of 0 gives no reason to order, and an order cost below 0 has no meaning. Both are refused by name:

> annualDemand must be a finite number above 0; got 0

> orderCost must be a finite number above 0; got -5

## Exercise

Open the register calculator, set the View to "The economic order quantity" and start from "Baryte on the Ekene register". Check the holding cost of a unit for a year against 0.22 times 260. Then halve the Cost of an order control and note the ordering cost, holding cost and quantity ordered; then set it to double the stated figure and note them again. Say which way each cost moved and why. Last, set the Annual demand control to 0 and copy the refusal.
