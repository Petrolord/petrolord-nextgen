# The value of a later choice

A choice that can be made later is worth something now, and a tree that leaves it out undervalues every branch that leads to it. OKRIKA's appraisal is worth 87.0000 million USD with the option to sell after a poor result, and 15.6000 without it.

{{panel:ec-tree-explorer}}

## The same appraisal with no sale

Take the appraisal branch and delete both sales, so the company must develop whatever the appraisal says. After a good result the development is still worth 225.0000, because it was already the choice. After a poor result the only branch left is the development at -94.0000.

| appraisal branch | after a good result | after a poor result | branch value | root choice |
| --- | --- | --- | --- | --- |
| with the option to sell | 225.0000 | 25.0000 | 87.0000 | Appraise |
| always develop | 225.0000 | -94.0000 | 15.6000 | Sell now |

By hand: 0.400000 x 225.0000 + 0.600000 x -94.0000 = 33.6000, less the appraisal cost 18.0000 = 15.6000. That branch now loses to Sell now at 48.0000, and the root sells today.

## Where the value lives

The difference, 87.0000 less 15.6000 = 71.4000, is what the option to sell after a poor result is worth inside the appraisal branch. It sits entirely on the poor side, which carries probability 0.600000, because on the good side the sale was never taken and deleting it changes nothing.

Look at the chance node without the sale, 33.6000. It is exactly the value of Develop now, 183.6000 less 150.0000 = 33.6000. An appraisal that cannot change what the company does is the same development, delayed, with 18.0000 added to its bill. The appraisal is worth doing only because a poor result leads somewhere else.

Against its best alternative the full appraisal still wins clearly: 87.0000 less 48.0000 = 39.0000.

## The mistake

The careful mistake is to credit the appraisal with reducing uncertainty. Uncertainty is reduced by the same amount in both trees, and in one of them the appraisal branch is worth 15.6000 and loses. What it earns is the right to act differently on what it learns.

A second error is pruning a branch because it is off the optimal path. Sell after a good appraisal reads false and can go without changing a number. Sell after a poor appraisal reads true and carries 71.4000 of the branch's value. Removing a later choice is safe only where it was never taken.

The third error is quoting 71.4000 as the value of the appraisal. It is the value of the option to sell inside a branch that also pays the appraisal cost.

## What it refuses

The engine values a later choice only if it is drawn. It has no idea that a sale is possible unless a Sell branch exists, and it takes the sale prices as typed: 25.0000 after a poor result, 95.0000 after a good one, 48.0000 today. It does not ask whether a buyer would pay 25.0000 for a discovery just appraised as poor. The rollback is risk neutral, so the option is valued at its expected money and no more.

## Exercise

Roll back OKRIKA's appraisal branch with both sales deleted and confirm 15.6000, and say which root branch wins. Then explain why the chance node without the sale equals the value of Develop now, and state what the option to sell after a poor result is worth inside the appraisal branch.
