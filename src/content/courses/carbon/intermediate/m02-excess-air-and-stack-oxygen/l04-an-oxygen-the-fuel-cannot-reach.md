# An oxygen the fuel cannot reach

SECTION 12 prints eight readings that the engine turns into excess air, from 0 percent to 12 percent dry stack oxygen. It also prints five calls it refuses. This lesson reads the refusals, because each one marks a reading, or a missing input, that the relation of lesson two cannot turn into a heater.

{{panel:carbon-efficiency-explorer}}

## The top of the table

The last row the engine answers is the reading of 12 percent:

| dry O2 percent | excess air percent | actual air kmol per kmol fuel | dry flue gas kmol per kmol fuel | wet flue gas kmol per kmol fuel |
| --- | --- | --- | --- | --- |
| 12 | 121.0076 | 22.046948 | 21.070448 | 23.103448 |

At 12 percent the invented Isiokpo fuel is burning in 22.046948 kmol of air per kmol of fuel, against the 9.975652 of the stoichiometric case. The engine still answers, and SECTION 12 prints the answer.

## Readings the engine refuses

SECTION 12 prints the calls that do not answer:

| the call | the engine says |
| --- | --- |
| dry O2 20.946 percent (all air) | REFUSED: Stack oxygen must be 0 percent or more and below 20.946 percent, the oxygen in dry air. A reading of 20.946 percent is air with no fuel burned. |
| dry O2 21 percent | REFUSED: Stack oxygen must be 0 percent or more and below 20.946 percent, the oxygen in dry air. A reading of 20.946 percent is air with no fuel burned. |
| dry O2 -1 percent | REFUSED: Stack oxygen must be 0 percent or more and below 20.946 percent, the oxygen in dry air. A reading of 20.946 percent is air with no fuel burned. |
| dry O2 blank | REFUSED: A measured dry stack oxygen is required. |
| no stoichiometry | REFUSED: Valid stoichiometry is required. |

The digest labels the first row "all air", and SECTION 1 prints the engine's air as O2_MOLE_FRACTION_DRY_AIR 0.20946. In practice, a stack reading all air is a stack where none of the air's oxygen has gone to any fuel. The engine refuses the call with the range message, and it gives no excess air for it.

A reading of 21 percent and a reading of -1 percent get the same message. The message states the bound the engine applies: 0 percent or more and below 20.946 percent, the oxygen in dry air. Its second sentence names the all-air case: a reading of 20.946 percent is air with no fuel burned. SECTION 25 lists the rule among those MD45-1 put in force: the stack oxygen refusal states the bound it applies, 20.946 percent.

## Missing inputs stay missing

The last two refusals are about boxes left empty. A blank oxygen reading is refused with its own message: a measured dry stack oxygen is required. The engine does not read a blank as 0 percent, which would be the stoichiometric case of lesson one and a heater with no excess air at all.

The other refusal is for a call with no stoichiometry. The relation of lesson two needs the oxygen demand, the stoichiometric air and the dry products of module one, and without them there is nothing to solve.

This is the same rule the Associate tier met on the flare. There, SECTION 2 prints a blank destruction efficiency refused where it could have been read as complete combustion. Here, a blank oxygen reading is refused where it could have been read as no oxygen. In both cases the blank is refused instead of being read as a figure, and the digest prints the refusal.

## Exercise

Read the row at 12 percent and the five refusals of SECTION 12, beside O2_MOLE_FRACTION_DRY_AIR 0.20946 in SECTION 1. Say which refused reading is the digest's all-air case and what the stack gas would be at that reading, and why a blank reading read as 0 percent would report the heater as having no excess air.
