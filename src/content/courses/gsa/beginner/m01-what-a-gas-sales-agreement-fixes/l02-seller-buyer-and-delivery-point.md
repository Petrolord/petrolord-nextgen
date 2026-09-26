# The seller, the buyer and the delivery point

{{panel:gsa-quantity-calculator}}

A gas sales agreement has two parties and one place where gas changes hands. The seller produces or aggregates the gas and makes it available at the delivery point. The buyer nominates how much it wants each day, takes gas at that point and pays for it. Everything the contract measures is measured at the delivery point, and every remedy in it turns on which side of that point a gap arose.

## What the seller owes

The seller's duty is to make gas available against what the buyer properly nominates. A nomination is properly nominated up to the maximum daily quantity (MaxDCQ) the contract allows; anything above it is a request the seller may decline. When the seller does not make available the properly nominated quantity, the gap is a seller shortfall. The model agreement opens its definition with exactly that day:

> "means for any Day in the Delivery Period, during which Seller did not make available the Properly Nominated Quantity," (Commonwealth model GSA (2025), definition of Shortfall Quantity)

A contract can excuse part of a gap. Force majeure and scheduled maintenance quantities stated for the day are subtracted before any seller shortfall is counted, and a contract may grant a delivery tolerance.

## What the buyer owes

The buyer's duty is to take, or pay for, a stated share of the gas the contract makes available over a year. Day by day, the gas the buyer could have taken and did not is a buyer shortfall. Over a contract year these gaps are reconciled against the take-or-pay quantity, and any quantity below it is a deficiency that the buyer pays for.

This course always names the side. A "shortfall" on its own is ambiguous, so every lesson says seller shortfall or buyer shortfall.

| side | its gap | measured against |
| --- | --- | --- |
| seller | seller shortfall | the properly nominated quantity, less tolerance, force majeure and maintenance |
| buyer | buyer shortfall | the adjusted DCQ of the day |

## When the gap is caused on the buyer's side

Sometimes gas is not made available because of something at the buyer's end: a closed valve at the plant, or a receiving facility that cannot accept flow. The engine takes a `buyerCaused` flag for such a day and prints a reason of its own:

> 2027-01-30: 8400 of the properly nominated quantity was not made available for a cause on the buyer's side, so it is not a seller shortfall

The quantity lands in the buyer's column for that day.

## Where Nigerian law touches the delivery point

The Petroleum Industry Act 2021 prices domestic gas at the delivery point and makes the buyer pay the transport beyond it. Those sector prices belong to the Professional tier. At this tier the delivery point is simply where quantity is counted.

## Exercise

Open the quantity calculator, the course's own calculator panel, and choose "The daily balance". The box holds the Ekene power plant's January 2027. Run it and find two rows: 2027-01-20 and 2027-01-30. On each, read the properly nominated quantity, the gas made available and the gas taken, then read the seller shortfall and buyer shortfall columns. Write one sentence for each day saying which side the gap belongs to and why, and check it against the reasons the panel prints below the table.
