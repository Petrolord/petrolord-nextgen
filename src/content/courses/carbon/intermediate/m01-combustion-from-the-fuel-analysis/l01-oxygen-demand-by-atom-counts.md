# Oxygen demand by atom counts

The Associate tier counted carbon at Igbogene and turned it into an inventory. This tier walks into a second invented record, Isiokpo, which the digest describes as a gas plant with one fired heater, a failed steam trap, its condensate system and four process streams. The first Isiokpo record is the fuel gas the heater burns, and the first thing the engine does with that fuel is count its atoms.

{{panel:carbon-efficiency-explorer}}

## The fuel as a list of molecules

SECTION 11 prints the Isiokpo fuel gas analysis in mole fractions. Like every flow, temperature and price in this course, it is invented for teaching and is no published figure:

| component | mole fraction |
| --- | --- |
| CH4 | 0.868 |
| C2H6 | 0.071 |
| C3H8 | 0.021 |
| CO2 | 0.025 |
| N2 | 0.015 |

The function that reads this analysis is combustionStoichiometry, one of the ten functions energyEfficiency exports (SECTION 1). It takes each code in the analysis and looks it up in energyEfficiency.FUEL_REFERENCE, which SECTION 1 prints with the atom counts of every component:

| code | C | H | O | S | N |
| --- | --- | --- | --- | --- | --- |
| CH4 | 1 | 4 | 0 | 0 | 0 |
| C2H6 | 2 | 6 | 0 | 0 | 0 |
| C3H8 | 3 | 8 | 0 | 0 | 0 |
| CO2 | 1 | 0 | 2 | 0 | 0 |
| N2 | 0 | 0 | 0 | 0 | 2 |

The engine's note on that table, verbatim: "Atom counts are definitional and drive the stoichiometry. Heating values are typical: the fuel analysis governs, and a measured value should replace these." The first sentence is this lesson. The heating values in the same table wait for module three.

## The rule the engine applies

SECTION 11 states the rule: the oxygen demand is c + h/4 + s - o/2 for each component, weighted by its mole fraction. The letters are the component's carbon, hydrogen, sulphur and oxygen atoms, read straight off FUEL_REFERENCE. The rule is arithmetic on counts, and the counts are what the note calls definitional. In practice, the c term is the oxygen carbon takes to become CO2 and the h/4 term is the oxygen hydrogen takes to become water.

For the Isiokpo analysis the weighted sum prints as o2PerKmolFuel 2.089500 kmol O2 per kmol fuel. That single figure is the start of everything in modules one and two: the air, the flue gas and the excess air are all built on it.

## Components that demand nothing

Two rows of the analysis add nothing to the demand. The CO2 in the fuel has c = 1 and o = 2, and SECTION 11 says it therefore demands no oxygen and passes into the flue gas. The N2 row carries no carbon, hydrogen, sulphur or oxygen at all, so every term of the rule is zero for it. Lesson three follows both of those inerts through the heater.

## What the counts put into the flue gas

The same atom counts decide the products. SECTION 11 prints, per kmol of fuel:

| output | value | unit |
| --- | --- | --- |
| products.co2PerKmolFuel | 1.098000 | kmol per kmol fuel |
| products.h2oPerKmolFuel | 2.033000 | kmol per kmol fuel |
| products.fuelN2PerKmolFuel | 0.015000 | kmol per kmol fuel |

The digest states that the 0.025 kmol of fuel CO2 is inside products.co2PerKmolFuel. The carbon that burns and the carbon that arrived already burned leave the stack in the same column.

## Exercise

SECTION 11 prints o2PerKmolFuel 2.089500 and products.co2PerKmolFuel 1.098000 for an analysis that carries CO2 at 0.025. Say which of the five components contribute to each of those two figures, and use the FUEL_REFERENCE atom counts to say why the fuel's CO2 appears in the second figure and adds nothing to the first.
