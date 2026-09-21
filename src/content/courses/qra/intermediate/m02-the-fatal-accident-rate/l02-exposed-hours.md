# Exposed hours

{{panel:qr-societal}}

The FAR has one number on top and one underneath, and most FAR errors are errors underneath. The exposed hours are a stated input: the analyst decides who is exposed and for how long, and the engine divides by what it is given. This lesson shows what happens when the denominator is chosen wrongly, and what the engine does when there is no denominator at all.

## Whose hours

The JISIKE crew is 60 people each exposed 2000 hours a year, both stated. The exposed hours of the group are therefore 120000 a year, derived. Those are the hours the crew spends where the crew scenarios can reach them, which is the same population the crew PLL of 0.002420000000 fatalities per year was built over. Numerator and denominator describe the same people.

## Three denominators from one PLL

| how FAR was built | FAR |
| --- | --- |
| PLL over the crew's exposed hours, the engine | 2.016667 |
| PLL over one person's hours | 121.000000 |
| a base of 1,000,000 hours, derived | 0.020167 |

Dividing the crew PLL by one person's 2000 hours gives 121.000000, sixty times too high, because it spreads the expected deaths of sixty people over the hours of one. The number is not absurd on its face, and that is the danger: an unexpectedly high FAR can pass for a hazardous crew when it is only a denominator taken from the wrong row. Using a base of 1,000,000 hours gives 0.020167, which is the right rate on the wrong base, a hundred times smaller than every FAR the industry publishes.

## The engine's own check

The one thing the engine can check about the denominator is that it exists and is positive. With no exposed hours it refuses:

> exposedHoursPerYr: must be above 0 hours: a rate over no exposure is undefined

The message names the field and says why in plain words. A rate per hour of exposure over no hours of exposure has no value to return, and the engine will not invent one. It cannot check whether the hours you gave belong to the population behind the PLL; that remains the analyst's job.

## Hours in a year and hours at work

The Associate tier converted hours at a place into a fraction of a year using 8760 hours. The FAR does something different. It counts the hours people are actually exposed, summed over the group, and it never divides by the calendar. A crew member's 2000 hours a year is a share of the calendar year for an IRPA and a count of exposure for a FAR. The same hours can appear in both calculations with different jobs.

## Exercise

Take the crew PLL of 0.002420000000 fatalities per year and the one-person FAR of 121.000000. Divide the one-person FAR by the crew FAR of 2.016667 and say what the quotient is and which stated input it equals. Then explain, in one sentence, how a reviewer would spot that error from the stated inputs alone.
