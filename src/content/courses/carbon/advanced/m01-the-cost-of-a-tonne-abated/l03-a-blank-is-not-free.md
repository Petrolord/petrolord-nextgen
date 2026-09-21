# A blank is not free

A measure's record carries a capital cost, annual savings, an annual cost, tonnes abated a year, a life, a discount rate and the source it acts on. On a first pass some of those boxes are left blank. The lab prints what the cost of a tonne does with each blank on the invented AGBOR Heat integration project, whose figures are invented for this course and in US dollars. Some blanks are refused and some are taken as 0 and named.

{{panel:carbon-abatement-explorer}}

## The blanks that are refused

| the call | the engine says |
| --- | --- |
| capital cost blank | REFUSED: Measure "Heat integration project" has no capital cost. Enter 0 if it needs none: a blank is not read as free. |
| abatement blank | REFUSED: Measure "Heat integration project" needs an annual abatement. |
| life blank | REFUSED: Measure "Heat integration project" has a capital cost, so it needs a life to annualise it over. Set against one year's saving, a one-off capital cost overstates the cost per tonne of a capital measure. |
| discount rate blank | REFUSED: Measure "Heat integration project" has a capital cost, so it needs a discount rate. A blank is not read as 0, which would annualise straight-line and move the measure down the curve. |

Every refusal names the measure it came from. A capital cost left blank is refused, and the refusal says how to state a measure that needs no capital: enter 0.

## A capital of 0 typed

A capital typed as 0 is an answer. The lab prints the Heat integration project with capital 0: costPerTonne -120.5882 USD and capitalRecoveryFactor 0.00000000. A capital of 0 typed needs no life and no rate, so neither is asked for. As costed at the Agbor inputs, the same measure prints -14.2492 USD a tonne.

## The running figures are taken as 0 and named

The annual savings and the annual cost are handled another way. The rule: "Blank running figures are taken as 0 and NAMED." The Heat integration project with its savings and its running cost both blank returns costPerTonne 106.3391 USD, with the field assumedZero reading: annual savings, annual cost.

So the engine does compute a figure, and the figure carries the list of boxes it filled with 0. A reader who sees 106.3391 USD a tonne beside assumedZero knows that no saving was entered. The same measure with its savings of 410000 USD entered prints -14.2492 USD a tonne and pays for itself.

## The rule in force

The course lists the rule as it stands: a negative abatement, a blank capital cost, a blank rate with capital, and a rate outside (-1, 1) are refused; blank savings and running costs are 0 and named. So there are two kinds of blank and two answers: refused, or filled with 0 and reported in assumedZero. The course adds, from MD45-1, that a refused measure is named in refusedMeasures and kept off the curve.

## A refused measure on the curve

The course hands the six Agbor measures to the curve with the Heat integration project's capital cost blank. The curve has 5 steps and totalAbatementTonnes 12060.000, and it names the measure it left off:

| refusedMeasures label | reason |
| --- | --- |
| Heat integration project | Measure "Heat integration project" has no capital cost. Enter 0 if it needs none: a blank is not read as free. |

The refusedNote, verbatim: "A refused measure is off the curve and out of every total until it is costed."

## What a blank would do if it were read as 0

The engine's own sentences say what each refusal prevents. The capital refusal says a blank is not read as free. The rate refusal says a blank read as 0 would annualise straight-line and move the measure down the curve. The life refusal says that, set against one year's saving, a one-off capital cost overstates the cost per tonne of a capital measure. Lesson five reads it.

The abatement refusal gives no reason beyond the need. A measure with no annual abatement named has no tonnes for the cost to be divided by, and the lab prints the call with the abatement blank as a refusal.

## Exercise

Read the Heat integration project's cost per tonne as costed, with capital 0 typed, and with its savings and running cost blank, together with the assumedZero field of the last. Say what the three figures, read with that field, show about the difference between a box typed as 0 and a box left blank.
