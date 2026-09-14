# Drill, farm out or walk

With three actions on the table, each pair has its own crossing, and only some crossings ever decide anything. On EKPAN walking away is always available and is never the best action at a positive success probability, because the farm-out is a better floor.

{{panel:ec-tree-explorer}}

## Three actions on the lottery

On the EKPAN lottery Drill costs 55.0000 and pays 420.0000 or -25.0000, Farm out pays 95.0000 or 0.0000, and Walk away pays 0.0000. At the low end of the sweep:

| success probability | Drill | Farm out | Walk away | best action |
| --- | --- | --- | --- | --- |
| 0.050000 | -57.7500 | 4.7500 | 0.0000 | Farm out |
| 0.100000 | -35.5000 | 9.5000 | 0.0000 | Farm out |
| 0.150000 | -13.2500 | 14.2500 | 0.0000 | Farm out |
| 0.200000 | 9.0000 | 19.0000 | 0.0000 | Farm out |
| 0.250000 | 31.2500 | 23.7500 | 0.0000 | Drill |

Drill crosses Walk away at 80 / 445 = 0.179775 and crosses Farm out at 80 / 350 = 0.228571. The first crossing lies inside the region where Farm out already wins, so it never changes the choice. Farm out pays 95 p, which is positive whenever success is possible, so it beats walking away at every row.

## Why the farm-out dominates the walk

The farm-out never loses money: its worst outcome, a dry hole, pays 0.0000, which is what walking away pays in every outcome. Its best outcome pays 95.0000. An action that equals another in one outcome and beats it in the other can never be worth less at any probability. Walking away can only be strictly best on a tree where every other branch can lose money.

## The tree says the same

The EKPAN tree, with its marginal find, gives the same answer at low success probabilities:

| success probability | dry hole | Drill | Farm out | Walk away | best action |
| --- | --- | --- | --- | --- | --- |
| 0.100000 | 0.750000 | -6.2500 | 14.0000 | 0.0000 | Farm out |
| 0.050000 | 0.800000 | -28.5000 | 9.2500 | 0.0000 | Farm out |

Rolled back without its walk-away branch, the tree still chooses Farm out, at 14.0000 and 9.2500, and at the stated probabilities it still reads 105.0000. Removing a branch that is never best leaves every root value unchanged.

## The mistake

The careful mistake is reasoning in pairs and stopping early: the drill is negative below 0.179775, so walk away. At 0.100000 that answer gives up the farm-out's 9.5000, and at 0.050000 it gives up 4.7500. The drill being negative says only that drilling is worse than nothing; the question is what is best, and that needs every branch compared at once.

The opposite error is drawing only Drill and Walk away because the farm-out terms are not yet agreed. The tree then walks below 0.179775 and drills above it, and its switch sits in the wrong place by the full width of the farm-out region.

## What it refuses

The engine compares only the branches drawn, and it holds every payoff at its typed value while the probability moves: the farm-out's 95.0000 is the same at 0.050000 as at 0.250000, although no partner would offer the same terms on a prospect that much weaker. The VOI Analyzer is narrower still: it offers exactly two actions, the named decision and "Do Not" with every payoff 0, so a farm-out cannot be entered there at all.

## Exercise

At success 0.100000 on the EKPAN lottery, write the value of all three actions and name the best. Then give both of Drill's crossings, say which one decides the first move and why, and state what the EKPAN tree without its walk-away branch reads at 0.050000.
