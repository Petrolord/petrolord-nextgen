# Day counts and leap years

{{panel:gsa-quantity-calculator}}

The ACQ is the DCQ times the days in the contract year, so the day count is a contract term in its own right. Get it wrong by one and a year's quantity is wrong by a whole DCQ. The engine accepts the day count in three ways and asks you to state exactly one.

## Three ways to state the days

| way | input | what the engine counts |
| --- | --- | --- |
| a stated number | `days` | the number, as stated |
| a calendar year | `year` | 365 days, or 366 in a leap year |
| a period | `period` with `start` and `end` | the days from the start up to the end, with the end date excluded |

The engine echoes the count it used in its basis, so you can always read which rule it applied.

## A leap year is a longer contract year

The calendar rule follows the Gregorian calendar. 2028 is a leap year and counts 366 days, so the power plant's ACQ for 2028 is 7686000.000000 MMBtu at its DCQ of 21000, against 7665000.000000 in 2027. The difference is exactly one DCQ. Century years are leap years only when divisible by four hundred, and the engine applies that rule too:

| case | DCQ | day count (engine basis) | ACQ (engine) |
| --- | --- | --- | --- |
| power plant 2027 | 21000.000000 | calendar year 2027: 365 days (not a leap year) | 7665000.000000 |
| power plant 2028 | 21000.000000 | calendar year 2028: 366 days (a leap year) | 7686000.000000 |
| year 2100 | 1000.000000 | calendar year 2100: 365 days (not a leap year) | 365000.000000 |
| year 2000 | 1000.000000 | calendar year 2000: 366 days (a leap year) | 366000.000000 |

The extra day carries through to everything built on the ACQ. At the power plant's 80 percent, the take-or-pay quantity on the full ACQ is 6148800.000000 in 2028 against 6132000.000000 in 2027. A buyer who took the same gas in both years would be further from its obligation in the leap year, so a reconciliation that ignored the calendar would misstate the deficiency.

## A period excludes its end date

A contract year that runs from one date to the first of January following is stated as a period whose end date is excluded. A full year from 2027-01-01 to 2028-01-01 counts 365 days and gives the export feed an ACQ of 22995000.000000. A first contract year that starts on 2027-07-01 and ends on 2028-01-01 counts 184 days, and at the export DCQ its ACQ is 11592000.000000. The engine's own wording for that count, verbatim:

> 2027-07-01 up to 2028-01-01 (end date excluded, as a contract year that finishes on the following 1 January): 184 days

## One count, and a real one

A call that states two day counts is refused, and so is a call that states none:

> days must be the only day count stated; got days and year

> days must be stated, or replaced by year or by period; got nothing

A day count must be whole, a period's end must come after its start, and every date must exist on the calendar:

> period.start must be a real date 'YYYY-MM-DD'; got "2027-02-30"

> days must be an integer at or above 1; got 365.5

## Exercise

Open the quantity calculator, the course's own calculator panel, and choose "Contract quantities and swing". Run the starting case for 2028 and read the day count line. Change `year` to 2027, then to 2100, then to 2000, and read the day count and ACQ each time. Now remove `year` and add a `period` with `start` "2027-07-01" and `end` "2028-01-01", set `dcq` to 63000, and read the day count. Finally add `"days": 365` beside the period and read the refusal.
