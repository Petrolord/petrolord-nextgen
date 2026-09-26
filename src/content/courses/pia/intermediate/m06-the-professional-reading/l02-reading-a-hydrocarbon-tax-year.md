# Reading a hydrocarbon tax year

{{panel:pia-hct-calculator}}

This lesson reads one year of hydrocarbon tax from revenue to tax, naming the provision behind each line. The year is the worked example inputs: synthetic, shallow water, a converted lease, 2025, a year under the Act alone, 18250000 bbl of oil at 80 USD/bbl, an NDDC levy stated as a fixed sum of 15000000 USD and a preceding year's opex of 170000000 USD. The Associate tier read the same year as a stack of instruments. Here the question is narrower: why is each hydrocarbon tax line the size it is?

## The lines, in the order the tax meets them

| line | 2025 | the provision |
| --- | --- | --- |
| gross revenue | 1,460,000,000.000000 | s.260(1)(a): crude oil is inside the tax |
| liquids royalty rate | 0.112500 | Seventh Schedule para 10(4): 50,000 bopd in shallow water |
| total royalty | 199158351.810791 | s.263(1)(b): deducted |
| HCDT | 5100000.000000 | s.240(2), s.263(1)(h): 3 percent of the preceding year's opex |
| NDDC | 15000000.000000 | s.263(1)(h): the stated fixed sum |
| CPR cap | 949000000.000000 | Sixth Schedule para 2(1): 65 percent of revenue |
| CPR claimed | 242500000.000000 | opex and capital allowance, inside the cap |
| HCT assessable profit | 1,058,241,648.189209 | s.263 and the cap together |
| production allowance | 45625000.000000 | Sixth Schedule para 1(1): 2.50 USD on every barrel |
| HCT chargeable profit | 952616648.189209 | after the capital allowance and the production allowance |
| HCT rate | 0.300000 | s.267(a): a converted lease in shallow water |
| HCT | 285784994.456763 | the rate on the chargeable profit |

## Reading down the column

The daily rate is 50,000 bopd, well above the 10,000 bopd edge, so the weighted rate is 11.250000 percent, most of the way to the shallow water terrain rate. The royalty by price is charged at 80 USD/bbl in 2025 on the Petroleum Royalty Regulations 2022 base, the engine default, and is part of the total royalty the tax deducts.

HCDT is 3 percent of the stated preceding year's opex. The NDDC levy is the fixed sum the case states, which replaces the 3 percent of budget. Both come off outside the cap.

The cap does not bind. The claim is far below it, so nothing is carried to a later year and nothing can be forfeited. The claim holds this year's opex and its capital allowance of 60000000.000000; the assessable profit deducts the opex, and the step to chargeable profit deducts the capital allowance and then the production allowance.

The rate is one the texts print. Nothing on this line is a stated reading, so the hydrocarbon tax is the rate on the chargeable profit with no open question behind it.

## What would make the year harder to read

This year is clean on purpose: crude oil only, a converted lease, a cap that does not bind. Change any one of those and a line needs more care. Gas production brings the crude-plus-condensate share into every shared cost, and the engine's note says so. A lease granted out of new acreage onshore or in shallow water puts a stated reading on the rate line, and its hydrocarbon tax is quoted with that reading. A binding cap puts a carry on the ledger, and the last year of the ledger then decides a forfeiture.

## Beside it

Companies income tax on the same year is 299472494.456763, on its own base and with the hydrocarbon tax kept out of it by s.302(5). How the two taxes and the royalties add up to government's share of the field is the stack the Associate tier read and the decomposition the Expert tier reads.

## Exercise

Work in the course's own hydrocarbon tax calculator, which calls the same engine.

1. Open "The tax base and the cost price ratio on a ledger" and start from worked_example_inputs_default. Match every line of the table that the view shows.
2. For each of these single changes, predict which line moves first, then run it: `pia_prior_year_opex_usd` set to 0; `pia_license_type` set to "PPL"; the 2025 `oil_bbl` divided by ten.
3. In the third run the cap binds. Name the paragraph that now decides the CPR claimed, and the one that will decide the fate of what is carried out.
