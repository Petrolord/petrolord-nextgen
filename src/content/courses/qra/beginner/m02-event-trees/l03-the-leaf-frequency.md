# The leaf frequency

{{panel:qr-event-tree}}

A leaf's frequency is the initiating frequency times the product of the probabilities on its path. That one sentence is the whole arithmetic of an event tree, and it has a useful consequence: because every branch set sums to one, the leaves of a tree always sum back to the frequency the tree started from. This lesson uses that property as a check you can run on any tree.

## EREMOR's five leaves

| leaf frequency per year | path probability | outcome |
| --- | --- | --- |
| 0.001900000000 | 0.950000000000 | no release |
| 0.000007000000 | 0.003500000000 | pool fire |
| 0.000063000000 | 0.031500000000 | no fire |
| 0.000007500000 | 0.003750000000 | pool fire |
| 0.000022500000 | 0.011250000000 | no fire |

The overfill happens at 2e-3 per year, as stated. Each row multiplies 2e-3 by its path probability. The leaves sum back to the initiating frequency, 0.002000000000 per year.

## Why the leaves close

Think of the initiating frequency as a stream of events flowing into the root. At every branch set the stream divides, and because the probabilities sum to one, none of it is lost and none is created. After the last branch set the stream has been divided among the leaves, and adding the leaves reassembles it.

So a tree whose leaves sum to its initiating frequency has closed. A tree whose leaves fall short has lost part of the stream somewhere, and the engine would have refused it before any leaf was printed, because some branch set would not have summed to one within 1e-9.

## The path probability is the product

Each path probability in the table is a product of the branch probabilities on that path. The answered alarm path carries one branch. The four other paths each carry three. Multiplying along a path is the same as asking: of every overfill, what fraction ends here?

That is why a path probability can be very small even when each branch looks ordinary. Three moderate probabilities multiplied together quickly reach the third decimal place. The first pool fire leaf has a path probability of 0.003500000000, which means that of every overfill, a small fraction ends in a fire in the bund.

## A leaf at zero

A branch of probability zero is allowed, and its leaf carries a frequency of zero. The golden case zero-probability-branch shows this: leaf a at 0.000000000000 and leaf b at 0.000400000000. Its leaves still sum back to the initiating frequency, because a zero leaf adds nothing.

## Exercise

Add the five leaf frequencies in the table and confirm that they reach 0.002000000000 per year. Then add the five path probabilities and say what their sum must be, and why. If one of your sums disagreed, write down which row you would recheck first and the multiplication you would redo on it.
