# A printed figure that misses its rounding

{{panel:marine-base-calculator}}

Published tables are checked by people, and people slip. When a table and the formula it is built from disagree, the course does not quietly adopt either one. It shows both figures, measures the gap against the rounding the table uses, and names the one that misses as a slip. Adan and Resing's Table 5.1 holds one.

## The row at five servers

At five servers, an occupation rate of 0.9 and a mean service time of 1, the engine returns a delay probability of 0.762493 and a mean wait of 1.524986. The table prints 0.76 for the first and 1.53 for the second.

| figure | engine | engine at two decimals | printed |
| --- | --- | --- | --- |
| delay probability | 0.762493 | 0.76 | 0.76 |
| mean wait | 1.524986 | 1.52 | 1.53 |

The delay probability rounds to what the table prints. The mean wait does not: 1.524986 rounds to 1.52.

## Measuring the gap

A figure printed to two decimals may sit up to half a unit in its last place from the value it rounds, which is five thousandths. The printed 1.53 sits 0.005014 above the engine's 1.524986, which is more than that half unit. No rounding convention, half up, half even or half away from zero, turns 1.524986 into 1.53: the third decimal is a 4, so every one of them rounds down. The printed figure therefore cannot be the formula's figure rounded, and the course reads it as a slip in the printed table.

## Why the engine's figure stands

Every other figure in Tables 5.1 and 5.2 is the engine's figure rounded, and Iversen's Example 12.3.1 agrees with the engine at three decimals. The row also checks against itself. At a mean service of 1, eq. 5.3 divides the delay probability by the five servers times the idle share of 0.1, so the engine's 0.762493 gives 1.524986, and even the printed 0.76 divided the same way gives 1.52. One figure against the formula, the other rows and its own row's delay probability is a slip, and the engine's figure is the one the course quotes.

## What a slip is, and is not

Calling it a slip says nothing about the notes as a whole. They remain the source of eqs 5.1 to 5.3 and of every other figure in both tables. It also does not change the engine: the engine computes the formula, and the formula gives 1.524986. A reader who checks the table against the calculator finds the same one row out.

## The habit this teaches

Before a published table is used as a check, every figure in it is recomputed and compared at the table's own precision. A figure that misses by more than half a unit is named, with the engine's figure beside it, and a figure the course quotes is always the engine's.

## Exercise

Open the shore base calculator on the view "The berth queue" and start from "Adan and Resing Table 5.1, five servers". Read the Probability of waiting and Mean wait, hours tiles and round each to two decimals yourself. Compare with the printed 0.76 and 1.53, and write the gap for the wait. Then set Berths (stated) to 10 and Arrivals a day (stated) to 90, read the ten-server row, and check that its printed 0.67 is the engine's figure rounded.
