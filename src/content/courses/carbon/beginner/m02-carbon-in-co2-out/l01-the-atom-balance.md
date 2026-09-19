# The atom balance

{{panel:carbon-inventory-explorer}}

## Carbon in equals CO2 out

The CO2 from burning a fuel is computed in this course by counting carbon atoms. combustionCo2FromCarbon takes the fuel burned in a year, the carbon atoms in each kilomole of it and the fraction of that carbon that is destroyed by combustion. The engine states its method, and it is quoted here in the engine's own words:

"Atom balance: carbon in equals CO2 out. This is conservation of mass, not an empirical factor, so it needs no source document."

That sentence is why a combustion line in the Igbogene inventory can show a source of "Atom balance (conservation of mass)" and a version of "not applicable". There is no factor to look up, so there is no document to cite.

## One thousand kilomoles

The clearest case is a fuel with one carbon atom in each molecule. Take 1000 kmol of it and burn it completely, then at three lower destruction efficiencies:

| destruction efficiency | carbon kmol | co2Tonnes | ch4Tonnes |
| --- | --- | --- | --- |
| 1 | 1000.000 | 44.009 | 0.000 |
| 0.99 | 1000.000 | 43.569 | 0.160 |
| 0.98 | 1000.000 | 43.129 | 0.321 |
| 0.95 | 1000.000 | 41.809 | 0.802 |

The carbon column is 1000.000 kmol in every row. The carbon that goes in does not depend on how well it burns. What changes is where it ends up.

Each kilomole of carbon that burns leaves as MW_CO2 kilograms of CO2, so 1000 kmol burned completely is 44.009 t. Each kilomole that escapes leaves as MW_CH4 kilograms of methane. Every row divides the same 1000.000 kmol between those two routes.

## Reading the rows

At a destruction efficiency of 1, all the carbon burns: co2Tonnes is 44.009 and ch4Tonnes is 0.000. At 0.99 the result is 43.569 t of CO2 and 0.160 t of methane. At 0.98 it is 43.129 t and 0.321 t, and at 0.95 it is 41.809 t and 0.802 t. Down the table, as the destruction efficiency falls, co2Tonnes falls and ch4Tonnes rises.

Read the two columns carefully, because they are different quantities. co2Tonnes is tonnes of CO2. ch4Tonnes is tonnes of methane. Neither is yet in tCO2e. The methane becomes tCO2e only when a declared GWP set converts it.

## Two gases and no third

The result carries these keys and no other gas: co2Tonnes, ch4Tonnes. Nitrous oxide from combustion is not computed by the atom balance. It is a held item of the course, and it needs an emission factor line of its own.

The destruction efficiency itself is typed as a fraction. The rows above use 1, 0.99, 0.98 and 0.95, and every one of them is an input to the call.

Open the panel and set the heaters' destruction efficiency. The same split, burned carbon to CO2 and escaped carbon to methane, runs on every source the atom balance computes.

## Exercise

Read the four rows of the 1000 kmol table. Say what the relationship between the carbon kmol column and the two tonnes columns shows about what the destruction efficiency decides.

Self check: carbon kmol is 1000.000 in every row, so the carbon in is fixed. The destruction efficiency decides how that carbon is divided: at 1 it all leaves as 44.009 t of CO2 and 0.000 t of methane, and at 0.95 it leaves as 41.809 t of CO2 and 0.802 t of methane. The two tonnes columns are different gases and neither is in tCO2e.
