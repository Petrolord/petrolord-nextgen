# The decommissioning escrow condition

{{panel:pia-ledger-calculator}}

A field has to be plugged and abandoned at the end of its life, and both Acts let a company set money aside for that and deduct it. The Nigeria Tax Act 2025 attaches a condition to the deduction. The cash leaves either way; the condition decides whether the tax lines see it.

## Deductible under the Act

The Petroleum Industry Act 2021 allows the contribution against both taxes. For the hydrocarbon tax, s.263(1)(e) allows "any amount contributed to a fund, scheme or arrangement approved by the Commission for the purpose of decommissioning and abandonment, provided that the surplus or residue of the fund shall be subject to tax under this Act at the end of life of the field,". For companies income tax, s.302(11)(b) allows a contribution to an approved fund "for the purpose of providing for: (i) abandonment and decommissioning, (ii) petroleum host communities development trust, or (iii) environmental remediation ;".

## Deductible under the new Act only on a condition

NTA s.86 opens by denying the deduction: a "provision made for decommissioning and abandonment fund shall not be" tax deductible unless its two paragraphs are met. Paragraph (a) requires that "(a) the licensee or lessee deposit a minimum of 30% of the" fund with a Nigerian bank in an escrow account the Commission or Authority can reach. Paragraph (b) requires that "(b) the Nigerian bank is accredited in accordance with the criteria for accreditation for participation in the management of the fund, determined by the Central Bank of Nigeria in collaboration with the Service."

Whether a company meets that condition is a fact about its banking, which a project model cannot see. The engine therefore takes it as a stated true or false, and refuses a year under the new Act that carries a contribution without it:

> 2026 is a year under the Nigeria Tax Act 2025 and carries a decommissioning fund contribution, so pia_decom_escrow_condition_met must be true or false: NTA s.86 allows the deduction only when at least 30% of the fund is deposited in an escrow account with a Nigerian bank accredited under the Central Bank of Nigeria's criteria.

## The same fund, met and not met

Two Ekene cases (synthetic, shallow water, converted, 2026 to 2028) collect a fund of 30,000,000 USD in equal contributions:

| year | contribution | deduction (met) | CIT (met) | HCT (met) | deduction (not met) | CIT (not met) | HCT (not met) |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 2026 | 10000000.000000 | 10000000.000000 | 30069497.282609 | 28569497.282609 | 0.000000 | 33069497.282609 | 31569497.282609 |
| 2027 | 10000000.000000 | 10000000.000000 | 25592461.374534 | 24272461.374534 | 0.000000 | 28592461.374534 | 27272461.374534 |

The contribution is the same in both runs; only the deduction moves. With the condition not met, each tax rises by 30 percent of the contribution, because the fund now reaches neither base. In a year under the Act alone the condition does not apply: the case ekene_sinking_fund_pia_years deducts its 15000000.000000 contribution in full in 2024 and in 2025.

## Exercise

Open the ledger calculator on "The whole ledger, year by year" and load ekene_sinking_fund_nta_escrow_met. Read the decommissioning deduction and companies income tax for 2026. Set pia_decom_escrow_condition_met to false in the case and read the same two columns; check them against the table. Then delete the key and read the refusal. Finally load ekene_sinking_fund_pia_years and explain why that case runs with no escrow statement at all.
