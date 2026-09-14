# Half a percent in binary

The implied-priors check calls typed indicator numbers consistent when every implied outcome chance sits within 0.005 of the stated one. At exactly 0.005 the answer depended, until the EC4-0 repair, on how a computer stores 0.305.

{{panel:ec-judgement-explorer}}

## The check

The implied chance of an outcome is the sum, over the indicators, of the indicator's chance times the outcome's chance given that indicator. The delta is implied less stated. Four published cases on a stated prior of 0.300000 / 0.700000:

| case | implied | deltas | consistent |
| --- | --- | --- | --- |
| consistentFromBayes | 0.300000 / 0.700000 | 0.000000e+0 / 1.110223e-16 | true |
| justInsideTolerance | 0.305000 / 0.695000 | 5.000000e-3 / -5.000000e-3 | true |
| justOutsideTolerance | 0.306000 / 0.694000 | 6.000000e-3 / -6.000000e-3 | false |
| inconsistent | 0.420000 / 0.580000 | 1.200000e-1 / -1.200000e-1 | false |

The threshold is inclusive, so a delta of exactly half a percent is meant to pass.

## Why exactly is not exact

In decimal, 0.305 less 0.3 is 0.005. In binary floating point it evaluates to 0.0050000000000000044, above 0.005 by 4.3e-18. Compared against 0.005 alone, justInsideTolerance would read consistent false. Before the EC4-0 repair the engine made exactly that comparison and called the case inconsistent: finding D1.

The repair compares every delta against 0.005 plus a 1e-12 representation allowance, and the case reads consistent true. The allowance is sized between two scales. Binary residue is tiny: the consistentFromBayes delta of 1.110223e-16 and EKPAN typed at full precision, 5.551115e-17, are both residue on inputs that agree perfectly, and the D1 overshoot is 4.3e-18. A real disagreement of any size worth arguing about is many orders larger. The allowance absorbs the first and never the second: justOutsideTolerance, at 6.000000e-3, is still false.

## What it changes in the Analyzer

The Analyzer runs this check before valuing information, so D1 was the difference between a value and no value:

| published case | implied | consistent | gross voi | netVoi card | evpi card |
| --- | --- | --- | --- | --- | --- |
| consistentAtHalfPercent | 0.305000 / 0.695000 | true | 34.75 | 24.75 | 63.00 |
| withheldPastHalfPercent | 0.306000 / 0.694000 | false | withheld | withheld | 63.00 |

At half a percent the Analyzer now draws the tree, root emv 39.7500, and prints an emvWithInfo card of 39.75. At an implied 0.306000, the value of information is withheld. Before the repair the Analyzer printed a gross voi of 35.10 for the withheld case, a number built on chances that cannot all be true.

## Where no allowance exists

The allowance belongs to the implied-priors check alone. The rollback's chance node test compares a sum against 1e-6 with no allowance, which is why three thirds typed as 0.333333, summing to 0.999999, are refused although their decimal gap is the tolerance itself. Two boundaries in the same engine behave differently at their edge.

## The mistake

The careful mistake is reading the allowance as a wider threshold. It moves the line by 1e-12 and nothing more: 0.306000 against a stated 0.3 is inconsistent before and after the repair. The opposite mistake is trusting a boundary result without asking how the comparison is made. A threshold written as "within half a percent" is only as inclusive as the arithmetic under it.

## Exercise

Write the binary value of 0.305 less 0.3, the amount by which it exceeds 0.005, and the allowance the repaired check adds. Then say what the Analyzer reports for consistentAtHalfPercent and withheldPastHalfPercent, and what it reported for justInsideTolerance's check before EC4-0.
