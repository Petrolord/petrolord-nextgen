# Round robin folds and their sizes

{{panel:ml-validate-explorer}}

How the engine deals wells into folds is a stated rule, and every fold score depends on it. `groupKFold` does three things in order: it sorts the well names, shuffles them once with the seed, and deals them round robin. This lesson follows each step on the nine sonic wells with k = 3 and seed 5.

## Sort, then shuffle

The names sort by character, so the order before the shuffle is EKENE-1, EKENE-10, EKENE-2, EKENE-3, EKENE-4, EKENE-5, EKENE-7, EKENE-8, EKENE-9. EKENE-10 sits before EKENE-2 because the character 1 comes before the character 2. The shuffle is the same seeded Fisher-Yates the Associate tier traced for the teaching split, and at seed 5 it gives the same order:

EKENE-8, EKENE-4, EKENE-5, EKENE-2, EKENE-1, EKENE-3, EKENE-10, EKENE-9, EKENE-7.

## Deal round robin

The well at shuffled position q goes to fold q mod k. With positions counted from 0:

| fold | shuffled positions | test wells |
| --- | --- | --- |
| 0 | 0, 3, 6 | EKENE-10, EKENE-2, EKENE-8 |
| 1 | 1, 4, 7 | EKENE-1, EKENE-4, EKENE-9 |
| 2 | 2, 5, 8 | EKENE-3, EKENE-5, EKENE-7 |

Position 0 is EKENE-8, position 3 EKENE-2, position 6 EKENE-10, and fold 0 lists them in sorted order. Deal the other two folds yourself from the shuffled list and check them against the table.

## Sizes that differ by at most one well

Nine wells into three folds divide evenly. With k = 4 they do not, and round robin gives folds of 3, 2, 2 and 2 wells, which is 90, 60, 60 and 60 rows. Fold sizes differ by at most one well.

That is a choice. scikit-learn's GroupKFold balances the number of ROWS in each fold, and it takes no seed. On the Ekene sonic wells every well has 30 rows, so balancing wells also balances rows; on a field where wells carry different numbers of samples, the two rules can deal different folds. The engine's stated reasons for its rule are that the deal is seeded and reproducible, and that every well is tested once. When you compare its folds with another tool's, compare the well lists.

## The limits on k

A fold needs at least one well, and training needs at least one fold. So k runs from 2 to the number of distinct wells. Ask for more folds than wells and the engine refuses by name:

> k must be a whole number from 2 to 9 (the number of distinct groups)

k equal to the number of wells is allowed. That is leave one well out, and it is the next lesson.

## Why the seed matters here too

A different seed shuffles the wells into another order, and round robin then deals different folds. Every fold score, and the mean over them, is a number about that seed. Quote k and the seed with every cross-validated figure, and when two figures are compared, check that they used the same folds.

## Exercise

Open the cross-validation view with GR, RHOB and NPHI, least squares, seed 5. Run k 3 and confirm the shuffled order and the three folds above. Then set k to 4 and read the fold table: note which fold holds three wells and the row counts of all four. Finally set k to 10 on the nine sonic wells and read the refusal, confirming it names the field `k`.
