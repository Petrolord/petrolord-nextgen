# Fossil and non-fossil methane

{{panel:carbon-inventory-explorer}}

## Two values for one gas

Each assessment report the course prints gives methane two 100-year values. On AR6, fossil methane is 29.8 and non-fossil methane is 27. On AR5, fossil methane is 30 and non-fossil methane is 28. A set holds one of them, and its label says which.

The engine attaches a methane note to every set it builds. It is quoted here in full, verbatim:

"AR6 gives methane two 100-year values: fossil (29.8) and non-fossil (27.0). This set holds one. The atom balance here counts carbon that escapes a burner or a flare as methane, so the oxidation CO2 is counted nowhere else and the fossil value is the consistent one for vented, fugitive and unburned fossil methane alike."

## Reading the note

The note says that a set holds one of AR6's two values, and it gives a reason that runs through the atom balance. The engine counts escaped carbon as methane and does not count it as CO2, so, in the note's words, "the oxidation CO2 is counted nowhere else". The note calls the fossil value the consistent one for three kinds of methane: vented, fugitive and unburned fossil methane alike. At Igbogene those are the vented and fugitive methane line and the flare's unburned methane line.

## The course's set

That note is why the course computes every inventory on "IPCC AR6 GWP100, fossil methane". The course says so directly: the course uses that set because the engine counts escaped carbon as methane, as the methane note states. The other three sets are printed beside it.

## The same Igbogene on the non-fossil value

The lab rebuilds the inventory on the AR6 non-fossil set to show what the choice of methane value moves:

| set | Scope 1 tCO2e | Scope 2 tCO2e | total tCO2e | total less the course set |
| --- | --- | --- | --- | --- |
| IPCC AR6 GWP100, fossil methane | 30030.777 | 12915.000 | 42945.777 | 0.000 |
| IPCC AR6 GWP100, non-fossil methane | 29587.520 | 12915.000 | 42502.520 | -443.257 |

| set | Flaring (unburned CH4) tCO2e | Vented and fugitive methane tCO2e |
| --- | --- | --- |
| IPCC AR6 GWP100, fossil methane | 485.922 | 4231.600 |
| IPCC AR6 GWP100, non-fossil methane | 440.265 | 3834.000 |

Both sets are AR6 and both are the 100-year horizon. The only difference between them is which methane value they hold, and the Igbogene total on the non-fossil set is 42502.520 tCO2e. The lab's arithmetic prints its total less the course set as -443.257 tCO2e. Only the label's last words tell the two sets apart, and the engine states the label on every result as gwpSetLabel. The methane tonnes are the same on both rows: 16.306 t from the flare and 142.000 t vented. Scope 2 stays at 12915.000.

In practice, fossil methane comes from geological carbon, such as natural gas, and non-fossil methane from recent biological carbon, such as a landfill or a wetland.

Switch the panel between the AR6 fossil and AR6 non-fossil sets and read the two methane lines move while the CO2 lines hold.

## Exercise

Read the two AR6 rows of the inventory table and the methane lines on each. Say what the relationship between the two totals shows about the methane value a set holds.

Self check: on AR6 fossil methane, 29.8, the total is 42945.777 tCO2e. On AR6 non-fossil methane, 27, it is 42502.520 tCO2e, and the lab prints the total less the course set as -443.257 tCO2e. The report, the horizon and every activity are the same, so the methane value the set holds is the whole of the difference. The flare's methane line moves from 485.922 to 440.265 and the vented line from 4231.600 to 3834.000.
