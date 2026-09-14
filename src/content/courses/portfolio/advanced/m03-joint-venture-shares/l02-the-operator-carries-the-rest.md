# The operator carries the rest

The operator's share is never typed in. The engine computes it as 100 percent less the sum of the partner interests, so the operator absorbs every gap and every excess in the list.

{{panel:ec-governance-explorer}}

## The residual

On OFON-1 the partners hold 40.0000, 22.5000 and 12.5000 percent, a partnerTotal of 75.0000. The operator share is 100 less 75.0000, which is 25.0000 percent. Against the budget of 27050000 that is 6762500; against the actuals to date of 15090000 it is 3772500. The four percents, 40.0000, 22.5000, 12.5000 and 25.0000, add to 100 only because the operator's figure was computed to make them add.

The operator is the party that runs the AFE and pays the contractors, so it is the natural place for a residual to land. It is also the place a mistake in the partner list lands without anyone typing a wrong number for the operator.

## Three published splits

| case | cost | partner interests | operator share | operator amount | valid |
| --- | --- | --- | --- | --- | --- |
| a 10 percent shortfall | 1000.00 | 10 | 90.0000 | 900.00 | true |
| no partners | 500.00 | none | 100.0000 | 500.00 | true |
| 70 and 45 | 1000.00 | 70, 45 | -15.0000 | -150.00 | false |

With one partner at 10 percent, the operator carries 90.0000 percent, 900.00 of a cost of 1000.00, and the split is valid. With no partners, the operator carries 100.0000 percent and all 500.00. With partners at 70 and 45 the residual goes negative, and only then does valid turn false.

## What valid true means

valid true means the operator's residual is not negative and no partner's interest is negative. It does not mean the split is right. A partner list that sums to less than the whole is exactly what a forgotten partner looks like, and the engine cannot tell the difference between an operator who really holds 90.0000 percent and a partner nobody entered.

## The mistake

The mistake is trusting valid true on a shortfall. Suppose Mfem Resources were never entered on OFON-1. The operator's residual would silently absorb Mfem's 12.5000 percent, the split would still read valid true with no note, and the operator would carry Mfem's share of every invoice until someone reconciled the joint operating agreement by hand. Nothing in the output would look wrong.

The check is outside the engine: before billing, compare the operator's residual with the operator's own interest in the agreement. On OFON-1 they should both read 25.0000 percent.

## What it refuses

There is no field for the operator's own interest, so the engine has nothing to compare the residual against. It cannot warn that an operator share of 90.0000 percent is implausible, and it cannot distinguish a sole-risk operator from an incomplete list. The residual is arithmetic, and the judgement about whether it is true belongs to whoever reads it.

## Exercise

Give OFON-1's operator share as a percent and as a share of the budget and of the actuals to date, showing the residual. Then explain why the published 10 percent shortfall case returns valid true, and describe the check that would catch a partner left out of the list.
