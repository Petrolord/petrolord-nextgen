# Buyer shortfall and the reconciliation identity

{{panel:gsa-quantity-calculator}}

A buyer shortfall is the adjusted DCQ the buyer did not take. The engine's rule: buyer shortfall = adjusted DCQ - taken, when that is positive. On a day the buyer takes more than the adjusted DCQ, the excess is over-take. Neither is settled on the day. Both are carried to the year's end, where the take-or-pay reconciliation decides what the buyer owes.

## The power plant's January 2027

Across the 31 days of January 2027, the power plant's daily balance gives these totals, each a return value of the engine:

| January 2027 totals | value |
| --- | --- |
| ACQ for the days | 651000.000000 |
| maintenance | 10500.000000 |
| force majeure | 42000.000000 |
| seller shortfall | 6300.000000 |
| Adjusted ACQ for the days | 592200.000000 |
| taken | 567460.000000 |
| buyer shortfall | 31270.000000 |
| over-take | 6530.000000 |

The ACQ for the days is 31 days at the DCQ. Take off the maintenance, the force majeure and the seller shortfall and you have the Adjusted ACQ for the days, the gas the buyer could have been asked to take.

## The identity

Summing the days gives an identity that the engine states in its basis: the sum of buyer shortfall less the sum of over-take equals the Adjusted ACQ less taken. On January 2027 both sides are 24740.000000, and they are equal exactly.

| side | figures | result |
| --- | --- | --- |
| buyer shortfall less over-take | 31270.000000 less 6530.000000 | 24740.000000 |
| Adjusted ACQ less taken | 592200.000000 less 567460.000000 | 24740.000000 |

The identity is a check you can run on any daily balance. If the two sides disagree, a day has been entered wrongly. It also shows why over-take matters: a day of taking above the adjusted DCQ offsets a day of taking below it, and only the net gap over the period counts toward the buyer's position.

## Reading the buyer's month

The buyer's gaps in January 2027 come from three kinds of day. Small ones, such as 210.000000 on 2027-01-01, are ordinary variation. One is a zero nomination on 2027-01-05, which leaves the whole adjusted DCQ of 21000.000000 untaken. The largest single gap after that is the buyer-caused day, 2027-01-30, at 8400.000000. Over-take days, such as 2027-01-25 at 2100.000000, pull the other way.

## From a month to a contract year

The daily balance of a whole contract year sums the same way, and its Adjusted ACQ is the figure the take-or-pay quantity is a percentage of. The next module works that year.

## The days must be real and in order

The engine refuses an empty list, a date that is not a date and days out of order:

> days must be an array of at least 1 entry; got []

> days[0].date must be a date 'YYYY-MM-DD'; got "2027-3-1"

> days[1].date must be after the previous day 2027-03-02; got "2027-03-02"

## Exercise

Open the quantity calculator, the course's own calculator panel, and choose "The daily balance". Run the power plant's January 2027 and read the tiles for the total buyer shortfall, the total over-take, the Adjusted ACQ for the days and the total taken. Check that the identity closes. Then set `nominated`, `available` and `taken` on 2027-01-05 to 21000, run it, and check that the identity still closes with both sides changed by the same amount.
