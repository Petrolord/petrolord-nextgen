# An input that never fed anything

An input a result accepts and never uses is one of the quietest defects a calculation package can carry. The user sets it, the result changes in no way they can see, and everybody assumes it was applied. This module has a place where that could have happened and does not.

## The turnover factor

> the turnover effect is the stated workingTurnoverFactor. AP-42's turnover factor Kn is not carried by this package, so a turnover count is not an input here

Read the last clause slowly. Because the factor is not carried, the engine does not take a turnover count at all. The alternative would be to accept one, ignore it, and return a result that looked like it had been used.

That is the general rule. An input a package cannot honour should not be accepted. Accepting it moves the error out of the engine, where a gate could find it, and into a user's head, where nothing will.

## The other side of it, which is a missing input

The same module refuses in the opposite direction when a control efficiency is left out:

> a control efficiency is needed: leaving it out is not the same as saying zero

That sentence is the whole argument. An omitted input is unknown and a zero is a claim, and a package that treats the first as the second has invented an answer on the user's behalf. Here the engine asks for the figure.

It also bounds the figure once it has it:

> a control efficiency of 140 percent is impossible: it lies between 0 and 100

## What control is worth on this tank

| control efficiency, pct | saved, lb/yr | remaining, lb/yr |
| --- | --- | --- |
| 0.000000 | 0.0000 | 77142.8167 |
| 60.000000 | 46285.6900 | 30857.1267 |
| 75.000000 | 57857.1125 | 19285.7042 |
| 90.000000 | 69428.5350 | 7714.2817 |
| 95.000000 | 73285.6759 | 3857.1408 |
| 98.000000 | 75599.9604 | 1542.8563 |
| 100.000000 | 77142.8167 | 0.0000 |

The efficiencies in that table are themselves typed rather than calculated, and the engine says so:

> an internal floating roof customarily saves 60 to 90 percent and a vapour recovery unit 90 to 98 percent; both figures are equipment and operating questions, so they are typed here rather than assumed

So the table answers a conditional question. Given an efficiency, here is the saving and here is what remains. Where the efficiency comes from is a vendor quotation, a performance test or an operating history, and the engine declines to supply it.

That is the same discipline as the stated venting factors two modules back. The relation is the part the package owns. The factors are the part somebody has to justify, and a result that mixes the two without saying which is which invites a reader to treat an assumption as a calculation.

## Exercise

Read the two lossControl refusals in digest SECTION 29 and say which one fires on an input that is present and which on an input that is absent. Then say what the engine would have to do differently for a missing efficiency to become a silent zero.
