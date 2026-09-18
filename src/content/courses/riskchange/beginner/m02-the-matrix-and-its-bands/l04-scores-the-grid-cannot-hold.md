# Scores the grid cannot hold

Scores run from 1 to 25, so it is natural to assume every whole number in between is a score some risk could have. That assumption fails. The grid holds fewer distinct scores than it has cells, and some whole numbers inside the range never appear in any cell at all.

{{panel:rc-risk-explorer}}

## Fourteen distinct scores

The grid has twenty five cells, and it holds 14 distinct scores. The difference comes from repeats: the same score sits in several cells whenever two different pairs of levels multiply to it, as 20 does at likelihood 4 impact 5 and at likelihood 5 impact 4.

## Eleven whole numbers in no cell

Of the whole numbers from 1 to 25, 11 are in no cell. They are:

| whole numbers from 1 to 25 that no cell holds |
| --- |
| 7, 11, 13, 14, 17, 18, 19, 21, 22, 23, 24 |

The reason is the rule itself. A score is the product of two whole levels from 1 to 5, and no two whole levels on this scale multiply to any of these numbers. Take 7. The only whole numbers that multiply to 7 are 1 and 7, and 7 is not a level on a scale that stops at 5. The same reasoning rules out each number on the list.

Check the two counts together: 14 scores that appear plus 11 whole numbers that do not make the 25 whole numbers from 1 to 25.

## What a missing score means

If you ever see a risk in this register carrying a score of 7, or 13, or 24, something other than the product of two levels produced it. The engine will still band it, because a band is found by its lower edge alone. A score of 14 reads "High", and 14 is on the list above.

Notice one more detail in the band table. The upper edge written for "High" is 14, and 14 is on the list of numbers no cell holds. The printed edge of a band is a label written for people, and a label can name a number the grid never produces. This is one more reason to read the lower edges only.

## Using the list as a check

A reviewer can turn this into a quick check on any register. For each risk, multiply the two levels and compare the result with the score on the record. Then glance at the score itself: if it is on the list of eleven, the record cannot have come from two whole levels on this scale, whatever the band beside it says. The band cannot reveal this error, because the band will look normal.

## The mistake

The mistake is to treat the scores 1 to 25 as a continuous scale, as if a risk could sit anywhere along it. The grid is a set of fourteen values. Averages, medians and gaps between scores behave oddly on a set like that, and a score outside the set is a sign that the record did not come from the rule.

## Exercise

Record the number of distinct scores the grid holds and the number of whole numbers from 1 to 25 it does not. List those numbers. Record the band the engine gives a score of 14, and state the rule that lets a score no cell holds still find a band.
