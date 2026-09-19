# Blank limits and typed zeros

Every limit in the configuration can be typed as a number, typed as 0, or left blank. Those are three different plans. This lesson is the trap this tier is built on: a box left blank and a box holding 0 do not mean the same thing, and the plan answers each one differently.

{{panel:refinery-plan-explorer}}

## The rule

The digest states it in one line: a limit left blank is no limit; a limit typed as 0 is a limit of zero. A limit is a crude's availability, a unit's capacity, or a product's floor or ceiling. A typed zero is a real number, and a limit of zero means nothing may pass. A blank means the planner has set no limit, and the plan is free to go as far as everything else allows.

## The hydrotreater three ways

The digest runs ABUA with the Diesel hydrotreater's capacity entered three ways, everything else as typed:

| hydrotreater capacity | hydrotreater throughput (bbl) | capacity the plan reports | crude run (bbl) | margin |
| --- | --- | --- | --- | --- |
| 650000.00 (as typed) | 650000.00 | 650000.00 | 2029032.26 | 7077935.48 |
| 0 (typed as shut) | 0.00 | 0.00 | 735294.12 | 424264.71 |
| blank | 666608.70 | no limit | 2082608.70 | 7173508.35 |

A typed zero shuts the unit. Its throughput is 0.00, and the rest of the refinery replans around it: the crude run reads 735294.12 bbl and the margin 424264.71. This is how a planner enters a turnaround. A unit shut for maintenance runs nothing, and the plan must find the best month without it.

A blank removes the limit. The hydrotreater runs 666608.70 bbl, the crude run reads 2082608.70 bbl, and the margin 7173508.35. The plan reports the capacity of a blank unit as the number Infinity, which is what "no limit" means to the solver, and the table prints it as no limit.

SECTION 13 prints what each entry did to margin against the plan as typed: the unit typed as shut, -6653670.77; the capacity left blank, 95572.87. The same box, emptied or zeroed, moves the month's margin in opposite directions.

## Neither one has a utilisation

A utilisation needs a finite capacity above zero. The plan reports a utilisation of null for the hydrotreater left blank, and null for the hydrotreater typed as 0. A null here is not zero percent. It is the plan saying the question has no answer.

## A blank cost is refused

The rule for limits does not extend to money. A cost or price left blank is refused by name, because the engine will not guess what a barrel costs:

REFUSED: "Missing the cost of Forcados (illustrative). Enter 0 where the value really is zero."

The refusal carries its own instruction: if a value really is zero, type 0.

One more entry is refused outright. A capacity below zero means nothing, so the engine refuses it and says what to do instead:

REFUSED: "Naphtha reformer capacity must be zero or more; leave it blank for no limit."

## The habit to take away

When you enter a configuration, decide for every limit which of the three you mean. A cargo that is cancelled is a typed zero. A unit with no practical limit this month is a blank. A limit left blank because nobody had the figure to hand is an error the engine cannot tell from a deliberate blank.

## Exercise

Read the three hydrotreater rows. Give the crude run and the margin for the unit typed as 0 and for the unit left blank, and the margin changes SECTION 13 prints for each, -6653670.77 and 95572.87. Say what the pair shows about the difference between entering 0 and entering nothing, and why the engine can refuse a blank cost but must accept a blank capacity.
