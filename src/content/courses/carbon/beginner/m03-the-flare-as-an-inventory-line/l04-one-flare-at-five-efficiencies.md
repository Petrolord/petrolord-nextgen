# One flare at five efficiencies

{{panel:carbon-inventory-explorer}}

## The whole table

The Igbogene flare sends 38500 kmol of gas a year to the flame at 1.32 kmol of carbon per kmol. Both figures are invented for this course, and so is every destruction efficiency below. Each row is one call to combustionCo2FromCarbon, and the methane line is converted on "IPCC AR6 GWP100, fossil methane", CH4 29.8:

| destruction efficiency | co2Tonnes | ch4Tonnes | methane line tCO2e | flare tCO2e (CO2 plus methane line) |
| --- | --- | --- | --- | --- |
| 1 | 2236.537 | 0.000 | no line (no methane) | 2236.537 |
| 0.99 | 2214.172 | 8.153 | 242.961 | 2457.133 |
| 0.98 | 2191.807 | 16.306 | 485.922 | 2677.729 |
| 0.95 | 2124.711 | 40.765 | 1214.805 | 3339.515 |
| 0.9 | 2012.884 | 81.531 | 2429.610 | 4442.493 |

## Reading the columns one at a time

Start with co2Tonnes. It is 2236.537 at 1 and falls down the table to 2012.884 at 0.9. As the efficiency drops, less of the carbon burns, and less CO2 leaves the flame.

Now ch4Tonnes. It is 0.000 at 1 and rises down the table to 81.531 at 0.9. The carbon that does not leave as CO2 leaves as methane. Both columns are tonnes of gas, and they are tonnes of different gases. SECTION 5 prints the flare's carbonKmolPerYear as 50820.000 at every efficiency in the table: the efficiency splits that carbon between CO2 and methane; it does not change it.

The methane line converts ch4Tonnes on the course's set. At 1 there is no methane and so no line. At 0.99 the line is 242.961 tCO2e, at 0.98 it is 485.922, at 0.95 it is 1214.805 and at 0.9 it is 2429.610 tCO2e.

The last column adds the CO2 and the methane line. It is 2236.537 tCO2e at 1, 2457.133 at 0.99, 2677.729 at 0.98, 3339.515 at 0.95 and 4442.493 at 0.9. It rises at every step down the table.

## What the table says about the input

The CO2 column falls as the efficiency drops, and the flare's total rises. Each row's total is its CO2 plus its methane line, and the two are weighted differently: CO2 carries a GWP of 1 on every set, and the methane is converted at 29.8 on the course's set. On this flare, a lower destruction efficiency makes the CO2 smaller and the total larger.

That is why the efficiency is an input. The digest measures two rows against each other: read as 100 percent, the same flare is 2236.537 tCO2e with no methane line, 441.191 tCO2e below the flare at 0.98. And at 0.98 the methane line is a share of 0.181468 of the flare. Both figures are the digest's arithmetic on the engine's figures.

## The row the inventory uses

The Igbogene inventory uses the operator's stated 0.98. It carries two flare lines from that row: "Flaring (CO2)" at 2191.807 tCO2e and "Flaring (unburned CH4)" at 485.922 tCO2e. The other four rows are the same flare with a different efficiency typed in, and none is in the inventory.

In practice, a flare study states one efficiency for stated conditions, and a flare that runs outside them runs at an efficiency nobody has written down.

Slide the flare's efficiency in the panel from 1 to 0.9 and watch the two tonnes columns move in opposite directions while the total climbs.

## Exercise

Read the co2Tonnes column and the flare tCO2e column from 1 down to 0.9. Say what the relationship between the two columns shows about the effect of a lower destruction efficiency on the flare's line in the inventory.

Self check: co2Tonnes falls from 2236.537 at 1 to 2012.884 at 0.9, while the flare's tCO2e rises from 2236.537 to 4442.493. The methane that replaces the lost CO2 is counted at 29.8 on the course's set, so a lower efficiency makes the flare's CO2 smaller and its total in tCO2e larger.
