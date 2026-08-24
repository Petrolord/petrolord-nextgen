# One curve is dead

The campaign field reads: dead curves detected, 1. Across six files and 24 imported curves, exactly one curve carries no measurement anywhere in its column, and that curve is in nullheavy_20.las. This lesson is about what that number is and what it deliberately leaves out.

## The definition, stated exactly

A dead curve is a curve with no finite samples at all. Every cell in its column is the file's null flag, so once the parser has converted flagged values to not-a-number there is nothing finite left to count, to average, or to plot. The curve exists in the header, it occupies a full column in the data grid, and it delivers nothing.

The test is exact and carries no threshold. A curve with one finite sample among two hundred is not dead by this definition. It is unusable, and you would say so in a note, and the campaign field would still not count it. That distinction matters more at campaign scale than it did when you were reading one file, because a count with a fuzzy definition cannot be added up across a batch. Two people applying an exact test to sixty files get the same total. Two people applying a judgement get two totals and an argument.

## The denominator is curves, not files

Every other exception field in this capstone counts files. This one counts curves, and that is a deliberate choice rather than an accident of wording.

| file | dead curves |
|---|---|
| basic_20.las | 0 |
| feet_20.las | 0 |
| irregular_20.las | 0 |
| nullheavy_20.las | 1 |
| quirks_20.las | 0 |
| wrapped_12.las | 0 |

Add the column and the field is 1. Its denominator is the 24 curves the campaign imported, so the finding reads as 1 dead curve in 24, in one of six files.

Counting curves rather than files preserves information that a file-level flag would destroy. Imagine a file that delivered two dead curves. A flag saying this file contains a dead curve would report the same thing for that file as for a file with one, and a batch of ten such files would report ten either way. The curve count separates a delivery with a scattered problem from a delivery with a collapsed one. Since a dead curve is a curve, count curves.

The corollary is that this field, on its own, is not enough to act on. It says how many, in a population of 24. It does not say which curve, and it does not say how much of the file's missing data the dead curve accounts for. Both of those are real questions with real answers, and the next module is where they get taken apart.

## What one dead curve in twenty four means

Read the number as a statement about the delivery rather than about the file.

One in 24 is small enough to be an incident and large enough to be worth a message. If a vendor delivered 24 curves and one of them is empty, something specific happened: a tool was not in the string, a channel failed, a splice kept a mnemonic no run could fill. Those are different causes with different consequences, and none of them is visible in the number.

Notice also that the dead curve is concentrated. Five files contribute nothing to this field and one contributes all of it. That is the same shape you found with the depth unit conversion and with step uniformity, and it is the shape this module is about. The campaign keeps returning the answer one, and it keeps returning it from a different file each time, which means no single file in this delivery is the bad one. Each has its own defect and five clean neighbours to reveal it.

nullheavy_20.las also carries by far the largest null count in the campaign. Those two facts about the same file are related in a way that is easy to state wrongly, so leave it alone for now. Module 4 opens that file up properly and shows exactly how the dead curve and the null total sit inside each other.

## Worked example

Work the field from the definition rather than from memory of the file.

Take each of the 24 imported curves in turn. For each one, count the finite samples in its column. If the count is zero, the curve is dead. If the count is one or more, it is not, however badly gapped it may be. Add up the dead curves across all six files.

Twenty three of those columns hold at least one finite sample. One holds none. The field is 1, and its location is nullheavy_20.las.

Then run the check that catches the common mistake. A curve that returns no mean and no first finite sample is dead, and a curve that returns a mean over a reduced sample count is not. If your total came out higher than 1, you have been counting badly gapped curves as dead ones. If it came out as 0, check the null flag your reader used against the flag each file declares, because a reader that misses the declaration sees a full column of large negative numbers and reports a perfectly healthy curve.

Open the panel below and read the dead curve column across the six files.

{{panel:wd-campaign-explorer}}

## Exercise

State the definition of a dead curve in one sentence, then use it to decide three cases: a curve with 0 finite samples in 201, a curve with 1 finite sample in 201, and a curve with 71 nulls of 201. For each, say whether it adds to the graded field. Then answer in two sentences: why does this field count curves when the neighbouring exception fields count files, and what does a value of 1 not tell you.

Self-check: a dead curve is one with no finite samples at all, so the first case is dead and adds 1 to the field, while the second and third are not dead and add nothing, even though a curve with a single finite sample in 201 is useless in practice and belongs in your notes, and a curve with 71 nulls of 201 keeps the rest of its samples as real readings. The field counts curves because deadness is a property of a curve and a file-level flag would report the same value for a file with one dead curve as for a file with several, which loses the size of the problem. A value of 1 tells you how many dead curves exist among the campaign's 24 imported curves and where the total came from at file level, and it does not tell you which curve died or how much of that file's missing data the dead column accounts for.
