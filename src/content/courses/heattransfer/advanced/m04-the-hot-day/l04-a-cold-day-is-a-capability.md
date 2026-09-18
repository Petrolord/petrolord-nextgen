# A cold day is a capability

Run the same bay on a cool morning and the duty fraction comes back above one. The engine does not print that number and leave it. It labels the row, and it says in words what a fraction above one means, because a capability and a delivered duty are two different things and only one of them is happening.

{{panel:fc-rating-explorer}}

## The rows below the design ambient

| check ambient, degF | regime | duty fraction | process out, degF | air rise, degF | design outlet reached |
| --- | --- | --- | --- | --- | --- |
| 86.000000 | colder than design | 1.058065 | 144.193548 | 31.741935 | yes |
| 92.000000 | colder than design | 1.019355 | 148.064516 | 30.580645 | yes |
| 98.000000 | hotter than design | 0.980645 | 151.935484 | 29.419355 | no |

The design ambient of this bay is 95.000000 degF, so the first two rows sit below it and the third sits above. The label changes at the design point and so does the last column.

## What the engine says about the first two rows

Its note explains the fraction rather than presenting it as an output. Because the morning is colder than the design ambient, the surface can do more than the design duty. That is a capability. A plant holding the process at 150.000000 degF will throttle or stage the air instead, and the outlet shown, 144.193548 degF, is what the bundle would reach wide open.

So the figure of 1.058065 is a statement about metal and air rather than about heat that moved. A sheet quoting it as a delivered duty has reported 21161290.3226 Btu an hour that the plant did not ask the bay for.

The same applies to the outlet in that row. A process leaving at 144.193548 degF is what this bundle would produce with every fan running and nothing throttled. It is a lower bound on what the morning could do rather than a temperature anybody plans around, and the note says as much in the engine's own words.

## Why the label matters more than the number

A duty fraction above one is the easiest figure in this module to misread, and the misreading is expensive in both directions. Read as a delivered duty it overstates the heat the process gave up on a cool morning. Read as spare capacity for a hot afternoon it is worthless, because the same bay at 124.000000 degF returns 0.812903 and the two figures belong to different days.

ANTAN behaves the same way. At 86.000000 degF it returns 1.087591, with the same label and the same meaning.

## What a plant does instead

The note names the answer: throttle or stage the air. Fans come off, pitch comes down, louvres close. The bundle is oversized for the morning by design, because it was chosen for the afternoon. So the cold end of a hot-day sweep describes control room work rather than a thermal result.

That is also why the label is part of the answer rather than a comment on it. A rating that reports only numbers leaves the reader to decide which rows describe a delivered duty, and the reader who decides wrongly has no way of finding out from the sheet.

## Exercise

Record the three rows above with the regime label and the reached column for each. Say what the duty fraction of 1.058065 describes and what it does not. Then record ANTAN's cold-day fraction beside the studio bay's, and write one sentence on why neither figure can be read as spare capacity for a hot afternoon.
