# Next best and the advantage

The brief's Next best alternative is the largest root branch value other than the chosen one, and its Decision advantage is the gap between the two. Both are arithmetic on engine returns, and both are easy to compute from the wrong number.

{{panel:ec-judgement-explorer}}

## Branch values, after their costs

A root branch value is the child's EMV less the cost on the branch. EKPAN's root branches are Drill 105.0000, Farm out 37.7500 and Walk away 0.0000. The best is Drill and the largest of the others is Farm out, so Next best alternative is 37.7500 and Decision advantage is 105.0000 less 37.7500, which is 67.2500.

OKRIKA's root branches, in the order listed:

| branch | cost | child emv | branchValue |
| --- | --- | --- | --- |
| Appraise | 18.0000 | 105.0000 | 87.0000 |
| Develop now | 150.0000 | 183.6000 | 33.6000 |
| Sell now | none | 48.0000 | 48.0000 |

Next best is Sell now at 48.0000, the third branch listed, and Decision advantage is 87.0000 less 48.0000, which is 39.0000. Next best means the largest other value wherever it sits in the list.

## On an information tree

The EKPAN information tree roots on acquiring the survey at 92.5750 against no further information at 75.7500. Next best is 75.7500 and Decision advantage is 16.8250, exactly netEvii at the survey cost of 8.0000. On an information tree the advantage row is the net value of the information.

## A tie

The published equalEmvTie has root branches A 30.0000, B 30.0000 and C 29.9990. The brief prints Optimal EMV 30.0000, Recommended first move "A", Next best alternative 30.0000 and Decision advantage 0.0000. The engine keeps the first branch listed when a later one is only equal, so "A" is recommended because it comes first. An advantage of 0.0000 beside a named first move is a tie reported as a recommendation.

## What the advantage does not say

Decision advantage is a difference of two means. It is neither a margin of safety nor a chance of being right. EKPAN's 67.2500 sits on a drill branch that loses money with probability 0.500000; its outcomes after the drill cost are 365.0000, 115.0000 and -80.0000, and 105.0000 is none of them. When the root is a chance node or has a single branch the brief prints neither row, because there is no alternative to measure.

## The mistake

The careful mistake is to take a node value before its branch cost. The Decision Tree Builder's drawing labels each node with its own EMV, so Develop now's chance node shows its 183.6000. A reader who takes that label as the branch value makes Develop now the best move and pushes Appraise into second place, an advantage running the wrong way. Its branch value is 33.6000, after the cost of 150.0000. The second mistake is to take the second branch listed as the next best: on OKRIKA that is Develop now at 33.6000, which overstates the advantage because Sell now at 48.0000 is the real alternative to beat.

## Exercise

For OKRIKA, list the three root branch values and give the Next best alternative and Decision advantage. Then explain why the advantage on the EKPAN information tree equals netEvii, and what the brief's rows say about equalEmvTie.
