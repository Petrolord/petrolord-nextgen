# A date is not a timestamp

A date-only string is a calendar date. The engine reads 2027-04-01 as local midnight on the first of April, and that single decision is the difference between a schedule every reader sees the same way and one that shifts by a day depending on who opened it.

{{panel:ec-schedule-explorer}}

## Local midnight, and the other midnight

`new Date("2027-04-01")` gives UTC midnight, which is the day before anywhere west of Greenwich. A schedule drawn from instants built that way showed the sanction date somebody typed to one reader and the day before it to another, from one stored string, with no edit in between.

The string never said anything about a time. A sanction is not an instant, it is a day in a calendar, and the moment a day is stored as an instant it acquires a time zone it was never given.

## The dates a concept carries

| concept | sanction | first oil | months |
| --- | --- | --- | --- |
| FPSO | 2027-04-01 | 2030-04-01 | 36 |
| Platform | 2027-04-01 | 2029-04-01 | 24 |

Both concepts are sanctioned on the same day and reach first oil on different ones. The difference of 36 months against 24 is a difference in what the concept requires, and nothing in it came from a clock.

## The end of February

A FPSO sanctioned on 2028-02-29 reaches first oil on 2031-03-01, and it is still 36 months. The sanction sits on the last day of a February that has a twenty ninth, and the February three years later does not, so the month arithmetic lands on the first of March.

That is a calendar answering a calendar question. An implementation adding a fixed number of milliseconds would land near it and drift with every leap year and clock change it crossed.

## Why this reaches the reader

A schedule is read in more than one place. The engineer who typed the sanction date, the reviewer in another office and the partner in another country all open the same stored plan, and if the stored value is an instant each is shown it converted into their own zone.

Sanction, first oil and every milestone between them move together, so each reader sees a schedule that is internally consistent and nothing looks broken to anybody. The disagreement surfaces only when two of them quote a date to each other.

## The mistake

Two mistakes travel together. The first is storing a day as an instant, which gives two readers two answers and no way to tell which is looking at the stored value. The second is subtracting two instants to get a length: an hour introduced by a clock change turns a whole number of days into something that is not one, and whether it still reads correctly depends on whether the code that divides truncates or rounds.

Both are avoided the same way. Keep a date as a date, and count in days.

## Exercise

State what 2027-04-01 means when read as a calendar date and what the same string means when read as an instant, and say which readers see a different day from the second reading. Then give first oil and the month count for a FPSO sanctioned on 2028-02-29, and explain why the answer falls on the first of March.
