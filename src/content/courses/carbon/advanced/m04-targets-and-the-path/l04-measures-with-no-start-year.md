# Measures with no start year

A measure goes on the path in the year it starts. SECTION 22 prints what happens when one AGBOR measure has no start year entered, and three calls the path engine refuses outright. The figures are invented for this course.

{{panel:carbon-abatement-explorer}}

## A measure left off, and named

With Vapour recovery on the storage tanks given no start year, the path prints:

| output | value |
| --- | --- |
| unscheduledMeasures | Vapour recovery on the storage tanks (no start year) |
| finalGapTonnes | 3220.083 |

With every measure scheduled, finalGapTonnes is 1370.083 t. The measure without a start year is placed in no year. It is named in unscheduledMeasures with its reason, "no start year", and left off the path. The engine does not give it a default year.

SECTION 25 lists the rule in force: a baseline that is not positive is refused, and a measure with no start year is named.

## On the curve and off the path

The same measure is still on the curve. It still has a cost per tonne of 35.4193 USD, still abates 1850.000 t a year as costed, and still ranks fourth. The curve ranks by cost and has no years in it. The path counts a measure from its start year, and a measure with none is off the path. The unscheduledMeasures list is where a reader finds that a measure on the curve is missing from the path.

## Three refusals

The path engine refuses these calls:

REFUSED: The baseline must be a positive tonnage. An inventory that computed nothing leaves the baseline unknown.

REFUSED: A baseline and a valid year range are required.

The same six measures against a baseline of 12000 t, a probe the digest invents:

REFUSED: In 2030 the scheduled measures abate 13610 t against a baseline of 12000 t. Emissions cannot fall below zero, so check the measures for double counting or a source outside the baseline.

The first refuses a baseline that is not positive, and its second sentence names the case it guards: an inventory that computed nothing. The second refuses a path with no baseline or no valid range of years. The third names the year, overAbatedYear 2030, in which the scheduled measures abate more than the baseline; SECTION 25 lists it among the rules MD45-1 put in force. Neither box is filled in. The path does not guess a baseline or a year range, and a measure's start year is never guessed either.

## Reading the two final gaps

The digest prints both final gaps: 1370.083 t with every measure scheduled, 3220.083 t with Vapour recovery on the storage tanks unscheduled. It also prints their relation: that gap less the scheduled plan's 1370.083 is 1850.000 t, the vapour recovery measure's tonnes a year. The path with the measure unscheduled, from 2030:

| year | abated t | emissions t | target t | unabated gap t |
| --- | --- | --- | --- | --- |
| 2030 | 13610.000 | 42490.276 | 46483.086 | 0.000 |
| 2031 | 13610.000 | 42490.276 | 44078.788 | 0.000 |
| 2032 | 13610.000 | 42490.276 | 41674.491 | 815.785 |
| 2033 | 13610.000 | 42490.276 | 39270.193 | 3220.083 |

The abated column stays at 13610.000 t from 2030, where the scheduled path reaches 15460.000 t in 2031. The unscheduled path prints a gap in 2032, 815.785 t, a year in which the scheduled path prints 0.000.

## What to carry

A path is only as complete as its start years. Read unscheduledMeasures before reading the final gap, in the same way that the inventory's reportable status is read before the baseline.

## Exercise

Read unscheduledMeasures, finalGapTonnes with and without the start year, and Vapour recovery on the storage tanks' tonnes a year on the curve. Say what the three figures, read together, show about what an unscheduled measure contributes to the path's final year.
