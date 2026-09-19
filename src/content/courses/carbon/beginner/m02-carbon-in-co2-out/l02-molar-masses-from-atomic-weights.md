# Molar masses from atomic weights

{{panel:carbon-inventory-explorer}}

## Three constants

The atom balance counts carbon in kilomoles, and an inventory reports tonnes. The bridge between them is a molar mass, the mass of one kilomole in kilograms. carbonAbatement exports three:

| constant | value, kg per kmol | built from |
| --- | --- | --- |
| MW_C | 12.011 | carbon |
| MW_CO2 | 44.009 | 12.011 plus two oxygens at 15.999 |
| MW_CH4 | 16.043 | 12.011 plus four hydrogens at 1.008 |

The engine's molar masses come from the IUPAC conventional atomic weights. Carbon is 12.011. Carbon dioxide is one carbon and two oxygens. Methane is one carbon and four hydrogens.

The oxygen weight of 15.999 and the hydrogen weight of 1.008 in that table are read back from the engine's own molar masses. They are the digest's arithmetic on the engine's constants, and they show how each constant is built. The engine itself exports the three molar masses and no atomic weight for oxygen or hydrogen.

## From kilomoles to tonnes

Each kilomole of carbon that burns leaves as MW_CO2 kilograms of CO2. Each kilomole that escapes leaves as MW_CH4 kilograms of methane. The carbon atom is the same atom on both routes. What differs is what it leaves with: two oxygens on one route, four hydrogens on the other.

That is why 1000 kmol of carbon burned completely is 44.009 t of CO2. One thousand kilomoles at 44.009 kilograms each is 44.009 tonnes, and the figure in the table carries the molar mass straight through.

Here is the same 1000 kmol again, at four destruction efficiencies:

| destruction efficiency | carbon kmol | co2Tonnes | ch4Tonnes |
| --- | --- | --- | --- |
| 1 | 1000.000 | 44.009 | 0.000 |
| 0.99 | 1000.000 | 43.569 | 0.160 |
| 0.98 | 1000.000 | 43.129 | 0.321 |
| 0.95 | 1000.000 | 41.809 | 0.802 |

Read the methane column with the molar mass in mind. At 0.95, the carbon that escaped leaves as 0.802 t of methane, weighed at MW_CH4. The CO2 column is weighed at MW_CO2. The two columns are tonnes of two different molecules, so neither can be added to the other until a GWP set puts the methane into tCO2e.

## Why atomic weights

An atom balance needs no emission factor, because the mass of CO2 from a kilomole of carbon is fixed by the atomic weights. The engine's method sentence says the same thing in its own words: the balance is conservation of mass and needs no source document. The only constants inside it are these molar masses, and they are labelled with where they come from.

In practice, atomic weights are reference data published by IUPAC, and a molar mass built from them is the same wherever the fuel is burned.

Open the panel and look at the flare's two lines. The CO2 line is in tonnes of CO2 and the methane line starts in tonnes of methane, each weighed at its own molar mass.

## Exercise

Read MW_CO2 and MW_CH4 and the 1 and 0.95 rows of the table. Say what the relationship between the molar masses and the two tonnes columns shows about how the atom balance weighs the carbon it counts.

Self check: MW_CO2 is 44.009 and MW_CH4 is 16.043 kg per kmol. At a destruction efficiency of 1, 1000 kmol of carbon leaves as 44.009 t of CO2, which is 1000 kmol at MW_CO2. At 0.95 the escaped carbon leaves as 0.802 t of methane, weighed at MW_CH4. Each route weighs the same carbon with the molecule it leaves as.
