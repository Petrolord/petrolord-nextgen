# Transport and the delivery point

{{panel:gsa-ledger-calculator}}

Every sector price in the Act is a price at one place: the marketable natural gas delivery point. Gas still has to travel from there to the buyer's plant, and the Act says who pays for that leg. This lesson places the price on the map and adds the transport the engine reports beside it.

## What the Act says

The Petroleum Industry Act 2021 (Official Gazette No. 142, Vol. 108, 27 August 2021, read 2026-09-26) writes the delivery point into every sector price of s.167, and puts the transport cost on the buyers:

> "shall pay for the transportation cost of the marketable natural gas from the marketable natural gas delivery point to the facilities of the wholesale customers." (PIA s.167(8))

For the gas based industries, s.168(4) says the Fourth Schedule prices are prices at the delivery point and that transport is added for delivery, and s.168(5) lets the Authority add industries:

> "be added for delivery to the respective gas based industries. (5) The Authority may by regulation adjust the price mechanism to add other gas based industries in line with market realities." (PIA s.168(4) and (5))

## Where the engine prices

Every `domesticPrice` result states its point in the basis. For a call with no tariff it reads, verbatim: "prices at the marketable natural gas delivery point". The price is the Act's price at that point and nothing more.

A call may state a `transportTariff` in US$ per MMBtu. The engine then keeps the sector price as it was and returns a delivered price beside it, and the basis says so:

> prices at the marketable natural gas delivery point; the stated transport tariff is added for the delivered price (s.167(8), s.168(4))

| sector | domestic base price, as stated | price at the delivery point | delivered price |
| --- | --- | --- | --- |
| power | 2.180000 (reported 2026) | 2.180000 (reported 2026) | 2.980000 (with the stated tariff) |

The delivered price is the tariff the case states added to the price at the delivery point. The tariff is a stated input: the Act says who pays, and the pipeline's tariff says how much.

## Why the point matters in a contract

A gas sales agreement names its delivery point, as the Associate tier showed, and the price, the quantities and the risk of loss all attach to it. When a domestic contract quotes a sector price, the question to ask is which point the price stands at. A buyer comparing a delivered price with a sector price at the delivery point is comparing two different things, and the difference is the transport the Act puts on the buyer.

## Exercise

Work in the course's own ledger calculator, on the view "Domestic gas prices".

1. Replace the inputs with a power sector call on the reported 2026 figure, stated as an input: `{ "sector": "power", "priceControlApplies": true, "domesticBasePrice": 2.18 }`. Read the price, the delivered price tile and the basis.
2. Add a `transportTariff` of your own and read the delivered price and the basis again. Check the difference.
3. Change the sector to "commercial" with the same tariff. Write the price at the delivery point and the delivered price.
4. In one sentence, say what the delivered price tile shows when no tariff is stated, and why.
