# Gas royalty at the ledger level

{{panel:pia-royalty-calculator}}

{{panel:pia-ledger-calculator}}

The Associate tier read the gas royalty rate. This lesson follows it onto a ledger and through the lines after it, because gas reaches the government by a different road from crude oil. Gas pays royalty and companies income tax, and it sits outside the hydrocarbon tax, so an in-country share moves fewer lines than a change in the crude oil rate does.

## The rate, as the texts write it

PIA Seventh Schedule para 10(6) sets both rates in one sentence: "(6) Royalty based on production for natural gas and natural gas liquids shall be at a rate of 5% of the chargeable volume and royalty rate for natural gas produced and utilised in-country shall be 2.5% of the chargeable volume." The Nigeria Tax Act 2025 repeats it word for word in its Seventh Schedule para 6(2)(f).

The Petroleum Royalty Regulations 2022 (S.I. No. 73, Official Gazette No. 205, Vol. 109, 22 November 2022) add two precisions. Separately produced liquids pay the higher rate wherever they go: "(4) The royalty rate of natural gas liquids produced separately, shall be 5% regardless of whether the natural gas liquids are used in-country or exported." And gas for export pays it too, under r.16(5).

The engine takes the in-country share as a stated input from 0 to 100 and blends the two rates. Every terrain pays the same gas rate:

| in-country share percent (stated) | gas royalty rate |
| --- | --- |
| 0 | 0.050000 |
| 25 | 0.043750 |
| 50 | 0.037500 |
| 100 | 0.025000 |

A share above 100 is refused:

> pia_gas_in_country_share_pct must be a number from 0 to 100; got 120.

## A gas field on a ledger

The Ekene gas field (synthetic, shallow water, converted, 2026 to 2028) produces no crude oil and uses half its gas in-country:

| year | gas royalty rate | gas royalty | HCT | CIT |
| --- | --- | --- | --- | --- |
| 2026 | 0.037500 | 2250000.000000 | 0.000000 | 10713000.000000 |
| 2027 | 0.037500 | 2250000.000000 | 0.000000 | 11181000.000000 |

With no crude oil or condensate the cost price ratio cap is 0.000000 and there is no hydrocarbon tax at all. Companies income tax is charged on the gas profit, after the gas royalty.

## The share on a mixed field

Ekene Alpha (synthetic, shallow water, converted, 2026 to 2032) sells associated gas beside its crude. Stating that all of its gas is used in-country moves the provision totals by:

| provision total | all gas in-country, less as run |
| --- | --- |
| royalties | -863333.550000 |
| hydrocarbon tax | 0.000000 |
| companies income tax | 259000.065000 |
| development levy | 34533.342000 |
| take percent | -0.068159 |

The royalty falls. The hydrocarbon tax does not move, because gas royalty is outside its base. Companies income tax and the levy rise a little, because a smaller royalty leaves a larger assessable profit. The take still falls: the government gives up more in royalty than it gains in tax.

## Exercise

Open the royalty calculator on "Gas royalty and gas used in-country". Type shares of 50, 100 and 100.5 and read the rate or the refusal each time. Then open the ledger calculator on "Which provision moved" with ekene_alpha_shallow_converted_nta loaded and enter {"pia_gas_in_country_share_pct": 100}. Confirm the table and explain the zero on the hydrocarbon tax row. Finally load ekene_nag_gas_in_country_half in "The whole ledger, year by year" and confirm that the hydrocarbon tax column is 0.000000 in every year.
