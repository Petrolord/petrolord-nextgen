# Counting the conversions

The graded number for this module is a count. Run the import pipeline on feet_20 and report how many curves were unit-converted. The answer is 2, it is graded exactly, and there is no tolerance to hide in.

The two are DEPT and DT. This lesson is about how to arrive at that count reliably, and about the two wrong answers that are common enough to be worth naming.

## Count units, not curves

The reliable method is not to count curves and then reason about them. It is to inspect units and let the count fall out.

Work down the curve section of the file, one line at a time, and for each curve ask the single question from lesson one: does this unit string contain a length expressed in the foreign system, in the numerator or the denominator? Write yes or no. When you reach the bottom, count the number of times you wrote yes. That is the answer, and you never had to hold the whole file in your head.

Applied to feet_20:

| mnemonic | kind | unit after | unit before | converted |
|---|---|---|---|---|
| DEPT | depth   | M     | F     | YES |
| GR   | gr      | GAPI  | GAPI  | no  |
| RHOB | density | G/C3  | G/C3  | no  |
| NPHI | neutron | V/V   | V/V   | no  |
| DT   | sonic   | US/M  | US/F  | YES |

DEPT carries F, a foreign length. Yes. GR carries GAPI, which has no dimensions. No. RHOB carries G/C3, dimensioned but metric. No. NPHI carries V/V, dimensionless. No. DT carries US/F, which has a foreign length in the denominator. Yes.

Two yeses. The count is 2.

The method scales. A file with thirty curves is not thirty times harder; it is thirty lines of yes or no, and the great majority of them are no because most logging units are either dimensionless, defined by a calibration standard, or already metric. Files that need many conversions are rare. Files that need exactly two, a depth and a sonic, are the ordinary case in the North American archive.

## The first wrong answer: 1

The commonest wrong answer is 1, and it comes from thinking that unit conversion is something done to the depth column.

It is a reasonable-sounding belief with a specific flaw. It confuses the unit of the log's index with the units of the log's measurements. The index unit is the loudest one in the file, because it is declared four times over in the header as STRT, STOP and STEP and again on the depth curve, so it dominates a quick read. The measurement units are declared once each, in the curve section, in a column that scans as boilerplate.

If you answered 1, the correction is not to remember that DT is special. It is to change what you look at. Read the curve section as five independent unit declarations rather than as one file-level fact plus some decoration.

## The second wrong answer: 5

The other wrong answer is 5, and it comes from the opposite error. The file is a feet file, everything in it is foreign, so the importer must have converted everything.

Two things are wrong with that. The lesser point is arithmetic: 5 is the total curve count, so answering 5 is really answering "all of them" without inspecting anything. The greater point is that it misunderstands what foreignness means. A file does not have a unit system. Curves have units, and the units of GR, RHOB and NPHI in this file are exactly the units those curves carry in the metric files of the same teaching set. There is nothing foreign about them.

If you answered 5, the correction is to open basic_20 alongside feet_20 and compare their curve sections line by line. Two lines differ. Three are identical. The three identical lines are the three curves that do not convert, and they were never going to.

## Two answers that are not wrong so much as unasked

Worth heading off. The count is of curves the importer converted, so it includes the depth column, which is stored as a log in its own right. It is not a count of measurement curves only, and it is not a count of distinct conversion factors used. Both of those would give different numbers, and neither is what is asked. Read the question as it is written: how many curves were unit-converted.

## Reading the count off the panel

The panel below runs the import pipeline on any of the six teaching files and shows the per-curve unit before, unit after, kind and converted flag.

Use it as a check on your own inspection, not as a substitute for it. Do the yes-or-no pass by hand first, on paper, then load feet_20 and count the set flags. Two rows carry the flag. Then load basic_20, which is already metric, and confirm that no rows carry it, which is the cleanest possible demonstration that the flag tracks the unit string rather than the curve identity.

{{panel:wd-import-explorer}}

## Exercise

Take a curve section you have not seen and count the conversions by inspection. The file is logged in feet and declares these six curves in order: DEPT in F, GR in GAPI, RHOB in G/C3, NPHI in V/V, DTCO in USEC/FT, and TVD in FT. Work down the list writing yes or no, then give the count. Then state, in one sentence each, what a learner who answered 1 got wrong and what a learner who answered 5 got wrong on feet_20.

Self-check: DEPT yes, GR no, RHOB no, NPHI no, DTCO yes because USEC/FT is another spelling of microseconds per foot and carries a foreign length in the denominator, and TVD yes because FT is another spelling of feet. That is three, which should also convince you that the answer of 2 for feet_20 is a fact about that file rather than a rule. Notice too that neither mnemonic mattered: DTCO is not DT and TVD is not DEPT, and both were decided on the unit string alone. The learner who answered 1 treated conversion as a property of the index column alone and missed the sonic. The learner who answered 5 treated foreignness as a property of the file rather than of each curve's unit string, and converted three curves that carry no foreign length at all.
