# A fixed period start

Every date in ABUA's schedule is counted from one date: the period start, 2027-03-01. This lesson reads why the period start is an input the schedule must be given, what happens when it is left out, and why the digest passes it as a string.

{{panel:refinery-plan-explorer}}

## Dates come from the period start

The schedule has no calendar of its own. It takes a period start and a period length, 31 days for ABUA, and lays the events out from there: cargoes spaced from the period start, runs at the start of each week, lifts at the end of each week and on the last day. Change the period start and every date moves with it. Keep it and every date is fixed.

That is why this course never says "today" as if it meant the reader's today. A schedule quoted in a lesson is the schedule of the period that begins on 2027-03-01, and it will read the same whenever the lesson is read.

## An argument that reads the clock when it is left out

The Associate tier's first module listed the exports that read the machine clock when an argument is left out. In refineryPlanning there is one: cascadeToSchedule. The digest names the argument that stops it: cascadeToSchedule reads it when periodStart is left out.

So a call that forgets the period start still returns a schedule. It dates that schedule from whatever day the machine happens to think it is. Run it on two different days and it returns two different schedules from the same plan.

The digest's own header is explicit about how it avoids that: every schedule in it is cascaded from 2027-03-01, passed to the engine as that YYYY-MM-DD string, and the generator refuses to print a line from a call that did not pass it. Nothing in the digest read the machine clock.

## Why the period start is a string

A date can reach the engine as a string or as a date object built by the calling program. They behave differently, and Lesson 4 shows how. The short version is in the digest's closing line to SECTION 16:

A period start given as a YYYY-MM-DD string is the same calendar day in every zone. That is how the Suite page passes it and how this digest passes it.

A string names a calendar day and nothing else. Nobody's clock and nobody's time zone can shift it.

## What a planner takes from this

When you build a schedule, give it the period start, typed as the day it is. Do not let a page fill it in from the clock on your machine, because then the schedule belongs to the moment the page was opened rather than to the period being planned.

When you read a schedule someone else built, find its period start before you read a date. A receipt on 2027-03-11 means the eleventh day of a period that starts on 2027-03-01.

Actuals are read against the schedule, event by event and date by date, in the Expert tier. A schedule whose dates wander with the clock cannot be read against anything.

## Exercise

Read ABUA's first receipt date, 2027-03-01, and its last lift date, 2027-03-31, with the period start 2027-03-01 and the period of 31 days. Then read the digest's statement of which argument stops cascadeToSchedule reading the machine clock. Say what would happen to those two dates if the schedule were built twice, on two different days, without a period start, and why the string form keeps them fixed.
