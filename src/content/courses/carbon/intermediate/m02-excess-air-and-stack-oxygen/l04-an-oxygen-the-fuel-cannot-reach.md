# An oxygen the fuel cannot reach

The lab prints eight readings that the engine turns into excess air, from 0 percent to 12 percent dry stack oxygen. It also prints five calls it refuses. This lesson reads the refusals, because each one marks a reading, or a missing input, that the relation of lesson two cannot turn into a heater.

{{panel:carbon-efficiency-explorer}}

## The top of the table

The last row the engine answers is the reading of 12 percent:

| dry O2 percent | excess air percent | actual air kmol per kmol fuel | dry flue gas kmol per kmol fuel | wet flue gas kmol per kmol fuel |
| --- | --- | --- | --- | --- |
| 12 | 121.0076 | 22.046948 | 21.070448 | 23.103448 |

At 12 percent the invented Isiokpo fuel is burning in 22.046948 kmol of air per kmol of fuel, against the 9.975652 of the 0 row, excess air 0.0000 percent. The engine still answers, and the lab prints the answer.

## Readings the engine refuses

The lab prints the calls that do not answer:

| the call | the engine says |
| --- | --- |
| dry O2 20.946 percent (all air) | REFUSED: Stack oxygen must be 0 percent or more and below 20.946 percent, the oxygen in dry air. A reading of 20.946 percent is air with no fuel burned. |
| dry O2 21 percent | REFUSED: Stack oxygen must be 0 percent or more and below 20.946 percent, the oxygen in dry air. A reading of 20.946 percent is air with no fuel burned. |
| dry O2 -1 percent | REFUSED: Stack oxygen must be 0 percent or more and below 20.946 percent, the oxygen in dry air. A reading of 20.946 percent is air with no fuel burned. |
| dry O2 blank | REFUSED: A measured dry stack oxygen is required. |
| no stoichiometry | REFUSED: Valid stoichiometry is required. |

This lesson labels the first row "all air", and the lab prints the engine's air as O2_MOLE_FRACTION_DRY_AIR 0.20946. In practice, a stack reading all air is a stack where none of the air's oxygen has gone to any fuel. The engine refuses the call with the range message, and it gives no excess air for it.

A reading of 21 percent and a reading of -1 percent get the same message. The message states the bound the engine applies: 0 percent or more and below 20.946 percent, the oxygen in dry air. Its second sentence names the all-air case: a reading of 20.946 percent is air with no fuel burned. The course lists the rule among those MD45-1 put in force: the stack oxygen refusal states the bound it applies, 20.946 percent.

## Missing inputs stay missing

The last two refusals are about boxes left empty. A blank oxygen reading is refused with its own message: a measured dry stack oxygen is required. The engine does not read a blank as 0 percent, the 0 row of lesson one, excess air 0.0000 percent.

The other refusal is for a call with no stoichiometry. The relation of lesson two needs the oxygen demand, the stoichiometric air and the dry products of module one, and without them there is nothing to solve.

This is the same rule the Associate tier met on the flare. There, the course prints a blank destruction efficiency refused where it could have been read as complete combustion. Here, a blank oxygen reading is refused where it could have been read as no oxygen. In both cases the blank is refused instead of being read as a figure, and the engine returns the refusal.

## Exercise

Read the row at 12 percent and the five refusals in the lab, beside O2_MOLE_FRACTION_DRY_AIR 0.20946 in its fuel view. Say which refused reading is the lesson's all-air case and what the stack gas would be at that reading, and why a blank reading read as 0 percent would report the heater as having no excess air.
