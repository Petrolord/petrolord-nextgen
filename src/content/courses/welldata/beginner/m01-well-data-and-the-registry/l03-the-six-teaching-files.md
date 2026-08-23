# The six teaching files

This course runs on six LAS files from the synthetic KETA field, onshore Ghana. All six log the same four curves (GR, RHOB, NPHI, DT) against a DEPT column, and all six pass through the same central parser the whole platform uses. They are not six copies of the same lesson: each file carries one specific failure mode you will meet in real production data. Learn the six and you have a mental catalogue of what can go wrong at import.

## basic_20.las: the clean reference

A well-behaved LAS 2.0 export from well KETA G1-1: depth in metres from 1500 to 1650 at a 0.5 m step, 301 samples, null flag -999.25, a complete header. This is what a file looks like when nothing is wrong, and it is the baseline you compare every other file against. Its QC facts anchor the capstone: 301 depth samples, 8 null GR samples, and a finite-sample GR mean of 64.9272 GAPI.

## feet_20.las: the unit trap

The same field, but depth runs from 4900 to 5200 in feet at a 2 ft step, 151 samples, and the sonic curve arrives in us/ft rather than us/m. Nothing about the file is broken; it is simply denominated in the other unit system, as a large fraction of the world's log data is. The platform works in metres, so the import must convert: a 2 ft step becomes 0.6096 m, another capstone number. Miss the unit and every depth in the well is wrong by a factor of about 3.28.

## irregular_20.las: the broken rhythm

A metric well from 1500 to 1560 m, 121 samples, but the depth step is not constant everywhere. The header admits it in the standard LAS way: STEP is declared as 0, the convention for irregular sampling. Averaging end to end still gives 0.5 m, which is precisely why an average step can lie to you. Downstream tools that assume a uniform grid must resample this well or refuse it; the QC job is to notice the irregularity before they have to.

## nullheavy_20.las: the missing data

A metric well from 1500 to 1600 m, 201 samples, with two twists. First, its null flag is -9999, not the usual -999.25; a reader that assumes the common flag would treat every missing sample as a real, very negative measurement. Second, it is missing a lot: the GR curve has 71 null samples, and the NPHI curve is null at all 201 depths. A curve with no finite samples at all is called a dead curve, and the 201 null NPHI samples are another capstone number.

## quirks_20.las: the messy header

A short metric well (1500 to 1540 m, 81 samples) whose data section is fine but whose header is written the way real service-company files often are: irregular spacing, and a well name that contains a colon, KETA G1-3: THE "QUIRKY" ONE. Since the colon is also the character that separates values from descriptions in LAS header lines, a naive parser splits this line in the wrong place and mangles the name. The file teaches you that header parsing has rules, and that module 5 will make you glad the engine implements them properly.

## wrapped_12.las: the old format

The oldest layout you will still meet in archives: LAS version 1.2 with wrapped mode switched on, meaning each depth step's values span several physical lines instead of one row per depth. From well KETA G1-2, 1500 to 1580 m, 161 samples. You cannot count its samples by counting lines in the data section; only a parser that understands wrapping gets 161, and that count is the last of the capstone's six numbers.

## Why these six

Between them the files cover the four QC questions from the previous lesson: structure (wrapped_12 and quirks_20), units (feet_20), sampling (irregular_20), and completeness (nullheavy_20), with basic_20 as the control. Real files often combine several of these at once. The teaching set separates them so that when you meet a combination in the wild, you can decompose it into failure modes you have already handled one at a time.

## Exercise

From memory, match each file to the single QC question it primarily stresses: structure, units, sampling, or completeness, and note which two files stress structure. Then answer with numbers: which file has the most depth samples, which has the fewest, and which two share the same step in metres after conversion is applied? Self-check: basic_20 has the most at 301, quirks_20 the fewest at 81; wrapped_12 and quirks_20 stress structure; and every file except feet_20 samples at 0.5 m natively, while feet_20 lands close by at 0.6096 m after its 2 ft step is converted.
