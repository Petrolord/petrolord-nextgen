# Neighbours against the tree

{{panel:ef-classify-explorer}}

{{panel:ef-judge-explorer}}

Two methods trained on the same cored rows predicted the same uncored wells. It is natural to compare them, and natural to read their agreement as support. This lesson measures the agreement and shows what it can and cannot carry.

## How often they agree

| well | rows where kNN, k 5, and the tree give the same facies |
| --- | --- |
| EKENE-7 | 28 of 30 |
| EKENE-8 | 29 of 30 |

The course's rule for reading that: agreement between two methods trained on the same rows is not a check against rock.

## Why agreement is weak evidence

kNN and the tree learned from the same 180 cored rows and the same core facies, and whatever is wrong with a new well's logs reaches both at once. EKENE-8's gamma ray reads 30 gAPI high, and both methods read that raised GR.

The withheld facies, which only this synthetic field has, lets you count what the agreement hid. On EKENE-7, kNN matches the withheld facies on all 30 rows, so the 2 rows where the tree disagrees are exactly the tree's 2 misses; there, a disagreement found every error. On EKENE-8, kNN misses 3 rows and the methods disagree on only 1. A row where kNN is wrong and the tree is right is a disagreement, so at most 1 of kNN's 3 misses is such a row, and at least 2 rows of EKENE-8 are missed by both methods at once. Agreement on those rows was agreement on a wrong answer.

## The evidence that does count

The held-out cored well is the evidence that counts, because it scores each method against rock it was not trained on. On EKENE-6, kNN at k 5 scored 0.833333 and the tree at the default depth 0.766667. A comparison of the two methods quotes those figures with the held-out well named, and quotes the agreement on the uncored wells as agreement.

The adjusted Rand index of the Professional tier can score two sets of predictions against each other without mapping one onto the other. A high index between kNN and the tree says they group the rows alike. It is the same kind of evidence as the agreement counts above, and it carries the same limit: two labellings can agree with each other and both disagree with the rock.

A row where the methods disagree is still worth flagging, because at least one of them is wrong there. Where they agree, the agreement proves nothing about the rock.

## Exercise

Open the view "The adjusted Rand index of two labellings" in the judge explorer. Make up a truth labelling for eight rows using two facies names, then two predictions that both get the same two rows wrong in the same way. Enter the two predictions as a and b and read their index. Then enter each prediction against your truth labelling, read both indices, and write one sentence on what the first index did not tell you.
