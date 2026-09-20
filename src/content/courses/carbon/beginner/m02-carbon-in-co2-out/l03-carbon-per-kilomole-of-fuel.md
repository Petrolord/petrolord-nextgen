# Carbon per kilomole of fuel

{{panel:carbon-inventory-explorer}}

## The second input

combustionCo2FromCarbon needs two quantities before it can count anything: a fuel quantity in kilomoles a year and the carbon per kilomole of fuel. The digest states what the second one is: "The carbon per kilomole of fuel is the fuel analysis read as carbon atoms". It is an input. The engine does not look it up and does not assume one.

## Atom counts are definitional

energyEfficiency carries a fuel reference table, and its carbon column is the kind of figure the analysis is read with. Here are the atom counts for the fuels the table holds:

| code | label | C | H | O | N | inert |
| --- | --- | --- | --- | --- | --- | --- |
| CH4 | Methane | 1 | 4 | 0 | 0 | no |
| C2H6 | Ethane | 2 | 6 | 0 | 0 | no |
| C3H8 | Propane | 3 | 8 | 0 | 0 | no |
| C4H10 | Butane | 4 | 10 | 0 | 0 | no |
| H2 | Hydrogen | 0 | 2 | 0 | 0 | no |
| CO2 | Carbon dioxide (inert) | 1 | 0 | 2 | 0 | yes |
| N2 | Nitrogen (inert) | 0 | 0 | 0 | 2 | yes |

The note beside the table says what those columns are: "Atom counts are definitional and drive the stoichiometry." A methane molecule carries one carbon atom and an ethane molecule carries two. Hydrogen and nitrogen carry none.

## The Igbogene heaters

Every Igbogene figure is invented for this course. The fired heaters burn 482000 kmol of fuel a year at 1.09 kmol of carbon per kmol of fuel, with a destruction efficiency of 1 typed for complete combustion. The engine counts 525380.000 kmol of carbon a year from those two inputs, and that carbon leaves as 23121.448 t of CO2.

## The same heaters at four carbon contents

Because the carbon per kilomole is an input, the heaters' CO2 moves with it. The digest runs the same fuel quantity at four values:

| carbon per kmol of fuel | co2Tonnes |
| --- | --- |
| 1.00 | 21212.338 |
| 1.05 | 22272.955 |
| 1.09 | 23121.448 |
| 1.15 | 24394.189 |

Read down the table. At 1.00 the heaters emit 21212.338 t of CO2. At 1.05 they emit 22272.955 t, at the Igbogene figure of 1.09 they emit 23121.448 t, and at 1.15 they emit 24394.189 t. As the carbon per kilomole rises, the CO2 rises with it. Nothing else in the call changed between the rows.

## What this input carries

The fuel quantity says how much fuel was burned. The carbon per kilomole says what that fuel was. A heater line needs both, and the engine reports the carbon they make, carbonKmolPerYear, beside the tonnes it weighs from it. The row for 1.09 is the Igbogene input and the one the inventory uses. The other three rows are the same heaters with a different figure typed in.

In practice, a fuel gas composition drifts as the wells behind it change, and a heater line is only as current as the analysis whose carbon count it was built from.

Change the carbon per kilomole in the panel and watch the heater line move. The fuel quantity stays at 482000 kmol while the CO2 follows the carbon.

## Exercise

Read the four rows of the carbon per kilomole table. Say what the relationship between the carbon per kilomole and co2Tonnes shows about what the fuel analysis decides in a heater line.

Self check: with the fuel fixed at 482000 kmol a year, co2Tonnes is 21212.338 at 1.00, 22272.955 at 1.05, 23121.448 at 1.09 and 24394.189 at 1.15. The CO2 rises as the carbon per kilomole rises, so the fuel analysis read as carbon atoms decides how much CO2 the same fuel quantity makes.
