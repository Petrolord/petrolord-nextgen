# Dates in every time zone

A refinery plan is built in one place and read in many: the refinery, the trading desk, the head office, the lender's engineer. A schedule date must mean the same day to all of them. This lesson reads the course's test of that, ABUA's schedule built in seven time zones, with the period start 2027-03-01 handed over two ways.

{{panel:refinery-plan-explorer}}

## The string, in seven zones

The course builds ABUA's schedule in seven time zones, each in its own process, with the period start passed as the string "2027-03-01". It prints the first and last event dates, and whether every one of the 41 dates matches the UTC run:

| time zone | first date | last date | every date matches UTC |
| --- | --- | --- | --- |
| UTC | 2027-03-01 | 2027-03-31 | true |
| Africa/Lagos | 2027-03-01 | 2027-03-31 | true |
| Pacific/Kiritimati | 2027-03-01 | 2027-03-31 | true |
| Europe/London | 2027-03-01 | 2027-03-31 | true |
| America/New_York | 2027-03-01 | 2027-03-31 | true |
| America/Los_Angeles | 2027-03-01 | 2027-03-31 | true |
| Pacific/Pago_Pago | 2027-03-01 | 2027-03-31 | true |

Every row reads true. The zones span both sides of Greenwich, from Pacific/Kiritimati to Pacific/Pago_Pago, and the course adds that the period crosses the North American spring clock change. None of it moves a date. Built anywhere, the schedule starts on 2027-03-01 and ends on 2027-03-31.

## A date object at local midnight

The course then hands over the same period start a second way: as a Date built at local midnight, new Date(2027, 2, 1). The engine reads a Date's UTC calendar day, so the answer depends on the zone:

| time zone | first date | every date matches UTC |
| --- | --- | --- |
| UTC | 2027-03-01 | true |
| Africa/Lagos | 2027-02-28 | false |
| Pacific/Kiritimati | 2027-02-28 | false |
| Europe/London | 2027-03-01 | true |
| America/New_York | 2027-03-01 | true |
| America/Los_Angeles | 2027-03-01 | true |
| Pacific/Pago_Pago | 2027-03-01 | true |

In Africa/Lagos and Pacific/Kiritimati the schedule starts on 2027-02-28, a day in the wrong month, and none of its dates matches the UTC run. In Europe/London, America/New_York, America/Los_Angeles and Pacific/Pago_Pago it starts on 2027-03-01. Both tables cover the same seven zones, so the only thing that differs between them is the form of the period start.

## Which zones move

The lab prints the reason in one line: the engine reads a Date's UTC calendar day. It then prints which zones that moves. Africa/Lagos and Pacific/Kiritimati read 2027-02-28. UTC, Europe/London, America/New_York, America/Los_Angeles and Pacific/Pago_Pago read 2027-03-01, and every date in those five matches UTC.

So the Date form is not wrong everywhere. It is right in some zones and a day early in others, which is worse, because a schedule built and checked in New York can be off by a day when the same code runs in Lagos. Nothing in the output says so.

A page in Lagos that built its period start from a local Date would date ABUA's whole March from the last day of February.

## The rule

A period start given as a YYYY-MM-DD string is the same calendar day in every zone. That is how the Suite page passes it and how this course passes it. A string names a day. It carries no clock and no zone, so no clock or zone can shift it.

Two habits follow. When you pass a period start, pass the string. When you check a schedule, check it in Africa/Lagos or Pacific/Kiritimati as well as your own, because the second table reads true in UTC and in the other four zones it prints.

## Exercise

Read the first date the lesson prints for Africa/Lagos in each of its two tables: 2027-03-01 with the string period start, and 2027-02-28 with the Date built at local midnight. Then read America/New_York's first date in the second table, 2027-03-01. Say what the three dates show about which form of period start is safe, and why the New York reading cannot be taken as proof that the Date form works.
