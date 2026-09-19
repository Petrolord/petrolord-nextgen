# What the engines will not ship

## Two lists: what is exported and what is not

The two modules export constants, and it is worth reading what those constants are. carbonAbatement exports three molar masses and the scope numbers:

| constant | value |
| --- | --- |
| carbonAbatement.MW_CO2 | 44.009 |
| carbonAbatement.MW_C | 12.011 |
| carbonAbatement.MW_CH4 | 16.043 |
| carbonAbatement.SCOPE | ONE 1, TWO 2 |

energyEfficiency exports eleven constants: air and oxygen constants, a list of heating value bases (LHV and HHV), a fuel reference table and its note, a table of typical stack properties, ATOMIC_WEIGHT (the atomic weights of C, H, O, N and S), PRODUCT_MOLAR_MASS (the flue gas products) and ATMOSPHERE_BAR_A (one standard atmosphere).

What neither module exports is stated just as plainly: neither module exports an emission factor or a global warming potential. The held items list says it again for the whole course: "GWP values, emission factors and every price are inputs. Neither engine ships one."

## An empty GWP set

A GWP set is built by makeGwpSet from what the caller passes. Built with nothing in it, the set says so:

| call | label | gases | declared |
| --- | --- | --- | --- |
| makeGwpSet({}) | none | 0 | false |

The set exists, it holds 0 gases and it is not declared. In the Igbogene inventory built with no set declared, the vented methane line is blocked, and the engine names the reason: "no global warming potential for CH4 in the declared set".

## A factor with a value and nothing else

A factor is built by makeFactor, and the record keeps more than the number. Typed with a value and nothing else, it still comes back as a record, and the record says what it lacks:

| label | value | unit | gas | hasValue | provenanceComplete | missingProvenance |
| --- | --- | --- | --- | --- | --- | --- |
| A factor typed with no source | 2.5 | tCO2/t | CO2 | true | false | source, version |

The factor has a value, so hasValue is true. It has no source and no version, so provenanceComplete is false and missingProvenance names the two missing fields. The engine keeps the value and reports what the record lacks.

## Typical is labelled typical

The fuel reference table in energyEfficiency does carry heating values, and it carries a note with them, verbatim: "Atom counts are definitional and drive the stoichiometry. Heating values are typical: the fuel analysis governs, and a measured value should replace these."

The stack property table does the same. Each row is labelled as typical: a flue gas specific heat of 1.1 kJ/kg K, a water vapour specific heat of 1.95 and a latent heat of 2442 kJ/kg at a 25 C reference.

## Why this matters for the course

Because the engines ship no factor, no GWP and no price, the course has to type every one in, and it says where each came from. The factors and prices are invented for this course and are not published figures; the electricity factor and the fuel emission factor are synthetic. The GWP sets are IPCC 100-year values as tabulated by GHG Protocol, version 2.0, 7 August 2024.

In practice, an emission factor or a GWP changes between editions and between sources, and a value built into a tool would carry no record of which one it was.

## Exercise

Read the makeGwpSet row and the factor row. Say what the relationship between hasValue and provenanceComplete in the factor row shows about what the engine counts as a complete factor.

Self check: the empty set holds 0 gases and is declared false, so nothing was filled in for the caller. The factor typed as 2.5 tCO2/t has hasValue true and provenanceComplete false, with source and version missing. A value on its own is not a complete factor: the engine counts a factor complete only when its source and version are recorded with it.
