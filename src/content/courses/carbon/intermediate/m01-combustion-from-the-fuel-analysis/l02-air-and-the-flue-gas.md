# Air and the flue gas

Lesson one ended with an oxygen demand: o2PerKmolFuel 2.089500 kmol O2 per kmol of the invented Isiokpo fuel gas. A heater is not fed pure oxygen. It is fed air, and this lesson reads what combustionStoichiometry does with that air and what leaves the stack as a result.

{{panel:carbon-efficiency-explorer}}

## The engine's air

energyEfficiency carries its air as constants, printed in SECTION 1:

| constant | value |
| --- | --- |
| O2_MOLE_FRACTION_DRY_AIR | 0.20946 |
| AIR_MOLAR_MASS | 28.9647 |
| O2_MOLAR_MASS | 31.998 |

These are constants of the module. Unlike the fuel analysis, they are no input of the Isiokpo record, and every fuel the engine burns meets the same air.

## Stoichiometric air, in moles and in mass

SECTION 11 prints the air the Isiokpo fuel needs to meet its oxygen demand with none to spare, in two units:

| output | value | unit |
| --- | --- | --- |
| stoichAirPerKmolFuel | 9.975652 | kmol air per kmol fuel |
| stoichAirKgPerKgFuel | 15.612763 | kg air per kg fuel |
| fuelMolarMassKgKmol | 18.5068 | kg per kmol |

SECTION 11 prints how the first follows from lesson one's oxygen demand: the stoichiometric air is that oxygen over O2_MOLE_FRACTION_DRY_AIR, 2.089500 / 0.20946 = 9.975652. The first figure is on a molar basis and the second on a mass basis. SECTION 11 prints the fuel's molar mass beside them, 18.5068 kg per kmol, and FUEL_REFERENCE carries a molar mass for every component of the analysis. A reader quoting stoichiometric air has to carry the unit with it, because 9.975652 and 15.612763 are the same air stated two ways.

## What leaves the stack with no excess air

SECTION 12 prints the flue gas at a range of dry stack oxygen readings. Its first row is the reading of 0 percent:

| dry O2 percent | excess air percent | actual air kmol per kmol fuel | dry flue gas kmol per kmol fuel | wet flue gas kmol per kmol fuel |
| --- | --- | --- | --- | --- |
| 0 | 0.0000 | 9.975652 | 8.999152 | 11.032152 |

The actual air in that row is 9.975652, the same figure SECTION 11 prints as stoichAirPerKmolFuel, and the excess air is 0.0000 percent. That is the 0 row: a stack reading of no oxygen at all, excess air 0.0000 percent.

Two flue gas figures appear in the row, one dry and one wet, and every row of SECTION 12 carries both. SECTION 12 prints the relation between them: the wet flue gas less the dry is the water the hydrogen makes, 2.033000 in every row, which is products.h2oPerKmolFuel. In practice, a stack oxygen analyser reads on the dry basis. The digest also prints the air's nitrogen leaving as products.airN2PerKmolFuel 7.886152 kmol per kmol fuel, a figure lesson four returns to, because what the engine calls nitrogen there carries more than nitrogen.

SECTION 12 is indexed by dry O2 percent, so the reading module two starts from is a dry reading.

## The mass balance closes

SECTION 11 prints a mass balance at 3 percent stack oxygen, per kmol of fuel:

| side | kg per kmol of fuel |
| --- | --- |
| fuel plus air in (fuel molar mass plus actual air times AIR_MOLAR_MASS) | 351.0222 |
| flue gas out (engine dry flue gas plus engine moisture) | 351.0222 |
| out less in (computed here) | 0.000001 |

SECTION 12 carries no row at 3 percent; the digest strikes the balance at that reading on its own. The in side is the fuel plus the air at AIR_MOLAR_MASS. The out side is the engine's dry flue gas plus its moisture. The difference, 0.000001 kg per kmol of fuel, is the digest's own arithmetic on the engine's figures, and SECTION 25 lists "the flue gas mass balance closes" among the rules in force.

## Exercise

Read the 0 percent row of SECTION 12 beside SECTION 11's stoichAirPerKmolFuel, and then read the mass balance at 3 percent. Say what the actual air in that row tells you about the excess air at a stack reading of no oxygen, and what the out less in figure of 0.000001 kg per kmol of fuel shows about the engine's flue gas.
