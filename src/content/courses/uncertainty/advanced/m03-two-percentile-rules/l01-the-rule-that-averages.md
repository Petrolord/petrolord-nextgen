# The rule that averages

The Scenario Builder reads its three NPV cases with the quantile rule in `lib/stats`. When n x q is a whole number on an even-length sample, that rule averages two sorted values.

{{panel:ec-risk-explorer}}

## The rule, branch by branch

For a sorted sample of length n and a fraction q, the rule first computes n x q. Then:

- If n x q is not a whole number, it returns one sorted value: the one at position n x q rounded up, counting from one.
- If n x q is whole and n is even, it returns the mean of the value at position n x q and the value after it.
- If n x q is whole and n is odd, it returns only the value after that position.

The rule is copied from simple-statistics so the engine matches the Suite bit for bit. `runMonteCarlo` calls it three times, at q of 0.1, 0.5 and 0.9, and stores the results under the keys `p10`, `p50` and `p90`.

## ISIALA's 1000 NPVs

n x 0.1 = 100 and n x 0.5 = 500 are whole numbers on an even length. So is n x 0.9, which means all three cases are averages.

| case | engine key | averaging rule, million USD | floor rule on the same sample |
| --- | --- | --- | --- |
| Low case P90 | `p10` | 15.6063 | 15.6619 |
| Best case P50 | `p50` | 78.5315 | 78.5836 |
| High case P10 | `p90` | 152.0653 | 152.1794 |

The last column is the single sorted value at index `floor(q n)`, which is the rule the Breakeven Analyzer uses.

## A value no iteration produced

Because it averages, 15.6063 is not one of the 1000 NPVs. It sits halfway between two neighbours, and the upper neighbour is the floor rule's 15.6619. The same is true of 78.5315 and 152.0653. Search the sorted `allValues` array for any of the three card values and nothing matches.

## When the rule stops averaging

The branch depends on the iteration count. At 1000, all three cases are averages. On an odd count, no case is averaged. On a count where n x q has a fractional part, the rule takes a single value. Two runs of one field that differ only in iteration count can read their cases by different branches, and nothing on the panel says which branch was used.

## The mistake

The careful mistake is checking a card by looking for its value in the exported sample, finding nothing, and concluding the card is wrong or stale. Under its own rule the card is right.

The opposite mistake is recomputing the Low case P90 in a spreadsheet with some other percentile function, then calling the difference in the second or fourth decimal an engine defect. Every percentile rule is a convention. Name the rule before you compare two numbers.

## What it refuses

The rule does no weighting and no interpolation beyond a single midpoint, and it never averages on an odd length. It knows nothing about exceedance. `p10` is just the plain 10th percentile position of the sorted NPVs. The Low case P90 label comes from the convention module, never from the rule.

## Exercise

State the rule's three branches. Say which branch applies to ISIALA's 1000 NPVs at q of 0.1, 0.5 and 0.9, and give the three cases with their engine keys. Then explain why 15.6063 cannot be found in the sorted sample, and which neighbour of it 15.6619 is.
