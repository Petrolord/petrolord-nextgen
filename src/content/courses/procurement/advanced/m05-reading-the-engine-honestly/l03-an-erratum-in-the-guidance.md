# An erratum in the Guidance

{{panel:pr-envelope-calculator}}

{{panel:pr-contract-calculator}}

A source can be wrong. A worked example in an official guidance note can carry a figure its own inputs do not support, and an evaluator who copies the printed figure copies the error. This lesson reads one such case in the World Bank's evaluation guidance and shows what a careful reader does with it: record both figures, say which one the engine uses, and check whether the conclusion depends on the difference.

## The example

The World Bank Procurement Guidance: Evaluating Bids and Proposals (including use of Rated Criteria), February 2025 and read on 2026-09-26, illustrates a minimum quality threshold in its Annex 2. Three criteria are scored in points out of 15, 15 and 70, and the threshold is 80. With each criterion's weight set equal to its maximum points, the engine's technical percentage equals the points total, so the engine can check the example directly.

| company | printed scores | total the Guidance prints | total on the printed scores (engine) | status at 80 (engine) |
| --- | --- | --- | --- | --- |
| A | 7, 4, 48 | 59 | 59.000000 | fail-pass-mark |
| B | 12, 11, 54 | 82 | 77.000000 | fail-pass-mark |
| C | 13, 11, 67 | 91 | 91.000000 | pass |

## What does not add up

Company B's printed criterion scores are 12, 11 and 54. They sum to 77.000000. The Guidance prints B's total as 82. On its own printed scores, B falls below the threshold of 80 together with A, while the Guidance names only A as rejected. The outcome the Guidance states, C first, is the same either way, because C clears the threshold on any reading and scores highest. The erratum changes who else qualifies, and here that does not change the winner.

## Reading a source critically

The engine computes from the criterion scores and returns 77.000000, so it treats the printed total as the figure in doubt. That is a choice, and the course states it. A careful reader of any source does three things when the source disagrees with itself:

1. **Record both figures.** The printed 82 and the computed 77.000000 each go in the notes, each labelled with where it came from.
2. **Say which one the calculation uses.** Here, the scores, because a total is derived from them and the scores carry more information.
3. **Check whether the conclusion depends on it.** Here the winner does not; the list of qualifying bids does.

One erratum does not discredit a source. The same Guidance's Figure IX checks out exactly: four criteria weighted 50, 25, 15 and 10, scored 0 to 4, with Company A scoring 2, 2, 2 and 1, give the printed weighted score of 190, and the engine returns 190.000000. A source that is right in one place and wrong in another is normal, which is why every example is checked by computing it.

## Exercise

Open the envelope calculator on the view "The technical envelope". Replace the criteria with three criteria whose weights and maxScores are 15, 15 and 70, replace the bids with companies A, B and C and their printed scores, and set the pass mark to 80. Read each technical percentage and status, and confirm B's. Then open the contract calculator on the view "Boundary probes", choose the pass mark probe, and enter a score of 77 against a pass mark of 80. Write the two lines you would put in an evaluation note about this example.
