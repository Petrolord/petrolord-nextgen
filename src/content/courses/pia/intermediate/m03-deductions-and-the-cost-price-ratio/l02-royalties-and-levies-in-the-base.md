# Royalties and levies in the base

{{panel:pia-hct-calculator}}

Three kinds of payment to government and communities sit in the hydrocarbon tax base beside the costs: royalties, the host communities contribution and the NDDC levy. They share one feature that matters for the next lesson. Each is deducted beside the costs, and none of them counts against the cost price ratio.

## Royalties

The tax base deducts the production royalty on crude oil and condensate and the royalty by price, by s.263(1)(b). The gas royalty stays out, because gas is outside the tax. Any royalty by price figure in this course is on the Petroleum Royalty Regulations 2022 base, the engine default.

## HCDT

The host communities development trust contribution is set by PIA s.240(2): each settlor pays "an amount equal to 3% of its actual annual operating expenditure of the preceding financial year in the upstream petroleum operations affecting the host communities". Section 257(1) makes it deductible "for the purposes of hydrocarbon tax and companies" income tax.

The engine charges 3 percent of the preceding year's opex. The first ledger year reads the stated `pia_prior_year_opex_usd`, and with none stated the first year's HCDT is 0.

## The NDDC levy

The Niger-Delta Development Commission Act 2000 s.14(2)(b), as amended in 2017, sets the levy at 3 percent of the company's total annual budget. That figure rests on a secondary source: the Act itself was not read, and the figure comes from published commentary on it. The engine takes the total annual budget as the year's opex plus capex, offers "opex" as a stated alternative base, and replaces the percentage with a fixed sum when one is given.

## Both at the liquids share, both outside the cap

HCDT and the NDDC levy enter the hydrocarbon tax at the crude-plus-condensate share of gross revenue, the same share as the other shared costs. The Sixth Schedule para 2(1) lifts them out of the cost price ratio: the cap applies to deductions "excluding those related to section 263 (1) (a), (b) and (h)". So a field whose costs are capped still deducts its royalties and its community contributions, whatever the cap does.

On Ekene Alpha (synthetic, shallow water, converted lease):

| year | opex | capex | HCDT | NDDC |
| --- | --- | --- | --- | --- |
| 2026 | 24000000.000000 | 120000000.000000 | 0.000000 | 4320000.000000 |
| 2027 | 24000000.000000 | 30000000.000000 | 720000.000000 | 1620000.000000 |
| 2028 | 24000000.000000 | 0.000000 | 720000.000000 | 720000.000000 |

The same rows under the two NDDC bases (the Ekene NDDC case, synthetic):

| year | NDDC, opex base | NDDC, total budget | HCT, opex base | HCT, total budget |
| --- | --- | --- | --- | --- |
| 2026 | 450000.000000 | 2250000.000000 | 32109497.282609 | 31569497.282609 |
| 2027 | 450000.000000 | 450000.000000 | 27272461.374534 | 27272461.374534 |

In 2027 there is no capex, so the two bases agree.

## Exercise

Work in the course's own hydrocarbon tax calculator, which runs the same engine.

1. Open "The tax base and the cost price ratio on a ledger" and start from ekene_nddc_opex_base. Confirm the 2026 HCT of 32109497.282609.
2. Change `pia_nddc_levy_base` to "total_budget" and confirm 31569497.282609. Say which way the levy moved and why the tax moved the other way.
3. Set `pia_prior_year_opex_usd` to 15000000. Which year's HCT moved, and which section of the Act puts the new deduction there?
4. Check the CPR claimed column before and after each change. Explain what you see from para 2(1).
