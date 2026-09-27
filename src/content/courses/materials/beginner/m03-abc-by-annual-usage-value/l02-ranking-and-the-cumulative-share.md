# Ranking and the cumulative share

{{panel:materials-register-calculator}}

With every item's annual usage value in hand, ABC ranks the register from the highest value to the lowest and keeps a running total of the share. That running total, the cumulative share, is what the cut-offs are measured against.

## The ranking

The engine ranks highest first. Its basis states the whole rule, verbatim:

> annual usage value = annualUsage x unitCost, ranked highest first (ties by id); the cumulative share including the item decides against A 80% and B 95%; compared at 12 significant digits

The first eight items of the Ekene register, with the cut-offs of the Ekene policy (A to 80 percent, B to 95) and the rule at-or-below:

| rank | id | annual usage value | share | cumulative share | class |
| --- | --- | --- | --- | --- | --- |
| 1 | ESP-MTR | 370000.000000 | 23.408536 | 23.408536 | A |
| 2 | CSG-958 | 348000.000000 | 22.016677 | 45.425213 | A |
| 3 | ESP-PMP | 288000.000000 | 18.220698 | 63.645911 | A |
| 4 | WH-MV | 84000.000000 | 5.314370 | 68.960281 | A |
| 5 | BARYTE | 78000.000000 | 4.934772 | 73.895054 | A |
| 6 | GL-VALVE | 76800.000000 | 4.858853 | 78.753907 | A |
| 7 | CEM-G | 75600.000000 | 4.782933 | 83.536840 | B |
| 8 | MECH-SEAL | 53400.000000 | 3.378421 | 86.915261 | B |

## At or below

Under the rule at-or-below, the cumulative share including the item decides. An item is A while its cumulative share is at or below the A cut-off, B while it is at or below the B cut-off, and C after that. GL-VALVE brings the running total to 78.753907, still at or below 80, so it is A. The next item takes it past 80, so it is B.

## What the classes hold

The class totals show the pattern ABC exists to find. Under at-or-below on the Ekene register:

| class | items | share of items | share of value |
| --- | --- | --- | --- |
| A | 6 | 33.333333 | 78.753907 |
| B | 5 | 27.777778 | 15.443307 |
| C | 7 | 38.888889 | 5.802786 |

A third of the items carry more than three quarters of the money. The C items, the largest group by count, carry 5.802786 percent of it. A stores team that counts, reviews and negotiates the A items first spends its effort where the money is.

## Ties go by id

Two items of equal value need an order, and the engine's stated choice is to rank them by id. On a stated case with items a and b both worth 10.000000, a takes rank 1 and b rank 2. The alternative is id descending; the engine names its choice in the basis, and no graded figure in this course depends on it.

## Cut-offs that cannot work

The A cut-off must lie above 0 and below 100, and the B cut-off above the A cut-off and below 100. A B cut-off equal to the A cut-off leaves no room for class B:

> cutoffs.bPct must be a number above aPct 80 and below 100; got 80

Leaving the cut-offs out is refused with a message that says what they are:

> cutoffs must be { aPct, bPct }, the cumulative value shares that close classes A and B

## Exercise

Open the register calculator in "ABC by annual usage value" on "The Ekene register, at-or-below". Follow the cumulative share from rank 8 to rank 18 and mark where B ends. Then start from "Two items tied on value" and read the ranks. Back on the Ekene start, set the A cut-off control to 70 and write down the new class counts; then set the B cut-off to 70 and copy the refusal.
