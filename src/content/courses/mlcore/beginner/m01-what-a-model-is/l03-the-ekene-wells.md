# The Ekene wells and their logs

{{panel:ml-fit-explorer}}

Every row in this course comes from one synthetic field, Ekene, drawn on one stated seed, 20260913, through the platform's canonical seeded random number stream, with every value rounded to the decimals a real file carries. The same inputs give the same file anywhere. There are 10 wells, EKENE-1 to EKENE-10, each with 30 samples at a one foot step through the same reservoir interval, each well at its own depth: 300 rows in all.

| channel | unit | what it is |
| --- | --- | --- |
| GR | gAPI | gamma ray |
| RHOB | g/cm3 | bulk density |
| NPHI | v/v | neutron porosity |
| RT | ohm.m | deep resistivity |
| CALI | in | caliper, the hole diameter |
| DT | us/ft | compressional sonic slowness |
| PHIC | v/v | core calibrated porosity |
| PAY | 0 or 1 | a label from a stated rule |

## Four values per well

Four well-level attributes are constant down each well, and a stated top depth places each well's first sample.

| well | top depth (ft) | kb (m) | mudWeight (ppg) |
| --- | --- | --- | --- |
| EKENE-1 | 7827 | 22.200000 | 9.400000 |
| EKENE-2 | 7880 | 25.900000 | 9.900000 |
| EKENE-3 | 7923 | 28.300000 | 9.700000 |
| EKENE-4 | 7966 | 22.900000 | 9.800000 |
| EKENE-5 | 8045 | 26.300000 | 9.300000 |
| EKENE-6 | 8092 | 23.000000 | 10.500000 |
| EKENE-7 | 8140 | 23.700000 | 10.300000 |
| EKENE-8 | 8209 | 18.600000 | 9.800000 |
| EKENE-9 | 8265 | 21.700000 | 10.100000 |
| EKENE-10 | 8304 | 27.500000 | 9.900000 |

Easting and northing complete the four. Because each attribute holds one value for all 30 rows of a well, a model handed them can learn which well a row came from. Keep that in mind; it matters the moment rows are split.

## The well with no sonic

EKENE-6 has no sonic log, so every one of its DT samples is null. That leaves 270 rows in 9 wells carrying a DT, and those 270 rows are the sonic rows every module of this tier works on. EKENE-6 also sits in a hot shale: its gamma ray reads 30 gAPI higher on every sample than the rock alone would give. Module three meets that well again.

## A label from a stated rule

PAY is 1 when PHIC is at least 0.16 and RT is at least 10 ohm.m, and 0 otherwise. 94 of the 300 samples are pay. A label is the output of a rule, and this course always states the rule. This tier builds no model of PAY; the Professional tier does.

## What was planted, and why that is honest

The field is synthetic, and it carries structure placed on purpose so each lesson has something real to find. 7 items are planted. The one this tier finds is a well-level sonic offset: each well adds its own drawn offset to every DT sample, so a well sits above or below the others as a block. Module five finds it in the residuals. The others are the well-identifying attributes, a split that flatters nothing, the no-sonic well, its hot shale, the pay rule and a caliper drawn with no link to any other channel.

A real field comes with no list of what was planted. Whenever a lesson checks an answer against a planted value, it is doing something only a synthetic field allows, and it says so.

## Exercise

Open the fit explorer on the split view. Its table holds the 270 sonic rows with the columns well, GR, RHOB, NPHI, CALI and DT. Scroll the table and confirm that no EKENE-6 row is in it. Then open the least squares view, change the target to CALI and the features to GR, RHOB and NPHI, and read the Training R-squared tile. Write one sentence on what that figure says about a column drawn with no link to the others.
