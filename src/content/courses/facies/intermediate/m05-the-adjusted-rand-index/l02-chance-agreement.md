# Chance agreement and the adjustment

{{panel:ef-judge-explorer}}

Counting the pairs that two labellings both join is the start of an agreement score. On its own it rewards labellings that join many pairs, whether or not they match. The adjusted Rand index subtracts what chance alone would give and scales the rest, so 0 means chance and 1 means the same grouping.

## The expected count by chance

Hold each labelling's group sizes fixed and shuffle which rows fall where. The expected number of pairs both labellings join is

E = (pairs together in a) x (pairs together in b) / (all pairs)

For the six rows of the last lesson, a = 0, 0, 0, 1, 1, 1 and b = p, p, q, q, r, r, that is 6 x 3 / 15 = 1.200000. Two labellings of these group sizes, drawn at random, would share 1.200000 joined pairs on average. They actually share 2.

## The index

The ARI compares the actual count with the expected one, and scales by the largest the difference could reach:

ARI = (sum C(n_ij, 2) - E) / (mean(pairs in a, pairs in b) - E)

The denominator takes the mean of the two labellings' joined pairs as the best possible count. The engine's basis, verbatim:

> (sum C(n_ij, 2) - E) / (mean(sum C(a_i, 2), sum C(b_j, 2)) - E), E = sum C(a_i, 2) sum C(b_j, 2) / C(n, 2) (Hubert and Arabie 1985)

For the six rows: (2 - 1.200000) / ((6 + 3) / 2 - 1.200000) = 0.242424, and the engine returns 0.242424. The two labellings agree a little more than chance.

## Below zero

Labellings that disagree more than chance go below 0. The stated golden a = 0, 0, 1, 1 against b = 0, 1, 0, 1 scores -0.500000: every pair a joins, b splits, and every pair b joins, a splits. The engine reports a negative index as it is.

## When the formula divides zero by zero

Two labellings that each put every row in one cluster have no pair to disagree on. Then the actual count, the expected count and the best count are all equal, and the formula divides zero by zero. The engine returns 1.000000, following scikit-learn. Its basis, verbatim:

> when the denominator is zero (both labelings one cluster, or both all singletons) the index is 1 (scikit-learn)

The alternative would be to return no value; the engine's choice says two identical trivial groupings agree perfectly.

## A grouping that knows nothing about rock

On the 180 cored rows, grouping each row by the well it came from, six groups, scores 0.157021 against the core facies. The well a row came from says nothing about its rock, and the index reads low. That figure is a useful floor: a clustering near it has found little of the rock.

## Exercise

In the adjusted Rand index view, type the six-row labellings and confirm 0.242424. Then compute E and the index yourself for a = 0, 0, 1, 1 against b = 0, 1, 0, 1 and check the engine's -0.500000. Type two labellings that each hold a single label on every row and read the index. Finally, change one label of b in the six-row case and predict whether the index rises or falls before you run it.
