# Deductible and non-deductible items

{{panel:pia-hct-calculator}}

The hydrocarbon tax charges a profit, so the texts have to say what comes off revenue before the rate applies. The Act does it with two lists: s.263 for what is deductible and s.264 for what is not. This lesson reads both lists for the lines the engine computes, and marks the ones it leaves to concept.

## What comes off

The Petroleum Industry Act 2021, s.263(1), as the course quotes it:

- (b) "all royalties the liability for which was incurred and were paid by the company during that period in respect of crude oil and associated gas"
- (e) "any amount contributed to a fund, scheme or arrangement approved by the Commission for the purpose of decommissioning and abandonment, provided that the surplus or residue of the fund shall be subject to tax under this Act at the end of life of the field,"
- (f) "all sums the liability of which was incurred by the company to the Federal Government or any State or Local Government Council by way of levies, stamp duties and fees ;"
- (h) contributions to "host communities development trusts under Chapter 3 of this Act, Environmental Remediation Fund, Niger Delta Development Commission and other similar contributions."

The Nigeria Tax Act 2025 carries (b), (f) and (h) into s.68(1). Operating costs and the capital allowance come off too, through the cost price ratio of the next lessons.

## What does not

Section 264 lists what may never be deducted. Two items bear on the engine's lines. Item (l): "(l) amounts incurred in respect of tertiary education tax, companies income tax, any income tax, profits tax or other similar taxes, whether charged within Nigeria or elsewhere ;". Item (q): "(q) costs under paragraph 2 (2) (c) of the Sixth Schedule to this Act.", which is cost still above the cost price ratio when crude oil operations end.

Item (f) of s.264 keeps signature, production and renewal bonuses out of the tax. The engine takes no bonus as an input, so that item is taught from the text only.

## One year, deduction by deduction

The worked example inputs (synthetic: shallow water, converted lease, 2025, a year under the Act alone, 50,000 bopd at 80 USD/bbl) return these lines in the tax base:

| line | 2025 |
| --- | --- |
| total royalty | 199158351.810791 |
| HCDT | 5100000.000000 |
| NDDC | 15000000.000000 |
| capital allowance | 60000000.000000 |
| CPR claimed | 242500000.000000 |
| production allowance | 45625000.000000 |
| HCT chargeable profit | 952616648.189209 |

Every line above the chargeable profit is a deduction with a citation. The CPR claimed holds the opex and the capital allowance the cap let through, so the capital allowance row sits inside it and is taken once. Companies income tax and the tertiary education tax appear elsewhere on the ledger and never in this list, by s.264(l).

## Exercise

Work in the course's own hydrocarbon tax calculator, which calls the same engine.

1. Open "The tax base and the cost price ratio on a ledger" and start from worked_example_inputs_default. Confirm the chargeable profit of 952616648.189209.
2. Delete `pia_nddc_levy_fixed_usd` from the terms, so the NDDC levy falls back to 3 percent of opex plus capex. Did the chargeable profit rise or fall? Did the CPR claimed move?
3. Restore the fixed sum and set `pia_prior_year_opex_usd` to 0. Which deduction disappeared, and which subsection of s.263 names it?
4. Name one item on the ledger that the tax base never deducts, and cite the paragraph of s.264 that keeps it out.
