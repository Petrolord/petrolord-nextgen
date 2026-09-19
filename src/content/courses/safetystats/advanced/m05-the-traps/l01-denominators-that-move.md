# Denominators that move

{{panel:ss-rates-explorer}}

AMUKPE's company employees worked 846200 hours with 4 recordables, which is 0.945403 per 200,000 hours. Put the contractors' 1392750 hours into the denominator and leave their 9 recordables out of the numerator, and the same 4 events read 0.357310. Nothing happened on site. The rate fell to well under half.

| what is counted | count | hours | rate per 200,000 |
| --- | --- | --- | --- |
| company events over company hours | 4 | 846200 | 0.945403 |
| company events over company and contractor hours | 4 | 2238950 | 0.357310 |
| company and contractor events over company and contractor hours | 13 | 2238950 | 1.161259 |

## A rate has two halves

Every rate in this engine is a count times a base over exposure hours. The count and the hours have to describe the same people. The second row breaks that rule. It divides the company's events by the hours of a workforce that worked more than twice the company's hours, most of whom could never have contributed an event to that count.

Events and hours must come from the same workforce, both in or both out. The first row keeps the contractors out of both halves and is a fair company rate. The third row keeps them in both and is a fair site rate. The second row is neither, and it is the lowest figure on the page.

## How the mismatch arrives

The mismatch rarely arrives as a decision. More often it arrives through two systems. Hours come from payroll and timesheets, and a site's timesheet system often books every person on the gate, contractor or employee. Events come from an incident register, and a contractor's recordables may sit in the contractor's own register and never reach the operator's. Each system is correct about what it holds. The rate built by dividing one by the other describes no workforce at all.

A mismatch can run the other way too. Events from both workforces over company hours alone would inflate the rate. Either direction breaks the rate, and only the first is flattering, which is why it is the one that tends to survive into a report.

## The engine cannot see this

The engine takes a count and hours and returns a rate. It checks that the count is a whole number, zero or more, and that the hours are finite and above zero. It has no idea whose events or whose hours they are. A mismatched denominator passes every check and produces a clean number with a correct `basis` block. The formula line reads count x base / exposureHours whatever the count and hours describe.

So the check belongs to the analyst, and it is a question to ask of every rate before it is read: whose events are in the count, and whose hours are in the denominator?

## Exercise

Compute AMUKPE's contractor rate on its own from the contractors' 9 recordables and 1392750 hours. Then place it beside the company rate of 0.945403 and the combined rate of 1.161259, and confirm that the combined figure sits between the two. Write one sentence explaining why the second row of the table falls below all three.
