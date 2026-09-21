# A digit slip in a table

NIOSH Table 1-2 prints a noise dose of 50000 percent as a TWA of 102.0 dBA. The table's own formula gives 111.989700 dBA, which sits 9.989700 dB above the printed value, 199.794001 tolerances away at a printed tolerance of 0.050000. The golden's note says it is a transposed digit for 112.0. This module is about the sources, and those printed values are current and permanent: every reader of that table meets them today.

## Reading the row against the formula

Table 1-2 restates a noise dose as a TWA on the NIOSH criterion: TWA = 10.0 log10(D/100) + 85. At a noise dose of 50000.000000 percent the formula gives 111.989700 dBA. The printed 102.0 is nearly ten decibels low. The golden records it verbatim:

> formula gives 111.99, printed 102.0 (a transposed digit for 112.0)

Two checks make the diagnosis sound. The neighbouring rows the table prints agree with the formula: 45000.000000 percent prints 111.500000 against 111.532125, and 60000.000000 percent prints 112.800000 against 112.781513. A printed TWA that goes from 111.500000 down to 102.0 and back up to 112.800000 as the noise dose rises is impossible for a formula that only rises. And 112.0, the value the formula rounds to, and 102.0 share the same digits in a different order, which is the signature of a slip at the keyboard.

| noise dose, percent | formula TWA, dBA | printed TWA, dBA | status |
| --- | --- | --- | --- |
| 45000.000000 | 111.532125 | 111.500000 | reproduced |
| 50000.000000 | 111.989700 | 102.000000 | erratum |
| 60000.000000 | 112.781513 | 112.800000 | reproduced |

## A second slip, in seconds

NIOSH Table 1-1 prints reference durations in hours, minutes and seconds. At 99.000000 dBA the formula gives 0.314980 h and the table prints 0.316389 h, 5.071055 tolerances away at a printed tolerance of 0.000278 h. The golden's note:

> formula gives 18 min 53.9 s, printed 18 min 59 s

Here the minutes agree and the seconds do not. The neighbours at 98.000000 and 100.000000 dBA reproduce, so the formula is right on both sides and the row between them carries the slip.

## Why the formula wins

The formula is the criterion. The table is a convenience printed from it. When a table and its own formula disagree at one row while agreeing at every neighbour, the table is the one that slipped. Reading a standard critically starts from that order of authority, and from the habit of checking a row that looks odd against the rows around it.

## Why the engine keeps the formula

An engine that copied the table row would return a TWA 9.989700 dB below the formula at that noise dose, 199.794001 tolerances away at the table's printed tolerance of 0.050000. Read back through a criterion, a TWA that low stands for a much smaller noise dose, and how much smaller depends on the criterion: one decibel on the TWA is worth a factor of 1.258925 on the NIOSH noise dose and 1.148695 on the OSHA one. Every figure built on the printed row comes back short. The engine evaluates the formula, and the golden pins the printed 102.0 as a case it must miss.

## Exercise

Take the three rows in the table and confirm that the TWA rises with noise dose in the formula column and fails to in the printed column. Then write the one sentence a reader would put in the margin of their copy of Table 1-2 at the 50000 percent row, giving the formula value and the reason for the correction.
