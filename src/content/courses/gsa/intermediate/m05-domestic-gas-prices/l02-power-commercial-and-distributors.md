# Power, commercial and gas distributors

{{panel:gsa-ledger-calculator}}

Three of the Act's sector prices hang on the domestic base price: the power sector's, the commercial sector's, and the ceiling on what gas distributors may agree. The engine's `domesticPrice` computes each and prints the rule it applied.

## What the Act says

The Petroleum Industry Act 2021 (Official Gazette No. 142, Vol. 108, 27 August 2021, read 2026-09-26) sets the three in s.167:

> "The price of marketable natural gas applicable to the power sector shall be the domestic base price at the marketable natural gas delivery point." (PIA s.167(5))

> "The price of marketable natural gas applicable to the commercial sector shall be the domestic base price at the marketable natural gas delivery point plus US $0.50 per MMBtu." (PIA s.167(6))

> "the applicable price for gas distributors for the marketable natural gas at the marketable gas delivery point shall not exceed that of the commercial sector under subsection (6)." (PIA s.167(7))

So the power price is the domestic base price, the commercial price adds US$0.50 per MMBtu, and a distributor negotiates a price the commercial price caps.

## The prices the engine returns

Each row states the domestic base price as reported for its year. None is graded.

| sector | domestic base price, as stated | stated (negotiated) figure | price | ceiling | held at |
| --- | --- | --- | --- | --- | --- |
| power | 2.180000 (reported 2026) | none | 2.180000 (reported 2026) | none | none |
| commercial | 2.180000 (reported 2026) | none | 2.680000 (reported 2026) | none | none |
| power | 2.130000 (reported 2025) | none | 2.130000 (reported 2025) | none | none |
| commercial | 2.130000 (reported 2025) | none | 2.630000 (reported 2025) | none | none |
| gas-distributor | 2.180000 (reported 2026) | 2.500000 | 2.500000 | 2.680000 (the stated commercial price) | none |
| gas-distributor | 2.180000 (reported 2026) | 2.900000 | 2.680000 (held) | 2.680000 (the stated commercial price) | ceiling |

Every row states `priceControlApplies` true, a stated input with no default.

## A distributor above the ceiling

The last row is a result, and no refusal. A figure above the commercial price is not a lawful distributor price under s.167(7) while price control applies, so the engine holds the price at the ceiling and returns the stated figure beside it as `statedPrice`, with `withinCeiling` false and `heldAt` ceiling. On the reported 2026 figure its reason reads, verbatim: "the negotiated price 2.9 exceeds the commercial sector price 2.68, so the price is held at 2.68 (s.167(7))"

A price exactly at the ceiling is within it: on the reported 2026 figure the reason says it "is at or below the commercial sector price 2.68". The gas based industries ceiling of s.168(3) is held the same way.

Where the free-market criteria of s.167(3)(b) are met, s.167(4) to (7) and s.168 cease to apply: stated with `priceControlApplies` false, the negotiated price stands with no ceiling or floor.

## What each sector must state

The sector is one of four words, and each needs its own inputs. The engine refuses a call that states the wrong ones:

> sector must be one of "power", "commercial", "gas-distributor", "gas-based-industry"; got "industrial"

> negotiatedPrice must be given only for sector 'gas-distributor' while priceControlApplies is true; got 2

> negotiatedPrice must be stated for a gas distributor, which negotiates its price (PIA s.167(7)); got nothing

## Exercise

Work in the course's own ledger calculator, on the view "Domestic gas prices".

1. Replace the inputs with a power sector call on the reported 2026 figure, `{ "sector": "power", "priceControlApplies": true, "domesticBasePrice": 2.18 }` (reported, and stated here as an input). Read the price and the rule.
2. Change the sector to "gas-distributor" and read the refusal. Add a `negotiatedPrice` of 2.5 and read the price, the ceiling and the reason.
3. Raise the negotiated price to 2.9 and read the stated figure, the within-the-ceiling flag, the held-at tile, the price and the reason. Then choose "no" for price control and read them again.
4. Change the sector to "industrial" and read the refusal.
