# Gas outside the tax

{{panel:pia-hct-calculator}}

A field that sells only gas pays royalty and companies income tax and no hydrocarbon tax. This lesson reads that on the Ekene gas field, then marks the line the Act draws between associated and non-associated gas, which the engine does not compute.

## A gas field on the ledger

The Ekene gas field is synthetic: a shallow water converted lease producing 20000000 Mscf a year from 2026 to 2028, with no crude oil or condensate and half its gas used in-country. The engine returns:

| year | gas royalty rate | gas royalty | CPR cap | HCT | CIT assessable profit | CIT |
| --- | --- | --- | --- | --- | --- | --- |
| 2026 | 0.037500 | 2250000.000000 | 0.000000 | 0.000000 | 47710000.000000 | 10713000.000000 |
| 2027 | 0.037500 | 2250000.000000 | 0.000000 | 0.000000 | 49270000.000000 | 11181000.000000 |

The cost price ratio cap is 0 because it reads crude and condensate revenue, and there is none. With no liquids revenue the hydrocarbon tax base is empty and the tax is 0. Companies income tax is charged on the gas profit. The gas royalty rate of 0.037500 is the in-country blend: half the gas at 5 percent and half at 2.5 percent.

## The line the engine does not draw

The Act treats gas by its origin. Section 260(1)(b)(ii) takes out of the tax "(ii) condensates and natural gas liquids produced from non-associated gas in fields or gas processing plants, provided the related volumes are determined at the measurement points or at the exit of the gas processing plant,". Section 260(2) sends the costs of associated gas to crude oil: "(2) The costs of production of associated gas, upstream of the measurement point shall be allocated to crude oil for the purposes of calculating hydrocarbon tax, provided that capital and operating costs for wells solely".

Both are concept-only here. The engine carries one gas stream and cannot tell associated from non-associated gas, so it splits shared costs by revenue share, a stated approximation. The Expert tier returns to gas and its incentives.

## A refusal on the in-country share

The in-country share is a stated input from 0 to 100. Anything else is refused, and the engine says exactly why:

> pia_gas_in_country_share_pct must be a number from 0 to 100; got 120.

A refusal is the engine declining to run. A note in `kpis.pia_notes` is different: that is a result with a statement attached.

## Exercise

Work in the course's own hydrocarbon tax calculator, which calls the same engine.

1. Open "The tax base and the cost price ratio on a ledger" and start from ekene_nag_gas_in_country_half. Confirm the CPR cap and the HCT read 0.000000 in every year.
2. Switch to "Companies income tax on a ledger", choose the same case, and confirm companies income tax of 10713000.000000 in 2026.
3. Set `pia_gas_in_country_share_pct` to 0 and watch 2026 companies income tax. Explain its direction from the royalty.
4. Set it to 120 and read the refusal. Then try 100: the engine accepts it, all the gas pays 2.5 percent, and companies income tax rises above the half-share figure.
