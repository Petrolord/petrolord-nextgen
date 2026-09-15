# Counting days

A span between two dates is counted in whole calendar days. It is not the difference between two instants divided by the length of a day, and the two do not always agree.

{{panel:ec-schedule-explorer}}

## Four days across a clock change

Oct 30 to Nov 3 is 4 days. It is 4 days in every zone the engine was run in, including the zones that put a daylight-saving change inside that window.

Counted as instants, the same window is out by an hour wherever the clocks moved. An hour is enough to turn a whole number of days into a fraction, and what happens next depends on the arithmetic that follows: code that truncates loses a day and code that rounds keeps it.

## What the count returns when it cannot count

| schedule | calendar span |
| --- | --- |
| EGINA, on the dates typed on its activities | 933 |
| an activity with no readable dates | null |
| an empty schedule | 0 |

Those last two are different answers and the difference matters. A span of 0 says the schedule has no extent. A span of null says the extent is unknown, because nothing readable was there to measure. An engine returning 0 for both would report an unfilled form as a project that takes no time.

## Milestones are the zero day rows

Milestones are the activities of zero duration, or those typed as one. EGINA's milestone list reads Project sanction and First oil, the two rows carrying a duration of 0.

A milestone takes no days and still has a position. Project sanction sits at day 0 and first oil at day 870, each running from its day to the same day. A date with no span is a good thing for a schedule to hold, so long as the code counting days knows that 0 is an answer.

## Whole days are what a schedule is made of

A duration is a whole number of days. EGINA's activities run 210, 300, 420, 330, 180 and 150, with 0 on the two milestones, and the network duration of 870 days is whole for the same reason.

A span counted between dates has to come out of the same arithmetic, or the two halves of one schedule cannot be compared. There is no honest way to set 870 days of work beside a window measured in days and a bit.

## The mistake

Counting inclusively in one place and exclusively in another. A reader who checks Oct 30 to Nov 3 by hand and arrives at 5 has counted both ends. The engine counts one way everywhere.

The other mistake is reading a calendar span as work. 933 days is how wide the window between EGINA's typed dates is. It is not a claim that 933 days of work exist, and the count knows nothing of what those days contain.

## Exercise

State the span the engine returns for Oct 30 to Nov 3, and say why it is the same figure in a zone whose clocks change inside that window. Then give the calendar span for an activity with no readable dates and for an empty schedule, and say why those two answers are deliberately different.
