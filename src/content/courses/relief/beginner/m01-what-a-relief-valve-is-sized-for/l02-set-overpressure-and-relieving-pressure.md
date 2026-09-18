# Set, overpressure and relieving pressure

{{panel:fc-sizing-explorer}}

Three pressures stand behind every area this engine returns, and only one of them is typed in directly. The set pressure is stated, in gauge. The overpressure allowance is stated, as a percentage. The relieving pressure, which is the one every sizing equation actually uses, is worked out from the other two.

## The arithmetic, on one stream

ORUBIRI is the gas stream this tier follows. It states a set pressure of 420.000000 psig and an overpressure of 10.000000 percent. The relieving pressure is the set pressure raised by the overpressure fraction and then converted to absolute, using the atmospheric constant of 14.700000000000 psia. That gives 476.700000 psia.

The atmospheric figure is worth a note. It is not exported, so the digest behind this course recovers it by asking the engine three separate questions whose answer is that constant and nothing else, and all three return 14.700000000000. A number nobody can read off the module can still be measured out of its behaviour, and that habit runs through this whole course.

## What a larger allowance buys

The overpressure a case is allowed changes the relieving pressure, and the relieving pressure changes the area. Here is the same load through the same valve at four allowances.

| overpressure pct (stated) | relieving psia | required area in2 | branch |
| --- | --- | --- | --- |
| 10.000000 | 476.700000 | 2.223779 | critical |
| 16.000000 | 501.900000 | 2.112125 | critical |
| 21.000000 | 522.900000 | 2.027301 | critical |
| 25.000000 | 539.700000 | 1.964194 | critical |

Read the direction and stop there. A larger allowance raises the relieving pressure, and a higher relieving pressure needs a smaller area for the same load. Every one of the four rows stays on the same flow branch, so nothing in the table is confounded by a change of regime partway down it.

Do not divide one of those areas by another. The digest behind this course prints a ratio wherever one is entitled to exist, and it prints none between these four rows, which means the relationship between them is not something this engine computes. A ratio nobody worked out reads on the page exactly like one somebody did, and that is how a plausible sentence about a table turns out to be wrong by a factor.

## Why the allowance is a decision rather than a number

The allowance is part of choosing the case. A contingency that is not a fire is customarily allowed a smaller accumulation than a fire case is, and the engine takes whichever percentage the caller hands it without comment. So the four rows above are not four answers to one question. They are four different questions, each with one answer, and picking between them is the engineering rather than the arithmetic.

That is the same point the whole course makes about the load. The engine is exact about the arithmetic it was given and silent about whether the inputs describe the plant.

## Exercise

Take the ORUBIRI set pressure and work the relieving pressure at 10.000000 percent for yourself, using the 14.700000000000 psia constant. Then say, without dividing anything, what happens to the required area when the allowance rises, and why the answer is a decision before it is a calculation.
