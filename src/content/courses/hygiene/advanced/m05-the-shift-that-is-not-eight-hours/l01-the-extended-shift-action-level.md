# The extended-shift action level

{{panel:hy-noise-dosimeter}}

For a 10.000000 hour shift the OSHA action level is 83.390216 dBA, which Table IV-3 prints as 83.400000. For 12.000000 hours it is 82.075016 dBA against a printed 82.100000, and for 16.000000 hours 79.999784 dBA against 80.000000. At 8.000000 hours the closed form gives 84.999892 dBA and the table prints 85. The PEL is not reduced for a longer shift; only the action level moves.

## The closed form

The OSHA Technical Manual gives the action level for a shift of h hours as AL = 16.61 log10( 50 / (12.5 h) ) + 90. The engine's door is `oshaActionLevelForShiftDbA`, and it is classed PUBLISHED, REPRODUCED with 6 published cases and 0 oracle-only ones.

Read the formula as a restatement of the 50 percent noise dose. The action level on an eight-hour day is a noise dose of fifty percent, a TWA of 85 dBA on the OSHA scale. Over a longer shift the same fifty percent is spread over more hours, so the constant level that reaches it is lower. The closed form is the level that, held for the whole shift, gives exactly 50 percent. Its only input is the shift length, so the door answers a question about the schedule, and the noise dose over the actual record is the subject of the next lesson.

| shift, hours | action level, dBA | Table IV-3 printed, dBA |
| --- | --- | --- |
| 8.000000 | 84.999892 | 85.000000 |
| 9.000000 | 84.150248 | 84.200000 |
| 10.000000 | 83.390216 | 83.400000 |
| 12.000000 | 82.075016 | 82.100000 |
| 16.000000 | 79.999784 | 80.000000 |

## Why eight hours gives 84.999892

At 8.000000 hours, 50 over 12.5 times 8 is 0.5, so the formula becomes 90 minus 16.61 log10 2. The printed 16.61 is a rounding of the exact coefficient 16.609640474437, and with the printed one the result lands at 84.999892 dBA. The course's constant pins measure it at 84.999891772021 against a literal typed in a third file. The table prints 85 because it prints one decimal.

That small miss is the J1 decision showing through. The engine uses the coefficient the mandatory Appendix A text writes. Table IV-3 reproduces every printed row to its decimal with 16.61. The course grades the extended-shift action level on the coefficient the regulation writes, and records that as a decision about the text, because a one-decimal table is too coarse to prove a coefficient by itself, as Table A-1 showed.

## The rows the table does not print

The engine returns the level at any shift from above zero to 24 hours: 87.075124 dBA at 6.000000 hours, 83.038262 dBA at 10.500000 hours and 77.074908 dBA at 24.000000 hours. At 4.000000 hours it returns 90.000000 dBA. Those rows are the same closed form evaluated off the table, and each carries the evidence the printed rows give the formula.

A shift of zero hours or more than 24 is refused on `shiftHours`:

> shiftHours must be a number of hours above zero and at most 24

## Exercise

Take the 9.000000 and 12.000000 hour rows and round each engine value to one decimal. Confirm each matches the printed column. Then explain in two sentences why the 8.000000 hour row reads 84.999892 dBA where the table prints 85, naming the coefficient responsible.
