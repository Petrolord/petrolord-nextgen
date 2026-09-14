# An EMV nobody receives

The EKPAN tree's drill branch is worth 105.0000 million USD, and no outcome of drilling pays 105.0000. An EMV is an average over outcomes, and the owner receives one outcome.

{{panel:ec-tree-explorer}}

## What the drill actually leaves

The money each drill outcome leaves once the drill cost of 55.0000 is paid, the outcome's branch value less 55.0000:

| outcome | probability | money after the drill cost |
| --- | --- | --- |
| Success | 0.350000 | 365.0000 |
| Marginal | 0.150000 | 115.0000 |
| Dry hole | 0.500000 | -80.0000 |

Weighted, these three give the same 105.0000 as the rollback, because the probabilities sum to 1. The branch value is not among them. The nearest outcome, the marginal find at 115.0000, happens with probability 0.150000.

## How often the drill loses

The drill loses money in exactly one outcome, the dry hole, so the chance of losing money on the drill branch is 0.500000. An owner who drills EKPAN once gets one of the three, and half the time it is -80.0000. The tree's EMV of 105.0000 is the average over many prospects like EKPAN and says nothing about which outcome this well delivers.

## The farm-out beside it

The farm-out has no cost, so its outcomes leave 95.0000, 30.0000 and 0.0000, weighted to 37.7500. It never loses money. It is also not among its own outcomes. The rollback prefers the drill because 105.0000 is larger than 37.7500, and never sees a half chance of losing 80.0000 on one side and no chance of loss on the other. The engine is risk neutral: two branches with the same EMV are the same to it however different their outcomes.

## What the Builder prints

The Decision Tree Builder's Optimal EMV card shows the root EMV, and on the EKPAN tree its drawing labels the drill chance node EMV 160, the value before the drill cost. Neither is money the owner can receive, and no card shows the chance of loss or the worst outcome. Those are worked by hand.

## The mistake

The careful mistake is reporting the EKPAN tree's EMV as a forecast: "drilling EKPAN will make 105.0000 million USD." It will not, in any outcome. The worse version budgets on it, sizing a programme or a loan on 105.0000 when half the time the well leaves -80.0000. The subtler version compares the EMV with an outcome, saying that the marginal find at 115.0000 is a little above expectation, as if the EMV were a middle case. It is a weighted average, pulled up by a 365.0000 success, and it need not sit near any outcome.

## What it refuses

The rollback reports no distribution, chance of loss or worst case for any branch, and the tree engine cannot be asked for one. It returns values and best branches.

## Exercise

List the money each EKPAN tree drill outcome leaves after the drill cost, with its probability, and weight them back to the branch value. State the chance of losing money on the drill branch and on the farm-out branch. Then rewrite "drilling EKPAN will make 105.0000 million USD" as a sentence that is true.
