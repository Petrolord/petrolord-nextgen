# Ceilings and the tops of the tables

{{panel:hy-noise-dosimeter}}

A 132 dBA period on the OSHA PEL setup gives a noise dose of 84.448506 percent, a TWA of 88.780693 dBA and 2 warnings. The engine still reports the number. Judgement J3 is the rule: **above 130 dBA, above 115 dBA and above the NIOSH ceiling the result warns and still integrates.**

Three limits sit near the top of the scale. `OSHA_TABLE_G16A_MAX_DBA` is 130, the top of Table G-16a. `OSHA_TABLE_G16_MAX_DBA` is 115, the highest level Table G-16 permits. The NIOSH ceiling on the NIOSH noise REL preset is 115 dBA. Past any of them the formula is still evaluated. The warning is the engine telling the reader that the source stops there.

## The four cases

| period | criterion | noise dose, percent | TWA, dBA | warnings |
| --- | --- | --- | --- | --- |
| 117 dBA | OSHA PEL | 52.780316 | 85.390260 | 1 |
| 117 dBA | NIOSH noise REL | 2156.290550 | 98.337073 | 1 |
| 132 dBA | OSHA PEL | 84.448506 | 88.780693 | 2 |
| 132 dBA | NIOSH noise REL | 13083.161045 | 106.167127 | 2 |

The warnings, verbatim from the engine. At 117 dBA on the PEL:

> a level of 117 dBA is above 115 dBA, the highest level Table G-16 permits

At 117 dBA on the NIOSH noise REL:

> a level of 117 dBA exceeds the 115 dBA ceiling of this criterion, whatever the dose

At 132 dBA the formula is also past the top of the published table, so each criterion adds a second warning:

> a level of 132 dBA is above 130 dBA, the top of Table G-16a: the formula is extrapolated there

> a level of 132 dBA is above 115 dBA, the highest level Table G-16 permits

> a level of 132 dBA exceeds the 115 dBA ceiling of this criterion, whatever the dose

## A ceiling is a different kind of limit

A noise dose adds up time. A ceiling does not. The NIOSH message says so plainly in its closing words. The 117 dBA period on the PEL setup gives a noise dose of 52.780316 percent, under the PEL limit of 100, and yet the level is above anything Table G-16 permits. A noise dose under its limit does not clear a level that breaches a ceiling. Read the warnings before you read the percentage.

## Why warn and keep going

The engine could refuse above these levels. It does not, because the record is real and the arithmetic is still defined. A refusal would throw away the rest of the day. Returning the number with the warning beside it keeps the information and marks the part the source does not cover. Above 130 dBA the result is an extrapolation of the formula, and the warning says so in those words.

## Exercise

Take the 132 dBA period on the NIOSH noise REL, with its noise dose of 13083.161045 percent and TWA of 106.167127 dBA. Put the noise dose through TWA = 10.0 log10(D/100) + 85 and check the TWA. Then list which of the two warnings would still appear for a period at 117 dBA on the same criterion, and say which warning concerns the source table and which concerns the worker.
