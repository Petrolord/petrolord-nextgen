# Walking away is a branch

The option to do nothing is worth 0.0000 and has to be drawn as a branch like any other. A tree without it cannot recommend it, and a tree with it still takes it only when every other branch is worth less.

{{panel:ec-tree-explorer}}

## The EKPAN tree with and without

At the stated probabilities the EKPAN tree's root reads Drill 105.0000 million USD, Farm out 37.7500 and Walk away 0.0000, and takes Drill. The drill still wins with its dry hole at -25.0000. Remove the walk-away branch and the root still reads EMV 105.0000, because walking away was never the best branch here. A walk-away that is not chosen changes nothing in the rollback, and leaving it off gives the same answer.

## Moving the success probability

The same tree with the success probability cut and the marginal find held at 0.150000, the dry hole taking the rest:

| success | dry hole | Drill | Farm out | Walk away | best | best without walk-away |
| --- | --- | --- | --- | --- | --- | --- |
| 0.100000 | 0.750000 | -6.2500 | 14.0000 | 0.0000 | Farm out | Farm out at 14.0000 |
| 0.050000 | 0.800000 | -28.5000 | 9.2500 | 0.0000 | Farm out | Farm out at 9.2500 |

At both probabilities the drill has turned negative and the farm-out takes the root. Removing the walk-away changes nothing again, because the farm-out is still above 0.0000.

## Why walking away never wins on the EKPAN tree

The farm-out has no cost and pays 95.0000, 30.0000 or 0.0000. None of those is negative, so its weighted value can never be below walking away's 0.0000, and it is strictly above whenever success or a marginal find has any chance at all. On the EKPAN tree the walk-away branch is dominated by the farm-out, and its presence is a record of the option, not a live contender.

## Where walking away matters

It matters on a tree whose other branches can all go negative. The published allNegative case has branches worth -55.0000 and -52.0000 and no walk-away, and the engine recommends the -52.0000 branch. Had a walk-away at 0.0000 been drawn, the root would have taken it. The engine has no way to invent that option: the maximum it takes is over the branches listed, and a branch that is not listed does not exist to it. A farm-out that pays nothing in a dry hole plays the same protective role on the EKPAN tree, which is why its walk-away stays idle.

## The mistake

The careful mistake is leaving the walk-away off because it is obviously worth 0.0000 and obviously never chosen. On the EKPAN tree the answer survives. On a tree where the drill and every alternative are negative, the same omission turns a correct decision not to act into a recommendation to lose money, and the rollback gives no sign that anything is missing. The second mistake is drawing the walk-away with a cost already spent, such as money gone on a licence, as a negative payoff. Money spent before the decision is spent on every branch alike, and charging it to one branch alone biases the choice against walking away.

## Exercise

Roll back the EKPAN tree at success 0.100000 with and without the walk-away branch, and state the best move each time. Explain why the farm-out keeps the walk-away from ever being chosen on the EKPAN tree. Then state what allNegative would recommend if a walk-away at 0.0000 were added, and why the engine could not reach that answer on its own.
