# Periods and their contributions

{{panel:hy-noise-dosimeter}}

The OBEN record's third period, 0.800000 h at 94.600000 dBA, contributes 18.921153 percent to the OSHA PEL noise dose and 91.895868 percent to the NIOSH noise REL. A dosimeter record is a list of periods, and the engine's `noiseDose` door returns one contribution for each period beside the total, under whichever criterion you name.

Each contribution is the period's hours divided by its reference duration at that level, written in percent. The day's noise dose is the sum. Nothing else enters the arithmetic.

## The contributions on one page

| period | sound level, dBA | hours | OSHA PEL | OSHA action level | NIOSH noise REL |
| --- | --- | --- | --- | --- | --- |
| 1 | 84.300000 | 2.600000 | not integrated | 14.747186 | 27.646683 |
| 2 | 89.800000 | 1.900000 | not integrated | 23.100555 | 71.996537 |
| 3 | 94.600000 | 0.800000 | 18.921153 | 18.921153 | 91.895868 |
| 4 | 81.200000 | 1.750000 | not integrated | 6.458554 | 9.091664 |
| 5 | 99.100000 | 0.200000 | 8.827030 | 8.827030 | 64.980192 |
| 6 | 76.500000 | 0.750000 | not integrated | not integrated | not integrated |

The columns total 27.748183, 72.054478 and 265.610944 percent. Where a cell reads "not integrated", the level is below that criterion's threshold and the period adds nothing.

## Reading down a column

Down any one column, the contribution tracks how much of the reference duration each period used. Period 1 is the longest integrated period on the action level, at 2.600000 h, and yet it carries less than period 2, which lasts 1.900000 h. Period 2 is louder by more than one step of the 5 dB decibel exchange rate, and that more than halves its reference duration: 8.224911 h against 17.630482 h. Hours matter, and level matters more.

## Reading across a row

Across a row the hours are fixed and only the criterion changes. Period 3 carries 18.921153 percent under both OSHA setups, because both share a criterion level and a decibel exchange rate, and the action level threshold only matters for quieter periods. Under NIOSH it carries 91.895868 percent, because the NIOSH reference duration at 94.600000 dBA is 0.870551 h.

A contribution is the most useful number on a dosimeter download. It tells you which task to look at first when the total is too high, and it tells you why one criterion reads so differently from another.

## Checking a download by its contributions

The contributions also let you check a download before you trust its total. Add the column yourself. If your sum and the engine's noise dose disagree, one period has been read differently from the way you read it, and the contribution that differs points straight at it. On the OBEN day the PEL column is the easy check: two terms, 18.921153 and 8.827030 percent, and nothing else. The NIOSH column needs all five integrated terms, and a missed period shows up as a gap of one whole contribution.

## Exercise

Take period 4, 1.750000 h at 81.200000 dBA. Its OSHA reference duration is 27.095850 h and its NIOSH reference duration is 19.248401 h. Divide the hours by each and write the results in percent, then check them against 6.458554 and 9.091664 percent. Say why the OSHA PEL column shows that period as not integrated, although your first division gives a number.
