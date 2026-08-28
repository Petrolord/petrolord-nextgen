# The separator test that is listed

One row of the report, four numbers, and the conditions that produced them.

{{panel:fluid-study-explorer}}

## The row

Good Oil Well No. 4's optimum separator test, at 100 psig and 75 F:

| quantity | value |
|---|---|
| total gas-oil ratio | 768 scf/stb |
| stock tank gravity | 40.7 API |
| formation volume factor at the bubble point | 1.474 rb/stb |
| separator pressure | 100 psig, which is 114.65 psia |
| separator temperature | 75 F |

The report contains four such rows at different separator pressures. This is the one the engine's gate uses, because it is the optimum: the pressure that produced the most stock tank liquid.

## What each number means

**768 scf/stb** is all the gas from all the stages, divided by the stock tank barrel that resulted. Not the gas from the separator alone.

**40.7 API** is the gravity of the liquid in the tank at 60 F. It is what the oil is sold on and it is the number that will appear in the field's economics.

**1.474 rb/stb** is the volume of reservoir fluid at the bubble point that produced one stock tank barrel through THIS separator train. Change the separator pressure and this number changes.

## The optimum, and why there is one

Separator pressure trades two losses against each other.

Too LOW, and the first stage releases too much: intermediate components that could have stayed in the liquid leave as gas, and the stock tank volume is smaller.

Too HIGH, and the intermediates stay in the liquid through the separator and then flash off in the tank, where the gas is at atmospheric pressure and is usually flared or has to be compressed from nothing. Tank losses are the expensive kind.

Between them, a pressure that maximises stock tank liquid. For this fluid the report found it near 100 psig, which is why that row is the one to reproduce.

## Why the study ran four

Because the optimum cannot be predicted reliably enough to skip measuring it, and because the facilities engineer needs the curve rather than the point.

It is also a useful internal check: four tests on the same fluid should produce a smooth trend in stock tank gravity against separator pressure. A row that breaks the trend is a measurement to question.

## What this row anchors

Everything. The differential liberation gives the shape of Bo and Rs through depletion, and this row gives the level they are anchored to at the bubble point.

Run the Amyx correction with a different separator row and you get a different Bo table from the same differential data. That is not an error; it is the correct statement that Bo depends on the surface facilities.

## The trap in reproducing it

The report lists ONE stage, the separator. The stock tank is not listed as a stage because it is not equipment somebody chose.

But the liquid leaving the separator at 114.65 psia arrives in the tank at 14.65 psia, and gas comes off there too. That gas is part of the 768.

A model that flashes the fluid once, from the bubble point straight to 114.65 psia, and calls the result the stock tank has skipped a flash. The next lesson is what that does.

## The misconception to avoid

"The formation volume factor is a fluid property, so the separator conditions are surface detail." Bo is reservoir volume per STOCK TANK barrel, and the separator train decides how much matter a stock tank barrel is. Two separator trains on the same fluid give two different Bo values and both are correct, which is why a Bo without its separator conditions is incomplete.

## Exercise

First, write out the four numbers of the optimum separator row with their units, and say which of them defines the denominator of the formation volume factor.

Second, explain in two sentences why a separator pressure that is too high costs stock tank liquid, given that higher pressure keeps more material in the liquid phase at the first stage.
