# The initiating event frequency

{{panel:lp-worksheet}}

The initiating event frequency is the first number on the row and the only frequency that enters the product. Everything else multiplied into the unmitigated frequency is a probability. ORONI's initiating event is a level control valve failing open, and its stated frequency is 0.45 per year. That figure is an input. The engine does not hold a table of valve failure frequencies and will not supply one if the field is left empty.

## A frequency may exceed one

A probability above one is meaningless. A frequency above one is ordinary: it is a count per year, and a device that fails three times a year has a frequency of three per year. The engine takes the initiating event frequency as any number above zero, with no upper bound.

| quantity | unit | allowed range, from the engine |
| --- | --- | --- |
| initiating event frequency, IEF | per year | above 0 |
| enabling condition, conditional modifier | probability | above 0 and no more than 1 |
| IPL PFD | probability | above 0 and no more than 1 |
| TMEL | per year | above 0 |

An IEF of 2.5 per year is accepted for exactly this reason. The same number typed into an enabling condition field is refused, because that field is a probability and 2.5 is not one. The engine tells you which field it objected to, so the two cases never look alike.

## Where the figure comes from, and who owns it

Because the engine invents nothing, the initiating event frequency arrives from somewhere the analyst can name: plant history for this valve or this class of valve, a generic frequency the organisation has adopted and recorded, or a reliability figure from the supplier. The choice of the figure is never graded in this course, and it is never checked by the engine. What the engine enforces is that a figure exists and that it is a frequency above zero.

That restraint is a declared choice. The alternative would have been a built in set of generic initiating frequencies, so a row could run with the field blank. The engine does not take that route, because a generic frequency quietly adopted is a frequency nobody defends in the review, and the whole row rests on it.

## What a wrong initiating frequency does to the row

Everything downstream is proportional to it. ORONI's unmitigated frequency is 0.013500000000 per year and its mitigated frequency without a SIF is 0.000013500000 per year. Both of those scale directly with 0.45, and so does the required risk reduction factor of 13.500000. An initiating frequency chosen ten times too high demands ten times the risk reduction, and the row may ask for a SIL a band higher than the plant needs. Chosen ten times too low, it may report that no SIF is required at all. The error is never in a safe direction, and it is never visible later in the arithmetic, because by then it is folded into a single number.

## Exercise

ORONI's required risk reduction factor is 13.500000 at an initiating frequency of 0.45 per year. Work out the required risk reduction factor the same row would report if the valve were found to fail at 2.5 per year with everything else unchanged, and say which band that lands in. Then write one sentence naming the evidence you would want on file before typing either figure.
