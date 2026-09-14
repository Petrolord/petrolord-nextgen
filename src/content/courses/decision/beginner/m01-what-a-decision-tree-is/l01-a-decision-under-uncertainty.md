# A decision under uncertainty

EKPAN is a prospect with three things its owner can do today and three things the ground can turn out to hold. A decision tree writes both down and turns them into one recommended move and one number: on the EKPAN tree, 105.0000 million USD.

## Three moves, three outcomes

The owner can drill at a cost of 55.0000 million USD, farm out and pay nothing, or walk away. The ground holds a success with probability 0.350000, a marginal find with probability 0.150000, or a dry hole with probability 0.500000. Each move meets those outcomes differently:

| outcome | probability | Drill pays | Farm out pays |
| --- | --- | --- | --- |
| Success | 0.350000 | 420.0000 | 95.0000 |
| Marginal | 0.150000 | 170.0000 | 30.0000 |
| Dry hole | 0.500000 | -25.0000 | 0.0000 |

Walking away pays 0.0000 whatever the ground holds. The drill's 170.0000 for a marginal find is itself the better of two later choices: develop, 260.0000 less a cost of 90.0000, or sell for 140.0000.

## Why the choice is not obvious

The drill holds the largest payoff in the table and the only negative one. The farm-out never loses and never pays much. Walking away is certain and worth nothing. Looking only at success favours the drill, looking only at the dry hole favours the farm-out, and neither view uses the probabilities, although the owner must choose before the ground is known.

## The expected value of each move

The tree weights each payoff by its probability and adds. For the drill, 0.350000 x 420.0000 + 0.150000 x 170.0000 + 0.500000 x -25.0000 = 160.0000, and less the drill cost of 55.0000 that gives 105.0000. For the farm-out, 0.350000 x 95.0000 + 0.150000 x 30.0000 + 0.500000 x 0.0000 = 37.7500. Walking away is 0.0000. The tree takes the largest, so the EKPAN tree's expected monetary value, its EMV, is 105.0000 and the recommended move is Drill.

## What the number is

105.0000 is a probability weighted average over outcomes that have not happened. It is not what the drill will return. After its cost the drill leaves 365.0000, 115.0000 or -80.0000, and it loses money with probability 0.500000. The tree ranks moves by averages alone. It is risk neutral: the move with the higher EMV wins however badly its worst outcome hurts.

## The mistake

The careful mistake is to choose by the most likely outcome. The dry hole is the single most likely outcome, at 0.500000, and against it the farm-out's 0.0000 beats the drill's -25.0000. Choosing the farm-out on that ground ignores the other half of the probability, where the drill pays far more, and trades 105.0000 for 37.7500. The opposite mistake, choosing by the best case, picks the drill here for the wrong reason, and would pick it just as confidently at a success probability far too low to justify it.

## Exercise

List the EKPAN tree's moves and outcomes with their probabilities. Weight the drill and farm-out payoffs by hand, subtract the drill cost where it belongs, and say which move the tree recommends and at what EMV. Then state the probability that the recommended move loses money.
