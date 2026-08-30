# A margin of two thousandths

How close the burst number came to being the reason, and what to do about that.

{{panel:ct-loadcase-explorer}}

## The number

    burst safety factor      1.2123376873879477
    burst warning threshold  1.2100000000000002
    margin                   0.0023376873879474847

Two thousandths. The burst check missed producing the warning by a fifth of a percent.

## Why that matters

Because the previous lesson's conclusion, that the warning came from triaxial and not from burst, rests entirely on those two thousandths.

Move the test pressure from 35000000 Pa to 35100000 and the burst number crosses the threshold as well. Both checks then flag, the verdict is unchanged, and the diagnosis you would give changes completely.

## The general shape of the problem

Any conclusion of the form "X is the reason and Y is not" is only as strong as the gap between X and Y.

Reporting the conclusion without reporting the gap is how a finding that is true of one input set gets remembered as a property of the system.

## So what is the honest statement

On THIS string, at THIS test pressure, with THIS dogleg, the triaxial check is the binding one and the burst check is not, by a fifth of a percent.

The transferable part is the mechanism: a case named after one check can be governed by another, and the triaxial check is the one most likely to do it because it is the only one that sees all three stresses.

The non-transferable part is the specific verdict.

## How to test which part you have

Perturb the input and see what survives.

Take the dogleg to zero: the triaxial number rises above 1.375 and the warning disappears entirely, while the burst number does not move at all. That confirms the bending term was carrying the triaxial result.

Take the test pressure up by a few percent: both numbers fall together and both flag. That confirms they are not independent.

Two perturbations, and now you know which of the two findings is about the string and which is about the numbers.

## The habit

Any time a result depends on an ordering, compute the gap. If the gap is small relative to the uncertainty in the inputs, the ordering is not a finding.

## Exercise

The bending stress at 2 degrees per 30 m contributes to the triaxial number and to nothing else in the report.

Estimate how small the dogleg would have to be for the triaxial safety factor to reach 1.375, and say whether that is a realistic dogleg for a slant well.
