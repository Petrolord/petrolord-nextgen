# A row its neighbours contradict

OSHA Table A-1 prints a noise dose of 115 percent as a TWA of 91.1 dBA. The formula gives 90.945190, 91.008191 and 91.070647 dBA at 114, 115 and 116 percent, and the table prints the two neighbours as 90.9 and 91.1. The printed 115 row sits 0.091809 dB above the formula, 1.836177 tolerances away at a printed tolerance of 0.050000. Two adjacent rows cannot both print 91.1 when the formula climbs 0.125458 dB across them.

## The argument from neighbours

This erratum is smaller than a transposed digit and harder to see. The printed 91.1 is a plausible TWA for a noise dose of 115 percent. Nothing about the number alone looks wrong. What exposes it is the row below it.

Table A-1 restates a noise dose as a TWA on the OSHA scale, TWA = 16.61 log10(D/100) + 90, printed to one decimal. The formula rises steadily with noise dose. Across the two percent from 114 to 116 it climbs 0.125458 dB, which is more than one printed unit. A table that rounds the formula correctly cannot give the 115 and 116 rows the same printed tenth, because the formula at 115 percent lies outside the range of values that round to 91.1 and the formula at 116 percent lies inside it. The golden's note:

> formula gives 91.008, printed 91.1 (neighbours 114 -> 90.9 and 116 -> 91.1 agree)

| noise dose, percent | formula TWA, dBA | printed TWA, dBA | status |
| --- | --- | --- | --- |
| 114.000000 | 90.945190 | 90.900000 | reproduced |
| 115.000000 | 91.008191 | 91.100000 | erratum |
| 116.000000 | 91.070647 | 91.100000 | reproduced |

## Why this row is detectable and the coefficient is not

Judgement J1 set a limit on what Table A-1 can prove. The printed coefficient 16.61 and the exact one differ by 0.000359525563 dB, and 0 of the table's 150 reproduced rows reject the exact coefficient. That gap is far too small for a one-decimal table to see.

The 115 row is different in size. Its printed value misses the formula by 0.091809 dB, which is nearly twice the half-unit a one-decimal table can hold. So the same table that cannot tell two coefficients apart can still convict one of its own rows. A table's resolving power is fixed by its printed precision, and whether it can prove something depends on whether the thing is larger than that precision. Here the erratum is and the coefficient gap is not.

## What a critical reader does

Read a printed row against the formula the source states. If it misses, read the rows on each side. If they agree with the formula, the row between them is the slip. If they miss too, suspect the formula you are using before you suspect the table. That order keeps a reader from correcting a standard that was right.

## What the engine does

The engine evaluates the formula and returns 91.008191 dBA at 115 percent. The golden pins the printed 91.1 as a case the engine must stay outside of, so an engine edited to agree with the table would fail.

## Exercise

Using the three formula values in the table, work out what a correctly rounding one-decimal table would print at 114, 115 and 116 percent. Then compare each with the printed column and name the row that fails. Finally, say in one sentence why Table A-1 can catch this row but cannot separate 16.61 from the exact coefficient.
