# A count with no tree and no rule is not checkable

Counts look like the safest thing in a technical document. They are integers, they are short, and nobody argues with them. They are also the easiest claim in a document to get wrong without anybody noticing, and the fix is a discipline worth taking into your own reports.

## What a count needs

Every count in this course is printed with two things beside it. The tree is what was counted over. The rule is what decided whether a candidate belonged in the count. Either one alone leaves a reader unable to check the number.

Take the count of courses on this tank. It comes back as five, over a tree that is the courses array the engine returns for this geometry, with a rule of one course per whole or part course height in the shell height, taken as the ceiling of the shell height divided by the course height. That rule is why the fifth course counts although it is shorter than the four below it. Without it, a reader who divided and rounded down would get a different answer with no way to tell which was intended.

## Two counts over one tree

The same tree can carry several counts, and then the rule is the only thing telling them apart. On this tank, one course is governed by the hydrostatic test and four are governed by the stated minimum plate thickness. Both counts are taken over the same courses array. The first counts a course when the engine returns a governing value of hydrostatic test, and the second when it returns minimum plate thickness.

Written without their rules, those two numbers are just a one and a four attached to a tank, and a reader cannot tell whether they overlap, whether they exhaust the table, or what a course that appeared in neither would mean.

## Counts in this file

This course prints nineteen counts in all. The tree of that count is the counts the generator built while it ran, plus the count itself, and its rule is one per call to the counting helper, which is the only way a count reaches the file at all.

That last clause is what makes the total meaningful. A count of counts is only checkable if there is exactly one route by which a count can be created, and naming the route is what tells a reader that no count reached the page some other way.

## The habit

When you write a count in a report, write what you counted over and what made something count. It takes a line. It converts a number somebody has to trust into a number somebody can reproduce, and it is the difference between a figure that survives review and one that generates an argument.

## Exercise

Find any count in this course and write out its tree and its rule in your own words. Then describe a plausible alternative rule that would give a different answer over the same tree.
