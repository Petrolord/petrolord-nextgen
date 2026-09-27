# The other parties pay their own shares

{{panel:farmout-earning-calculator}}

A farm-out is a trade between two parties, and the licence often has others. They stand outside the trade: each pays its own participating interest of every gross cost, and none of them carries or is carried by the farminee. This lesson reads how the engine splits a well between all the parties, and checks that the three payments add up to the well.

## The rule for the other parties

The engine states it in the basis of every earning result:

> the other parties pay their own interests of each gross cost (calculatePartnerCosts from engines/economics/afe.js)

The split for the other parties is the canonical partner split of the AFE engine, imported and reused. Partner cost splits under a joint operating agreement are the joint ventures course's subject; here the split simply fills in the parties the deal does not touch.

## The Ekene Deep well, split three ways

On the Ekene Deep well of 46000000.000000, FIN pays 40.000000 percent to earn 30.000000 percent from EKO. PA holds 30.000000 percent and is outside the trade.

| party | pays (engine) |
| --- | --- |
| FIN, the farminee | 18200000.000000 |
| EKO, the farmor | 14000000.000000 |
| PA, the other party | 13800000.000000 |
| the three together | 46000000.000000 |

PA pays its own 30.000000 percent of the well. FIN and EKO share the rest, and the three payments add up to the gross cost of 46000000.000000. That check is worth doing on every result: if the payments do not make up the well, a term has been misread.

FIN's payment is 39.565217 percent of the gross cost, a little below its stated share of 40.000000 percent. The difference comes from the deal's cap on the gross cost, which the engine reports in its reason:

> Ekene Deep-1 exploration well: gross cost 46000000; FIN pays 40% to earn 30% (30% held after it): a promote of 10 points, ratio 40 / 30; the gross cost exceeds the cap 44000000 by 2000000: the promote applies to 44000000; the excess is paid by the post-deal interests (FIN 30%, EKO 40%); FIN pays 18200000 (39.565217% of the gross cost), EKO pays 14000000, a carry of 4400000

How a cap and its overrun rule split the excess is the Professional tier's first module. At this tier, read the reason as a record of what the engine did, and note that PA's payment does not depend on it.

## The same rule on a well with no cap

On the worked case `earn-cap-gross-below`, a well of 40000000.000000 sits below its cap, so the whole well is split by the stated shares. FIN pays 16000000.000000, EKO 12000000.000000 and PA 12000000.000000, which again make up the well.

## Exercise

Open the earning calculator, the course's own calculator panel, in the view "The earning obligation, the promote and the consideration", and start from "The Ekene Deep well, a gross-cost cap". Read the event row for what FIN and EKO pay and the "event other party" table for PA, and add the three: check the total against the gross cost. Then start from "A heads-up deal", read the three payments again, and check that they also make up that well.
