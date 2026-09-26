# What the income tax base deducts

{{panel:pia-hct-calculator}}

Companies income tax on an oil and gas company starts from the same revenue as the hydrocarbon tax and deducts a different list. This lesson reads that list from s.302(11), sets it against the hydrocarbon tax base, and shows the two differences that matter most on a ledger: every royalty comes off, and the cost price ratio never applies.

## The text

The Petroleum Industry Act 2021, s.302(11), lists deductions for companies income tax:

- "(a) all rents and royalties the liability for which was incurred by the company during that period in respect of crude oil sold, condensate sold and natural gas sold or delivered or disposed of in any other commercial manner"
- "(b) any amount contributed to any fund, scheme or arrangement approved by the Commission or Authority for the purpose of providing for: (i) abandonment and decommissioning, (ii) petroleum host communities development trust, or (iii) environmental remediation ;"

The Nigeria Tax Act 2025 repeats both at s.82(1)(a) and (b).

## The base the engine builds

The engine's companies income tax base is gross revenue from oil and gas together, less every royalty, opex in full, HCDT, the NDDC levy and any deductible decommissioning contribution, less its own capital allowance. The hydrocarbon tax is not deducted. The cost price ratio does not apply. There is no production allowance in this base either: the Sixth Schedule allowance belongs to the hydrocarbon tax alone.

Set against the hydrocarbon tax base, four lines differ:

| line | hydrocarbon tax base | companies income tax base |
| --- | --- | --- |
| gas revenue | outside | inside |
| gas royalty | not deducted | deducted |
| opex and capital allowance | through the 65 percent cap, at the liquids share | opex in full, with its own capital allowance claim |
| HCDT and the NDDC levy | at the liquids share, outside the cap | deducted, on a base that holds oil and gas together |

## The cap reaches one base only

On the Ekene CPR case (synthetic: shallow water, converted lease, costs heavy against revenue), the hydrocarbon tax claim is capped in every year while companies income tax deducts the full opex:

| year | CPR claimed | CIT assessable profit | opex (in full) |
| --- | --- | --- | --- |
| 2024 | 48750000.000000 | 23999396.909159 | 40000000.000000 |
| 2025 | 39000000.000000 | 13442572.062084 | 40000000.000000 |
| 2026 | 29250000.000000 | -457065.217391 | 40000000.000000 |

By 2026 the companies income tax base is below zero, while the hydrocarbon tax still finds a chargeable profit of 8792934.782609. The same costs, read through two sets of rules, give a profit in one tax and a loss in the other.

## A decommissioning fund in a year under the Act alone

A contribution to an approved decommissioning fund is deductible for both taxes in a year under the Act alone. The Ekene fund case (synthetic) contributes 15000000.000000 in 2024 and in 2025, and the engine deducts 15000000.000000 in each year. What changes in a year under the Nigeria Tax Act 2025 is a transition question for the Expert tier.

## Exercise

Work in the course's own hydrocarbon tax calculator, which calls the same engine.

1. Open "Companies income tax on a ledger" and choose ekene_cpr_binding_forfeiture. Match the CIT assessable profit column to the table.
2. Choose ekene_sinking_fund_pia_years and read the CIT assessable profit. Delete `abandonment_funding_mode` from the terms and read it again. Which subsection of s.302(11) explains the difference?
3. Choose ekene_alpha_shallow_converted_nta, which sells gas. Set every `gas_mscf` to 0 and watch the CIT assessable profit. Which two lines of the table above moved?
