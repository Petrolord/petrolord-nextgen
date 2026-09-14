# An exact tie reported as a recommendation

When two branches are worth exactly the same, both apps still name one of them. They name the branch listed first, because the comparison is strictly greater. This is a property of the apps as published, and the owner left it unchanged.

{{panel:ec-judgement-explorer}}

## The rule in the tree engine

A decision node keeps the first branch listed when a later branch is only equal. On a small tree, Drill is worth 40.0000 less a cost of 10.0000 and Farm out is worth 30.0000:

| listing order | best | emv |
| --- | --- | --- |
| Drill first | Drill | 30.0000 |
| Farm out first | Farm out | 30.0000 |

The value is the same both ways, and the recommendation follows the order in which somebody typed the branches. The published equalEmvTie case ties "A" and "B" at 30.0000 beside "C" at 29.9990 and reports A. The EKPAN information tree ties its two root branches at a survey cost of 24.8250, both 75.7500, and reports the acquisition, because it is listed first.

## The same rule in the Analyzer

The VOI Analyzer's two actions are the named decision, listed first, and "Do Not", with every payoff 0. Type Success at 25 percent paying 200, Dry hole at 75 percent paying -50, and a decision cost of 12.5. Acting is worth 0.25 x 200 plus 0.75 x -50, less 12.5, which is 0, exactly the value of "Do Not". The cards read:

| card | value |
| --- | --- |
| emvWithoutInfo | 0.00 |
| emvWithInfo | 20.00 |
| voi | 25.00 |
| netVoi | 20.00 |
| evpi | 46.88 |

The insight opens by giving the EMV without new information as 0.00 million USD, "with the optimal decision being to 'Drill Exploration Well'." Nothing tells the reader that walking away was worth exactly the same. The consistency check passes, nothing is withheld, and the tree is drawn with root emv 20.0000 and root bestBranchIndex 0.

## Why the tie matters here

At a tie, the value of information is at its most useful and the recommendation at its least. The gross voi of 25.00 is large against an emvWithoutInfo of 0.00 because the prior decision is perfectly unsettled: any signal at all can tip it. On the EKPAN lottery EVPI is largest at the drill against farm-out switch, 61.7143 at 0.228571, for the same reason. The sentence that names "Drill Exploration Well" as optimal is the least informative sentence on the screen.

## Reading the brief

Decision Studio prints the same tie as arithmetic. For equalEmvTie its rows are Optimal EMV 30.0000, Recommended first move "A", Next best alternative 30.0000 and Decision advantage 0.0000. The advantage row is the only place the tie is visible, so read it before the first move.

## The mistake

The careful mistake is quoting the recommended action without its margin. A reader who writes "drill" from the Analyzer's insight has reported the listing order. The honest report of a tie names both branches, gives their shared value, and says the choice is indifferent on EMV grounds. The opposite mistake is reordering the branches to get the answer you prefer, which changes nothing but the label.

## Exercise

Roll the Analyzer's tie case back by hand and show that acting is worth 0. Then say which action the insight names and why, give the netVoi card, and state which row of a Decision Studio brief shows that a recommendation is a tie.
