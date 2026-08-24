# Onward to Expert

This tier taught one thing and taught it completely. You can take a foreign file and bring it into the project's own units and vocabulary, one file at a time, and defend every field you produced. On feet_20 that means a frame of 1493.52001953125 m converted to 1584.9599609375 m converted from a native 4900 to 5200 in feet at a factor of 0.3048, a measured step of 0.609619140625 m converted, 2 curves unit-converted because the sonic carries a length in its denominator, and 4 curve kinds recognised because the index curve is not a kind. On irregular_20 it means the integer 0, because the same test that forgives float32 wobble refuses real irregularity.

That is a complete skill, and it is narrow in one direction on purpose. Everything you did was scoped to a single file. The tier above changes the unit of work.

## The Expert tier works a delivery, not a file

The Expert tier runs all six teaching files through the same pipeline as one import campaign and reports on the delivery as a whole. Its six readings are aggregates across the set rather than fields of any one file:

* 24 curves imported across the six files, with the depth column excluded from the count
* 1 file needing a depth conversion
* 1 dead curve found in the delivery
* 5 files carrying a uniform step
* 161 depth samples parsed out of the wrapped LAS 1.2 file
* 272 flagged nulls in nullheavy_20

Those numbers belong to that tier and they are listed here as a destination rather than as material. Do not go looking for them now, and do not try to reach them with the import panel, which runs the pipeline on one file at a time and does not compute campaign totals.

## Why the aggregate is a different skill

Read that list again and notice that nothing in it is new. Every one of the six is a roll-up of a check you already know how to run.

The curve count is the curve section from the Associate tier, summed, with the same index exclusion you applied to the kind count here. The conversion count is this tier's module 2 and module 3, asked of a set. The dead curve is the Associate tier's null analysis. The uniform step count is module 5, run six times. The wrapped sample count is the Associate tier's wrapped mode. The null total is the Associate tier's null flag.

What changes is the question. At this tier the question is "is this file right", and the answer is a set of fields. At the Expert tier the question is "what is wrong with this delivery, and which part of it can I publish today", and the answer is a triage. Files do not arrive one at a time with a panel waiting for them. They arrive as a batch, and the useful output is a ranked list of what needs attention and what does not.

That reframing brings problems this tier never had to face. Which files can go into the registry while the others are queried with the sender. How you notice that one file out of six is the odd one, when reading each of them individually would take a day. Which single number on a campaign summary tells you fastest that a delivery is not what it claims to be. Whether a count that looks wrong is a bad file or a bad expectation.

## What to carry up

Three habits from this tier are what make the campaign readable at all.

Measure, do not trust. The step field exists because the header's claim was tested against the column. A campaign summary is a page of numbers that will be believed on sight, so every one of them has to have been produced the same way.

Unit trouble lives curve by curve. The count of 2 on feet_20 is the whole lesson, because a file is not just a feet file or a metres file. At campaign scale that becomes the difference between a delivery you can characterise by its files and one you have to characterise by its curves.

Record the negative. irregular_20 scoring 0 is a result, not a gap. The campaign's count of 5 files with a uniform step is only meaningful because the sixth file's absence of a step was recorded rather than filled in.

## Where this leaves you

Go back to the idea the Associate tier opened with. The data manager is a gatekeeper. That tier taught you to read a file's health. This tier taught you to bring a file into the project without losing or inventing anything on the way, and to write down what you did so somebody else can check it. The Expert tier scales that to a delivery.

Everything above this course consumes what you let through. The petrophysicist computing porosity from a sonic, the correlator hanging tops in metres, the mapper gridding a surface and the evaluator booking a volume are all working with numbers they did not check themselves. They are trusting that somebody did.

## Exercise

For each of the six Expert campaign readings, name the check from your own two tiers that it rolls up, and say which module first taught it. Then answer in two sentences: which reading would you look at first on a new delivery of six files, and why is the import panel the wrong tool for producing any of these six numbers?

As a self check: 24 curves imported with the depth column excluded rolls up the curve section and the index exclusion; 1 file needing a depth conversion rolls up depth units from module 2 of this tier; 1 dead curve and 272 flagged nulls in nullheavy_20 both roll up the Associate tier's null and dead curve work; 5 files with a uniform step rolls up module 5 of this tier, run once per file; and 161 depth samples in the wrapped LAS 1.2 file rolls up the Associate tier's wrapped mode. Any of the six can be defended as the first reading as long as you say what it would tell you, and the import panel is the wrong tool because it runs the pipeline on one teaching file at a time and reports that file's fields rather than any campaign total.
