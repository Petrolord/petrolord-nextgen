# Energy equivalence and its ratio

The bus has never run on CNG, so no one has measured what it would use. `conversionEconomics` still gives a CNG consumption: 10.1449 kg per 100 km. This lesson reads where that figure comes from, and the one input that moves it.

{{panel:gasvalue-rollout-explorer}}

## Derived from energy equivalence

The bus: 14 litres of PMS per 100 km, PMS at 32 MJ a litre, CNG at 48 MJ a kg. No consumption on CNG is measured, and the converted engine turns CNG energy into distance 0.92 times as well as PMS energy. That last figure is the efficiency ratio.

The engine prints the source of its CNG figure:

| field | value |
| --- | --- |
| consumptionSource | derived from energy equivalence |
| newFuelConsumptionPer100Km (kg) | 10.1449 |

consumptionSource reads derived from energy equivalence. It is the first field on the result to read. It names what the CNG figure rests on. The figure 10.1449 kg per 100 km comes from the PMS consumption, the two fuels' energy contents and the efficiency ratio.

## The ratio moves the answer

The efficiency ratio moves the answer. The same bus at other ratios:

| efficiency ratio (input) | newFuelConsumptionPer100Km | annualSaving | simplePaybackYears |
| --- | --- | --- | --- |
| 0.8 | 11.6667 | 3507666.6700 | 0.3421 |
| 0.92 | 10.1449 | 3825710.1400 | 0.3137 |
| 1 | 9.3333 | 3995333.3300 | 0.3004 |

At 0.8, the CNG consumption is 11.6667 kg per 100 km, the saving 3507666.6700 naira a year and the payback 0.3421 years. At 0.92 they are 10.1449, 3825710.1400 and 0.3137. At 1 they are 9.3333, 3995333.3300 and 0.3004.

A ratio of 1 is the reading in which CNG energy turns into distance exactly as well as PMS energy. The engine accepts it as an input like any other ratio; it is one row of three here, and the course does not say which ratio is right for a bus.

## A stated ratio, never assumed

The ratio has no default. With no measured consumption and the efficiency ratio left blank, the engine refuses:

| probe | engine |
| --- | --- |
| no measured consumption and the efficiency ratio left blank | REFUSED: Either a measured consumption on the new fuel, or both fuels' energy content and an efficiency ratio, are required. Neither is assumed. |

The refusal names the two ways in. One is a measured consumption on the new fuel. The other is both fuels' energy content with an efficiency ratio. Neither is assumed.

## When a consumption is measured

With a measured CNG consumption of 9.5 kg per 100 km, the engine uses it. consumptionSource reads "as measured", and simplePaybackYears is 0.3030.

So consumptionSource prints one of two phrases, and each names what the CNG figure rests on: derived from energy equivalence, or as measured.

## Reading the source first

Two results for the same bus can print different CNG consumptions and different paybacks. The first field to read is consumptionSource. On the derived result, the ratio typed is part of the answer, and the table above shows the payback at three ratios: 0.3421, 0.3137 and 0.3004 years. On the measured result, the payback is 0.3030 years.

In practice, an operator converting a fleet runs one converted bus and measures its consumption before converting the rest.

## In the explorer

Open the customer's switch. Read consumptionSource and the CNG consumption. Set the ratio to 0.8, then 1, and read the consumption, the saving and the payback each time. Clear the ratio and read the refusal. Then type a measured consumption of 9.5 and read consumptionSource and the payback.

## Exercise

Read the ratio table: 0.8, 0.92 and 1 giving 11.6667, 10.1449 and 9.3333 kg per 100 km and paybacks of 0.3421, 0.3137 and 0.3004 years. Then read the measured case: 9.5 kg per 100 km, consumptionSource "as measured", payback 0.3030. Say what consumptionSource names on each result, what the engine requires when no consumption is measured, and quote the refusal's last sentence.
