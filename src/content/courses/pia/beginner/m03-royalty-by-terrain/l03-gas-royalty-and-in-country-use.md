# The gas royalty and in-country use

{{panel:pia-royalty-calculator}}

Gas has a simpler royalty than crude oil. There are no tranches and no terrain rates: one rate for gas and natural gas liquids, and a lower rate for gas produced and used in Nigeria. The lower rate rewards gas that stays in the country, and it makes the in-country share a stated input on every case. The Expert tier reads the wider gas incentives; this lesson reads the royalty alone.

## The rule in the text

The Seventh Schedule para 10(6):

> "(6) Royalty based on production for natural gas and natural gas liquids shall be at a rate of 5% of the chargeable volume and royalty rate for natural gas produced and utilised in-country shall be 2.5% of the chargeable volume."

The Regulations add two points. Natural gas liquids produced separately pay 5 percent wherever they go:

> "(4) The royalty rate of natural gas liquids produced separately, shall be 5% regardless of whether the natural gas liquids are used in-country or exported."

and gas for export pays 5 percent (r.16(5)). Only gas used in-country earns the 2.5 percent rate.

## One blended rate

The engine takes the in-country share as `pia_gas_in_country_share_pct`, from 0 to 100 with a default of 0, and returns one blended rate. Every terrain pays the same gas rate.

| in-country share percent (stated) | gas royalty rate, every terrain |
| --- | --- |
| 0 | 0.050000 |
| 25 | 0.043750 |
| 50 | 0.037500 |
| 100 | 0.025000 |

A share outside 0 to 100 is refused:

> pia_gas_in_country_share_pct must be a number from 0 to 100; got 100.5.

## A gas field with no crude

The gas case, ekene_nag_gas_in_country_half, is a shallow water field that produces 20000000 Mscf of gas a year from 2026 to 2028 and no crude or condensate, with half its gas used in-country. Its gas royalty rate prints as 0.037500, half the gas at 5 percent and half at 2.5 percent, and its gas royalty is 2250000.000000 USD in each of the three years. It pays no liquids royalty and no royalty by price, because it sells no crude oil or condensate.

| year | gas royalty rate | gas royalty | total royalty |
| --- | --- | --- | --- |
| 2026 | 0.037500 | 2250000.000000 | 2250000.000000 |
| 2027 | 0.037500 | 2250000.000000 | 2250000.000000 |
| 2028 | 0.037500 | 2250000.000000 | 2250000.000000 |

The same field pays no hydrocarbon tax, because gas sits outside that tax, and it pays companies income tax on its gas profit. The Professional tier reads why.

## Associated gas on an oil field

On Ekene Alpha the associated gas pays the gas royalty at 0.050000 in every year, because the case states no in-country share. Its 2026 gas royalty is 350400.000000 USD.

## Exercise

Open the royalty calculator and choose "Gas royalty and gas used in-country". Enter shallow_water and step the in-country share through 0, 25, 50 and 100, reading each rate. Change the terrain and confirm the rate does not move. Enter 100.5 and copy the refusal. Then switch to "The instruments stacked on a ledger", run ekene_nag_gas_in_country_half, change pia_gas_in_country_share_pct in the case box to 100 and run it again. Say which columns moved.
