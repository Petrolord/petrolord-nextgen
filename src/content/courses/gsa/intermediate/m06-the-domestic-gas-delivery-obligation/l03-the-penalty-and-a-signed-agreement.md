# The penalty and a signed agreement

{{panel:gsa-ledger-calculator}}

What is left after deemed fulfilment and the excuses is penalised. The Act fixes a rate, lets a signed agreement set its own and lets the Commission adjust it, and the Regulations put a floor under the agreement's rate.

## What the texts say

The Petroleum Industry Act 2021 (Official Gazette No. 142, Vol. 108, 27 August 2021, read 2026-09-26):

> "a lessee who fails to comply with the domestic gas delivery obligation shall incur a penalty of US $3.50 per MMBtu not delivered," (PIA s.110(8))

> "where the lessee has signed a gas purchase and sale agreement with a wholesale supplier of the strategic sectors, the penalty for failure to deliver shall be as stated in that agreement." (PIA s.110(8))

> "The penalty amount of US $3.50 per MMBtu referred to under subsection (8) may be adjusted as the Commission may prescribe in a regulation made under this Act." (PIA s.110(9))

The Domestic Gas Delivery Obligation Regulations 2022 (S.I. No. 74 of 2022, read 2026-09-26) repeat the rate in r.6(1), US$3.50 per MMBtu, and bound the agreement's:

> "the penalty payable to the Commission for failure to deliver such gas shall not be less than the amount specified in subregulation (1) of this regulation." (DGDO Regulations 2022 r.6(2))

## The rates the engine applies

With no rate stated, the engine applies US$3.50 per MMBtu (PIA s.110(8); r.6(1)). A signed agreement's rate is `agreementPenaltyRate`, lifted to 3.500000 when it is lower. A rate adjusted by the Commission is `penaltyRate`, with its value and a named source. Each case below penalises 400.000000 undelivered:

| rate basis | rate stated | rate applied | penalty |
| --- | --- | --- | --- |
| an agreement above the minimum | 5 | 5.000000 | 2000.000000 |
| an agreement below the minimum | 2 | 3.500000 | 1400.000000 |
| an agreement at the minimum | 3.5 | 3.500000 | 1400.000000 |
| an illustrative adjusted rate (synthetic) | 4.25 | 4.250000 | 1700.000000 |

Its basis for the second row, verbatim: "the agreement's rate 2 per MMBtu is below the US$3.50 minimum of r.6(2), so 3.5 applies".

A call that states both an agreement's rate and an adjusted rate is refused:

> penaltyRate must be left out when agreementPenaltyRate is stated (state one rate basis); got {"value":4,"source":"x"}

An adjusted rate with no source is refused as well:

> penaltyRate.source must be a non-empty string; got nothing

## The power plant in 2028, and what follows

The power plant fixture (synthetic) states no agreement rate, so its 676200.000000 penalised MMBtu pay 3.500000 each, a penalty of 2366700.000000. The engine's reason carries more than the money:

> 676200 is penalised at 3.5 per MMBtu: 2366700; the lessee may not supply new midstream gas export operations (s.110(14)(a)) and export supply approvals require prior compliance (s.110(15))

> "An approval for the supply of natural gas for export projects shall, from the effective date, be subject to prior compliance by the lessee with its domestic gas delivery obligation." (PIA s.110(15))

Any penalised quantity above zero sets the export restriction tile. The engine reports that restriction and gives it no price.

## Exercise

Work in the course's own ledger calculator, on the view "The Domestic Gas Delivery Obligation", which starts with the power plant's 2028 obligation.

1. Read the rate, the penalty, the export restriction tile and the rate basis note.
2. Add an `agreementPenaltyRate` of 5, then of 2. Write the rate applied and the penalty each time.
3. Keep the agreement rate and add a `penaltyRate` with a value and a source. Read the refusal.
4. Add enough excuse to cover the whole undelivered quantity and write what happens to the export restriction.
