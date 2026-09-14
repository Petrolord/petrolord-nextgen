# The information tree

The information tree puts the survey decision in front of the prospect decision and rolls both back in one pass. For EKPAN its root is worth 92.5750 million USD and chooses "Acquire CSEM survey".

{{panel:ec-information-explorer}}

## The shape

The root is a decision with two branches. "Acquire CSEM survey" costs 8.0000 and leads to a chance node over the two readings. "No further information" costs nothing and leads straight to the EKPAN choice at the prior. Under each reading sits a decision among Drill, Farm out and Walk away, and under each action a chance node over Success and Dry hole at that reading's posteriors.

| path | branch | probability and cost | child | branchValue | onOptimalPath |
| --- | --- | --- | --- | --- | --- |
| 0 | Acquire CSEM survey | cost 8.0000 | chance "Signal received" emv 100.5750 | 92.5750 | true |
| 0.0 | . Bright spot | probability 0.460000 | decision "Choose action" emv 207.7989 | 207.7989 | true |
| 0.0.0 | . . Drill | cost 55.0000 | chance "Drill outcome" emv 262.7989 | 207.7989 | true |
| 0.0.1 | . . Farm out | none | chance "Farm out outcome" emv 61.4402 | 61.4402 | false |
| 0.0.2 | . . Walk away | none | chance "Walk away outcome" emv 0.0000 | 0.0000 | false |
| 0.1 | . No bright spot | probability 0.540000 | decision "Choose action" emv 9.2361 | 9.2361 | true |
| 0.1.0 | . . Drill | cost 55.0000 | chance "Drill outcome" emv 18.2639 | -36.7361 | false |
| 0.1.1 | . . Farm out | none | chance "Farm out outcome" emv 9.2361 | 9.2361 | true |
| 0.1.2 | . . Walk away | none | chance "Walk away outcome" emv 0.0000 | 0.0000 | false |
| 1 | No further information | none | decision "Choose action" emv 75.7500 | 75.7500 | false |
| 1.0 | . Drill | cost 55.0000 | chance "Drill outcome" emv 130.7500 | 75.7500 | false |
| 1.1 | . Farm out | none | chance "Farm out outcome" emv 33.2500 | 33.2500 | false |
| 1.2 | . Walk away | none | chance "Walk away outcome" emv 0.0000 | 0.0000 | false |

## Right to left

Start at the leaves under a bright spot. Drill's chance node weights 420.0000 and -25.0000 by 0.646739 and 0.353261 to 262.7989, and less 55.0000 the Drill branch is 207.7989. Farm out is 61.4402 and Walk away 0.0000, so the bright spot decision is worth 207.7989.

Under no bright spot the outcomes carry 0.097222 and 0.902778. Drill's chance node is 18.2639 and its branch -36.7361, Farm out is 9.2361, and the decision is worth 9.2361.

The reading chance node weights those two decisions:

0.460000 x 207.7989 + 0.540000 x 9.2361 = 100.5750

Less the survey cost of 8.0000, the acquire branch is 92.5750. The other root branch rolls back the lottery at the prior: Drill 130.7500 less 55.0000 is 75.7500, against Farm out 33.2500 and Walk away 0.0000, so that branch is 75.7500. The root takes the larger, 92.5750, and acquires.

## The root difference is the net value

92.5750 less 75.7500 is 16.8250, the net value of information. The tree is the Bayes calculation drawn out: every number in the EVII working appears on one of its nodes, and the tree adds only the price.

## The optimal path

onOptimalPath marks the survey, both readings, Drill under a bright spot and Farm out under no bright spot. Every branch under "No further information" reads false, because that branch is not taken. The recommendation is a policy: buy, then drill on a bright spot and farm out without one.

## What it refuses to be

The tree is single stage: one survey, one reading, one action. Walk away appears as a chance node paying 0.0000 in both outcomes. The tree is risk neutral and undiscounted. With no readings at all, the published noSignals case returns the plain prospect decision, root "Choose action" at 43.0000.

## The mistake

Hand-built trees fail in two ways. The first puts the prior 0.350000 on the outcome branches under a reading. Under a bright spot they must carry 0.646739, or the tree ignores what the survey said. The second reads a node before the cost on the branch into it. The Decision Tree Builder labels each node with its own value, so the drill node under a bright spot shows its value before the 55.0000, and the chance node under the survey branch is worth 100.5750, 8.0000 more than the branch.

## Exercise

Roll the EKPAN information tree back by hand: both drill chance nodes, the two reading decisions, the reading chance node, the acquire branch after its cost, and the no-information branch. Take the root maximum, name the optimal path, and show that the root difference equals the net value of information.
