# One saving in money and carbon

An energy saving is one quantity of fuel not burned. `energyEfficiency.priceSaving` prices it twice from that one quantity: once in money, once in carbon. The lab prints the call on an invented AGBOR saving, and this module reads it.

{{panel:carbon-abatement-explorer}}

## The inputs

Every figure here is invented for this course, and the money is in US dollars:

- an energy saving of 11800 GJ a year;
- fuel at 7.5 USD a GJ;
- a SYNTHETIC emission factor of 56.1 kg CO2e per GJ;
- an implementation cost of 210000 USD over 8 years at a rate of 0.1;
- all three quantities, the saving, the price and the factor, declared on LHV.

The factor is synthetic. It is not a published fuel factor, and nothing in this lesson says what a real fuel's factor is.

## The outputs

| output | value |
| --- | --- |
| annualValue USD | 88500.00 |
| annualTonnesCo2e | 661.980 |
| simplePaybackYears | 2.372881 |
| costPerTonneCo2e USD | -74.2270 |
| basis | LHV |

Two of these come straight from the saving. annualValue, 88500.00 USD a year, is the saving priced at the invented fuel price. annualTonnesCo2e, 661.980 tCO2e a year, is the same saving carried through the synthetic factor. Both rest on the same 11800 GJ a year.

The other two bring in the implementation cost. costPerTonneCo2e, -74.2270 USD a tonne, is the levelised cost of the carbon, and lesson three reads how it is built. simplePaybackYears, 2.372881, is read in lesson four.

## Money and carbon travel together

The call returns both figures from one set of inputs, and the lab prints them in the same table, each with its unit: US dollars a year and tCO2e a year. The money figure rests on the saving and the fuel price. The carbon figure rests on the saving and the factor. The saving, the price and the factor are all declared on one basis, LHV, and the next lesson reads why that declaration is required. Neither figure is converted into the other, and a reader quotes each in its own unit.

## What a missing factor does

The carbon figure needs an emission factor. With no factor supplied, the lab prints annualTonnesCo2e none, with the carbonNote: "No emission factor supplied, so the carbon figure is absent rather than zero." A saving with no factor still has a money value. Its carbon is missing, and the engine prints it as missing. It does not print 0 tCO2e.

## A saving is required

The one input the call cannot do without is the saving itself. A blank saving is refused:

REFUSED: An energy saving is required.

## Where the carbon goes next

The 661.980 tCO2e a year is a tonnage of the same kind as the tonnes abated a year on the curve of module two. The cost per tonne built from it is the same function the curve's measures are costed with, and lesson three shows the hand-over.

## Exercise

Read annualValue, annualTonnesCo2e and the carbonNote for the call with no emission factor. Say what the two figures, read with the note, show about which output rests on the fuel price, which rests on the factor, and what the engine returns for the carbon when the factor is missing.
