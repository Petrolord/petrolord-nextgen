# The excuses, in their order

{{panel:gsa-ledger-calculator}}

A lessee that delivers less than its obligation is not always at fault. The Act lists four causes that excuse the failure, and a quantity excused carries no penalty. This lesson reads the four, the order the engine applies them in, and the limit on how much they can excuse.

## What the texts say

The Petroleum Industry Act 2021 (Official Gazette No. 142, Vol. 108, 27 August 2021, read 2026-09-26):

> "A lessee shall not incur a penalty prescribed under subsection (8), where it can establish that its failure to comply is as a result of" (PIA s.110(10))

The first cause, (a), is force majeure. The other three:

> "(b) the inability of a purchaser to accept allocated natural gas volumes ; (c) the inability to transport the allocated natural gas for reasons beyond the control of the lessee ; or" (PIA s.110(10)(b) and (c))

> "(d) the failure of a purchaser to pay for allocated natural gas volumes." (PIA s.110(10)(d))

The Domestic Gas Delivery Obligation Regulations 2022 (S.I. No. 74 of 2022, read 2026-09-26) keep the four when they set the penalty:

> "Except as provided under section 110(10) of the Act, a lessee" (DGDO Regulations 2022 r.6(1))

## In order, up to the undelivered quantity

The engine takes `excused` with four keys, one per cause: `forceMajeure`, `purchaserCannotAccept`, `transportUnavailable` and `purchaserNonPayment`. Any other key is refused:

> excused.pipelineOutage is not an accepted key; the accepted keys of excused are forceMajeure, purchaserCannotAccept, transportUnavailable, purchaserNonPayment

It applies them in the Act's order, (a) to (d), each only up to the undelivered quantity still left. Two golden cases show the rule:

| case | undelivered | excuses stated | excused applied | penalised |
| --- | --- | --- | --- | --- |
| excuses in order | 500.000000 | 150.000000 (a), 50.000000 (b), 25.000000 (c), 100.000000 (d) | 325.000000 | 175.000000 |
| all excused | 400.000000 | 250.000000 (a), 300.000000 (c) | 400.000000 | 0.000000 |

In the first, the case states the four in a different order and the engine applies them (a) to (d) regardless; they total less than the undelivered quantity, so 175.000000 is left for the penalty. In the second, force majeure takes 250.000000 and transport then covers only the 150.000000 left:

> 150 is excused: the allocated gas could not be transported for reasons beyond the lessee's control (s.110(10)(c))

> the whole undelivered quantity is excused; no penalty

## The power plant in 2028

The power plant fixture (synthetic) states that the 2028 plant outage is the purchaser's inability to accept, s.110(10)(b), for 688800.000000 MMBtu. That is the same 688800.000000 the plant failed to take under its gas sales agreement that year, which the ledger turned into a deficiency and a make-up entry. On the obligation side it is an excuse:

> 688800 is excused: the purchaser could not accept the allocated volumes (s.110(10)(b))

Of the 1365000.000000 undelivered, 676200.000000 is left to penalise.

## What the engine does not compute

Its basis says so, verbatim: "the 90-day investigation rule of r.6(3) and the compensation to customer-clients of s.110(13) are not computed." The excuses are applied as the case states them; whether the Commission accepts each is outside the engine.

## Exercise

Work in the course's own ledger calculator, on the view "The Domestic Gas Delivery Obligation", which starts with the power plant's 2028 obligation.

1. Read the excused, penalised and "excuses applied" tiles and the reasons.
2. Add a `forceMajeure` excuse larger than the undelivered quantity and write what the engine applies and in what order.
3. Rename `purchaserCannotAccept` to `pipelineOutage` and read the refusal.
