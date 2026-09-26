# Crude plus condensate over calendar days

{{panel:pia-hct-calculator}}

The tranches read a daily rate, so the first question on any field is what goes into it and what it is divided by. The texts answer the first part plainly. The second part is one of the engine's declared choices, and it prints its reason every time it runs.

## Condensate counts as crude

The Petroleum Industry Act 2021, Seventh Schedule para 6, says that "for royalty purposes condensates shall be treated as crude oil and natural gas liquids shall be treated as natural gas." The Petroleum Royalty Regulations 2022, r.12(1)(b), apply that to the scale: where a "field produces both crude oil and condensates, the sliding scale shall be applied to the total production of crude oil plus condensates ;".

So condensate raises the daily rate and can push a field up a tranche.

## The day count: a stated annual reading

The Regulations work month by month. Rule 12(2) says the barrels of oil per day "shall be determined by taking the total production for the applicable month and dividing this amount with the number of days during which oil was produced in such month, and the result shall be rounded to entire barrels."

The engine is an annual ledger. It divides the year's crude oil plus condensate by the calendar days of the year, 365 or 366, prints the result on every row as `royalty_liquids_bopd`, and states the choice in `kpis.pia_notes`:

> Royalty tranches read the year's crude oil plus condensate divided by the calendar days of the year; the Regulations (r.12(2)) divide each month's production by the days oil was produced in that month.

That note is a result with a stated approximation. It is never a refusal.

## Ekene Alpha, year by year

Ekene Alpha (synthetic, shallow water, converted lease) produces crude with condensate. In 2026 it produces 2920000 bbl of oil and 116800 bbl of condensate.

| year | calendar days | liquids bopd | liquids royalty rate |
| --- | --- | --- | --- |
| 2026 | 365 | 8320.000000 | 0.059976 |
| 2027 | 365 | 7321.600000 | 0.057927 |
| 2028 | 366 | 6425.404372 | 0.055546 |
| 2030 | 365 | 4989.463014 | 0.050000 |

2028 is a leap year and divides by 366. From 2030 Alpha is at or below 5,000 bopd and pays exactly 5 percent.

## Why the day count reaches the hydrocarbon tax

A lower daily rate means a lower weighted royalty rate, which means a smaller royalty deducted in the hydrocarbon tax base. Every step in that chain is a provision: para 6 decides the volume, r.12 decides the division, para 10(4) the rate, and s.263(1)(b) the deduction.

## Exercise

Work in the course's own hydrocarbon tax calculator, which calls the same engine.

1. Open "The tax base and the cost price ratio on a ledger" and start from ekene_alpha_shallow_converted_nta. Read the 2026 daily rate, 8320.000000 bopd, in the first table, and find the daily rate note in the engine notes under the tables. Read it against the quotation above.
2. Set every `condensate_bbl` in `prodRows` to 0. Read the new 2026 daily rate and liquids royalty rate, and compare the 2026 HCT assessable profit with 182041059.069891. Name the two things the change removed from that line.
3. Restore the case. Suppose Alpha had produced its 2026 barrels in nine months only. Which reading, the Regulations' monthly one or the engine's annual one, gives the higher daily rate, and in which direction would the royalty move?
