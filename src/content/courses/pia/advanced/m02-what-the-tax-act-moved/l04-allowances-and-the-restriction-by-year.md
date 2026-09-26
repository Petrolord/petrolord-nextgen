# Capital allowance and the restriction by year

{{panel:pia-hct-calculator}}

{{panel:pia-ledger-calculator}}

Two rules about capital spend change at the switch, and both are read by the law of the year of assessment. The fifth year of the capital allowance moves from 19 to 20 percent, and the two thirds restriction on the companies income tax allowance stops applying.

## The fifth year

PIA Fifth Schedule para 17(1) sets the schedule: "17.: (1) Qualifying expenditure shall be subject to the rates below: Qualifying Capital Expenditure 1st 2nd 3rd 4th 5th Year Year Year Year Year Qualifying Plant Expenditure 20% 20% 20% 20% 19%". The missing 1 percent is kept on the books under para 5(2) and written off only on disposal, which the ledger never reaches.

NTA First Schedule Part II para 14(1) prints five equal years: "Qualifying Plant Expenditure 20% 20% 20% 20% 20%". It keeps a 1 percent figure too, under para 4(2), but as "a notional amount, shall not increase or reduce the amount of capital allowance claimable under this Part."

The engine's fractions:

| year of life (0 is the year of spend) | a year under the Act alone | a year under the Nigeria Tax Act 2025 |
| --- | --- | --- |
| 0 | 0.200000 | 0.200000 |
| 3 | 0.200000 | 0.200000 |
| 4 | 0.190000 | 0.200000 |
| 5 | 0.000000 | 0.000000 |

On ekene_onshore_across_2026 the 2024 spend claims 20 percent in each of its five years: 2024 to 2027 at 20 percent under either law, and 2028, its fifth year and a year under the Nigeria Tax Act 2025, at 20 percent. The capital allowance line reads 18000000.000000 in every year from 2024 to 2028. On ekene_force_pia_2027, forced to the Act alone, the fifth-year allowance of the 2027 spend, in 2031, is 11400000.000000.

## The restriction

In a year under the Act alone, the capital allowance claimed against companies income tax is limited to two thirds of the assessable profit, with the excess carried forward. A company in upstream or midstream gas operations is exempt as a stated input. In a year under the Nigeria Tax Act 2025 there is no restriction and a carried amount is claimed in full. The engine states the reading it applies to earlier years in its note:

> Before 2026 the companies income tax capital allowance is limited to two thirds of the assessable profit, with the excess carried forward (CITA Second Schedule para 24(7) as substituted by Finance Act 2023 s.9(b), effective 1 May 2023). The wording in force before 1 May 2023 was not read; the engine applies the same restriction to every year before 2026. Companies in upstream or midstream gas operations are exempt: set pia_cit_company_gas_operations to true.

On the cost price ratio case ekene_cpr_binding_forfeiture (synthetic, shallow water, 2024 to 2026) the restriction binds:

| year | CIT assessable profit | CIT allowance claimed |
| --- | --- | --- |
| 2024 | 23999396.909159 | 15999597.939440 |
| 2025 | 13442572.062084 | 8961714.708056 |
| 2026 | -457065.217391 | 65038687.352504 |

In 2024 and 2025 the claim is two thirds of the assessable profit. In 2026, the first year under the new Act, the carried amount comes in whole.

## Exercise

Open the hydrocarbon tax calculator on "The capital allowance by year of life" and compare the two columns. Then open "Companies income tax on a ledger", load ekene_cpr_binding_forfeiture and read the allowance claimed and carried in each year. Set pia_under_nta_2025_override to "force_nta" in the case and describe what happens to the carry. Finally open the ledger calculator on "The whole ledger, year by year", load ekene_force_pia_2027 and read the tertiary education tax in 2031.
