# A split by rows

{{panel:ml-fit-explorer}}

The simplest way to hold data back is to pick rows at random and set them aside. The engine offers that as `randomRowSplit`. Run on the 270 sonic rows of the nine sonic wells with the test fraction 0.3 and the seed 5, it holds out 81 rows and trains on 189. It is shown here beside the whole-well split so the two can be compared on the same rows.

| split | test rows | training rows | wells with test rows | wells on both sides |
| --- | --- | --- | --- | --- |
| `randomRowSplit` | 81 | 189 | 9 | 9 |
| `groupSplit` | 90 | 180 | 3 | 0 |

## Every well lands on both sides

Under the random-row split the 81 test rows come from all 9 wells, and each of those wells also trains the model. The engine lists them in its `sharedGroups`: EKENE-1, EKENE-10, EKENE-2, EKENE-3, EKENE-4, EKENE-5, EKENE-7, EKENE-8, EKENE-9. Every test row of that split shares its well with training rows.

The engine states what the function is for, in its own words:

> leakage demonstration only: rows of one well can fall on both sides (sharedGroups); use groupSplit or groupKFold to score a model

That sentence is part of the result. The function exists so you can see what happens when rows of one well sit on both sides, and the engine's own advice is to score a model on a split by wells.

## What a random-row test score measures

A test score on this split answers a narrower question than the one a new well asks. Each test row comes from a well whose other rows trained the model, so the score measures how the rule does on wells it has already met. A new well has not been met.

Whether that makes the random-row score look better or worse depends on the model. If some feature lets the model recognise a well, it can learn each well's offset from the training rows and meet it again in the test rows. If nothing identifies a well, there is no such path, and the random-row score can come out either side of a whole-well score as the draw falls. The Professional tier measures both cases, seed by seed. At this tier, hold one rule: a random-row split is never the honest estimate for a new well, whichever way its number moves.

## The test size

The number of test rows is ceil(testFraction x count). Here that is ceil(0.3 x 270), which gives 81. The whole-well split applies the same rule to a count of wells, which is why it holds out 3 wells and 90 rows. The two splits therefore hold out different numbers of rows at the same fraction.

## Naming the split

The vocabulary rule applies from here on. When a score comes from a random-row split, the sentence says so. "Test" on its own always means whole wells held out.

## Exercise

Open the fit explorer on the split view. It shows both splits of the sonic rows at the test fraction 0.3 and the seed 5. Check every cell of its table against the table above. Then change the seed to 1, 2 and 3 in turn and, for each, write down how many wells the random-row split puts on both sides and which wells the whole-well split holds out. Finally write one sentence saying which of the two splits answers the question a new well asks.
