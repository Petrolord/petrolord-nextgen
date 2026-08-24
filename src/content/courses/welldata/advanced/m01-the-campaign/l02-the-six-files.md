# The six files

The campaign runs over the same six teaching files the whole Well Data Manager ladder runs over. You have met all of them individually. This lesson meets them as a set, which is the first time their differences are visible in one place, and that visibility is the point of the table below.

## The campaign table

Each row is one file through the full pipeline. Curves are counted with the depth index excluded, which module 2 spends four lessons on. Nulls are flagged samples across the value curves, and samples is the length of the depth column.

| file | curves (depth excluded) | converted | uniform step | dead curves | nulls | samples |
| --- | --- | --- | --- | --- | --- | --- |
| basic_20.las | 4 | no | yes | 0 | 17 | 301 |
| feet_20.las | 4 | YES | yes | 0 | 6 | 151 |
| irregular_20.las | 4 | no | NO | 0 | 13 | 121 |
| nullheavy_20.las | 4 | no | yes | 1 | 272 | 201 |
| quirks_20.las | 4 | no | yes | 0 | 12 | 81 |
| wrapped_12.las | 4 | no | yes | 0 | 14 | 161 |

Read down the columns before you read across the rows. The curves column is constant at 4. The converted column has one entry that differs. The uniform column has one entry that differs. The dead column has one entry that differs. The nulls column has one entry that is nothing like the others, and the samples column varies in every row without any of that variation being a problem.

Five different shapes of column, on one table. Learning to tell them apart is most of this tier.

## A clean baseline: basic_20.las

Depth in metres at a steady step, 301 samples, the largest file in the set, a complete header, a null flag of -999.25 and nothing wrong with any of it. It contributes 4 curves, converts nothing, steps uniformly and carries no dead curve.

Its 17 flagged nulls are worth a second of attention, because they show that a clean file is not an empty one. Scattered nulls are ordinary in log data. A file is not suspect for having them.

basic_20 earns its place in the campaign by being the row every other row is read against. Without a control, a reader has no way to tell which entries in the table are properties of these files and which are properties of LAS files in general.

## A foreign-unit file: feet_20.las

The only file in the batch whose depth column arrives in feet, and therefore the only YES in the converted column. Its 151 samples cover the same sort of interval as the others once the conversion is applied.

The Professional tier worked this file in detail: the factor, the converted frame, the digits that survive float32, and the fact that unit trouble is a curve-by-curve matter rather than a depth-only one. None of that is repeated here. At campaign scale feet_20 collapses to a single word in a single cell, and the whole of the Professional tier's module 2 and module 3 stands behind that word.

## An irregular one: irregular_20.las

121 samples over a metric depth column whose step is not constant. It is the only NO in the uniform column, which is what makes five of the six uniform.

This file is the reason the uniformity reading is a measured verdict rather than a header field. Its header declares a step of 0, the LAS convention for irregular sampling, and a campaign that trusted headers would still have to test the other five to know they were telling the truth. The Professional tier tested the column. The campaign does the same test six times.

## A null-heavy one: nullheavy_20.las

201 samples, 272 flagged nulls, and the only dead curve in the delivery. It also declares its null flag as -9999 rather than the more common -999.25, which the Associate tier used to teach why a reader must read the declaration rather than assume it.

Notice that 272 exceeds 201. That is not an error and it is the first sign that this number is not what a quick reader will take it for. A count of nulls runs over the value curves rather than over depths, so it can exceed the sample count of the file. Module 4 takes the number apart. Leave it whole for now.

## Header quirks: quirks_20.las

The smallest file in the set at 81 samples, with a data section that is unremarkable and a header written the way real service-company files are written: irregular spacing, and a well name containing a colon, which is also the character that separates value from description in a LAS header line.

In the campaign table quirks_20 is unexceptional in every column. That is itself the finding. A file can be awkward to parse and still be perfectly good data, and the campaign correctly reports it as such because every quirk in it was handled at read time by a parser that knows the grammar. A file is not a problem because it was hard to read. It is a problem when the reading came out wrong.

## A wrapped file: wrapped_12.las

LAS version 1.2 with wrap switched on, so each depth step spans several physical lines. It reports 161 samples, and that count is graded.

The interesting part is not that the count is 161. It is how a parser with no wrap branch arrives at 161, which module 5 works through. For the campaign, wrapped_12 is another ordinary row: 4 curves, no conversion, a uniform step, no dead curve.

## What the set is for

Between them the six cover the four questions the Associate tier opened with. Structure is covered by wrapped_12 and quirks_20, units by feet_20, sampling by irregular_20, completeness by nullheavy_20, and basic_20 holds the control. Real deliveries combine these, often several in one file. The teaching set separates them so that each exception in the campaign table has exactly one cause and you can learn to read the table before the table gets hard.

## Exercise

Cover the table and write down, for each of the six files, which single column you expect it to be the exception in. Then uncover it and check. For the two files you expect to be exceptional in no column at all, say what each one is doing in a teaching set for a campaign.

Self-check: feet_20 is the exception in converted, irregular_20 in uniform step, nullheavy_20 in both dead curves and nulls, and basic_20, quirks_20 and wrapped_12 are exceptional in no column. basic_20 is the control that makes the other rows readable. quirks_20 shows that a file which is hard to parse can still be clean, so difficulty at read time and quality in the data are separate things. wrapped_12 is the same lesson in a different register, since its unusual layout produces an entirely ordinary row.
