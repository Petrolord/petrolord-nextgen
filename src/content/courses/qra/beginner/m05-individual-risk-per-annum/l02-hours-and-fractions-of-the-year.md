# Hours and fractions of the year

{{panel:qr-event-tree}}

Rosters come in hours. The IRPA formula wants fractions of the year. The engine accepts either for each place and converts hours at 8760 hours a year, the hours in a year the LOPA course engine uses, which belongs to the LOPA course and is borrowed unchanged. This lesson shows the conversion, the refusals that guard it, and what a different year length would quietly do to the answer.

## Hours over 8760

| occupancy fraction | hours a year, stated | place |
| --- | --- | --- |
| 0.114155251142 | 1000 | process deck |
| 0.091324200913 | 800 | control room |
| 0.292237442922 | 2560 | accommodation |

Each fraction is the stated hours divided by 8760. The EREMOR operator's 1000 hours on the process deck become an occupancy of 0.114155251142, and the operator's IRPA over the three places is 0.000017541379 per year. At the limit, 8760 hours at one place is an occupancy of 1.000000, the whole year.

## Fractions as typed

The EREMOR supervisor's roster is given as fractions of the year instead: process deck 0.05, control room 0.2 and accommodation 0.25, all stated. The engine uses them directly, and the supervisor's IRPA is 0.000008743500 per year. Both forms reach the same formula; the engine converts hours first and then treats every place alike. Use whichever form the roster already speaks. A shift pattern written in hours should stay in hours, and a planning estimate written as a share of the year should stay as fractions.

Each place takes one form or the other. The refusal for both, in the engine's own words:

> locations[0].occupancyFraction: 'deck': give exactly one of occupancyFraction and hoursPerYr

And a place cannot hold more hours than a year has:

> locations[0].hoursPerYr: 'deck' must lie in [0, 8760] hours

## A different year

| operator IRPA per year | how it was built |
| --- | --- |
| 0.000017541379 | as the engine builds it, hours over 8760 |
| 0.000017529373 | hours over 8766 |

Some analysts divide by 8766, a year that averages in the leap day. The operator's IRPA then reads 0.000017529373 per year, slightly lower. The difference is small, and it is exactly the kind of small difference that fails a twelve decimal comparison. The engine's year is 8760 hours, declared, and every IRPA in this course uses it.

## Why the engine converts for you

Converting inside the engine means every place in a roster is divided by the same year. An analyst who converts by hand risks mixing year lengths across places, or rounding each fraction before multiplying, and either slip moves the answer in the later decimals where no one looks.

Keep the hours as stated when the roster gives hours. Let the engine make the fraction, and quote the fraction it returns at twelve decimals, exactly as printed, whenever you show your working to a reviewer.

## Exercise

Divide the operator's 800 control room hours by 8760 and confirm that you reach the occupancy fraction of 0.091324200913. Then multiply that fraction by the control room LSIR of 0.000006545000 per year, and check that you reproduce the control room contribution of 0.000000597717 per year.
