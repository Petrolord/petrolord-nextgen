# Capital allowances over five years

{{panel:pia-hct-calculator}}

Capital spending enters the hydrocarbon tax through the capital allowance, a fixed share of the spend in each year of its life, on a schedule the texts fix. This lesson reads the schedule under both texts and the refusal that guards it.

## The texts

The Petroleum Industry Act 2021, Fifth Schedule para 17(1): "17.: (1) Qualifying expenditure shall be subject to the rates below: Qualifying Capital Expenditure 1st 2nd 3rd 4th 5th Year Year Year Year Year Qualifying Plant Expenditure 20% 20% 20% 20% 19%". The missing 1 percent is explained in para 5(2): "there shall be retained in the books, in respect of each asset 1% of the initial cost of the asset which may only be written off in accordance with subparagraph (3)."

The Nigeria Tax Act 2025 prints its own schedule at First Schedule Part II para 14(1): "20% 20% 20% 20% 20%". Its para 4(2) keeps a 1 percent record "for statistical purposes until the asset is disposed", and says that "being a notional amount, shall not increase or reduce the amount of capital allowance claimable under this Part."

## The fraction the engine returns

| year of life (0 is the year of spend) | a year under the Act alone | a year under the Nigeria Tax Act 2025 |
| --- | --- | --- |
| 0 | 0.200000 | 0.200000 |
| 3 | 0.200000 | 0.200000 |
| 4 | 0.190000 | 0.200000 |
| 5 | 0.000000 | 0.000000 |

The fraction is read by the law of the year of assessment, so a spend part way through its life when the law changes takes each later year's rate as that year's law gives it. On the Ekene onshore lease (synthetic), a 2024 spend claims 18000000.000000 in each of its five years, 2024 to 2028. The Expert tier reads what happens across that change in full.

Under the Act alone the retained 1 percent is never claimed in the ledger: the ledger has no disposal event.

## The allowance and the cap

The capital allowance is a cost in the cost price ratio pool at the crude-plus-condensate share, and the cap claims it last, after the carried pool and the year's opex. On a lease where the cap binds, the capital allowance is the first thing carried forward. Companies income tax has its own claim on the same allowance, which module five reads.

## A life the texts do not allow

The capital allowance life is a stated input the engine checks, `pia_capex_recovery_years`. Any stated value other than 5 is refused. The message opens:

> pia_capex_recovery_years is 4, but the PIA Fifth Schedule para 17(1) and NTA First Schedule Part II para 14(1) fix the capital allowance at five years (20, 20, 20, 20, 19 percent under the PIA; 20 percent a year under the NTA).

## Exercise

Work in the course's own hydrocarbon tax calculator, which runs the same engine.

1. Open "The capital allowance by year of life" and read every row. At which year of life do the two columns differ?
2. Open "Companies income tax on a ledger" on ekene_onshore_across_2026 and confirm the capital allowance column reads 18000000.000000 in every year.
3. Add `"pia_capex_recovery_years": 4` to the terms and read the refusal. Change it to 5 and confirm the run returns unchanged.
4. Take a spend whose whole life falls in years under the Act alone. Using the table, say what share of it the ledger never claims, and cite the paragraph that holds it back.
