# Host communities and the NDDC levy

{{panel:pia-royalty-calculator}}

Two lines on the stack are contributions to funds for the producing regions. One is created by the Act itself, the host communities development trust. The other comes from an older statute, the Niger-Delta Development Commission Act. Both read a cost base rather than a revenue base, both are deductible for the taxes, and one of them rests on a secondary source that this course names every time.

## The host communities development trust

The Act makes each settlor pay into a trust fund for its host communities every year, PIA s.240(2):

> "of an amount equal to 3% of its actual annual operating expenditure of the preceding financial year in the upstream petroleum operations affecting the host communities for which the applicable host communities development trust fund was established."

The engine reads HCDT as 3 percent of the preceding year's opex. In the first year of a ledger it reads the stated `pia_prior_year_opex_usd`, and 0 if none is stated. The worked example states a prior-year opex of 170000000 USD and returns an HCDT of 5100000.000000 USD for 2025. The payment is deductible for both taxes, PIA s.257(1):

> "this Act, shall be deductible for the purposes of hydrocarbon tax and companies"

## The NDDC levy

The NDDC levy is 3 percent of the company's total annual budget, under the NDDC Act 2000 s.14(2)(b) as amended. This course has not read that Act; the rate and base come from secondary commentary, and the course says so wherever the levy appears. The engine takes the total annual budget as the year's opex plus capex. Two alternatives are stated inputs: `pia_nddc_levy_base` "opex" charges the levy on opex alone, and a fixed sum in `pia_nddc_levy_fixed_usd` replaces the percentage, as in the worked example's 15000000.000000 USD. Any other base is refused:

> pia_nddc_levy_base must be "total_budget" or "opex"; got "budget".

## Ekene Alpha's two contributions

| year | opex | capex | HCDT | NDDC |
| --- | --- | --- | --- | --- |
| 2026 | 24000000.000000 | 120000000.000000 | 0.000000 | 4320000.000000 |
| 2027 | 24000000.000000 | 30000000.000000 | 720000.000000 | 1620000.000000 |
| 2028 | 24000000.000000 | 0.000000 | 720000.000000 | 720000.000000 |

Alpha states no prior-year opex, so its 2026 HCDT is 0. From 2027 HCDT reads the previous year's opex. The NDDC levy is largest in 2026, the year of heaviest capex, because the budget base counts capex.

## The two NDDC bases on one case

| year | NDDC, opex base | NDDC, total budget |
| --- | --- | --- |
| 2026 | 450000.000000 | 2250000.000000 |
| 2027 | 450000.000000 | 450000.000000 |

In a year with capex the two bases differ; in a year without it they agree.

## Where the contributions go next

Both contributions come off the hydrocarbon tax base and the companies income tax base. The Act names them in s.263(1)(h) for the hydrocarbon tax, and s.302(11)(b) for companies income tax covers the host communities trust. On a field that also sells gas, the engine enters both in the hydrocarbon tax at the crude-plus-condensate share of gross revenue. The Professional tier works those deductions.

## Exercise

Open the royalty calculator and choose "The instruments stacked on a ledger". Run ekene_nddc_opex_base and read its NDDC column. In the case box change pia_nddc_levy_base to "total_budget", run it again and confirm the table above; then type "budget" and copy the refusal. Next run ekene_alpha_shallow_converted_nta, set pia_prior_year_opex_usd to 24000000, run it, and say which 2026 lines moved and why.
