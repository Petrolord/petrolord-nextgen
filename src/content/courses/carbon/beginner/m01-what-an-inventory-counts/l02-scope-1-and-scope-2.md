# Scope 1 and Scope 2

{{panel:carbon-inventory-explorer}}

## Two scopes and a constant

carbonAbatement exports one constant for scopes, and it holds two values:

carbonAbatement.SCOPE: ONE 1, TWO 2

Every line of an inventory carries one of those two numbers, and buildInventory totals each scope on its own before it adds them. The inventory names the two totals itself: Scope 1 is "direct" and Scope 2 is "purchased energy".

## The Igbogene lines by scope

Igbogene's inventory has four sources and five lines. Every figure in it is invented for this course, and the electricity factor behind the Scope 2 line is synthetic. The lines are computed on the course's GWP set, "IPCC AR6 GWP100, fossil methane".

| line | scope | gas | tCO2e |
| --- | --- | --- | --- |
| Fired heaters (CO2) | 1 | CO2 | 23121.448 |
| Flaring (CO2) | 1 | CO2 | 2191.807 |
| Flaring (unburned CH4) | 1 | CH4 | 485.922 |
| Vented and fugitive methane | 1 | CH4 | 4231.600 |
| Purchased electricity | 2 | CO2 | 12915.000 |

Four of the five lines are Scope 1: the fired heaters, the vented and fugitive methane, and the flare. The flare appears twice. One line carries the carbon that burned and left as CO2, and the other carries the carbon that escaped combustion, which the engine counts as methane.

One line is Scope 2, the purchased electricity. Its activity is 31500.000 MWh, and the line converts it at Igbogene's invented factor of 0.41 tCO2/MWh into 12915.000 tCO2e. It is the one line in the inventory whose activity is energy bought in, which is the Scope 2 label, "purchased energy".

Every line reaches its scope total in tCO2e. The two methane lines start as tonnes of methane, 16.306 t CH4 from the flare and 142.000 t CH4 vented, and each is converted at a GWP of 29.8 on the course's set. The CO2 lines carry a GWP of 1.

## The totals

| total | tCO2e |
| --- | --- |
| Scope 1 (direct) | 30030.777 |
| Scope 2 (purchased energy) | 12915.000 |
| Total, Scope 1 and Scope 2 | 42945.777 |

SECTION 7 prints the rule behind the table: every line is activity x factor x GWP, in tCO2e, Scope 1 is the sum of its 4 lines, Scope 2 the sum of its 1 line, and the total the two scopes together. The total's label says exactly what it covers.

## A line off both scopes

SCOPE holds 1 and 2 and nothing else, so a line on any other scope is outside what buildInventory totals. The course adds a business travel line on scope 3 to the complete Igbogene inventory, and the engine blocks it and names why:

| line | reason |
| --- | --- |
| Business travel | scope 3 is not Scope 1 or Scope 2, which is all this inventory totals |

The total stays 42945.777 tCO2e. The line is not dropped in silence: it is listed as blocked with its reason, and the inventory stops being reportable.

In practice, reporting frameworks describe emissions beyond these two scopes; this engine totals Scope 1 and Scope 2 and names any other line it is handed.

Open the inventory panel and find the scope column. Each line keeps its scope beside its tonnes, and the two scope totals sit beside the grand total.

## Exercise

Read the five Igbogene lines and the three totals. Say what the relationship between the lines and the totals shows about how buildInventory builds each scope.

Self check: the four Scope 1 lines, 23121.448, 2191.807, 485.922 and 4231.600 tCO2e, make the Scope 1 total of 30030.777 tCO2e. The one Scope 2 line of 12915.000 tCO2e is the Scope 2 total. The total of 42945.777 tCO2e is the two scope totals together, and a scope 3 line is blocked with its reason and leaves the total where it is.
