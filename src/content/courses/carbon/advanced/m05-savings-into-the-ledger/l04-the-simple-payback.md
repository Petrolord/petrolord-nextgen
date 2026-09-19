# The simple payback

`energyEfficiency.priceSaving` returns one more figure beside the money, the carbon and the cost per tonne: a simple payback in years. SECTION 23 prints it on the invented AGBOR saving. This course teaches it as the engine prints it, and grades nothing that rests on it.

{{panel:carbon-abatement-explorer}}

## The figure

| output | value |
| --- | --- |
| annualValue USD | 88500.00 |
| annualTonnesCo2e | 661.980 |
| simplePaybackYears | 2.372881 |
| costPerTonneCo2e USD | -74.2270 |

The saving is 11800 GJ a year at an invented fuel price of 7.5 USD a GJ, with an implementation cost of 210000 USD over 8 years at 0.1, and every figure here is invented for this course. The engine prints simplePaybackYears 2.372881, a figure in years, to six decimals.

SECTION 23 prints what the figure is: the implementation cost over one year's value, 210000 / 88500.00 = 2.372881 years (computed here), undiscounted, with no life and no rate in it.

## What no oracle recomputes

SECTION 26 names what neither oracle recomputes: carbonIntensity, the curve's residual to target and paysForItselfTonnes, compositeCurve, and the simple payback. They are taught from the engine and never graded. So 2.372881 years is the engine's figure, taught here as printed, and it carries no second route behind it.

The cost per tonne beside it is different. SECTION 26 says the energyEfficiency oracle computes a levelised cost per tonne, and the carbonAbatement oracle levels the cost per tonne from a year-by-year present value ledger. The -74.2270 USD a tonne is recomputed by another route. The 2.372881 years is not.

## Two figures in two units

The simple payback is in years. The cost per tonne is in US dollars a tonne of CO2e. They answer different questions and cannot be compared with each other. The payback carries no tonnes at all. The cost per tonne is built by the same function as the costs of the six Agbor measures of module two, and it is the figure this tier reads beside theirs.

## What the payback is not

The simple payback is not the cost per tonne, and it is not the one-year figure of the last lesson. SECTION 23 computes that figure, 183.5403 USD a tonne, by setting the whole implementation cost against one year's value and one year's tonnes, and prints it only for contrast. It is in US dollars a tonne and it is the wrong route. The simple payback, 2.372881, is in years and it is the engine's own output.

## Scope

This course computes no net present value and no internal rate of return, and grades no decision built on one. The levelised cost per tonne is this tier's subject. The simple payback appears because the engine returns it, and it is read as the engine prints it.

## Exercise

Read simplePaybackYears and costPerTonneCo2e for the Agbor saving, with SECTION 26's list of outputs no oracle recomputes. Say what the two figures, read with their units and with that list, show about which of them this course grades and which it teaches as printed.
