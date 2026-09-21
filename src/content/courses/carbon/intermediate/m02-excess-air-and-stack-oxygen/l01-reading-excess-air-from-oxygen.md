# Reading excess air from oxygen

Module one built the Isiokpo heater's combustion with no oxygen to spare. In practice, a heater is run with more air than its fuel needs, and the number an operator reads to know how much more is the oxygen left in the stack. This module reads what excessAirFromFlueOxygen, one of the energyEfficiency functions SECTION 1 lists, does with that reading.

{{panel:carbon-efficiency-explorer}}

## One reading in, the whole flue gas out

The function takes a measured dry stack oxygen and the stoichiometry of module one. SECTION 12 prints what it returns for the invented Isiokpo fuel gas at eight readings:

| dry O2 percent | excess air percent | actual air kmol per kmol fuel | dry flue gas kmol per kmol fuel | wet flue gas kmol per kmol fuel |
| --- | --- | --- | --- | --- |
| 0 | 0.0000 | 9.975652 | 8.999152 | 11.032152 |
| 1 | 4.5228 | 10.426827 | 9.450327 | 11.483327 |
| 2 | 9.5230 | 10.925631 | 9.949131 | 11.982131 |
| 2.8 | 13.9199 | 11.364257 | 10.387757 | 12.420757 |
| 4 | 21.2938 | 12.099847 | 11.123347 | 13.156347 |
| 5.5 | 32.1223 | 13.180063 | 12.203563 | 14.236563 |
| 8 | 55.7461 | 15.536691 | 14.560191 | 16.593191 |
| 12 | 121.0076 | 22.046948 | 21.070448 | 23.103448 |

Every row is one call. The oxygen column is the input, and the other four columns are what the engine derives from it and from the fuel. The first row is the 0 row of lesson two: no oxygen in the stack, excess air 0.0000 percent and actual air equal to stoichAirPerKmolFuel, 9.975652.

## Reading a row

Take the reading of 5.5 percent. The engine reports excess air of 32.1223 percent, actual air of 13.180063 kmol per kmol fuel, a dry flue gas of 12.203563 and a wet flue gas of 14.236563, both in kmol per kmol fuel. Each of those is per kilomole of the Isiokpo fuel, so each belongs to this fuel analysis and no other.

Two rows of the table matter more than the rest for the modules that follow. SECTION 13 and SECTION 14 call the reading of 5.5 percent the heater's current state and the reading of 2.8 percent its target, where the table prints excess air of 13.9199 percent. Module three turns both into efficiencies and module four prices the move from one to the other.

The excess air at every other reading in the table is read the same way, from the same fuel, and the table prints no reading between its rows. A figure at 3.5 percent or 4.5 percent is not in SECTION 12, and this module does not supply one.

## The units of the answer

The excess air column is a percent and prints to four decimals, as the course's precision line says percents of excess air do. The air and flue gas columns are kilomoles per kilomole of fuel, and SECTION 12 prints them to six decimals. A reader quoting excess air quotes the percent; a reader quoting the flue gas quotes kilomoles and names whether it is dry or wet.

## What the reading assumes

SECTION 12 prints the engine's assumption, verbatim: "Complete combustion. An oxygen reading alone cannot see carbon monoxide, so a stack making CO will read as if it had more excess air than it has." Lesson three reads that sentence closely. For now, it is enough that the table above is what a heater burning completely would show at each reading.

## Exercise

Read the rows at 2.8 percent and at 5.5 percent in SECTION 12. Say what excess air, actual air and dry flue gas the engine reports at each, and what the two rows show about how the air a heater takes in and the gas it sends up the stack move together as the measured oxygen goes up.
