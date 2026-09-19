# The component reference table

A gas analysis is a list of codes and mole fractions. The figures the engine needs for each code, its carbon, its molar mass, its heating value and its liquid density, sit in one exported table.

{{panel:gasvalue-flare-explorer}}

## GAS_COMPONENT_REFERENCE

This is the table as flareToValue exports it:

| code | label | carbon per molecule | molar mass lb/lbmol | typical heating value Btu/scf | liquid density lb/gal | recoverable as NGL | inert |
| --- | --- | --- | --- | --- | --- | --- | --- |
| C1 | Methane | 1 | 16.043 | 1010 | none | false | false |
| C2 | Ethane | 2 | 30.07 | 1770 | 2.971 | true | false |
| C3 | Propane | 3 | 44.096 | 2516 | 4.233 | true | false |
| IC4 | Iso-butane | 4 | 58.122 | 3252 | 4.695 | true | false |
| NC4 | n-Butane | 4 | 58.122 | 3263 | 4.872 | true | false |
| C5 | Pentanes plus | 5 | 72.15 | 4010 | 5.253 | true | false |
| N2 | Nitrogen | 0 | 28.014 | 0 | none | false | true |
| CO2 | Carbon dioxide | 1 | 44.01 | 0 | none | false | true |

The studio fills a gas analysis from these rows. The analysis then carries the figures, and the engine reads what it is given.

## Two kinds of figure in one table

The engine's note on the table sorts its columns into two kinds: "Molar masses and carbon numbers are definitional. Heating values and liquid densities are typical: the gas analysis and the certificate govern, and a measured value should replace these."

So the carbon per molecule and the molar mass columns are definitional. The typical heating value and the liquid density columns are typical figures, and for those the engine's own note says the gas analysis and the certificate govern. When a lesson in this tier quotes a heating value or a density from this table, it is quoting the engine's typical figure.

## Reading the columns

Carbon per molecule counts carbon atoms. Methane carries 1, ethane 2, propane 3, both butanes 4 and pentanes plus 5. Nitrogen carries 0.

Liquid density is given in lb/gal for ethane and heavier, from 2.971 for ethane to 5.253 for pentanes plus. Methane, nitrogen and carbon dioxide read none.

Recoverable as NGL reads true on exactly the rows that carry a liquid density: C2, C3, IC4, NC4 and C5. Module three sums the liquids over the recoverable components.

Inert reads true on two rows, N2 and CO2. Both carry a typical heating value of 0.

## The CO2 row

One row carries a carbon number and an inert flag together. The CO2 row carries one carbon per molecule and is marked inert: its carbon is counted when the carbon per mole is counted, and it is not a fuel.

Keep that row in view. Module two counts the carbon in the gas atom by atom, and the CO2's carbon is in that count. Module four flares the gas, and there the CO2 already in the gas leaves the flare as CO2 at every efficiency. Both lessons read back to this one row.

## A typical figure in a live analysis

The table's heating values and liquid densities are the engine's labelled typical figures, and the flare explorer shows them beside the analysis. Open the explorer, find the propane row and read its carbon per molecule, molar mass, heating value and liquid density against the table above. Then find the CO2 row and read its carbon and its inert flag.

## Exercise

Read the N2 row and the CO2 row. Both are marked inert and both carry a typical heating value of 0. N2 carries 0 carbon per molecule and CO2 carries 1. Say what the engine's sentence about the CO2 row says happens to that one carbon, in the carbon per mole and as a fuel.

Self check: the CO2 row's carbon is counted when the carbon per mole is counted, and CO2 is not a fuel. N2 carries no carbon, so it adds nothing to the carbon per mole. The two inert rows share a heating value of 0 and differ in their carbon.
