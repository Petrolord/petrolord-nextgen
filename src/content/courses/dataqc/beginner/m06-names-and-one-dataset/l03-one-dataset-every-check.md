# One dataset, every check

{{panel:dq-checks-explorer}}

Each module of this tier took one question and one check at a time. A real file arrives whole, and the job is to run every check on it, in a sensible order, with every setting stated. Here is EKENE-3's production sheet through every Associate check, with the settings the earlier lessons used.

| check | column | setting, stated | checked or n | result |
| --- | --- | --- | --- | --- |
| completeness | oil | none | 90 | 3 missing, in 1 gap run from day 31 |
| rateCheck | oil | hours on and status | 87 | 2 failed |
| cumulativeCheck | cumOil | tolerance 0 | 89 | 1 flag |
| waterCutCheck | waterCut | tolerance 1e-4 | 90 | 6 failed |
| phaseSumCheck | oil + water against gross | relTolerance 0.005 | 87 | 1 flag |
| frozenRuns | gas | minRun 5, tolerance 0 | 90 | 1 run |

And EKENE-7's log through the same checks:

| check | channel | entries failed | flags |
| --- | --- | --- | --- |
| completeness | RHOB | 12 | 1 |
| completeness | NPHI | 3 | 3 |
| rangeCheck | GR as delivered | 4 | 4 |
| rangeCheck | NPHI | 10 | 10 |
| rangeCheck | RT | 1 | 1 |
| indexCheck | depth | 1 | 1 |
| frozenRuns | DT | 9 | 1 |

Every one of these flags is a planted defect.

## Reading the production sheet as one story

Put the flags in date order and the sheet tells a story. Days 20 to 24 carry a water cut written in percent. Days 31 to 33 lost the oil meter, and the gross and water cut went with it. Day 40 has a truck load in the gross total. Day 47 carries a negative allocation entry, and day 55 a water cut typed from the day before. Day 61 has a rate carried onto a shut-in day. Day 70 has a keyed cumulative, measured against day 68 because day 69 is missing. The gas meter stuck from day 74 to day 81. Every one of those is a question for the person who owns the sheet, and the flags hand over the day, the rule and the reason for each.

## The settings are part of the result

Look at the setting column. The water cut count is 6 only because the tolerance matches the sheet's four-decimal reporting; at the default it would be 83. The cumulative count is 1 at a tolerance of 0; at 8000 bbl it would be none. A count without its setting cannot be reproduced, and a count with the wrong setting is a different claim. Report them together.

## An order that works

Start with completeness and the index, and check the index before coverage, because coverage refuses an index that steps back. Then coverage, so you know how much of the interval is there. Then validity: definitional limits, your own ranges, units and rates. Then consistency between channels. Then names, before the file is merged with anything else. A flag early in that order often explains flags later: the missing oil days reappear as days the water cut and phase sum could not check.

## What this tier does not ask

A value that passes these checks has cleared every rule this tier states. None of that says which values stand apart from the rest. That is the next tier's question. This tier's answer to its own question, whether the data are fit to use, is this pair of tables with their settings, and a note on what the owner of the file must decide.

## Exercise

Open the checks explorer and work through its five views on the Ekene defaults. In each of the first four, find a flag that matches a row of the tables above and copy its rule and reason. Then pick one EKENE-3 row, change its setting in the panel to the alternative this tier discussed, and write down how the result moved and what that change would mean for a report.
