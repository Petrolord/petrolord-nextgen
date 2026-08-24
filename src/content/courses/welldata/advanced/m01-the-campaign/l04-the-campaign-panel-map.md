# The campaign panel map

This lesson is the map of the tier. It names what the campaign panel reports, says which module owns each part, and puts the six graded numbers in front of you now rather than at the end. Seeing the destination early changes how you read everything between here and the capstone, and at this tier the destination has an unusual property: nothing in it has any margin at all.

## What the panel does

The panel runs all six teaching files through the full import pipeline in one pass and renders the campaign table. Every row is a file. Every column is a check you already know how to run on a single file. Above the table it shows the aggregates, and beside each aggregate it shows the composition, meaning which files or which curves contributed to it.

That pairing is the design of the panel and the design of the tier. An aggregate on its own is a number that can be believed too quickly. An aggregate with its composition beside it is a finding, because you can see at once whether the count is spread evenly across the delivery or carried by one member.

## The five parts and who owns them

**Curve counts.** How many curves the campaign imported, with the depth index excluded, and how that total is built from the six files. Module 2 owns it, and spends its length on why the index is excluded and on what a curve count does not tell you.

**Exceptions.** The three readings where exactly one file differs from the rest: the file needing a depth unit conversion, the file with no uniform depth step, and the dead curve. Module 3 owns them, and argues that the exceptions are the product of the campaign rather than a by-product.

**Aggregate composition.** The null total in nullheavy_20, broken out by curve. Module 4 owns it, and it is the central teaching point of the tier. One number, two entirely different problems inside it, and two different responses.

**The wrapped file.** The depth sample count in wrapped_12, and the mechanism by which a parser with no wrap branch arrives at it. Module 5 owns it, along with the question of when that mechanism is safe and when it is not.

**The workflow.** Module 6 puts the whole thing together in the order you would run it on a delivery that arrived this morning, sets out the quality control on the campaign itself, and walks the capstone.

## The six graded numbers

The tolerances are part of the fact, so learn them beside the values.

| reading | value | tolerance |
| --- | --- | --- |
| curves imported across the campaign, depth excluded | 24 | 0 |
| files needing depth unit conversion | 1 | 0 |
| dead curves detected | 1 | 0 |
| files with a uniform depth step | 5 | 0 |
| depth samples in wrapped_12 | 161 | 0 |
| flagged nulls in nullheavy_20 | 272 | 0 |

Look at the right-hand column before you look at the values. Every tolerance is zero, and that is worth saying out loud because the tier below was not like this. There, three of the six graded readings were converted depths with a tolerance of 0.01 m, and the interesting question about each was what close enough meant.

Here the question does not arise. These are counts. A count is either right or wrong. There is no arithmetic that lands you 0.4 of a curve away from 24, and no float representation that makes 5 files with a uniform step come out as 4.98. Being one off is not being nearly right, because the only ways to be one off are to have counted a different kind of thing or to have used a different set.

That is the other half of what a zero tolerance means, and it is the useful half. The grader is not testing your arithmetic. Six counts of small numbers require no arithmetic worth the name. It is testing whether you know what is being counted. Answer 30 for the first row and you counted the depth index in every file. Answer 6 for the fourth row and you took the headers at their word instead of testing the columns. Answer 201 for the last row and you reported that file's depth sample count in place of its flagged nulls.

Each of those wrong answers is reachable by careful work from a wrong definition, which is exactly why no margin is offered on any of them.

## The two readings that belong to one file

Four of the six are aggregates over the delivery. The last two are not, and the difference matters when you write them down. The 161 is a sample count inside wrapped_12, and the 272 is a null count inside nullheavy_20. Both are hard for a different reason than the aggregates are: one tests whether you understand a parser, the other whether you will report a total without its composition.

Say the file name whenever you quote either. A bare 272 means nothing, and a bare 161 reads as a property of the delivery rather than of one archive-era file.

## How to use the panel

Use it to check yourself rather than to find out. Predict a reading, write it down, then open the panel and compare. A match confirms your definition. A miss tells you which definition is wrong, and the composition beside each aggregate shows where to look.

That loop works here because there is no estimation anywhere in this tier. The pipeline is deterministic, the files are fixed, and every graded reading is a count over a finite set. If your answer and the panel disagree, one of you is wrong and it is findable.

The panel below runs all six teaching files as one campaign and shows the table with each aggregate and its composition.

{{panel:wd-campaign-explorer}}

## Exercise

Open the panel and find all six graded numbers on it. Beside each, write the module that will explain it, the unit it counts, and whether it is an aggregate over the delivery or a reading inside one named file. Then, without computing anything, write down for each of the four aggregates what a plausible wrong answer would be and what a person would have to believe to produce it.

Self-check: curve counts belong to module 2, the three exception readings to module 3, the null total to module 4 and the wrapped sample count to module 5, with module 6 assembling all of them. By unit, the readings count curves, files, curves, files, samples and samples in that order, and the last two are readings inside wrapped_12 and nullheavy_20 rather than aggregates. The reachable wrong answers include 30 curves from counting the depth index in every file, 0 or 2 conversions from reading the delivery as uniform in units, 6 uniform files from trusting the declared steps, and a dead-curve count of 0 from testing a curve for many nulls rather than for no finite samples at all.
