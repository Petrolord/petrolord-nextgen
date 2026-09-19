# Inerts ride through

Two of the five components in the invented Isiokpo fuel gas analysis burn nothing: CO2 at 0.025 and N2 at 0.015 (SECTION 11). This lesson follows them from the fuel line to the stack, and reads what the engine prints when one of them is taken out.

{{panel:carbon-efficiency-explorer}}

## What FUEL_REFERENCE says about them

SECTION 1 prints the two inert rows of energyEfficiency.FUEL_REFERENCE:

| code | label | C | H | O | S | N | molar mass kg/kmol | typical LHV MJ/kmol | typical HHV MJ/kmol | inert |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| CO2 | Carbon dioxide (inert) | 1 | 0 | 2 | 0 | 0 | 44.009 | 0 | 0 | yes |
| N2 | Nitrogen (inert) | 0 | 0 | 0 | 0 | 2 | 28.014 | 0 | 0 | yes |

Both carry a heating value of 0 on each basis and the flag inert yes. Both still carry atom counts and a molar mass. The engine does not drop an inert from the analysis. It keeps it, with its atoms and its mass, and lets the atom counts decide what it does.

SECTION 1 adds one sentence about the CO2 row: it, PRODUCT_MOLAR_MASS.CO2 and carbonAbatement.MW_CO2 are one number, 44.009, so an inert CO2 in the fuel weighs the same going in as it does in the flue gas.

## The fuel's CO2

The CO2 row has c = 1 and o = 2. SECTION 11 says what follows: it demands no oxygen and passes into the flue gas, and the 0.025 kmol of fuel CO2 is inside products.co2PerKmolFuel, which prints 1.098000 kmol per kmol fuel.

In practice, that is why a fuel gas with CO2 in it puts more CO2 up the stack than its burning carbon alone would.

The Associate tier met the same idea at Igbogene, where SECTION 4 calls the carbon per kilomole of fuel the fuel analysis read as carbon atoms and takes the Igbogene figure as an input. At Isiokpo, combustionStoichiometry reads the analysis itself, inerts included.

## The fuel's nitrogen

The N2 row carries no carbon, hydrogen, sulphur or oxygen, so it demands no oxygen either. SECTION 11 prints it leaving as products.fuelN2PerKmolFuel 0.015000 kmol per kmol fuel, and states that the fuel's nitrogen is carried separately from the air's. The air's nitrogen leaves as products.airN2PerKmolFuel 7.886152 kmol per kmol fuel, and lesson four reads what the engine carries inside the air's figure.

## The inerts dilute the fuel

SECTION 11 prints one more calculation: the same analysis with the CO2 taken out and the rest renormalised.

| analysis | o2PerKmolFuel | lhvMJPerKmolFuel |
| --- | --- | --- |
| as analysed, CO2 at 0.025 | 2.089500 | 840.9925 |
| CO2 taken out, the rest renormalised | 2.143077 | 862.5564 |

The digest's reading of that pair is one short sentence: the inerts dilute the fuel. A kilomole of the fuel as analysed carries its share of CO2, which brings no oxygen demand and no heating value, and so both figures are per kmol of a fuel that includes it.

For a reader of the engine, the lesson is about the basis of a figure. o2PerKmolFuel and lhvMJPerKmolFuel are per kmol of the fuel the analysis describes. Change the analysis and both change, even when the burning components have not.

## Exercise

Read the two rows of the renormalised comparison above, both printed in SECTION 11. Say which of the two analyses shows the higher oxygen demand and the higher LHV per kmol of fuel, and explain from the FUEL_REFERENCE row for CO2 why taking the CO2 out moves both figures in the direction it does.
