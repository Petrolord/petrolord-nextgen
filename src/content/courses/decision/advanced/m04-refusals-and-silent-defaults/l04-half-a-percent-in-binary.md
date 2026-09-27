# Half a percent in binary

The implied-priors check calls typed indicator numbers consistent when every implied outcome chance sits within 0.005 of the stated one. At exactly 0.005 the answer depends on how the comparison treats the binary residue of storing 0.305, and the check adds a 1e-12 allowance for it.

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

In decimal, 0.305 less 0.3 is 0.005. In binary floating point it evaluates to 0.0050000000000000044, above 0.005 by 4.3e-18. Compared against 0.005 alone, justInsideTolerance would read consistent false, although its typed decimals sit exactly on the line.

The check compares every delta against 0.005 plus a 1e-12 representation allowance, and the case reads consistent true. The allowance is sized between two scales. Binary residue is tiny: the consistentFromBayes delta of 1.110223e-16 and EKPAN typed at full precision, 5.551115e-17, are both residue on inputs that agree perfectly, and the overshoot at 0.305 is 4.3e-18. A real disagreement of any size worth arguing about is many orders larger. The allowance absorbs the first and never the second: justOutsideTolerance, at 6.000000e-3, is still false.

## What it changes in the Analyzer

The Analyzer runs this check before valuing information, so the allowance is the difference between a value and no value:

| published case | implied | consistent | gross voi | netVoi card | evpi card |
| --- | --- | --- | --- | --- | --- |
| consistentAtHalfPercent | 0.305000 / 0.695000 | true | 34.75 | 24.75 | 63.00 |
| withheldPastHalfPercent | 0.306000 / 0.694000 | false | withheld | withheld | 63.00 |

At half a percent the Analyzer draws the tree, root emv 39.7500, and prints an emvWithInfo card of 39.75. At an implied 0.306000, the value of information is withheld. Unguarded, the withheld case gives a gross voi of 35.10, a number built on chances that cannot all be true.

## The same allowance on the rollback

The same 1e-12 allowance guards the rollback: a chance node compares |sum - 1| against 1e-6 plus 1e-12, so three thirds typed as 0.333333, summing to 0.999999, are accepted although their binary sum misses 1 by a hair more than the tolerance. Both boundaries in the engine are inclusive at their edge, and both refuse anything past it: thirds typed as 0.33333 are refused.

## The mistake

The careful mistake is reading the allowance as a wider threshold. It moves the line by 1e-12 and nothing more: 0.306000 against a stated 0.3 is inconsistent with or without the allowance. The opposite mistake is trusting a boundary result without asking how the comparison is made. A threshold written as "within half a percent" is only as inclusive as the arithmetic under it.

## Exercise

Write the binary value of 0.305 less 0.3, the amount by which it exceeds 0.005, and the allowance the check adds. Then say what the Analyzer reports for consistentAtHalfPercent and withheldPastHalfPercent, and what justInsideTolerance's check would report compared against 0.005 alone.
