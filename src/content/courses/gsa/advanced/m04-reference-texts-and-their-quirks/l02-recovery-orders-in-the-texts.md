# Recovery orders in the texts

{{panel:gsa-ledger-calculator}}

{{panel:gsa-contract-calculator}}

Make-up is gas already paid for. When the buyer takes gas in a later year, the contract has to say which gas is the year's own and which is make-up. That is the recovery order, and three texts describe it three ways. The engine computes all three and takes the order as a required contract input with no default.

## Three texts, three orders

The Commonwealth model agreement (2025, CC BY 4.0), Article 12.7.1, allows make-up only after the buyer has taken the Adjusted ACQ of the year. The engine calls that order `after-adjusted-acq` and names it the reference text's order.

ESMAP Report 152/93 (January 1993), para 6.59, counts make-up after the year's minimum-pay quantity:

> "Normally, make-up quantities are accounted for after the minimum-pay quantity for the year has been taken."

The engine's `after-top-quantity` computes that order, with the take-or-pay quantity as the minimum.

The HMRC Oil Taxation Manual, OT05435 (updated 19 December 2019), names two orders:

> "in priority over that period’s contract amount; or only when the minimum for that period has been taken."

The first of those is the engine's `first`: make-up taken in priority, before the year's own quantity.

## One contract under each order

The golden cases run the same three years under each order: a deficiency of 200.000000 in 2027, then 1100.000000 taken in 2028 against an Adjusted ACQ of 1000.000000 and a take-or-pay quantity of 800.000000.

| order | make-up taken in 2028 | counted in 2028 | deficiency in 2028 |
| --- | --- | --- | --- |
| after-adjusted-acq | 100.000000 | 1000.000000 | 0.000000 |
| after-top-quantity | 200.000000 | 900.000000 | 0.000000 |
| first | 200.000000 | 900.000000 | 0.000000 |

After the Adjusted ACQ, only the 100.000000 above it is make-up. After the take-or-pay quantity, everything above 800.000000 can be make-up, so the whole 200.000000 is recovered. Taken first, make-up comes off the top.

## When priority creates a deficiency

The order `first` has a consequence the others do not. In the golden case where the buyer takes only 800.000000 in 2028, make-up taken first consumes 200.000000 of it and leaves 600.000000 counted against the year's own take-or-pay quantity of 800.000000: a new deficiency of 200.000000, paid again. The engine's reason for that year states both steps.

## The Ekene agreements

The Ekene power plant (synthetic) takes make-up after the Adjusted ACQ; the Ekene export feed (synthetic) after the take-or-pay quantity. On the power plant in 2030 the buyer takes exactly the Adjusted ACQ, and the engine's reason reads:

> 2030: make-up aggregate 478800 available and none taken, because taken 7665000 does not exceed the Adjusted ACQ 7665000

Make-up begins strictly above the threshold, the engine's stated convention on the model's "at least".

## No default

A contract that states no order is refused, and so is an order the engine does not compute:

> makeUp.order must be one of "after-adjusted-acq", "after-top-quantity", "first"; got "fifo"

## Exercise

Open the ledger calculator on "The take-or-pay ledger". It starts on the Ekene power plant. Read make-up taken, make-up expired and the total net to the seller. Change makeUp.order to after-top-quantity, then to first, and read the same figures each time; state which years move and why the total make-up expired changes. Then enter fifo and read the refusal. The power plant's money rests on the fixture's held price, a stated planning assumption.
