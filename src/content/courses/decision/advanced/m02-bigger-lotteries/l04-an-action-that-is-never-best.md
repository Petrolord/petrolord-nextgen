# An action that is never best

Some actions cannot win at any probability. On the published three-outcome lottery Drill with partner is an exact half-scale copy of Drill alone, and the sweep shows it never leads.

{{panel:ec-judgement-explorer}}

## Half of everything

Drill alone costs 60.0000 and pays 500.0000, 150.0000 and -20.0000 in Large, Medium and Dry. Drill with partner costs 30.0000 and pays 250.0000, 75.0000 and -10.0000. Every payoff is half and so is the cost, so at any probabilities the partner is worth exactly half of Drill alone: 54.5000 against 109.0000 at the stated prior.

Half of a positive number is smaller, so whenever Drill alone is worth something the partner is worth less. Half of a negative number is still negative, and Farm out never falls below 0 because none of its payoffs is negative, so whenever Drill alone loses the partner loses to Farm out. Relinquish pays 0.0000 everywhere and can at most tie Farm out.

## The sweep

Large is swept with Medium held at its stated 0.5 and Dry taking the rest.

| Large | Dry | Drill alone | Drill with partner | Farm out | Relinquish | best action |
| --- | --- | --- | --- | --- | --- | --- |
| 0.000000 | 0.500000 | 5.0000 | 2.5000 | 15.0000 | 0.0000 | Farm out |
| 0.050000 | 0.450000 | 31.0000 | 15.5000 | 19.0000 | 0.0000 | Drill alone |
| 0.100000 | 0.400000 | 57.0000 | 28.5000 | 23.0000 | 0.0000 | Drill alone |
| 0.200000 | 0.300000 | 109.0000 | 54.5000 | 31.0000 | 0.0000 | Drill alone |
| 0.300000 | 0.200000 | 161.0000 | 80.5000 | 39.0000 | 0.0000 | Drill alone |
| 0.500000 | 0.000000 | 265.0000 | 132.5000 | 55.0000 | 0.0000 | Drill alone |

The partner column is half the Drill alone column in every row. The sweep has one switch, from Farm out to Drill alone, somewhere between a Large chance of 0.000000 and 0.050000. Four actions, and two of them never enter the contest.

## Never best under perfect information either

With the outcome known first, the published golden records the best actions for Large, Medium and Dry as indices 0, 0 and 2. The partner, index 1, appears nowhere; Relinquish, index 3, ties Farm out in Dry and loses on listing order. Since neither is the maximum anywhere, deleting either leaves emvPrior 109.0000, evWithPerfect 133.0000 and the EVPI of 24.0000 where they are.

## Never best at the prior is not worthless

On EKPAN the farm-out is not best at the stated prior, yet the survey's gross value falls from 24.8250 to 19.8375 without it, because it is the best action after a No bright spot reading. The test is whether an action is best after some reading or outcome, and the partner fails that test here.

It does not fail on risk. In Dry the partner loses 10.0000 plus its 30.0000 cost where Drill alone loses 20.0000 plus 60.0000. The engine is risk neutral and maximises the mean, so it has no way to prefer halving a loss.

## The mistake

The careful mistake is to prune the partner because the EMV never picks it, then present the tree as the full set of options. No number changes, and the one alternative that halves the exposure has vanished from the page. The opposite mistake is to prune an action that is merely not best at the prior, such as EKPAN's farm-out, and quote the smaller value of information as if nothing were lost.

## Exercise

Show that Drill with partner is half of Drill alone at a Large chance of 0.300000 and give both values. Then explain why it can never be best on this lottery, and why removing EKPAN's farm-out changes the value of its survey while removing the partner here changes no value at all.
