# The Isiokpo heater end to end

Modules one to four read the Isiokpo heater one function at a time. This lesson reads it as one chain, from the fuel analysis to a year of fuel saved, and marks at each link the figure that carries forward and the box the engine will not fill for the caller. Every input in the chain is invented for this course.

{{panel:carbon-efficiency-explorer}}

## Link one: the fuel analysis

The chain starts from the fuel gas analysis of SECTION 11: CH4 0.868, C2H6 0.071, C3H8 0.021, CO2 0.025, N2 0.015. Counted atom by atom against FUEL_REFERENCE, it gives:

| output | value | unit |
| --- | --- | --- |
| o2PerKmolFuel | 2.089500 | kmol O2 per kmol fuel |
| stoichAirPerKmolFuel | 9.975652 | kmol air per kmol fuel |
| lhvMJPerKmolFuel | 840.9925 | MJ per kmol fuel |
| hhvMJPerKmolFuel | 930.6273 | MJ per kmol fuel |

The inerts ride through: the fuel's CO2 sits inside products.co2PerKmolFuel, 1.098000, and its nitrogen leaves on its own line. Air's argon is carried in the atmospheric nitrogen at 28.1610 kg per kmol, and the mass balance at 3 percent stack oxygen closes at 351.0222 kg per kmol of fuel on each side.

## Link two: the stack oxygen

The stoichiometry meets one measurement, the dry stack oxygen. SECTION 12 turns the current reading of 5.5 percent into 32.1223 percent excess air and the target of 2.8 percent into 13.9199 percent. Both carry the engine's assumption, verbatim: "Complete combustion. An oxygen reading alone cannot see carbon monoxide, so a stack making CO will read as if it had more excess air than it has." A blank reading is refused, and so is a reading of air itself.

## Link three: the efficiency on a declared basis

The flue gas becomes an efficiency in SECTION 13. With a stack at 238 C, air at 28 C and a radiation and convection loss of 1.8 percent read off the vendor's chart:

| case | basis | total loss percent | efficiency percent |
| --- | --- | --- | --- |
| current, 5.5 percent O2 | LHV | 13.5971 | 86.4029 |
| target, 2.8 percent O2 | LHV | 12.1524 | 87.8476 |
| current, 5.5 percent O2 | HHV | 22.0712 | 77.9288 |
| target, 2.8 percent O2 | HHV | 20.7657 | 79.2343 |

The radiation loss is typed because the engine refuses to default it, and it moves the efficiency one for one. The basis is carried on every row. The two bases are never set against each other: the gap of 8.4741 percentage points at the current reading is the digest's arithmetic on two figures for one unchanged heater.

## Link four: a year of fuel saved

SECTION 14 takes the two LHV efficiencies, holds the target against a declared floor of 2 percent, and applies the ratio to 410000 GJ a year on LHV:

| output | value |
| --- | --- |
| basis | LHV |
| fuelSavingFraction | 0.0164448058 |
| fuelSavingPercent | 1.6445 |
| annualEnergySavedGJ | 6742.370 |

The digest prints the percentage-point shortcut beside it, computed here from the engine's efficiencies: 5923.008 GJ a year, 819.363 GJ below the engine's saving. The engine returns only the ratio. On HHV, SECTION 14 prints a saving fraction of 0.0164763814 computed from the two HHV efficiencies, and no annual HHV figure; the 410000 GJ it prints is stated on LHV.

## The boxes along the way

Read the chain again for what the caller had to supply. The fuel analysis. The stack oxygen. The radiation and convection loss. The minimum safe stack oxygen and the target, checked against each other. The basis, the same on both efficiencies and on the fuel figure. At each of those the engine either answered from what it was given or refused, and at none of them did it read a blank as a figure.

## Exercise

Follow one figure through the chain: the current reading of 5.5 percent oxygen. Say what excess air SECTION 12 turns it into, what LHV efficiency SECTION 13 reports for it, and where it enters the saving of SECTION 14. Then say which two boxes in the chain the engine refuses to default and what each refusal gives as its reason.
