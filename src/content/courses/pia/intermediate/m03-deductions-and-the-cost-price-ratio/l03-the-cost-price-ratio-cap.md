# The cost price ratio cap

{{panel:pia-hct-calculator}}

The cost price ratio is the Act's brake on cost recovery in the hydrocarbon tax. It limits how much cost one year may claim and sends the rest forward. This lesson reads the cap, the order in which the engine fills it, and the one tax it reaches.

## The text

Section 266(2) sets the principle: "(2) In determining the chargeable profit, the total cost shall not exceed" the ratio the Sixth Schedule fixes. The Sixth Schedule para 2(1) fixes it: deductions under s.263 and the Fifth Schedule, "excluding those related to section 263 (1) (a), (b) and (h), in an accounting period the sum of which is eligible for deduction under the hydrocarbon tax shall be subject to a cost price ratio limit of 65% of gross revenues". The Nigeria Tax Act 2025 prints the same 65 percent at its Sixth Schedule para 2(1).

## What goes in, and in what order

The engine fills the cap from one pool: opex, the capital allowance and any deductible decommissioning contribution, each at the crude-plus-condensate share, plus any cost carried in from last year. The limit is 65 percent of crude oil and condensate revenue. It claims the carried pool and this year's operating costs first, then this year's capital allowance. What does not fit is carried to the next year.

Royalties, HCDT and the NDDC levy sit outside the cap, as the previous lesson showed. The cap claims the lesser of the pool and the limit, so a pool exactly equal to the cap is claimed in full and carries nothing. A field with ample revenue never feels it: Ekene Alpha claims 46563591.022444 in 2026 against a cap of 147664400.000000, so nothing is carried.

## A case where it binds

The Ekene CPR case (synthetic: shallow water, converted lease, heavy cost on thin revenue) spends 150000000 USD of capex in 2024 and 40000000 USD of opex a year, on falling oil.

| year | gross revenue | CPR cap | CPR claimed | CPR carried out |
| --- | --- | --- | --- | --- |
| 2024 | 75000000.000000 | 48750000.000000 | 48750000.000000 | 21250000.000000 |
| 2025 | 60000000.000000 | 39000000.000000 | 39000000.000000 | 52250000.000000 |
| 2026 | 45000000.000000 | 29250000.000000 | 29250000.000000 | 93000000.000000 |

In every year the claim equals the cap, and the carry grows. The cap is 65 percent of that year's revenue, so as revenue falls the cap falls with it.

## The one tax it reaches

The cap limits the hydrocarbon tax and nothing else. Companies income tax in the same years deducts opex in full:

| year | CIT assessable profit | opex (in full) |
| --- | --- | --- |
| 2024 | 23999396.909159 | 40000000.000000 |
| 2025 | 13442572.062084 | 40000000.000000 |
| 2026 | -457065.217391 | 40000000.000000 |

Module five reads that base line by line. For now, hold the contrast: one set of costs, two taxes, and a cap on only one of them.

## Exercise

Work in the course's own hydrocarbon tax calculator, which calls the same engine.

1. Open "The tax base and the cost price ratio on a ledger". It starts on ekene_cpr_binding_forfeiture. Match the three rows of the first table.
2. Double every `oil_bbl` in `prodRows`. In which years does the claim now fall below the cap, and what is carried out of those years?
3. Restore the case. Halve the 2024 capex instead. Does the cap move? Does the carry? Explain each answer from para 2(1).
4. Open "Companies income tax on a ledger", choose the same case, and match the CIT assessable profit to the second table. Explain why 2026 goes below zero there while the hydrocarbon tax base stays positive.
