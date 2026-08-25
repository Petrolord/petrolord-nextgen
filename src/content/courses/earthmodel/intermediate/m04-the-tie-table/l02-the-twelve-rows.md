# The twelve rows

Four wells, three tops each: the golden tie table has twelve rows, and this lesson reads it whole. A tie table is an instrument you read by patterns, down columns and across rows, not entry by entry.

{{panel:em-tie-explorer}}

## The table

| Well | Top | TVDSS | Surface | Residual |
| --- | --- | --- | --- | --- |
| W1 | TopA | 1505 | 1507 | -2 |
| W1 | TopB | 1540 | 1538 | +2 |
| W1 | BaseB | 1570 | 1565 | +5 |
| W2 | TopA | 1496.6634373420557 | 1532.422275553417 | -35.75883821136131 |
| W2 | TopB | 1581.5162510844414 | 1573.1978994886435 | +8.318351595797822 |
| W2 | BaseB | 1623.9426579556343 | 1578.9144946336385 | +45.02816332199586 |
| W3 | TopA | 1560 | 1559 | +1 |
| W3 | TopB | 1605 | 1598 | +7 |
| W3 | BaseB | 1635 | 1598 | +37 |
| W4 | TopA | 1556 | 1555.5 | +0.5 |
| W4 | TopB | 1602 | 1596 | +6 |
| W4 | BaseB | 1632 | 1596 | +36 |

Summary statistics: mean residual +9.173973058869365 m, mean absolute residual 15.467112760762916 m, twelve live rows, no nulls.

## Reading down the columns

The TopA column is small everywhere except W2: minus 2, plus 1, plus 0.5 at the vertical wells, minus 35.76 at the deviated one. Whatever afflicts W2's TopA is specific to W2, and TopA is the one top with no complications below it, so trajectory is the prime suspect. Note the SIGN: W2's TopA residual is the only large negative in the table.

The TopB column is uniform and modest: plus 2, plus 8.3, plus 7, plus 6. A same-signed, similar-sized residual at every well is the signature of a SURFACE bias: the TopB surface runs a few metres shallow across the field. No per-well explanation is needed for a column that moves together.

The BaseB column is the drama: plus 5, plus 45, plus 37, plus 36. Three of four wells disagree with BaseB by an entire zone thickness, and two of those three are VERTICAL, so trajectory cannot be the explanation for them. Whatever is wrong with BaseB is wrong at W3 and W4 in a way it is not at W1.

## Reading across the rows

W1 is clean everywhere: the model is trustworthy in W1's corner. W2 has two large residuals of OPPOSITE signs; one mechanism with a consistent direction cannot produce that pattern alone, so at least two things are happening in W2's rows. W3 and W4 are clean at TopA, mild at TopB, terrible at BaseB, and nearly identical to each other, which suggests they share whatever the cause is: they are the two eastern wells.

Three hypotheses assemble from the patterns: a small shallow bias in the TopB surface; something structural about BaseB in the east; and something W2-specific at TopA. The next two lessons resolve the second and third; the first is left as the honest residue a real QC table would carry forward.

## Worked example

Use the mean and mean-absolute pair diagnostically. The mean is +9.17 while the mean absolute is 15.47. If residuals were symmetric noise, the mean would sit near zero however large the absolute mean. A mean this far positive says the disagreements do not cancel: the wells are systematically finding rock DEEPER than the surfaces claim, which fits the BaseB column's one-way disagreement. A single pair of summary numbers, read together, already indicts a one-directional mechanism rather than random error.

## Exercise

Compute the mean residual of the TopB column alone, and of the BaseB column alone. Then write one sentence for each column saying what kind of fix, surface adjustment, pick review, or structural change, its pattern calls for.
