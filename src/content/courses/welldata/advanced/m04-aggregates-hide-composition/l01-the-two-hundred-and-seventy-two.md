# The two hundred and seventy two

The last graded field of the campaign reads: flagged nulls in nullheavy_20, 272. It is one number, it is exact, and it is the number a report about that file would carry. This lesson takes it entirely at face value, because you have to understand what it honestly says before you can see what it quietly withholds.

## What the field counts

272 is the number of flagged samples in nullheavy_20.las, counted across its value curves. The file holds 4 curves once the depth index is excluded, and each of them runs to 201 depth samples. Every cell in that grid holds either a measurement or the file's declared null flag, and 272 of them hold the flag.

Two details in that sentence are doing more work than they look.

The depth column is not counted. The campaign counts nulls in the value curves, the same population it counts when it says the file contributed 4 curves. A depth index with holes in it would be a different and much worse problem, and it is not what this field is about.

The flag is whatever the file declares. The count is only correct if the reader took the null value from the file's own header rather than assuming the common one. This is the trap you met at the Associate tier, and it has not gone away just because you are now running six files at once. A reader that assumes the wrong sentinel does not report a smaller number here. It reports zero, and it hands every downstream statistic a column of large negative values that look like readings.

## Where 272 sits in the campaign

The null column across the six files puts the size of it in perspective.

| file | nulls |
|---|---|
| basic_20.las | 17 |
| feet_20.las | 6 |
| irregular_20.las | 13 |
| nullheavy_20.las | 272 |
| quirks_20.las | 12 |
| wrapped_12.las | 14 |

Five files sit in the low tens. One sits at 272, which is more than an order of magnitude above the next largest count in the batch, and it does so on a file that is not the largest in the set. basic_20 holds 301 depth samples against nullheavy_20's 201, and it reports 17 nulls.

So the campaign has isolated this file the way it isolated feet_20 and irregular_20. One file in six is unlike its neighbours, the difference is not marginal, and the number that says so is a single integer you can read off a column.

That is a real result, and it is the last thing this number does well.

## The number a report would carry

Picture how 272 travels. It goes into a delivery note as a row: nullheavy_20.las, 272 flagged nulls. It goes into a summary table beside the other five files. Somebody sorts the table by that column and this file goes to the top. Somebody else, three weeks later, reads the row and forms a view about the file without ever opening it.

Everything in that chain is reasonable. Aggregates exist because nobody can read every cell of every grid, and a single integer per file is exactly the right density of information for a table that has to be scanned. The number is correct, the row is correct, and the sorting is correct.

Hold on to how ordinary that all feels, because the rest of this module is about what the reader three weeks later actually knows. They know this file has more missing data than its neighbours. They do not know whether that missing data is spread thinly across the file, concentrated in one place, or something else again, and those possibilities call for completely different responses. The number does not distinguish them, and nothing about the way it is presented warns anyone that it cannot.

## Worked example

Form the count the way the campaign forms it, so you know exactly what it is a count of.

Take the file's curves in order and skip the first, which is the depth index. For each of the remaining 4 curves, walk its 201 samples and count the ones that are not finite, which after parsing means the ones that held the declared null flag. Keep a running total across the four curves. When you reach the end of the fourth curve, the total is 272 and the field is graded on that integer with a tolerance of zero.

Then run two checks on your own arithmetic. If your total came out at 0, your reader is using the wrong null value and you should go back to the file's header before doing anything else. If your total came out well above 272, check that you did not include the depth column in the sweep.

Open the panel below on nullheavy_20 and read the file's null total in the campaign table.

{{panel:wd-campaign-explorer}}

## Exercise

Write one sentence for a delivery note reporting the flagged null count for nullheavy_20.las, in the form you would actually send. Then list, without looking anything up, three different arrangements of missing data inside a file that would all produce a large null total, and say for each whether your sentence would let a reader tell it apart from the others.

Self-check: a defensible sentence reports 272 flagged nulls in nullheavy_20.las across its 4 value curves of 201 samples each, which is more than an order of magnitude above any other file in the delivery. Three arrangements that would all produce a large total are missing data spread thinly through every curve, missing data concentrated in one depth interval across all curves, and missing data concentrated in one curve while the others are complete. Your sentence distinguishes none of them, because the total is the same integer in all three cases, and the three call for different responses from different people. Which of them nullheavy_20 actually is, and what follows from that, is the next lesson.
