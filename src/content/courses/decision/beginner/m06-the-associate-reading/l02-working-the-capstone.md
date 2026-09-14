# Working the capstone

A graded tree question hands you a tree and asks for its value, its first move and where that move would change. The method is to check the tree before any arithmetic, roll it back right to left in writing, read the path, and only then move a probability.

{{panel:ec-tree-explorer}}

## Step one: check the tree before rolling it back

Open the tree in the explorer and write out each node with its type, each branch with its cost, and each chance node's probabilities. Add each chance node's probabilities: the engine refuses a sum further than 1e-6 from 1. On EKPAN the drill outcomes are 0.350000, 0.150000 and 0.500000. Note which payoffs came from a linked Monte Carlo summary, because only the mean enters.

## Step two: roll back in writing, deepest first

Write one line per node, starting at the terminals. On OKRIKA:

| node | line | value |
| --- | --- | --- |
| development after good | 0.750000 x 520.0000 + 0.250000 x -60.0000 | 375.0000 |
| after a good appraisal | develop 375.0000 less 150.0000 against sell 95.0000 | 225.0000 |
| development after poor | 0.200000 x 520.0000 + 0.800000 x -60.0000 | 56.0000 |
| after a poor appraisal | develop 56.0000 less 150.0000 against sell 25.0000 | 25.0000 |
| appraisal result | 0.400000 x 225.0000 + 0.600000 x 25.0000 | 105.0000 |
| root | appraise 105.0000 less 18.0000, develop now 33.6000, sell now 48.0000 | 87.0000 |

Subtract each cost on its own branch before the node above weights it. Then compare your lines with the explorer node by node, and stop at the first disagreement.

## Step three: node value or branch value

EKPAN's drill chance node is 160.0000 and the drill branch is 105.0000; the Decision Tree Builder's drawing labels the node EMV 160, before the cost on the branch into it. A value read off the node where the branch was asked for is wrong by exactly the branch cost.

## Step four: read the path and the cards

Name the first move, the next best alternative and the decision advantage. OKRIKA appraises at 87.0000 against Sell now at 48.0000, an advantage of 39.0000; EKPAN drills at 105.0000 against Farm out at 37.7500, an advantage of 67.2500. List which branches are on the optimal path: every outcome under a taken branch is on it, only the best branch of each decision is, and nothing under an untaken branch ever is. If the advantage is 0.0000, the first move is only the tie rule, and say so.

## Step five: move one probability

When the question asks where the choice would turn, write each competing branch as a line in the probability and solve. On the EKPAN lottery Drill is 445 p - 80 and Farm out 95 p, crossing at 80 / 350 = 0.228571. Check every pair: Drill against Walk away crosses at 0.179775, where Farm out already wins. Report the switch; never report a winner exactly at it.

## Step six: a later choice

If the tree has a decision after a chance node, delete it and roll back again. OKRIKA's appraisal falls from 87.0000 to 15.6000 without the option to sell, and the root flips to Sell now. The difference, 71.4000, is the value of that later choice.

## The mistake

The careful mistake is trusting the explorer's root and writing it down. The root is only as right as every probability, cost and link beneath it.

## What the method refuses

It gives risk neutral expected money with no discounting, and cannot say whether the probabilities are right.

## Exercise

On EKPAN, write every node line from the terminals to the root and confirm 160.0000, 105.0000 and 37.7500. Then give the next best alternative and the advantage, and the success probability at which the lottery's first move would change.
