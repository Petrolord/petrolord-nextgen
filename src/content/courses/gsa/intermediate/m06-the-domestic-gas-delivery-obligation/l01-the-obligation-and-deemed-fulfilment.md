# The obligation and deemed fulfilment

{{panel:gsa-ledger-calculator}}

A gas sales agreement binds two parties. The Domestic Gas Delivery Obligation binds a lessee to the country: each year the regulator allocates a share of domestic gas demand to every lessee, and a lessee that fails to deliver its share pays a penalty unless an excuse applies. This module computes the obligation with the engine's `domesticGasObligation`. This lesson covers what the obligation is and the first way a lessee meets it.

## What the Act says

The Petroleum Industry Act 2021 (Official Gazette No. 142, Vol. 108, 27 August 2021, read 2026-09-26) gives the Commission the allocation:

> "prescribe and allocate the domestic gas delivery obligation among all lessees before 1st March of each year based on the domestic gas demand requirements" (PIA s.110(1)(a))

The Domestic Gas Delivery Obligation Regulations 2022 (S.I. No. 74 of 2022, Official Gazette No. 206, Vol. 109, 23 November 2022, made and commenced 18 November 2022, read 2026-09-26) set out the supply curve and the allocation. The engine computes neither: the lessee's obligation for the year is a stated input.

## Deemed fulfilment

A lessee can meet its obligation on paper by contracting for it. The Act says:

> "where the volume of the contracts is equal to or higher than the domestic gas delivery obligation for the lessee, the lessee shall" (PIA s.110(2))

> "(a) be deemed to have fulfilled its domestic gas delivery obligation ;" (PIA s.110(2)(a))

Contracts signed before the Act took effect count too:

> "Domestic gas delivery contracts entered into by lessees or licensees prior to the effective date and continuing after the effective date, shall be counted towards their domestic gas delivery obligation" (PIA s.110(16))

The engine takes those contracts as `voluntaryContracts`. "Equal to or higher" is inclusive, so contracts exactly equal to the obligation are enough, and one unit short is not:

| case | obligation | delivered | voluntary contracts | deemed fulfilled | undelivered | penalty |
| --- | --- | --- | --- | --- | --- | --- |
| deemed by contracts | 1000.000000 | 200.000000 | 1000.000000 | true | 800.000000 | 0.000000 |
| contracts one short | 1000.000000 | 200.000000 | 999.000000 | false | 800.000000 | 2800.000000 |
| met by delivery | 1000.000000 | 1000.000000 | 0.000000 | false | 0.000000 | 0.000000 |
| over-delivered | 1000.000000 | 1200.000000 | 0.000000 | false | 0.000000 | 0.000000 |

The engine's reason for the first row, verbatim:

> voluntary contracts of 1000 are at or above the obligation 1000: the lessee is deemed to have fulfilled its obligation (s.110(2)(a))

In the first row the lessee delivered only 200.000000, yet owes nothing: deemed fulfilment turns on the contracts, whatever was delivered. In the third and fourth rows the obligation is met by delivery, which the engine reports as "delivered 1000 meets the obligation 1000", and deemed fulfilment is simply not needed.

## The Ekene power plant in 2028

The power plant fixture (synthetic) states a 2028 obligation of 6825000.000000 MMBtu and a delivery of 5460000.000000, with no voluntary contracts. It is not deemed fulfilled, and 1365000.000000 is undelivered. The next two lessons take that quantity through the excuses and the penalty.

A quantity that cannot be true is refused before anything is computed:

> obligation must be a finite number at or above 0; got -1

## Exercise

Work in the course's own ledger calculator, on the view "The Domestic Gas Delivery Obligation". It starts with the power plant's 2028 obligation.

1. Read the undelivered tile and the first reason, and check them against the figures above.
2. Add `voluntaryContracts` equal to the obligation and read the result and its reason.
3. Reduce it by one MMBtu and write what changes.
4. Set `obligation` to -1 and read the refusal.
