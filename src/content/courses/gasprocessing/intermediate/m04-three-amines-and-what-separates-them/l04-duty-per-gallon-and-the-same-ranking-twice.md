# Duty per gallon, and the same ranking twice

Put the same sweetening duty through all three amines, each at its own strength, its own rich limit and its own duty per gallon, and two answers come back for each. This lesson is about what those answers do and do not tell you.

The arrangement is the important part. Each row is a whole operating case rather than one property swapped out, which is what makes the comparison meaningful as a comparison of solvents and useless as a study of any single property.

## All three, on one duty

| amine | circulation, gpm | regenerator, MMBtu/hr | rich used | MMBtu/hr per gpm |
| --- | --- | --- | --- | --- |
| MEA | 994.638143 | 65.646117 | 0.350000 | 0.066000000 |
| DEA | 934.163599 | 53.247325 | 0.400000 | 0.057000000 |
| MDEA | 502.519990 | 24.120960 | 0.500000 | 0.048000000 |

{{panel:fc-absorber-explorer}}

## The last column is not a new fact

The final column is the two engine figures on each row divided. It looks like a result and it is a restatement. Divide each amine's customary duty in the property table by the minutes in a day and multiply by the minutes in an hour, and the same number comes back.

| amine | MMBtu/hr per gpm, from the two engine figures | the table duty times 60 over a million |
| --- | --- | --- |
| MEA | 0.066000000 | 0.066000000 |
| DEA | 0.057000000 | 0.057000000 |
| MDEA | 0.048000000 | 0.048000000 |

That is the sort of check worth doing on any derived column. When a ratio of two outputs turns out to be an input you already had, the ratio carries no information, and treating it as a finding is how a table gets over-read.

It is also a useful sanity check in the other direction. If that column ever failed to reproduce the property table, something between the circulation and the duty would be wrong, because there is nothing else in that step for the arithmetic to touch.

## The same ordering three times

The regenerator duty ranks the three amines in exactly the order the duty column of the property set already does, and the circulation ranks them in the same order again. All three orderings are the same ordering.

So the interesting question is not which amine comes out cheapest on this duty. It is how far apart they are, and the two ways of measuring that give different answers.

| pair | circulation ratio | duty ratio |
| --- | --- | --- |
| MEA over MDEA | 1.979300649 | 2.721538393 |
| DEA over MDEA | 1.858958085 | 2.207512726 |
| MEA over DEA | 1.064736567 | 1.232852867 |

## Why the two ratio columns differ

The two ratio columns are not equal, and that is the whole point of the table. Circulation is set by the rich limit and the strength. Duty is set by the rich limit, the strength and the duty per gallon. The same ordering is reached by two different routes, and the gaps between the amines are different sizes on each.

That is why a comparison of solvents needs both numbers in front of it. A ranking that is stable across two measures is a real ranking. The size of the advantage is not stable, and quoting one ratio when the decision turns on the other is a mistake that a single ordering hides completely.

This is also the clearest example in the course of a rule worth generalising. Two numbers agreeing on an order say much less than they appear to, and the moment anyone asks by how much, the two routes have to be separated and named.

## Exercise

Record the circulation and the regenerator duty for all three amines, and the duty per gallon each was run at. Then record both ratios for MEA over MDEA and say which one you would quote to somebody sizing a pump and which to somebody sizing a reboiler.
