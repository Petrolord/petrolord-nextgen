# The worst row was the first row

A real defect, found while writing this course, in the engine the course teaches.

{{panel:cd-clearance-explorer}}

## What the check reports

The clearance check returns every row and, alongside them, the single row it calls the worst. That row is what a summary shows and what a reader looks at first.

On the published completion it was reporting the first tubing joint, at a clearance of over a hundred millimetres, on a string whose packer clears by under five.

## Why it did that

The ranking was by status only. A fail outranks a warn, a warn outranks a pass, and the reduction kept the highest ranked row it had seen.

On a string where the statuses differ, that gives a sensible answer. On a string where every row shares a status, no row ever outranks the incumbent, and the reduction returns whatever it started with, which is the first row.

## Which strings that affects

Every string that passes. That is the important part.

A completion with a failure was reported correctly, because the failing row outranked the passing ones. A completion that passed everywhere, which is what a finished design looks like, reported its first component as the worst.

So the defect was invisible on exactly the cases where somebody was looking for a problem, and present on exactly the cases where the report was being used as reassurance.

## What it looked like to a reader

A summary line saying the worst clearance is a hundred and two millimetres, on a string whose real tightest row is four point seven.

That is not a small error in a number. It is a statement that the string has plenty of room, on a string whose margin is under two millimetres against the warn threshold. A reader who trusted it would have concluded the design had slack it did not have.

## The ratio

The reported value was about twenty two times the real tightest clearance on this string. There is no reason that factor could not be larger on another string.

## Exercise

State the defect in one sentence.

Explain why it appeared only on strings where every row shared a status.

Then say why that particular condition makes the defect more dangerous rather than less.
