# Destruction efficiency is an input

{{panel:carbon-inventory-explorer}}

## The Igbogene flare

The Igbogene flare is the second call to combustionCo2FromCarbon in the inventory. Its inputs are invented for this course: gas to the flare 38500 kmol a year, at 1.32 kmol of carbon per kmol. The operator's flare study states a destruction efficiency of 0.98, and that figure is invented too.

Those three numbers are the whole of what the atom balance needs. The gas and its carbon per kilomole fix the carbon that goes into the flame. The destruction efficiency decides how much of that carbon leaves as CO2 and how much escapes and is counted as methane.

## One flare, five answers

Here is the same flare at five destruction efficiencies. The methane line is converted at the course's GWP set, "IPCC AR6 GWP100, fossil methane", with CH4 at 29.8:

| destruction efficiency | co2Tonnes | ch4Tonnes | methane line tCO2e | flare tCO2e (CO2 plus methane line) |
| --- | --- | --- | --- | --- |
| 1 | 2236.537 | 0.000 | no line (no methane) | 2236.537 |
| 0.99 | 2214.172 | 8.153 | 242.961 | 2457.133 |
| 0.98 | 2191.807 | 16.306 | 485.922 | 2677.729 |
| 0.95 | 2124.711 | 40.765 | 1214.805 | 3339.515 |
| 0.9 | 2012.884 | 81.531 | 2429.610 | 4442.493 |

Every row is the same gas and the same carbon. Only the destruction efficiency changes, and the flare's total moves from 2236.537 tCO2e at 1 to 4442.493 tCO2e at 0.9.

## Why the input decides the answer

The engine's default of complete combustion is for a burner. A flare is asked for its efficiency every time, and the engine's refusal of a blank gives the reason: "It is not read as 100 percent: for a flare it is the answer, and it is contested." The table shows what "it is the answer" means. The one input that differs between the rows is the destruction efficiency, and it sets the flare's tCO2e.

The engine therefore treats the efficiency as an input like the gas quantity. It must be typed, it must be a fraction in (0, 1], and a blank box is refused. The Igbogene inventory uses the operator's stated 0.98, which gives 2191.807 t of CO2 and 16.306 t of methane, a flare of 2677.729 tCO2e on the course's set. In the inventory it becomes two lines, "Flaring (CO2)" at 2191.807 tCO2e and "Flaring (unburned CH4)" at 485.922 tCO2e, both scope 1 and both sourced to the atom balance.

## Where this line stops

This course reads the flare as one line of an inventory. What the flared gas is worth, and how it could be recovered, belongs to the sibling course Flare Gas to Value & LPG/CNG.

In practice, a flare's destruction efficiency depends on wind, gas composition and flow rate, and the operator's study is where the Igbogene figure comes from.

Open the panel and move the flare's destruction efficiency between 0.9 and 1. Watch the CO2 column fall and the methane line rise as the efficiency drops.

## Exercise

Read the flare at 1 and at 0.98. Say what the relationship between the two rows shows about which input decides the flare's tCO2e.

Self check: at 1 the flare is 2236.537 t of CO2 with no methane line, 2236.537 tCO2e. At 0.98 it is 2191.807 t of CO2 and 16.306 t of methane, whose methane line is 485.922 tCO2e, a flare of 2677.729 tCO2e. The gas and its carbon are the same in both rows, so the destruction efficiency is the input that decides the answer.
