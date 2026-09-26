# Power, commercial and gas distributors

{{panel:gsa-ledger-calculator}}

Three of the Act's sector prices hang directly on the domestic base price: the power sector's, the commercial sector's, and the ceiling on what gas distributors may agree. The engine's `domesticPrice` computes each from a stated domestic base price and prints the rule it applied beside the result.

## What the Act says

The Petroleum Industry Act 2021 (Official Gazette No. 142, Vol. 108, 27 August 2021, read 2026-09-26) sets the three in s.167:

> "The price of marketable natural gas applicable to the power sector shall be the domestic base price at the marketable natural gas delivery point." (PIA s.167(5))

> "The price of marketable natural gas applicable to the commercial sector shall be the domestic base price at the marketable natural gas delivery point plus US $0.50 per MMBtu." (PIA s.167(6))

> "the applicable price for gas distributors for the marketable natural gas at the marketable gas delivery point shall not exceed that of the commercial sector under subsection (6)." (PIA s.167(7))

So the power price is the domestic base price, the commercial price adds US$0.50 per MMBtu (s.167(6)), and a distributor negotiates a price the commercial price caps.

## The prices the engine returns

Each row states the domestic base price as reported for its year. None is graded.

| sector | domestic base price, as stated | negotiated | price | ceiling |
| --- | --- | --- | --- | --- |
| power | 2.180000 (reported 2026) | none | 2.180000 (reported 2026) | none |
| commercial | 2.180000 (reported 2026) | none | 2.680000 (reported 2026) | none |
| power | 2.130000 (reported 2025) | none | 2.130000 (reported 2025) | none |
| commercial | 2.130000 (reported 2025) | none | 2.630000 (reported 2025) | none |
| gas-distributor | 2.180000 (reported 2026) | 2.500000 | 2.500000 | 2.680000 (the stated commercial price) |
| gas-distributor | 2.180000 (reported 2026) | 2.900000 | 2.900000 | 2.680000 (the stated commercial price) |

## A distributor above the ceiling

The last row is a result with a reason, and no refusal. The engine returns the negotiated price and states that it breaks the ceiling. On the reported 2026 figure its reason reads, verbatim: "negotiated price 2.9 exceeds the commercial sector price 2.68, which s.167(7) sets as the ceiling for gas distributors"

A price exactly at the ceiling is within it. For a negotiated price equal to the commercial price on the reported 2026 figure, the engine's reason says the price "is at or below" the commercial sector price. The engine reports the breach and leaves the consequence to the parties and the regulator.

## What each sector must state

The sector is one of four words, and each needs its own inputs. The engine refuses a call that states the wrong ones:

> sector must be one of "power", "commercial", "gas-distributor", "gas-based-industry"; got "industrial"

> negotiatedPrice must be given only for sector 'gas-distributor'; got 2

> negotiatedPrice must be stated for a gas distributor, which negotiates its price (PIA s.167(7)); got nothing

A negotiated price makes sense only where the Act lets the parties negotiate, and a distributor's price cannot be computed without one.

## Exercise

Work in the course's own ledger calculator, on the view "Domestic gas prices".

1. Replace the inputs with a power sector call on the reported 2026 figure, `{ "sector": "power", "domesticBasePrice": 2.18 }` (reported, and stated here as an input). Read the price and the rule.
2. Change the sector to "gas-distributor" and read the refusal. Add a `negotiatedPrice` of 2.5 and read the price, the ceiling and the reason.
3. Raise the negotiated price to 2.9 and read the reason.
4. Change the sector to "industrial" and read the refusal.
