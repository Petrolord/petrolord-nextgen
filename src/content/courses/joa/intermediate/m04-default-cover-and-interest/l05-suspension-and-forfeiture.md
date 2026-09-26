# Suspension and forfeiture triggers

{{panel:joa-recovery-calculator}}

Beyond default interest, an agreement takes rights away from a defaulter that stays in default: first its vote, later its interest. The engine reports each stated consequence with its trigger date, and says whether the default was open after it.

## What the texts say

The Norwegian Joint Operating Agreement (Attachment A, unofficial English translation, PDF dated 27 February 2007, cited from its Wayback Machine capture of 26 May 2024, read on 2026-09-26) counts working days for the first step and months for the second:

> "If a Party's default has not ceased within five (5) working days after he has received a demand for payment from the Operator, he looses his right to vote and his access to data and information" (Norway JOA Art. 9.2)

> "If a Party's default remains in effect for more than three (3) months after the Operator has informed the management committee" (Norway JOA Art. 9.3)

The spelling "looses" is the translation's own. The Kenya Model PSC 2015, Participation Agreement (2015 model, read on 2026-09-26) counts calendar days, and vests a forfeited share with no payment:

> "that share shall vest rateably, unless otherwise agreed, in the non-defaulting parties without payment of compensation" (Kenya Model PSC 2015, Participation Agreement Art. 6.10)

## How the engine reads a trigger

The engine's basis, verbatim:

> reported only as stated: each applies when the default is open after the whole trigger date; working days are Monday to Friday less the stated holidays; months keep the day of the month (the last day when the month is shorter)

The Ekene contract states a suspension after 5 working-days from 2027-03-01 and a forfeiture right after 3 months from 2027-03-10. PB cures on 2027-04-15:

> PB: the suspension of its rights (as the contract states) starts after 5 working days from 2027-03-01, that is after 2027-03-08: triggered, the default being open after 2027-03-08

> PB: the right to demand the assignment of its interest (forfeiture, as the contract states) arises after 3 months from 2027-03-10, that is after 2027-06-10: not triggered, the default being cured on 2027-04-15

## The trigger day itself

| golden case | consequence | trigger date | applies |
| --- | --- | --- | --- |
| default-cured-on-trigger-day | suspension | 2027-03-08 | false |
| default-cured-day-after-trigger | suspension | 2027-03-08 | true |
| default-forfeiture-last-day | forfeiture | 2027-06-10 | false |
| default-forfeiture-day-after | forfeiture | 2027-06-10 | true |

A cure on the trigger date is in time; a default still open the day after it is not.

## When forfeiture is available

On the golden input left open to 2027-07-01, the forfeiture right is triggered, and the engine reports what the participating interests would be if PB's assignment were demanded: EKO 47.058824, PA 29.411765 and NOC 23.529412, pro rata to their participating interests. It reports the compensation and computes none:

> the cover by acquiring the defaulting party's share of petroleum, and the compensation on an assignment, are reported only

A unit the engine does not count is refused:

> suspension.unit must be one of "calendar-days", "working-days", "months"; got "business-days"

## Exercise

Work in the course's own recovery calculator, view "A default: cover, interest and consequences".

1. Start from "The Ekene March default, simple interest". Read the suspension and forfeiture columns of the defaulter table and the two reasons.
2. In the box, set PB's `curedOn` to `"2027-03-08"`, then to `"2027-03-09"`, and read the suspension column each time.
3. Start from "The same default left open". Read the forfeiture column and the table of interests after forfeiture.
4. In the box, change the suspension's `unit` to `"business-days"` and read the refusal.
