# Reading it wrongly

{{panel:qr-societal}}

An F-N curve can be misread in two ways that each produce a plausible table. The first reads F(N) as the frequency of more than N deaths. The second reads it as the frequency of exactly N deaths. Both change every number on the curve, and one of them has a published source behind it. This lesson sets the three readings side by side for the JISIKE off-site set and says why the engine takes the reading it does.

## Three columns from one scenario set

| N | F(N), N or more (the engine) | more than N, derived | only scenarios with exactly N, derived |
| --- | --- | --- | --- |
| 3.000000 | 0.000049700000 | 0.000009700000 | 0.000040000000 |
| 12.000000 | 0.000009700000 | 0.000001700000 | 0.000008000000 |
| 40.000000 | 0.000001700000 | 0.000000200000 | 0.000001500000 |
| 300.000000 | 0.000000200000 | 0.000000000000 | 0.000000200000 |

The engine's column is cumulative and includes the scenarios sitting at each corner. The "more than N" column drops them, so at every corner it shows the value of the next corner down: at N = 3 it reads 0.000009700000 where the engine reads 0.000049700000, having lost both jet fires. At N = 300 it reads zero, and the worst scenario on the plant disappears from the curve at its own N. The "exactly N" column is not cumulative at all. It is a histogram of frequency by size, and it lets a larger event hide behind a smaller one.

## The source contradicts itself

The Purple Book's introduction to societal risk says "the cumulative frequency of having more than N deaths". Its equation 6.6 and section 6.3 say "N or more". A reader who takes the introduction at its word builds the middle column. The engine follows the equation, and so does this course, and the engine's model string states the choice:

> F(N) = sum of f_i with N_i >= N, at each distinct N_i > 0 (left-continuous step function)

The greater-than-or-equal sign in that string is the whole decision.

## Why the equation wins

A criterion is a statement about how often an event at least this bad may happen. Under "more than N", a scenario exactly at a criterion's N is never compared with the criterion at that N, so a plant could place its worst event on a line's corner and have it vanish from the check. Under "N or more", every scenario is present at its own N. Two passages of the source, equation 6.6 and section 6.3, carry that reading against one sentence of introduction, and the equation is what a reviewer reproduces.

## How much it moves

The difference is not small. At N = 3 the engine's value is 0.000049700000 per year and the "more than" value is 0.000009700000, a small part of it. When the curve is set against a criterion, that difference can move a comparison from above the line to below it. A reader should ask which reading any published F-N curve uses before comparing it with the engine's.

## A check you can always make

The engine's F at the smallest corner must equal the sum of every scenario frequency with deaths. On this set that is 0.000049700000 per year. The "more than N" reading fails that check at the first corner, and the "exactly N" reading fails it too.

## Exercise

From the stated scenario frequencies, rebuild the "more than N" column at N = 12 and at N = 40 and confirm the derived values in the table. Then state which scenario each of those two derived values omits, and by how much each falls short of the engine's figure.
