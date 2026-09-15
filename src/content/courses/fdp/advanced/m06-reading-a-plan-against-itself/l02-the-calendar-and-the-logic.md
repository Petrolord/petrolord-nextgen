# The calendar and the logic

EGINA's network says the work must take 870 days and the dates typed on its activities span 933 days, and the difference of 63 days is float somebody has already spent in the calendar.

{{panel:ec-value-explorer}}

## Two questions, two answers

The network duration comes from the dependencies: a forward pass, a backward pass, and a float on each activity of late start minus early start. It answers how long the work must take given what has to finish before what. The calendar span comes from the dates on the activities and answers how long the window is. Neither is wrong and neither is the other.

| activity | duration | early start | late start | float | critical |
| --- | --- | --- | --- | --- | --- |
| a1 Project sanction | 0 | 0 | 0 | 0 | true |
| a2 Detailed engineering | 210 | 0 | 180 | 180 | false |
| a3 Long lead procurement | 300 | 0 | 0 | 0 | true |
| a4 Hull conversion | 420 | 300 | 300 | 0 | true |
| a5 Topsides fabrication | 330 | 210 | 390 | 180 | false |
| a6 Subsea installation | 180 | 210 | 690 | 480 | false |
| a7 Integration and commissioning | 150 | 720 | 720 | 0 | true |
| a8 First oil | 0 | 870 | 870 | 0 | true |

The critical path is a1 to a3 to a4 to a7 to a8 at 870 days. Detailed engineering and Topsides fabrication carry 180 days of float each and Subsea installation carries 480.

## Two kinds of float

The float in that table is float the logic still has. An activity with 180 days of float can slip 180 days without moving the end date, and an activity on the critical path cannot slip at all.

The 63 days is a different animal. It is not available to anybody. The dates already stretch the work across a longer window than the logic requires, so the slack is committed: it is sitting inside somebody's start dates. Reading it as contingency double counts, because the calendar has spent it and the plan has not recorded spending it.

## Counting the span

The span is counted in whole calendar days rather than by subtracting two timestamps, so a daylight saving change inside a window cannot cost it an hour. A window from 30 October to 3 November is 4 days in every zone. An activity whose dates cannot be read gives a span of null, and an empty schedule gives 0.

## The third clock

The concept carries its own schedule, dated from the concept and never from a machine clock. The FPSO development is sanctioned 2027-04-01 and reaches first oil 2030-04-01, which the engine reports as 36 months. That figure comes from the concept type, not from the network and not from the activity dates, so a plan now has three statements about its own duration and they were produced by three different mechanisms.

## The mistake

The mistake is calling every activity critical. Before the repair every one of these eight read critical at float 0, which is what a network reports when nothing has been linked: with no dependencies typed, every activity starts on day 0 and the network is as long as its longest single activity. A path of five out of eight, with 480 days of float sitting on Subsea installation, is a schedule somebody can manage. A list of eight critical activities is not.

The second mistake is reading 933 as the duration and putting the difference down as slack in hand.

## Exercise

State the network duration, the calendar span and the difference, and name the activities that carry float and how much each carries. Then explain why 63 days of calendar float is not available to the project, and why 480 days on Subsea installation is.
