# A sweep that turns over

This is the one place in this module where the arithmetic and the engineering pull in opposite directions. The table below is the whole of it, and it is worth more attention than any other table in this course.

{{panel:pw-device-explorer}}

## The sweep

The KOKORI flow, swept downward through liner counts. Read the cut size column from the bottom up, which is the direction a designer saving money reads it:

| liners | m3/s per liner | turndown | field g | shear penalty | ideal cut micron | CUT MICRON | warning |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 600 | 0.000230016341 | 0.383361 | 146.965325 | 1.000000 | 7.674178 | 7.674178 | starved |
| 460 | 0.000300021314 | 0.500036 | 250.035525 | 1.000000 | 6.719472 | 6.719472 | none |
| 350 | 0.000394313728 | 0.657190 | 431.898099 | 1.000000 | 5.861251 | 5.861251 | none |
| 280 | 0.000492892159 | 0.821487 | 674.840780 | 1.000000 | 5.242462 | 5.242462 | none |
| 230 | 0.000600042629 | 1.000071 | 1000.142101 | 1.000000 | 4.751385 | 4.751385 | none |
| 200 | 0.000690049023 | 1.150082 | 1322.687929 | 1.000000 | 4.430689 | 4.430689 | none |
| 177 | 0.000779716410 | 1.299527 | 1688.771335 | 1.000000 | 4.168146 | 4.168146 | none |
| 150 | 0.000920065364 | 1.533442 | 1690.000000 | 1.086081 | 4.526119 | 4.915730 | overloaded |
| 120 | 0.001150081705 | 1.916803 | 1690.000000 | 1.214275 | 5.060355 | 6.144662 | overloaded |

## Where the best answer is

The finest cut in that table is at 177 liners, 4.168146 micron at a turndown of 1.299527, and it is NOT the smallest bank in the table. The smallest bank, 120 liners, cuts at 6.144662 micron, which is 1.474196 times worse.

A designer reading the column from the bottom sees the cut size improving as liners come out of the bank, right up to the row where it stops and reverses. Everything above that row is the square law. Everything below it is the ceiling and the shear penalty.

## The top of the table

The other end of the sweep is worth a look before leaving it. At 600 liners each one carries 0.000230016341 m3/s, a turndown of 0.383361, and the field has fallen to 146.965325 g. The cut there is 7.674178 micron, which is coarser than anything in the middle of the table, and the row carries a starved warning.

So the column is worse at both ends and best in between, and neither end is visible from a single design point.

## The two halves of the argument

Going down the table towards fewer liners, each liner carries more water. That raises the field as the square of the turndown, and a stronger field is a finer cut. That is the arithmetic.

At a turndown of 1.3 the inlet slot has all it can take. The field stops at 1690.000000 g and the shear penalty starts, so past that row the extra flow is buying droplet breakup and pressure drop. That is the engineering, and it wins.

## What to take from this beyond hydrocyclones

The general habit is a sweep. Take the input a user is most tempted to reduce, sweep it across the range a user could plausibly type, and look at the DIRECTION of the answer rather than at any single value. A model whose answer improves without limit as that input is pushed has no limit in it, and a studio that tells a designer to buy less equipment for a better answer is worse than no studio at all.

This model has a limit in it, and the table shows where. That is the thing to check on any model you are handed.

The warning column is part of the same discipline. Every row outside the envelope says so, at both ends, so the module reports the state of the bank beside the answer it gives for it.

## Exercise

Read the CUT MICRON column from the bottom row upward, write down where it stops improving, and name the two separate mechanisms that put the turn there.

Then say what the field column is doing on the last two rows, and why the ideal cut and the reported cut have parted company.
