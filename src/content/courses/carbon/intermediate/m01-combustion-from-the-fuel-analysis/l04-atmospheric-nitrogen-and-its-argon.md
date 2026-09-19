# Atmospheric nitrogen and its argon

Lessons two and three left one figure unexplained: products.airN2PerKmolFuel 7.886152 kmol per kmol fuel, the air's nitrogen leaving the Isiokpo heater (SECTION 11). This lesson reads what the engine means by nitrogen in that column, and why the flue gas mass balance of lesson two closes because of it.

{{panel:carbon-efficiency-explorer}}

## Four constants for one air

SECTION 1 prints the constants energyEfficiency uses for air:

| constant | value |
| --- | --- |
| O2_MOLE_FRACTION_DRY_AIR | 0.20946 |
| AIR_MOLAR_MASS | 28.9647 |
| O2_MOLAR_MASS | 31.998 |
| ATMOSPHERIC_N2_MOLAR_MASS | 28.1610 |

The fourth is marked differently from the other three. SECTION 1 says it is printed to four decimals and derived by the engine from the three air constants above it, and prints the formula: (AIR_MOLAR_MASS - O2_MOLE_FRACTION_DRY_AIR x O2_MOLAR_MASS) / (1 - O2_MOLE_FRACTION_DRY_AIR). It is no value typed into the module. It is what is left of air once its oxygen is accounted for.

In practice, dry air carries argon and small amounts of other gases beside its oxygen and nitrogen, and a combustion calculation has to decide where those gases go.

## Atmospheric nitrogen is a name for everything else

SECTION 11 states the engine's treatment directly: air enters at AIR_MOLAR_MASS, and the air's non-oxygen part leaves as "atmospheric nitrogen" at ATMOSPHERIC_N2_MOLAR_MASS, which carries air's argon. The column products.airN2PerKmolFuel is that non-oxygen part of the air, counted in kilomoles and weighed at 28.1610 kg per kmol.

That is a different molar mass from the nitrogen in FUEL_REFERENCE, where the N2 row prints 28.014 kg per kmol. SECTION 11 keeps the two nitrogens in separate columns. The fuel's nitrogen is a measured component of the analysis and leaves as products.fuelN2PerKmolFuel 0.015000 kmol per kmol fuel. The air's nitrogen is the remainder of the engine's air and leaves at its own molar mass.

## Why the balance needs it

Lesson two read the mass balance SECTION 11 prints at 3 percent stack oxygen:

| side | kg per kmol of fuel |
| --- | --- |
| fuel plus air in (fuel molar mass plus actual air times AIR_MOLAR_MASS) | 351.0222 |
| flue gas out (engine dry flue gas plus engine moisture) | 351.0222 |
| out less in (computed here) | 0.000001 |

The in side weighs the air at AIR_MOLAR_MASS, argon and all. For the out side to weigh the same air, the non-oxygen part has to leave at a molar mass that carries the argon too, and ATMOSPHERIC_N2_MOLAR_MASS is that molar mass. SECTION 25 lists the rule as one of those in force: "Air's argon is carried at ATMOSPHERIC_N2_MOLAR_MASS, and the flue gas mass balance closes".

The out less in figure, 0.000001 kg per kmol of fuel, is the digest's arithmetic on the engine's two sides, marked computed here. It is quoted as the digest prints it.

## Where the dry flue gas mass shows up again

The same weighing reaches module three. SECTION 13 prints dryFlueGasKgPerKmolFuel at 5.5 percent stack oxygen as 363.6388 and moistureKgPerKmolFuel as 36.6245. SECTION 13 prints them in the same place as the dry flue gas loss and the moisture loss of the heater's stack loss efficiency, which module three reads line by line. The masses this module builds are the masses that module weighs.

## Exercise

Read the N2 molar mass in FUEL_REFERENCE, 28.014 kg per kmol, beside ATMOSPHERIC_N2_MOLAR_MASS, 28.1610. Then read the two sides of the SECTION 11 mass balance. Say what the engine puts into the second molar mass that the first does not carry, and what the mass balance at 3 percent stack oxygen shows about that choice.
