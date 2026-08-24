# Never invent a pick

Everything in this module has pointed at one rule, and this lesson states it as a rule. A missing pick stays missing in the data. You may estimate the surface, you may report the estimate, you may build on it, and the estimate lives beside the data rather than inside it. Ekene-4's TOP_B slot stays blank forever, including after somebody has produced a defensible number for where TOP_B probably sits.

That sounds like bookkeeping pedantry until you watch it fail. What follows is why the rule exists, what breaks without it, and where the line between data and estimate actually runs.

## The temptation is reasonable, which is the problem

Nobody invents a pick out of malice. It happens for good reasons. A figure looks unfinished with a line stopping in mid air. A downstream tool refuses to run on a well with a blank. A mapping package wants a value at every control point. A reviewer asks what TOP_B does under Ekene-4 and an honest shrug feels like a failure to have done the work.

In every one of those situations there is a number available. The three wells that carry TOP_B are right there, the section has a clear structure, and a competent geologist can produce a sensible expectation for Ekene-4 in under a minute. The number is not stupid. It might even turn out to be close.

None of that makes it a pick.

## What a pick is

A pick is a record that an interpreter identified a named surface at a stated depth in a specific wellbore, from data measured in that wellbore. That is what everybody downstream believes when they read a tops table. They believe somebody looked at the logs and put the surface there.

An estimate is a record that somebody inferred where a surface probably sits, using data from somewhere other than that depth in that well. That is a different claim with different reliability and a different failure mode, and it needs to be readable as a different claim.

The two are indistinguishable once they share a column. A tops table has room for a well, a top name and a depth. It has no room for how the depth came to be there. Type an estimate into that column and within a week it is a measurement, because the only thing that ever marked it as an estimate was somebody's memory.

## What breaks

Three things, in order of how quickly they hurt.

The first is the well count. Enter a TOP_B for Ekene-4 and the count of wells carrying all four tops goes from 3 to 4. That number is graded with a tolerance of zero in this tier's capstone for a reason. It is the honest statement of how much complete data the section holds, and a fabricated pick corrupts it directly. Worse, it corrupts it silently, since a complete tops table looks healthier than an incomplete one to every automated check anybody will run.

The second is every statistic derived from TOP_B. Relief on TOP_B is 34 m over the three wells that carry it. Add a fourth depth and the relief changes, and the new number describes a mixture of three observations and one guess. Nobody reading it will know which parts are which.

The third is uncertainty. This is the deepest cost and the least visible. An estimate carries a spread around it. A pick, as far as any consumer is concerned, does not. Converting the estimate into a pick throws away the spread, and the spread was the most valuable thing the estimate had. You end up more confident than you were before you did the work, which is the opposite of what analysis is for.

## Where the estimate goes instead

Beside the data, labelled, with its method and its spread.

In practice that means the estimate lives in the report, the memo, the map annotation or a separate clearly named column that no downstream process treats as picks. It reads as an estimate in its own text. It says which wells it was derived from and how. It states the range, not only the central value. And it never removes the blank from the tops table.

A section figure follows the same rule. If you want to show where TOP_B might sit under Ekene-4, draw it in a different style, put it under a legend entry that says estimated, and keep the correlation line itself stopping at the third well. The correlation line is the observation. The dashed thing is the inference. A reader can then choose which one to rely on, which is a choice they cannot make if the two are drawn identically.

## This is the boundary the Expert tier works on

The tier above this one predicts Ekene-4's missing TOP_B. It is a serious piece of work with real method behind it, and it is still an estimate. Nothing that tier produces gets typed into the tops table.

Say that clearly now, before you meet the method, because the method is convincing enough to blur the line. A prediction that comes with a stated uncertainty is more trustworthy than a guess, and it is not more trustworthy than a measurement. It sits in the estimate column no matter how good it is, and the blank in Ekene-4's TOP_B slot outlives it. The Expert tier's own discipline is built on that, which is why this tier sets the boundary first.

## Exercise

You have finished the growth analysis and your team lead asks for a section figure and a one-page summary that includes a best expectation for TOP_B in Ekene-4. Write down what changes and what does not change in three places: the tops table, the correlation line on the figure, and the count of wells carrying all four tops. Then state the one sentence you would put in the summary so that a reader six months from now cannot mistake the expectation for a pick.

Self-check: the tops table does not change and Ekene-4's TOP_B stays blank. The correlation line on the figure does not change and still stops after the third well, with any expectation drawn in a separate style under a legend entry that names it as estimated. The count of wells carrying all four tops does not change and remains 3, which is the graded answer and would have been corrupted by the entry. The sentence in the summary should name the quantity as an estimate, say which wells it was derived from, and give its range rather than a single value, so that its status and its reliability both survive being read out of context.
