# Two published tables

{{panel:hy-noise-dosimeter}}

OSHA Table A-1 has 150 rows and the engine reproduces all of them with 16.61. With the exact coefficient, 0 of the 150 rows fall outside their printed tolerance. NIOSH Table 1-2 has 83 rows and the engine reproduces all of them with 10.0. With the exact coefficient, 49 of the 83 rows fall outside their printed tolerance.

Both tables do the same job. Each converts a noise dose in percent to a TWA in dBA, so that a hygienist without a calculator could read one off the other. Both print the TWA to one decimal. What differs is whether that one decimal is fine enough to tell the printed coefficient from the exact one.

## OSHA Table A-1 cannot tell them apart

The two OSHA coefficients differ by 0.000359525563 dB. Across the whole table that moves no TWA by enough to change its printed decimal. A few rows show it.

| noise dose, percent | TWA with 16.61 | printed TWA | TWA with exact K |
| --- | --- | --- | --- |
| 10.000000 | 73.390000 | 73.400000 | 73.390360 |
| 45.000000 | 84.239860 | 84.200000 | 84.239985 |
| 105.000000 | 90.351954 | 90.400000 | 90.351947 |
| 999.000000 | 106.602783 | 106.600000 | 106.602423 |

In each of these rows, round either engine column to one decimal and you land on the printed figure. The table is consistent with 16.61 and equally consistent with the exact coefficient, so the table alone cannot decide between them. That is why the regulation's text is what fixes 16.61, as the previous lesson showed.

## NIOSH Table 1-2 can

The two NIOSH coefficients differ by 0.034215715338 dB, and over the wide range of Table 1-2 that is enough to move the printed decimal.

| noise dose, percent | TWA with 10.0 | printed TWA | TWA with exact K |
| --- | --- | --- | --- |
| 20.000000 | 78.010300 | 78.000000 | 78.034216 |
| 700000.000000 | 123.450980 | 123.500000 | 123.319418 |
| 450000.000000 | 121.532125 | 121.500000 | 121.407128 |
| 10000000.000000 | 135.000000 | 135.000000 | 134.828921 |

At a noise dose of 450000.000000 percent the exact coefficient gives 121.407128 dBA, which rounds to a decimal the table does not print. The printed 121.500000 dBA is what 10.0 gives. That row is one of the 49 that reject the exact coefficient, and together they are evidence the table was computed with the coefficient NIOSH prints. Not every row can separate them: at 20.000000 percent both engine columns round to the printed 78.000000 dBA, and a row like that one cannot tell the coefficients apart.

## What a table can prove

A published table is evidence only as far as its printed precision reaches. Table 1-2 separates the two NIOSH coefficients and so supports judgement J1 directly. Table A-1 does not separate the two OSHA coefficients, so for OSHA the course leans on the text of Appendix A and says so. A reader who claimed Table A-1 proves 16.61 would be claiming more than one decimal can carry.

The same care applies when you check any engine against any printed table. Ask first whether the table could have caught the error you are looking for.

## Exercise

Take the NIOSH row at a noise dose of 700000.000000 percent. The engine with 10.0 gives 123.450980 dBA and the exact coefficient gives 123.319418 dBA. Round each to one decimal and say which one matches the printed 123.500000 dBA. Then do the same for the OSHA row at 45.000000 percent, and explain in one sentence why the OSHA row cannot tell you which coefficient the table used.
