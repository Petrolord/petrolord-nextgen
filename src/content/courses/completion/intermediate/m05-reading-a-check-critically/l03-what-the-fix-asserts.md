# What the fix asserts

The corrected ranking, the guards that now hold it, and how to read a worst row from here on.

{{panel:cd-clearance-explorer}}

## The correct ranking

Rank by status first, because a failure anywhere outranks any pass. Then, within a status, rank by the tightest clearance.

That gives the right answer in both regimes. On a mixed string the failure is still selected. On an all passing string the tightest passing row is selected, which is what the reader wanted all along.

## The tie and the missing value

Two details the fix has to handle. Rows with equal status and equal clearance can be resolved either way, and the reduction takes the first, which keeps the result deterministic.

Rows with no clearance value, which happens where the profile has a gap and the governing drift is unavailable, are never selected over a row that has one. A row we could not evaluate is not evidence of tightness.

## The guards

Two tests now hold it in the engine's own suite, and two more in this course.

The engine asserts that on the published all passing string the selected row is the packer and not the first row, and that the ratio between the first row and the selected one is greater than twenty. The second assertion is the one that would fail loudly if the reduction ever degenerated again, because a degenerate selection on this string gives exactly that ratio.

The oracle now computes the worst row independently and the golden file carries it, so the comparison has something to compare.

## How to read a worst row now

As the tightest row, within the most severe status present. That is a precise statement and it is worth holding, because the phrase worst row is doing two jobs.

If any row fails, the worst row is a failure and you should look at the whole failing set rather than one member of it. If nothing fails, the worst row is the design margin, and it is the number that decides whether the string is comfortable.

## The habit for any tool

When a tool reports a single worst case out of many, check it against the list once by hand. If the two disagree, you have found something. If they agree, you have learned what the tool means by worst, which is not always what you meant.

## Exercise

State the corrected ranking rule in one sentence.

Explain what the fix does with ties and with rows that have no clearance value, and why each choice is right.

Then look at the published string in the panel, confirm the selected row by hand from the list, and say what ratio you get between the first row and the tightest.
