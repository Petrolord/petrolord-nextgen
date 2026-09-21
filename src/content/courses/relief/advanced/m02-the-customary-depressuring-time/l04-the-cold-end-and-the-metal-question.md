# The cold end, and the metal question

Blowing a vessel down makes it cold. The march reports how cold, and that figure is one of the two reasons a depressuring study gets run at all. This lesson is about what the figure is fixed by, and about the question it opens that this course does not answer.

{{panel:fc-blowdown-explorer}}

## Fixed by the pressures, and by nothing you can turn

The orifice sweep in this module holds a final temperature of 340.807983 degR on all eight rows. Distinct final temperatures across that sweep, counted: 1.

The end state is fixed by the pressure ratio across the blowdown and by the isentropic exponent. The orifice decides only how long the vessel takes to get there. That is a harder result to hold than it looks, because the orifice is the one thing a designer can change, and on this quantity it does nothing at all.

## What does move it

The end pressure does, and here is the same vessel taken to seven of them.

| end pressure psia (stated) | time s | final temperature degR | final degF, derived | fraction of inventory removed |
| --- | --- | --- | --- | --- |
| 600.000000 | 83.838356 | 464.976597 | 5.306597 | 0.432854 |
| 400.000000 | 133.645325 | 425.511333 | -34.158667 | 0.586835 |
| 250.000000 | 194.213269 | 383.936928 | -75.733072 | 0.713810 |
| 145.000000 | 268.419002 | 340.807983 | -118.862017 | 0.813004 |
| 80.000000 | 354.644554 | 299.234348 | -160.435652 | 0.882496 |
| 40.000000 | 462.482817 | 257.134963 | -202.535037 | 0.931629 |
| 25.000000 | 540.397236 | 232.011700 | -227.658300 | 0.952641 |

Every column moves down the table and the lab prints no ratio between any pair of them, so read the directions and stop there. Deeper blowdown, longer clock, colder gas, more inventory gone. A reader who divides the temperature at one end pressure by the temperature at another has produced a figure this engine never computed, and the fact that both figures are real engine output does not make the quotient anything. Ask first whether two quantities are entitled to be compared, and only then compare them.

## Where the bottom rows stop being trustworthy

The march assumes choked flow the whole way down, and on this vessel it stops being choked below 26.758009 psia against the stated back pressure at the orifice outlet. The last row of the table crosses that floor, and the engine says so rather than leaving it to be noticed: at an end pressure of 25.000000 psia the call succeeds and attaches `the march assumes choked flow throughout, and it stops being choked below 26.8 psia against a 14.7 psia back pressure: the time below that is optimistic`, in the engine's own words.

The warning names the time and nothing else, so take it as being about the clock. The temperature on that row is still the isentropic end state for that pressure ratio.

## The question this course hands on

A final temperature is not a metallurgical answer. Whether the shell will see that temperature, how fast, how far into the wall, and whether the material is rated for it are cooldown questions, and cooldown and no-touch time belong to the Flow Assurance course. This module gives you the gas temperature at the end of an adiabatic expansion and a curve of how it got there. The metal is a different model.

## Exercise

Say what the final temperature is fixed by and what it is independent of, and record the count of distinct final temperatures across the orifice sweep. Record the final temperature in degR and degF and the fraction removed at end pressures of 600.000000, 145.000000 and 25.000000 psia. Then name the choked floor, quote the warning on the bottom row, and name the course that owns the metal question.
