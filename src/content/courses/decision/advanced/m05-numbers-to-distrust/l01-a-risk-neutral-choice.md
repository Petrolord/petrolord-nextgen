# A risk neutral choice

Both decision modules maximise expected money. They contain no utility function and no risk aversion parameter, so a choice that loses money most of the time is recommended whenever its mean is highest.

{{panel:ec-judgement-explorer}}

## What the mean chose

On the EKPAN lottery at a success probability of 0.35, with the drill cost of 55.0000 already taken off:

| action | emv | outcomes after cost | chance of losing money |
| --- | --- | --- | --- |
| Drill | 75.7500 | 365.0000 at 0.350000, -80.0000 at 0.650000 | 0.650000 |
| Farm out | 33.2500 | 95.0000 at 0.350000, 0.0000 at 0.650000 | never |
| Walk away | 0.0000 | 0.0000 | never |

Roll the drill back by hand: 0.350000 x 365.0000 plus 0.650000 x -80.0000 gives 75.7500. The farm-out is 0.350000 x 95.0000, which is 33.2500. The engine takes the maximum and recommends Drill. Nothing in either module sees anything but the two means.

The full EKPAN tree says the same thing with a third outcome. Its drill branch is worth 105.0000 and delivers 365.0000, 115.0000 or -80.0000, losing money with probability 0.500000. The 105.0000 is not among the outcomes anyone will book.

## What a risk neutral value of information misses

The survey on the same lottery has an EVII of 24.8250, and that number is also a difference of means. It prices the survey only by how much it raises expected money. Look at what it does to the chance of drilling a dry hole. Without the survey, the drill is chosen and fails with probability 0.650000. With it, the drill is chosen only after a bright spot, and the joint chance of a bright spot and a dry hole is 0.162500. After no bright spot, which happens with probability 0.540000, the choice is the farm-out, which never loses on the well.

That fall from 0.650000 to 0.162500 is worth something to a company that cannot absorb a dry hole, and it appears nowhere in 24.8250. A risk averse buyer would pay more than the EVII for this survey; the engine cannot say how much more.

## Where the choice turns

Risk neutrality also fixes where the decision turns. Drill and farm-out are straight lines in the success probability and cross at 0.228571. EVPI peaks there at 61.7143 against 52.0000 at the stated 0.35. A decision maker who weighs losses more heavily would switch at a higher probability, and these engines cannot find that point.

## What to do with it

Report the recommendation as what it is: the action with the highest expected money. Beside it, report what the mean hides, taken from the tree itself: the outcomes the action can produce, the chance of each, and the chance of losing money. For the EKPAN lottery that is one sentence: Drill has an EMV of 75.7500 and loses 80.0000 with probability 0.650000; the farm-out has 33.2500 and cannot lose.

## The mistake

The careful mistake is treating a larger EMV as a safer choice, or softening the recommendation by quietly lowering a payoff until the farm-out wins. The first confuses a mean with a guarantee. The second hides a risk preference inside the numbers, where no reviewer can see it or argue with it. A preference belongs in words beside the tree.

## Exercise

Roll the EKPAN lottery's drill and farm-out back by hand at 0.35 and name the recommended action. Then state the chance of drilling a dry hole with and without the survey, and explain why neither probability affects the EVII of 24.8250.
