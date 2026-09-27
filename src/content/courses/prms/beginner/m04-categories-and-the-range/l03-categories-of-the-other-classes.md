# Categories of the other classes

{{panel:prms-classification-calculator}}

Every class with a project carries a low, a best and a high estimate, and the labels change with the class so that a figure can never be mistaken for one of another class. A 2C is never a 2P, however close the numbers. This lesson reads the categories of Contingent Resources and Prospective Resources (PRMS 2.2.2.2 to 2.2.2.4).

## Contingent Resources, both ways

The Ekene North estimates are stated two ways in the course's cases, once as slices and once as totals. The engine returns the same categories from each:

| stated as | 1C | 2C | 3C | C1 | C2 | C3 |
| --- | --- | --- | --- | --- | --- | --- |
| slices (incremental) | 3.000000 | 4.500000 | 6.500000 | 3.000000 | 1.500000 | 2.000000 |
| totals (cumulative) | 3.000000 | 4.500000 | 6.500000 | 3.000000 | 1.500000 | 2.000000 |

The slices of Contingent Resources are named C1, C2 and C3. They follow the same arithmetic as Reserves: the 1C is C1, the 2C is C1 plus C2, and the 3C adds C3.

## Prospective Resources: totals only

The course's case "Prospective Resources" states a 1U of 12.000000, a 2U of 30.000000 and a 3U of 70.000000 MMbbl. The engine returns them with their labels and no slices, and says why:

> incremental: no terms are defined for Prospective Resources (PRMS 2.2.2.4)

The framework gives Prospective Resources no incremental names, so the engine will not invent any. Stating the incremental method for them is refused:

> method must be "cumulative" for Prospective Resources (PRMS 2.2.2.4 defines no incremental terms for them); got "incremental"

## A class the engine does not know

The class is stated with its own control, and only three are accepted. "Resources" on its own names all quantities together and is no class of its own, so it is refused:

> resourceClass must be one of "reserves", "contingent", "prospective"; got "resources"

Unrecoverable quantities have no categories at all, which is why they are missing from the list.

## Why the labels matter

Adding a 2P to a 2C to a 2U gives a number that belongs to no class and describes no project. Keeping the labels apart keeps the classes apart. The Expert tier takes up how figures of one class are added, and why figures of different classes are kept out of one total.

## The probability labels stay the same

In every class the low case carries P90, the best P50 and the high P10. Those three are outcome labels, the same across classes; the class letters, P, C and U, change. So the 1C of Ekene North and the 1U of the prospect case are both P90 figures, each within its own class.

## Exercise

Open the classification calculator, the course's own calculator panel, in the view "The categories of a set of estimates", and start from "Ekene North, stated incrementally". Read both tables. Switch to "Ekene North, stated cumulatively" and check that every figure matches. Then start from "Prospective Resources", set the "Method (stated)" control to incremental and read the refusal; restore cumulative. Finally set the "Class (stated)" control to Contingent Resources on the same case and write down which labels change.
