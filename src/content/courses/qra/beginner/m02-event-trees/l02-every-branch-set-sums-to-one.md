# Every branch set sums to one

{{panel:qr-event-tree}}

A branch set lists every answer to one question, and exactly one answer happens. So the set is exhaustive, covering every possibility, and exclusive, with no two answers happening together. Those two properties mean its probabilities sum to one. The engine enforces the rule on every branch set in a tree, at every depth, and this lesson shows how it copes with decimals that a computer cannot add exactly.

## Three sets, three verdicts

| branch probabilities, stated | their sum in double precision | what the engine did |
| --- | --- | --- |
| 0.6, 0.3 | 0.8999999999999999 | refused |
| 0.7, 0.2, 0.1 | 0.9999999999999999 | accepted |
| 0.4000001, 0.6 | 1.0000001 | refused |

The first set is short of one. On paper it sums to a round figure below one, and in double precision the sum prints as 0.8999999999999999. Either way something is missing: a way the event could go that nobody drew.

The second set is the interesting one. On paper 0.7, 0.2 and 0.1 sum to one exactly. In IEEE double arithmetic, the arithmetic the engine runs on, they sum to 0.9999999999999999. A rule that demanded an exact one would refuse a perfectly good tree.

The third set is over one by a tenth of a millionth. That is a typing error, and the engine treats it as one.

## The tolerance

The engine's answer is a declared tolerance. `BRANCH_SUM_TOLERANCE` is 1e-9, absolute. A branch set whose sum lies within 1e-9 of one is accepted; a set further away is refused. The gap left by double arithmetic in the second set is far smaller than 1e-9, so it passes. The gap in the third set is far larger, so it fails.

The refusal for the third set reads, in the engine's own words:

> tree.branches: the branch probabilities sum to 1.0000001, not 1 (tolerance 1e-9): every branch set must be exhaustive and exclusive

The message prints the sum it found and the tolerance it applied, so you can see at once how far off the set was.

## Why a tolerance and no rounding

An alternative would have been to round every sum to a few decimals before comparing. That would hide real errors of the size of the third set. A tolerance of 1e-9 is loose enough to forgive the arithmetic of the machine and tight enough to catch a typing error such as the third set. It is a declared choice, printed in the refusal itself, so every analyst who meets the rule can see exactly where the line sits.

A branch of probability zero is allowed. The golden case zero-probability-branch carries a leaf a at 0.000000000000 and a leaf b at 0.000400000000, and its set still sums to one.

## Exercise

Take the three stated sets in the table. For each, decide whether the distance between its double precision sum and one is smaller or larger than 1e-9, and check that your decision matches the verdict. Then write a two branch set of your own that sums to one on paper, and say which verdict the engine would give it.
