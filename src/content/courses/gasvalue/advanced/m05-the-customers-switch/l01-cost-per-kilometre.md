# Cost per kilometre

IBAFO's station needs customers, and in this course its first is a Lagos bus operator deciding whether to convert a bus from PMS to CNG. The operator and every figure attached to the bus are invented. `conversionEconomics` answers the question on cost per kilometre, with a saving and a simple payback. This lesson reads the cost per kilometre on each fuel.

{{panel:gasvalue-rollout-explorer}}

## The bus

A Lagos bus covering 55000 km a year on 14 litres of PMS per 100 km at 780 naira a litre (32 MJ a litre). CNG at 380 naira a kg (48 MJ a kg). No consumption on CNG is measured, and the converted engine turns CNG energy into distance 0.92 times as well as PMS energy. Conversion 1200000 naira; extra maintenance 60000 naira a year.

## What the engine returns on each fuel

| field | value |
| --- | --- |
| PMS litres a year | 7700.0000 |
| PMS cost a year | 6006000.0000 |
| PMS cost per km | 109.2000 |
| newFuelConsumptionPer100Km (kg) | 10.1449 |
| CNG kg a year | 5579.7100 |
| CNG cost a year | 2120289.8600 |
| CNG cost per km | 38.5507 |
| savingPerKm | 69.5584 |

## The PMS side

On PMS the bus uses 7700.0000 litres a year. At 780 naira a litre that costs 6006000.0000 naira a year, and the engine prints the PMS cost per km as 109.2000 naira.

## The CNG side

On CNG the bus's consumption is 10.1449 kg per 100 km. No consumption on CNG was measured, so this figure is derived, and the next lesson reads how. The bus uses 5579.7100 kg a year. At 380 naira a kg that costs 2120289.8600 naira a year, and the engine prints the CNG cost per km as 38.5507 naira.

## Two units, one comparison

PMS is bought by the litre and CNG by the kilogram. The two fuels' consumptions are in different units: 14 litres per 100 km against 10.1449 kg per 100 km. The engine brings them to one unit a customer can compare: naira per kilometre. The PMS figure is 109.2000 and the CNG figure is 38.5507.

The engine also prints savingPerKm, 69.5584 naira. It also prints the annual saving after maintenance, 3825710.1400 naira, which the payback lesson reads.

## Money in this module

Money here is in naira, and every price is invented and illustrative. The course prints the naira to four decimals, as the engine's result gives them, and it does not convert them to dollars.

## A price or a distance missing

| probe | engine |
| --- | --- |
| no annual distance | REFUSED: Annual distance, base consumption and both fuel prices are required. |

The annual distance, the base consumption on PMS and the prices of both fuels are all required. The engine refuses the switch if any is missing.

## The emissions line

The engine also prints kgCo2eAvoidedPerYear, 2365.8000, on emission factors of 2.3 kg CO2e a litre of PMS and 2.75 a kg of CNG, both illustrative. In practice, a fleet's emissions as an inventory line are the carbon course's (`carbon`) subject.

In practice, an operator reads the cost per kilometre against its fares and its routes.

## In the explorer

Open the customer's switch. Read the PMS litres, cost and cost per km, then the CNG kilograms, cost and cost per km. Change the CNG price and read the CNG cost per km move while the PMS side stays at 109.2000.

## Exercise

Read the two sides: PMS 7700.0000 litres, 6006000.0000 naira and 109.2000 naira per km; CNG 10.1449 kg per 100 km, 5579.7100 kg, 2120289.8600 naira and 38.5507 naira per km; savingPerKm 69.5584. Say what unit the engine puts both fuels in to compare them, and which figure on the CNG side is derived because no consumption on CNG was measured.
