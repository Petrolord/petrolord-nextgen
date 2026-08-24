# Why depth is excluded

The graded reading is 24 rather than 30 because the depth column is not counted in any file. This lesson gives the reason, and then gives the arithmetic consequence, because at campaign scale the exclusion is not a small tidying convention. It moves the answer by six.

## Depth is the axis, not a measurement

Every value curve in a LAS file is a sequence of readings. Each entry in GR was produced by a sensor while the tool was at a place in the hole, and it is a claim about the rock at that place. The same is true of RHOB, of NPHI and of DT.

The depth column is a different kind of object. It says where each of those readings was taken. It is the coordinate the other columns are sampled against, and it is the reason the other columns mean anything. Remove GR from a file and you still have a log with three curves. Remove the depth column and you have four unlabelled sequences of numbers with no way to place any of them in the hole.

That asymmetry is what the word index names. The index is the axis. The measurements live on it.

You met this at the Professional tier, where the pipeline forced the kind of the first curve to depth by position rather than by looking its mnemonic up, and where the graded count of recognised kinds on feet_20 was 4 out of 5 declared curves. The reasoning there was that the count exists to say how many measurements the platform understood, and the index is not a measurement. The campaign count uses the identical rule, for the identical reason, applied to six files instead of one.

## The arithmetic consequence

Here is the part that is specific to a campaign.

Counting the index inflates every file by exactly one, because the LAS standard puts exactly one index first in every file. Six files therefore inflate the campaign by six. The graded 24 becomes 30, and 30 is a number that looks entirely reasonable, divides neatly by 6, and is wrong.

That is what makes this error dangerous at this tier rather than merely incorrect. On a single file, counting 5 where 4 was wanted is a small visible slip in a small visible number. Across a delivery, the same slip compounds silently and lands as a plausible total. There is nothing about 30 that announces itself.

Worse, the inflation scales with the size of the delivery rather than with the amount of data. A delivery of sixty files with two curves each would be inflated by sixty, which is half again as large as the true count of 120. The more files a delivery is split into, the larger the error the index makes, and splitting a dataset into more files adds no measurements at all.

## What the count is for

A count of imported curves is used for a small number of things and the exclusion serves all of them.

It sizes the work. Somebody asking how much data arrived wants to know how many measured curves the project now holds, because that is what gets loaded, plotted, quality-controlled and computed on. Six depth columns are not six more pieces of data.

It gets compared across deliveries. Two batches with the same number of measured curves are comparable in size. If the index is counted, the comparison is contaminated by how many files each batch was cut into, and the contamination is invisible in the totals.

It feeds the per-file average. Twenty four curves over six files is 4 curves per file, which is a statement about the logging suite. Thirty over six is 5, which is a statement about the logging suite plus a constant nobody wanted.

In every case, including the index adds a quantity that is fixed by the file count and tells you nothing you did not already know from the file count.

## The honest objection

There is a real objection to all of this and it deserves an answer. The depth column is data. It was recorded, it can be wrong, it can be in the wrong unit, and this very tier grades a reading about it, since 5 of the 6 files have a uniform depth step and one does not.

All of that is true, and it does not make the index a measurement. The index gets more scrutiny than any value curve in the pipeline, not less. Its unit governs whether the file can be imported at all. Its regularity is tested and reported. Its first and last values become the frame of the imported well. Excluding it from a count of measured curves is not a claim that it is unimportant. It is a claim that it belongs to a different category, and the campaign reports on it in the columns where it belongs, which are the converted column, the uniform step column and the samples column.

Three of the six graded readings in this tier are about the index. It is not being ignored. It is being counted as what it is.

## The rule to carry

Where you see a curve count anywhere in this platform, assume the index is not in it, and check if it matters. Where you produce one, say so in the same breath: twenty four curves, depth excluded. Six extra words that stop a reader reconstructing the wrong number.

## Exercise

A delivery arrives as twelve LAS files. Nine of them declare six curves each and three declare four curves each, and every file is in the ordinary layout with a depth column first. Work out the campaign curve count the way this platform would report it, then work out what a reader who counted the index would report, and state the difference in terms of the delivery rather than the data. Then say what happens to both numbers if the sender re-exports the same measurements as twenty four files by splitting each one in half at a depth.

Self-check: nine files at 5 value curves plus three files at 3 value curves gives 45 plus 9, which is 54 curves with depth excluded. Counting the index gives 66, and the difference of 12 is exactly the file count, so it describes how the delivery was cut up rather than how much was measured. Splitting into twenty four files leaves the reported count at 54, because the same measured curves arrive in more pieces, while the index-inclusive count rises from 66 to 78. A number that moves when nothing was measured is the wrong number to be reporting.
