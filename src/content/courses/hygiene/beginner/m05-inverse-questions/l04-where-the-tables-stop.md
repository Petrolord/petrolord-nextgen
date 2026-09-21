# Where the tables stop

{{panel:hy-noise-dosimeter}}

OSHA Table G-16a runs from 80 to 130 dBA in 51 rows. OSHA Table A-1 runs from a noise dose of 10.000000 to 999.000000 percent in 150 rows. NIOSH Table 1-1 runs from 80.000000 to 129.000000 dBA, and NIOSH Table 1-2 from a noise dose of 20.000000 to 10000000.000000 percent in 83 rows. Every inverse question in this module can be asked outside those ranges, and the engine answers it, with a warning where the source stops.

## The edges, in one place

| source | what it tabulates | where it stops |
| --- | --- | --- |
| OSHA Table G-16a | reference duration by level | 130 dBA |
| OSHA Table G-16 | the highest level permitted | 115 dBA |
| OSHA Table A-1 | TWA by noise dose | 999.000000 percent |
| NIOSH Table 1-1 | reference duration by level | 129.000000 dBA |
| NIOSH noise REL | its ceiling | 115 dBA |

The engine carries two of these as frozen tables of its own: `OSHA_TABLE_G16A_MAX_DBA` is 130 and `OSHA_TABLE_G16_MAX_DBA` is 115.

## The formula keeps going

The formulas behind the tables have no edge. Ask for the OSHA level at 0.250000 h and the engine returns 115.000000 dBA, which is where Table G-16 stops. Ask for a shorter time and the level rises past it. Ask for the noise dose of a record with a 132 dBA period and the engine integrates it: 84.448506 percent on the PEL setup, with 2 warnings. One of them reads:

> a level of 132 dBA is above 130 dBA, the top of Table G-16a: the formula is extrapolated there

That is judgement J3 at work on an inverse question. Past the top of a table the number is an extrapolation of the formula, and the engine says so in those words.

## What an extrapolation is worth

Inside a table the engine has been checked against every printed row. Outside it there is no printed row to check against, so the number rests on the formula alone. The arithmetic is still right. What is missing is a source that vouches for the formula there. For a report, that difference matters: quote the number, quote the warning beside it, and say that the source does not tabulate that level.

At the other end the edge is a threshold. Below 80 dBA the OSHA action level and the NIOSH noise REL stop counting, and below 90 dBA the PEL does. For such a level the engine reports `belowThreshold` in place of a reference duration.

## Exercise

Take the 132 dBA period on the PEL setup, with its noise dose of 84.448506 percent. Put that noise dose through TWA = 16.61 log10(D/100) + 90 and check your answer against the engine's 88.780693 dBA. Then say which of the two warnings is about the table and which is about the sound level reaching the worker, and whether the TWA itself sits inside or outside Table A-1.
