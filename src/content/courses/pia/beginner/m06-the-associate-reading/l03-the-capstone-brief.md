# The capstone brief

{{panel:pia-royalty-calculator}}

The Associate capstone asks for the map of the Act on one ledger. It gives you one lease and asks for six values that the engine returns. Each value tests one part of this tier, and each is the same under every open reading of the texts. This lesson says what the capstone asks, where each value comes from in the panel, and how to practise the whole reading on a teaching case first.

## What the capstone gives you

The capstone card carries one case file: the terms (`cfg`) and the production, capex and opex rows the engine ran. Paste it into "The instruments stacked on a ledger" in the royalty calculator. The card states the terrain, licence and lease status, the working interest share, the prices, the in-country gas share, the prior-year opex for the first year's HCDT and the framework setting, so every term the engine reads is in front of you. The royalty by price is read on the Regulations base, the engine default. Every money value is at the working interest share.

## The six values

| value | what it tests | where to find it |
| --- | --- | --- |
| the crude oil and condensate production royalty rate in a stated year, as a fraction | the tranches and the daily rate | the liquids royalty rate column |
| the production royalty on liquids and gas in a stated year | the rate applied to value, and the gas rate | the production royalty column |
| the hydrocarbon tax in a stated year | reading one line of the stack | the HCT column |
| the development levy in a stated year | the education charge of a year under the Nigeria Tax Act 2025 | the development levy column |
| companies income tax over the life of the ledger | the whole-profit tax | the total companies income tax tile |
| the government take, undiscounted, in percent | the take by provision | the government take tile |

All six are reported to six decimals.

## Reading the royalty values

Every value is printed on the panel, so the work is reading the right column and knowing why it holds that number. The first royalty table gives, for each year, the daily rate the tranches read (the year's crude oil and condensate over its calendar days), the liquids royalty rate that daily rate earns, the royalty on liquids and on gas, their sum as the production royalty, and the royalty by price beside them. The production royalty excludes the royalty by price, which has its own column. The second table carries HCDT, the NDDC levy and the taxes. Before you copy a figure, check that its row is the year the card names and that the year's framework is the one you expect.

## Practise on Ekene Alpha

Alpha's figures are printed in this course, so it is a safe place to rehearse. For 2027 the course prints a daily rate of 7321.600000 bopd, a liquids royalty rate of 0.057927, a production royalty on liquids of 11580515.038462 USD and a gas royalty of 308352.000000 USD. Over the life it prints total companies income tax of 222856630.287730 USD and a take of 66.564877 percent. The practice case ekene_alpha_wi_50 is the same field at a 50 percent share.

## Exercise

Open the royalty calculator. Run ekene_alpha_shallow_converted_nta in "The instruments stacked on a ledger" and read all six values for the year 2027: the daily rate and the liquids royalty rate from the first table, then check the rate in "Royalty by terrain and daily rate" by entering that daily rate; the production royalty, and check it is the liquids and gas royalties added together; the hydrocarbon tax and the development levy from the second table; and the two tiles. Then repeat on ekene_alpha_wi_50 and check that every money value halves while the rate and the take hold.
