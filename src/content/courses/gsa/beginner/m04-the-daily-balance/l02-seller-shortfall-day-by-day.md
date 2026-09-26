# Seller shortfall, day by day

{{panel:gsa-quantity-calculator}}

A seller shortfall is gas the seller did not make available against a properly nominated quantity. It is the seller's failure, and it has two consequences in a gas sales agreement: it reduces what the buyer must take or pay for that year, and the contract may make the seller pay damages for it. This lesson computes it day by day.

## The model agreement's formula

The Commonwealth model agreement defines the Shortfall Quantity with a formula:

> "the Properly Nominated Quantity less the Delivery Tolerance Quantity and less the Daily Actual Quantity determined using the following formula: SFQ = (PNQ − DTQ ) − DAQ" (Commonwealth model GSA (2025), definition of Shortfall Quantity)

The engine's rule starts from the same place: seller shortfall = (PNQ - tolerance) - available, less the force majeure and maintenance stated for the day, and none on a buyer-caused day.

## Measured against the gas made available

The model formula subtracts the daily actual quantity. The engine measures against the quantity the seller made available, and states that choice in its own basis:

> "seller shortfall measured against the quantity the seller made available"

The difference shows on a day when gas was made available and not taken. In the golden case, 100.000000 was properly nominated and made available and the buyer took 60.000000. The seller shortfall is 0.000000 and the buyer shortfall 40.000000. Gas made available and not taken is the buyer's. This is one of four readings the engine states in its basis, and the Expert tier sets them side by side.

## The delivery tolerance

A contract may allow the seller a delivery tolerance, a quantity it may fall short by on any day without it counting. The two golden tolerance days show the edge:

| case | properly nominated | tolerance | available | seller shortfall (engine) |
| --- | --- | --- | --- | --- |
| tolerance covers the gap | 100.000000 | 5.000000 | 95.000000 | 0.000000 |
| one unit beyond it | 100.000000 | 5.000000 | 94.000000 | 1.000000 |

The engine's reason for the second, verbatim:

> 2027-03-01: the seller made 94 available against a properly nominated 100 less the tolerance 5: seller shortfall 1

## The power plant's seller shortfall

On 2027-01-20 the power plant's buyer properly nominated 22050.000000 and the seller made only 15750.000000 available. With no tolerance, force majeure or maintenance stated, the seller shortfall is 6300.000000:

> 2027-01-20: the seller made 15750 available against a properly nominated 22050: seller shortfall 6300

That day's adjusted DCQ drops to 14700.000000, because a seller shortfall is taken off the DCQ before the buyer's side is measured. The buyer took all 15750.000000 made available, so it has no buyer shortfall for the day, and the part above the adjusted DCQ is over-take.

## Why the seller shortfall reduces the buyer's obligation

A buyer cannot be made to pay for gas the seller did not offer. So each seller shortfall reduces the adjusted DCQ for the day, and over the year it reduces the Adjusted ACQ, on which the take-or-pay quantity rests. The take-or-pay module picks this up.

## Exercise

Open the quantity calculator, the course's own calculator panel, and choose "The daily balance". Run the power plant's January 2027 and read every column for 2027-01-20. Then replace the box with a `dcq` of 100, `maxDcqPct` 120, `deliveryTolerance` 5 and one day dated "2027-03-01" with `nominated` 100, `available` 95 and `taken` 95. Run it, then change `available` and `taken` to 94 and run it again. Finally set `available` to 100 and `taken` to 60, and read both shortfall columns.
