# The Badagry cargo end to end

This lesson walks one cargo through the whole tier in one pass, from the tonnes on its bill of lading to the exchange rate at which a capped pump price stops covering it. The point is to see every link at once and to name, at each one, the input it needed.

BADAGRY is an invented record. Its FOB price, its ocean loss, its exchange rate and every freight, insurance, duty, charge, margin, levy, tax and cap on it are invented for this course and describe no market.

{{panel:supply-price-explorer}}

## The cargo

34000 tonnes of PMS at 742.8 kg/m3. The density is the first input the engine requires. Through it the cargo is 45772.752 m3, 45772751.75 litres and 287901.9470 barrels.

## The landed cost walk

Money is in US dollars.

| stage | value USD |
| --- | --- |
| FOB | 23392000.00 |
| C&F | 24293000.00 |
| CIF | 24331931.09 |
| landed total | 26513943.86 |

FOB is 688.00 USD a tonne on 34000 tonnes. The invented freight of 26.5 USD a tonne is the C&F step. The invented insurance of 0.16 percent of CIF is solved in closed form, which gives CIF. The seven landed lines follow, each on its named base: the invented duty and financing on the frozen CIF, port per tonne, regulatory per litre, jetty and storage per m3, demurrage per cargo.

## The litre sold

The importer pays on the bill of lading and sells the outturn. At the invented ocean loss of 0.45 percent, the outturn is 45566774.37 litres. The landed total is divided by it: 0.581870 USD a litre sold. At the invented exchange rate of 1520.4000 naira to the dollar, converted once at the end, that is 884.6753 naira a litre, the landed cost at the depot gate.

The jetty and storage lines, 54927.30 USD and 121297.79 USD, are levied on the bill-of-lading 45772.752 m3 where the outturn is 45566.774 m3. That is held finding H1, a contract term the engine does not know.

## The pump price

From 884.6753 naira a litre, seven invented elements are added in order. Six are per litre. The last, the invented value added tax of 6.5 percent, is a percent of the running total of 1009.2253 and adds 65.5996. The pump price is 1074.8249 naira a litre.

## The cap

Against the invented cap of 1150.0000 naira a litre, the shortfall is -75.1751 and the cap covers the chain. Re-priced along the exchange rate, the cap covers the chain at 1500.0000 naira to the dollar and does not at 1650.0000. Bisection finds the breakeven at 1641.7105 naira to the dollar after 18 steps.

## Every link was an input

Read back up the chain and name the inputs: a density, a quantity and its unit, an FOB price and its basis, 9 import rates each with a base and a stage, an ocean loss, an exchange rate, 7 pump elements each with a basis and a recipient, and a cap. The engine ships none of the rates. Leave out the density, a rate, the exchange rate or the cap and the engine refuses, labels its answer as a floor or reports the figure it cannot form as none.

## Exercise

Record, in order, the litres on the bill of lading, CIF, the landed total, the outturn litres, the USD per litre sold, the naira per litre sold, the pump price and the breakeven exchange rate, each with its unit. Say what the landed total, read against the naira per litre sold and the pump price, shows about where in the chain the ocean loss and the exchange rate each enter.
