# The payback year

Payback is the first year the running sum is above zero, it is a whole year and not a fraction, and it answers a smaller question than most readers ask of it.

{{panel:ec-regime-explorer}}

## The definition, and its neighbour

`payback` is the first year in which cumulative contractor net cash flow is above zero. Under "USA - Gulf of Mexico" on the Designer's default project the cumulative reads -140.2337 in year 2 and 8.9905 in year 3, so payback is year 3.

The ledger carries a second clock beside it. `payout` is the first year the R factor is above 1.0, and the R factor is cumulative revenue over cumulative cost. On the same ledger it reads 0.512217, then 0.922481, then 1.254640, so payout is also year 3. The two agree here and they do not always agree.

| regime | payback year | payout year |
| --- | --- | --- |
| Nigeria - PIA (2021) | 4 | 3 |
| Ghana - Deepwater | 3 | 3 |
| Brazil - Concession | 3 | 3 |
| USA - Gulf of Mexico | 3 | 3 |
| Angola - Deepwater PSC | 4 | 3 |
| Generic Royalty/Tax | 3 | 3 |

PIA and Angola take a year longer to return the contractor's cash than they take to earn back the project's cost, because the state takes its share in between.

## When there is no answer

Both readings are null when the event never happens. The published case that runs the test project at capex 20000 returns payback null and payout null, with a life total of -15724.0151. A null is a reading, and quoting it as a null is the correct answer, not a gap in the table.

## The mistake

Payback is not the year the cost pool clears. A published case named for a pool that never recovers, running cost recovery capped at 5 percent, pays back in year 3 and reaches payout in year 2, and closes the life with 2543.7575 still unrecovered. Its total contractor net cash flow is 1530.0622. The contractor's cash turned positive early while the cost pool never emptied at all, and a reader who treats the two as one clock reports the wrong one.

The second error is to rank on payback. It is a whole year, so four of the six templates read 3 on the default project and are not distinguished at all, and on the Suite test project all six read 2. A tie in this column is not a tie in the money: the same year 3 covers a life total of 986.7327 under Generic and 623.9658 under Brazil.

## Slower on a harder field

The teaching field ODIDI pushes every clock out. Payback lands in year 6 under Brazil and Ghana, year 7 under Generic, PIA and the Gulf of Mexico terms, and year 8 under Angola, while payout is year 6 for all six. A regime cannot buy back much of a decline of 14 percent a year against 420.0000 of capex.

## What it refuses

Payback is undiscounted, so it says when nominal money returns and never what it was worth on arrival. It has no fractional year, no interest on the deficit, and no view of anything that happens after the crossing: a field that pays back in year 3 and then loses money for twenty years still reports year 3.

## Exercise

Write payback and payout for the six templates on the default project, and say what makes PIA and Angola differ from the other four. Then say why a case whose pool closes at 2543.7575 can still report payback in year 3.
