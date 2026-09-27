# Bands and write-downs

{{panel:materials-register-calculator}}

Placing an item in a band is half the job. The other half is the money: stock that has sat for years is probably worth less than the register says, and a policy writes its value down by a stated percentage for each band. This lesson works the write-downs of the Ekene register band by band.

## Stock value and write-down

An item's stock value is its stock on hand times its unit cost. Its write-down is its band's percentage of that value. The wellhead master valve holds 3 units at 42000, a stock value of 126000.000000. It has gone 14 months without an issue, so it is band slow, written down 25 percent: 31500.000000. The engine's reason, verbatim:

> WH-MV: 14 months since the last issue is at or above 12, band slow (below 24), written down 25% of 126000 = 31500; cover 17.996401 months is at or below 24

The reason names the months, the band's minimum and the next band's minimum, the percentage, the stock value and the write-down, so the whole working sits in one line.

## The Ekene register by band

| band | items | stock value | write-down |
| --- | --- | --- | --- |
| active | 11 | 589980.000000 | 0.000000 |
| slow | 4 | 265700.000000 | 66425.000000 |
| very slow | 2 | 32060.000000 | 16030.000000 |
| obsolete | 1 | 15500.000000 | 15500.000000 |

The total stock value is 903240.000000 and the total write-down 97955.000000. Most of the write-down comes from band slow, because the casing and the wellhead master valve carry large values there. The single obsolete item, the heat tracing controller, is written down in full: 5 units at 3100, 15500.000000, all of it.

| id | band | stock value | write-down |
| --- | --- | --- | --- |
| CSG-958 | slow | 87000.000000 | 21750.000000 |
| SSV-ACT | very slow | 27500.000000 | 13750.000000 |
| GASKET-RJ | very slow | 4560.000000 | 2280.000000 |
| HEAT-TRC | obsolete | 15500.000000 | 15500.000000 |

## The percentages are policy

Why 25 percent at 12 months, and 100 at 36? Because the Ekene policy says so. The engine holds no write-down schedule of its own; it applies the stated one and reports it. An accountant, an auditor and a stores manager might each argue for different bands, and the course quotes every write-down with the band that set it so the argument can happen in the open.

## Bands that cannot work

The first band must start at 0 months, so that every item takes a band:

> bands[0].minMonths must be 0 so that every item takes a band; got 6

Each band must start above the one before it:

> bands[2].minMonths must be above the band before it (24); got 12

And a write-down is a percentage from 0 to 100:

> bands[0].writeDownPct must be a number from 0 to 100; got 101

A call may carry at most 10 bands, and each label may be used once only.

## Exercise

Open the register calculator in "Slow-moving and obsolete stock" on "The Ekene register, its stated bands". Work the write-down of CEM-G and ORING-KIT by hand from the box and check both against the panel. Change the band 2 write-down control from 25 to 50 and note the new total write-down; restore it. Then set the band 1 from-months control from 0 to 6 and copy the refusal.
