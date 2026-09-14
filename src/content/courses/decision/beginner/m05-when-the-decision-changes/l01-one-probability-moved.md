# One probability moved

A decision rests on its probabilities, and moving one of them moves every branch that depends on it. On the EKPAN lottery the EMV climbs steadily as success becomes likelier, while the choice changes only once.

{{panel:ec-tree-explorer}}

## The lottery

The EKPAN lottery has two outcomes, Success and Dry hole. Drill costs 55.0000 and pays 420.0000 or -25.0000; Farm out pays 95.0000 or 0.0000; Walk away pays 0.0000 either way. At the stated success probability of 0.350000 the dry hole carries 0.650000, and the drill branch rolls back as 0.350000 x 420.0000 + 0.650000 x -25.0000 = 130.7500, less 55.0000 = 75.7500. The farm-out is 0.350000 x 95.0000 = 33.2500.

This lottery is not the EKPAN tree. The tree also carries a marginal find at 0.150000, which it would develop for 170.0000, and its drill branch is worth 105.0000. Quote each number with the model it came from.

## The sweep

| success probability | Drill | Farm out | best action | emv |
| --- | --- | --- | --- | --- |
| 0.150000 | -13.2500 | 14.2500 | Farm out | 14.2500 |
| 0.200000 | 9.0000 | 19.0000 | Farm out | 19.0000 |
| 0.250000 | 31.2500 | 23.7500 | Drill | 31.2500 |
| 0.300000 | 53.5000 | 28.5000 | Drill | 53.5000 |
| 0.350000 | 75.7500 | 33.2500 | Drill | 75.7500 |
| 0.400000 | 98.0000 | 38.0000 | Drill | 98.0000 |
| 0.500000 | 142.5000 | 47.5000 | Drill | 142.5000 |

Each row is a separate rollback. Moving success from 0.350000 to 0.400000 lifts the EMV from 75.7500 to 98.0000 and changes nothing about the decision. Moving it from 0.200000 to 0.250000 lifts the EMV from 19.0000 to 31.2500 and changes the first move from Farm out to Drill.

## Moving one means moving two

A probability cannot move alone. When success rises, dry hole must fall by the same amount, or the chance node no longer sums to 1 within the engine's tolerance of 1e-6 and the tree is refused. On the EKPAN tree the same rule holds with three outcomes: at success 0.100000 the marginal find stays at 0.150000 and the dry hole takes 0.750000, giving Drill -6.2500 against Farm out 14.0000.

## The mistake

The careful mistake is reading the size of an EMV change as the size of a decision change. The biggest moves in the table happen well inside the Drill region, where they alter the value and never the action. The move that matters is small and sits between two rows. A reader who reports "the EMV is sensitive to the success probability" has said nothing about the choice; a reader who reports "the choice turns between 0.200000 and 0.250000" has said what a decision maker needs.

The second mistake is carrying a sweep of one model onto the other. The lottery's 75.7500 at 0.350000 is not a point on the tree's curve, and the tree's -6.2500 at 0.100000 is not a point on the lottery's.

## What it refuses

The engine takes one probability per branch and returns one value; it has no notion of a probability that is itself uncertain, and a sweep is only a list of separate rollbacks with the payoffs held as typed. The rows sit 0.050000 apart, so the table can bracket the change of choice and cannot place it.

## Exercise

Roll back the EKPAN lottery's Drill and Farm out branches at 0.200000 and at 0.250000 by hand, and confirm the four values in the table. Then say between which two rows the choice changes, and why the move from 0.350000 to 0.400000 matters less to the decision than a smaller move lower down.
