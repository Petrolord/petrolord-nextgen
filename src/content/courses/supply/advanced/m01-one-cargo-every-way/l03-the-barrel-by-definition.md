# The barrel by definition

The barrel is the unit a price screen quotes and the unit no terminal in this course measures. Nobody dips a tank in barrels. The barrel enters a cargo's paperwork as a conversion of a volume somebody measured in cubic metres, and the engine keeps that conversion as a fixed constant for exactly that reason.

{{panel:supply-price-explorer}}

## Two constants and a rule

The `fuelPricing` module exports two unit constants:

- `LITRES_PER_M3` is 1000;
- `M3_PER_BBL` is 0.158987294928.

Barrels are cubic metres divided by the second constant. The engine never reaches a barrel from tonnes directly. It forms the cubic metres through the density first, then divides. So a quantity entered in tonnes reaches the barrel column through the density and then the constant. The digest's density sweep shows the first step moving: the same 34000 tonnes read 45637.584 m3 at PMS's typical 745 kg/m3 and 40476.190 m3 at AGO's typical 840 kg/m3.

That order tells you where to look when two barrel figures for one cargo disagree. The constant cannot be the cause. Either the density differs or the quantity typed in differs.

## Entering a cargo in barrels

`cargoQuantities` accepts a barrel quantity and converts back the other way. The BADAGRY cargo entered as 287900 bbl at 742.8 kg/m3 comes back as:

| quantity (stated) | unit (stated) | m3 | litres | tonnes | barrels |
| --- | --- | --- | --- | --- | --- |
| 287900 | bbl | 45772.442 | 45772442.21 | 33999.7701 | 287900.0000 |
| 34000 | tonne | 45772.752 | 45772751.75 | 34000.0000 | 287901.9470 |

The second row is the cargo as its bill of lading states it in tonnes. The first row is the same cargo quoted to a round number of barrels. The barrel column of each row returns what it was given, 287900.0000 and 287901.9470, and every other column follows from it through the constant and the density.

## A unit the engine does not know

The module accepts tonnes, m3, litres and barrels. Hand it a unit outside that list and it refuses rather than guessing what was meant:

> REFUSED: Unknown quantity unit "kg".

The refusal is the whole answer. The call returns no quantity in any unit, so nothing from it can be carried forward into a landed cost.

## Why a definition belongs in the engine and a density does not

The contrast with the last lesson is the point of this one. The engine ships the barrel as a constant, M3_PER_BBL, and applies the same figure to every product. It ships no density default because a density belongs to one cargo on one certificate. A constant the engine owns can be exported, and the module exports this one by name. A measurement the engine does not own has to come in as an input, and when it does not come in, the engine says so.

## Exercise

Record `M3_PER_BBL` and `LITRES_PER_M3` as the module exports them. From the two rows above, record the m3 and the tonnes the engine returns for 287900 bbl and for 34000 tonnes. Then quote the refusal for the unit "kg" and say what the two rows show about which input, the constant or the quantity typed, sets the barrel figure.
