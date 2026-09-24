# A split by whole wells

{{panel:ml-fit-explorer}}

`groupSplit` holds out whole wells. Every row of a held-out well goes to the test set, and every row of the others trains the model, so no well is ever on both sides. On the 270 sonic rows with the test fraction 0.3 and the seed 5, it holds out EKENE-4, EKENE-5 and EKENE-8, 90 rows, and trains on EKENE-1, EKENE-10, EKENE-2, EKENE-3, EKENE-7 and EKENE-9, 180 rows. This is the teaching split, and the rest of this tier is measured on it.

| seed, stated | test wells | test rows |
| --- | --- | --- |
| 1 | EKENE-2, EKENE-7, EKENE-8 | 90 |
| 2 | EKENE-1, EKENE-5, EKENE-9 | 90 |
| 3 | EKENE-2, EKENE-4, EKENE-5 | 90 |
| 4 | EKENE-3, EKENE-4, EKENE-5 | 90 |
| 5 | EKENE-4, EKENE-5, EKENE-8 | 90 |
| 6 | EKENE-3, EKENE-5, EKENE-7 | 90 |

## The rule, in the engine's words

The basis of every group split carries its rule:

> the first nTest groups of the shuffled order are the test set; every row of a group goes with it

The wells are sorted, shuffled with the seed, and the first few of the shuffled order are held out. How many is set by the test fraction: ceil(0.3 x 9) is 3 wells. The next lesson opens the shuffle itself.

## Why whole wells

A new well arrives with its own sonic offset, and every one of its rows carries it. A test well held out whole arrives the same way: the model has seen none of its rows, so it cannot have learned its offset. The engine describes this split in its own words: "groupSplit(testFraction, seed): whole wells held out; the honest estimate for a new well".

That honesty has a price. With nine wells, three test wells leave six to train on. Fewer wells in training means a rule fitted on less variety. Holding out whole wells asks the model the question a new well will ask.

## A seed fixes the draw and nothing else

The table shows six seeds and six different sets of test wells. Each set is a fair draw; none is the right one. A score measured on one set is a score on those wells, and any other seed would hold out another set and give another score. So a group split is always quoted with its fraction and its seed, and better still with the names of the wells it held out.

## Asking for a number of wells

In place of a fraction you can pass `nTestGroups`, the number of wells to hold out. Pass one or the other. Given both, the engine refuses:

> nTestGroups and testFraction cannot both be given

It also refuses a fraction so large that no well is left to train:

> testFraction puts all 9 groups in the test set (ceil(0.95 x 9) = 9): lower it so at least one group trains

And it refuses a table with one well, because there is nothing to hold out against:

> groups must hold at least 2 distinct groups to hold one out (found 1)

Each refusal names its field first: `nTestGroups`, `testFraction` and `groups`.

## Exercise

Open the fit explorer on the split view. With the test fraction 0.3, set the seed to each of 1 to 6 in turn and check the test wells against the table above. Next clear the test fraction, set the test wells box to 1 and the seed to 5, and write down the one well held out and its row count. Put the fraction back at 0.95 with the test wells box cleared, and copy the refusal and its field.
