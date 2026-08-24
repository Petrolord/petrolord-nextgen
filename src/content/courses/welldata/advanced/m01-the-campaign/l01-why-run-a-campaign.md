# Why run a campaign

Six LAS files arrived this morning from the same service company, all from the same field. Nobody sent them one at a time and nobody is going to load them one at a time. They came as a delivery, they will go into the registry as a delivery, and the question the project wants answered by the end of the day is a question about the delivery as a whole. Can we publish this, and what in it needs a call back to the sender.

Two tiers of this course have already worked the single file. The Associate tier put one file on the bench and read its health: the section structure, the curve list, the null flag, the sample count. The Professional tier took one file and brought it into the project's own units and vocabulary, and defended every field it produced. Both tiers were narrow on purpose. The unit of work was one file, and the panel in front of you showed one file at a time.

This tier changes the unit of work. It runs all six teaching files through the same pipeline as one campaign, and it reads the aggregates.

## A delivery is not six separate arrivals

The six files share a sender, a field and a format. What they do not share is quality. One of them is denominated in the other unit system. One of them has a depth column that does not step evenly. One of them carries a curve with no data in it at all. Those three facts are the entire content of the morning's work, and none of them is visible from the covering email.

That is the situation a data manager is actually in. You are rarely handed a file with a note saying which part of it is wrong. You are handed a batch that looks uniform from the outside, and your job is to find the parts that are not, before somebody downstream finds them for you in a porosity calculation or a depth-shifted correlation.

## What reading them one at a time costs

You could open all six. The Professional tier gave you the method, and the method works. Six files at the pace that tier set is most of a day, and the day buys you six sets of fields sitting in six places.

The cost is not only the time. Three things go wrong when the file is the unit of work at delivery scale.

**You compare from memory.** The interesting fact about feet_20 is that it is the only file in the batch denominated in feet. You cannot see that fact while looking at feet_20. You can only see it by holding the other five in your head at the same time, and by the fourth file you are no longer holding them accurately.

**You lose the count.** A reader who works file by file ends with six verdicts and no number. The project does not want six verdicts. It wants to know how many files need work and which ones, because that is what schedules a morning.

**You stop early.** The fifth and sixth files in any batch get read faster than the first, and the batch does not know that. Whatever is wrong in file six is exactly as wrong as whatever is wrong in file one, and it is less likely to be found.

## What the campaign is for

The campaign runs the same checks the two tiers below taught you, over every file, and reports the results side by side. Its purpose is narrow and worth stating in one sentence: it exists to find which files differ from the rest without you having to open each one.

That is a search for exceptions. In this delivery of six, the exceptions are sparse and that is what makes them findable. Exactly one file needs a depth unit conversion. Exactly one file has a depth column with no uniform step, so five of the six do have one. Exactly one dead curve exists anywhere in the batch. Each of those readings points at a single file, and the campaign table puts a name beside it.

Compare that with the alternative. Six individual reports each say "this file converts" or "this file does not", and the reader has to do the comparison themselves. The campaign has already done it, and the answer is a count with a name attached.

## The checks are not new

Nothing in this tier is a new test. The curve count is the curve section from the Associate tier, summed. The conversion flag is the Professional tier's depth unit work, asked of a set. The uniformity verdict is the Professional tier's step test, run six times. The dead curve and the null count are the Associate tier's completeness work. The wrapped sample count is the Associate tier's wrapped mode.

What is new is the reading. An aggregate is a different kind of number from a field, it fails in different ways, and it hides things a single-file reading cannot hide. That is the subject of lesson 3 and, in a much harder form, of module 4.

## What the campaign does not do

It does not decide anything. A campaign that reports one dead curve has not told you whether to flag it or drop it, and a campaign that reports one file needing conversion has not converted it for you. Those decisions still belong to the person reading, and they still get written down the way the two tiers below insisted.

It also does not replace opening the file. Once the campaign has told you that nullheavy_20 is the file worth your attention, you go and open nullheavy_20. The campaign chose the file. It did not do the work.

## Exercise

Without looking ahead, write down the three questions you would want a six-file delivery summarised against if you could only ask three. For each one, say what a number would have to look like before you would stop and open a file. Then answer this: why is a summary that reports six verdicts, one per file, less useful than one that reports three counts across the batch.

Self-check: any three defensible questions work, and the strong ones are about units, about sampling and about completeness, because those are the three ways this delivery actually varies. The number that should stop you is any one that is not the same for all six, since a reading shared by every file tells you about the format and a reading that differs tells you about a file. Six verdicts are less useful because the comparison across files is the finding, and a per-file list leaves that comparison to the reader at exactly the point in the day when the reader is least likely to make it carefully.
