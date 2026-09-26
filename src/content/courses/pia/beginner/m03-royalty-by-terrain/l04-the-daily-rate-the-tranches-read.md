# The daily rate the tranches read

{{panel:pia-royalty-calculator}}

The tranches read a daily rate in barrels of oil per day, and a ledger holds a year of barrels. Something has to turn the one into the other. The Regulations say how to do it month by month, and the engine, which works in years, states the reading it uses. This lesson sets the two side by side.

## The rule in the Regulations

The Regulations define barrels of oil per day in r.12(2):

> "barrels of oil per day shall be determined by taking the total production for the applicable month and dividing this amount with the number of days during which oil was produced in such month, and the result shall be rounded to entire barrels."

Three features matter: the month is the period, the divisor is the days oil was produced, and the result is rounded to whole barrels.

## The engine's annual reading

The engine works one row a year. It divides the year's crude oil plus condensate by the calendar days of the year and prints the result on every row as `royalty_liquids_bopd`. The calendar days come from the year:

| year | calendar days |
| --- | --- |
| 2024 | 366 |
| 2025 | 365 |
| 2026 | 365 |
| 2027 | 365 |
| 2028 | 366 |

The engine states this reading in a note on every ledger, in its own words:

> Royalty tranches read the year's crude oil plus condensate divided by the calendar days of the year; the Regulations (r.12(2)) divide each month's production by the days oil was produced in that month.

The note is part of the result. A field that produces steadily through the year reads nearly the same either way; a field with a shutdown, or with a large swing between months, can read differently.

## Ekene Alpha year by year

| year | liquids bopd | liquids royalty rate | liquids royalty USD |
| --- | --- | --- | --- |
| 2026 | 8320.000000 | 0.059976 | 13625099.038462 |
| 2027 | 7321.600000 | 0.057927 | 11580515.038462 |
| 2028 | 6425.404372 | 0.055546 | 9771930.584405 |
| 2029 | 5669.846575 | 0.052954 | 8197954.296941 |
| 2030 | 4989.463014 | 0.050000 | 6811816.500000 |
| 2031 | 4390.728767 | 0.050000 | 5994400.250000 |
| 2032 | 3853.284153 | 0.050000 | 5275072.000000 |

Alpha sits between 5,000 and 10,000 bopd from 2026 to 2029, so each of those years pays a weighted rate between 0.050000 and 0.062500 that falls as the field declines. From 2030 it is at or below 5,000 bopd and pays exactly 5 percent. The year 2028 has 366 days, and the engine divides by 366.

## What the daily rate is not

The daily rate is a tranche input and nothing else. It does not set the royalty base, which is the value of the liquids, and it does not enter the royalty by price, which reads the price. The same annual rate is read at field level before any working interest share is taken, so a partner's share never changes the tranche a field falls into.

## Exercise

Open the royalty calculator and choose "Royalty by terrain and daily rate". Enter shallow_water and the year 2028, and check that the panel prints 366 calendar days. Add Alpha's 2028 oil and condensate from the rows of the Ekene cases lesson, divide by 366, enter the result as the daily rate, and confirm the engine returns 0.055546. Repeat for 2030 and explain why the rate there is exactly 0.050000. Then run ekene_alpha_shallow_converted_nta in "The instruments stacked on a ledger" and find the daily rate note among the notes below the table.
