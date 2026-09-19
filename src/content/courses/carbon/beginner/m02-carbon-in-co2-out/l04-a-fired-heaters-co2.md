# A fired heater's CO2

{{panel:carbon-inventory-explorer}}

## The Igbogene heaters in one call

The Igbogene fired heaters are one call to combustionCo2FromCarbon. The inputs are invented for this course: fuel 482000 kmol a year, 1.09 kmol of carbon per kmol of fuel, and a destruction efficiency of 1, typed for complete combustion. The engine answers:

| output | value |
| --- | --- |
| carbonKmolPerYear | 525380.000 |
| co2Tonnes | 23121.448 |
| ch4Tonnes | 0.000 |
| unburnedNote | none |

Read each row. carbonKmolPerYear is the carbon the engine counted from the fuel and its analysis. co2Tonnes is that carbon leaving as CO2, weighed at MW_CO2. ch4Tonnes is 0.000 because at a destruction efficiency of 1 no carbon escapes. unburnedNote is none.

## Typed, and not defaulted

The heaters' destruction efficiency of 1 is typed into the call. The engine does have a default of complete combustion for an argument left out, and it says who that default is for: "A burner is the case that default is for. A flare is asked for its efficiency every time." A fired heater is a burner. The Igbogene record still types the figure, so the line in the inventory rests on a value somebody entered.

## A burner line can split too

A heater at complete combustion makes one gas. Type a lower destruction efficiency and the same heaters' line splits into CO2 and methane:

| destruction efficiency | co2Tonnes | ch4Tonnes |
| --- | --- | --- |
| 0.999 | 23098.327 | 8.429 |
| 0.995 | 23005.841 | 42.143 |

At 0.999 the heaters emit 23098.327 t of CO2 and 8.429 t of methane. At 0.995 they emit 23005.841 t of CO2 and 42.143 t of methane. The carbon that stops leaving as CO2 leaves as methane instead, and the methane column is in tonnes of methane.

The rule is the same one the 1000 kmol table showed. The carbon in is fixed by the fuel and its analysis. The destruction efficiency divides it between the two routes.

## The heater line in the inventory

In the Igbogene inventory the heaters become one line: "Fired heaters (CO2)", scope 1, gas CO2, activity 23121.448 t CO2, a factor of 1 tCO2/tCO2, a GWP of 1, and 23121.448 tCO2e. Its source is "Atom balance (conservation of mass)" and its version is "not applicable". Provenance is complete. The Carbon Studio builds atom-balance lines from a result that computed, through a factor of one, so the tonnes the engine returned pass into the inventory unchanged.

The heaters are also the line that survives the Igbogene first pass. Built with no GWP set declared, no electricity factor and no flare efficiency, the inventory still computes one figure, and it is the heaters' 23121.448 tCO2e.

In practice, a fired heater burns its fuel in a closed firebox and a flare burns in the open air, and the engine asks the flare for its efficiency every time.

Open the panel and lower the heaters' destruction efficiency. A methane line appears beside the CO2 line.

## Exercise

Read the heaters at 1, at 0.999 and at 0.995. Say what the relationship between co2Tonnes and ch4Tonnes across the three rows shows about what a lower destruction efficiency does to a burner line.

Self check: at 1 the heaters emit 23121.448 t of CO2 and 0.000 t of methane. At 0.999 they emit 23098.327 t of CO2 and 8.429 t of methane, and at 0.995 they emit 23005.841 t of CO2 and 42.143 t of methane. As the efficiency falls, the CO2 falls and the methane rises, because the same carbon is divided between the two routes.
