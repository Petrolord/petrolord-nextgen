# The Ekene cases and what the engine asks for

{{panel:pia-royalty-calculator}}

Every practical in this course runs on an Ekene teaching case: a synthetic lease written for this platform, with terms and rows chosen so that each rule of the texts has something to act on. No real company, licence, field or price list appears. This lesson reads the cases, then reads the terms a case gives the engine, so that a learner can build a case of their own.

## The cases this tier uses

| case | what it is | years | terrain and lease |
| --- | --- | --- | --- |
| worked_example_inputs_default | one year, 50,000 bopd, a fixed NDDC sum | 2025 | shallow_water, converted |
| ekene_alpha_shallow_converted_nta | Ekene Alpha: crude with condensate and associated gas | 2026 to 2032 | shallow_water, converted |
| ekene_alpha_wi_50 | Ekene Alpha at a 50 percent working interest | 2026 to 2032 | shallow_water, converted |
| ekene_nag_gas_in_country_half | a gas field, half the gas used in-country, no crude | 2026 to 2028 | shallow_water, converted |
| ekene_condensate_price_royalty_regs | crude at 95 and condensate at 88 USD/bbl | 2025 | shallow_water, converted |
| ekene_frontier | frontier acreage at 120 USD/bbl | 2026 | frontier, converted |
| ekene_nddc_opex_base | the NDDC levy on the opex base | 2026 to 2027 | shallow_water, converted |

Every case keeps its prices, opex and capex flat in money of the day and discounts at 10 percent nominal. None states a hydrocarbon tax override, a tertiary education tax rate or a capital allowance life, so the engine applies the statutory values.

## What a case carries

A case is four parts: the terms (`cfg`) and three row sets for production, capex and opex. The first three years of Ekene Alpha's rows:

| year | oil bbl | condensate bbl | gas Mscf | capex USD | opex USD |
| --- | --- | --- | --- | --- | --- |
| 2026 | 2920000 | 116800 | 2336000 | 120000000 | 24000000 |
| 2027 | 2569600 | 102784 | 2055680 | 30000000 | 24000000 |
| 2028 | 2261248 | 90450 | 1808998 | 0 | 24000000 |

Alpha sells oil at 75, condensate at 70 and gas at 3 USD per Mscf. Its oil, condensate and associated gas decline each year. Capex is spent in the first two years and opex is flat, which gives a ledger with a large first year and a long tail. That shape lets one case show the royalty tranches, the royalty by price, the levies and the taxes together.

## Why the cases are small

Each case is built to show one rule clearly. The gas field has no crude, so its only royalty is the gas royalty. The frontier case sits at 120 USD/bbl, a price at which the other terrains pay a royalty by price, so its absence is plain. The worked example runs one year at exactly 50,000 bopd, a daily rate where the shallow water tranches and the terrain rate all apply.

## The terms that decide the fiscal lines

The engine reads a handful of stated terms to decide which provision applies:

| term | what it states | what the engine accepts |
| --- | --- | --- |
| pia_terrain | the terrain | onshore, shallow_water, deep_offshore, frontier |
| pia_license_type | the licence | PML or PPL |
| pia_lease_status | the road to the lease | converted or new |
| pia_marginal_field_pre_2021 | a converted producing marginal field | true or false |
| pia_gas_in_country_share_pct | gas used in-country | 0 to 100 |
| pia_price_royalty_base | the royalty by price base year | regulations_2021 (the default) or act_2020 |
| pia_working_interest_pct | the working interest share | a percentage |
| pia_prior_year_opex_usd | last year's opex, for the first year's HCDT | USD |

## Stated inputs and open readings

The texts leave three questions open: the royalty by price base year, the hydrocarbon tax rate of a new lease onshore or in shallow water, and the deep offshore hydrocarbon tax under the Nigeria Tax Act 2025. Each is an open reading. A run answers one by stating it as an input, and that answer is a stated reading, never presented as the law. Where the engine keeps a default, as it does for the base year, it says so in a note. Where it keeps none, it refuses a run that leaves the question unanswered.

## At the share

Every money figure the engine returns is at the working interest share. The rates, tranches and caps are read at field level first, and the cash flow course owns the arithmetic of the scaling.

## Exercise

Open the royalty calculator and choose "The instruments stacked on a ledger". Start from each of three cases in turn: ekene_alpha_shallow_converted_nta, ekene_nag_gas_in_country_half and ekene_frontier. For each, read the terms in the case box and write down its terrain, licence, lease status, in-country gas share and base year, then run it. Build a small table of your own that sets each case's terms beside its total royalties tile. Finally, change one term of your own choosing in one case, run it, and say which provision you expect to move before you read the result.
