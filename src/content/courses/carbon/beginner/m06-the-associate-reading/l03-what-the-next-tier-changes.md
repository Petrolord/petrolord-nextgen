# What the next tier changes

## From the inventory to the plant

This tier has read carbonAbatement: the atom balance, the flare as an inventory line, the GWP sets, factors as records, computed against reportable, and intensity over a boundary. The next tier turns to the other module, energyEfficiency, and to the other app, the Energy & Utilities Efficiency Studio.

Its record is ISIOKPO, and like Igbogene it is invented: a gas plant with one fired heater, a failed steam trap, its condensate system and four process streams.

## The functions it reads

energyEfficiency exports ten functions: combustionStoichiometry, compositeCurve, condensateReturnValue, energyIntensity, excessAirFromFlueOxygen, excessAirSaving, pinchTargets, priceSaving, stackLossEfficiency and steamTrapLoss. The digest's headings for the next tier name what they are used for: the Isiokpo fuel gas and combustion from the analysis, excess air from the stack oxygen, stack loss efficiency on LHV and on HHV, what tuning the excess air is worth, the Isiokpo steam trap, condensate return and its floor, and the pinch by the problem table.

## What carries over

Three things from this tier carry straight across.

The atom counts. The fuel reference table you read for carbon per kilomole sits in energyEfficiency, and its note says what its atom counts do: "Atom counts are definitional and drive the stoichiometry. Heating values are typical: the fuel analysis governs, and a measured value should replace these."

The rule that a missing value stays missing. The digest's list of rules in force includes several for the next tier: "A target oxygen is required and checked against the declared floor"; "A trap needs a boiler efficiency for fuel and carbon, an isentropic exponent, and hours a year"; "Only an interior zero of the cascade is a pinch". Each one is a box the engine will not fill for you.

The basis on every figure. energyEfficiency exports HEATING_VALUE_BASIS with two values, LHV and HHV. A GWP set in this tier is stated on every result. In the next tier the heating value basis travels with the figures, and the rules in force include one for it: "A saving, its price and its factor declared on different heating value bases are refused".

## What is new

The next tier works in energy as well as carbon, and it carries a table of typical properties, each one labelled typical: a flue gas specific heat, a water vapour specific heat and a latent heat of water. The held methane heating value pair, H2, is met there.

It also uses ATMOSPHERIC_N2_MOLAR_MASS, and the rules in force say air's argon is carried at it and the flue gas mass balance closes.

In practice, a fired heater's fuel is where efficiency and carbon meet: fuel saved in the firebox is carbon that never reaches the stack.

## Exercise

Read the digest's rule for the trap and the rule for the target oxygen. Say what the relationship between those rules and the flare's destruction efficiency in this tier shows about how both modules treat an input nobody filled.

Self check: the flare's destruction efficiency is refused when blank, because it is not read as 100 percent. The trap needs a boiler efficiency, an isentropic exponent and hours a year, and a target oxygen is required and checked against the declared floor. Both modules treat a missing input as missing and name what they need.
