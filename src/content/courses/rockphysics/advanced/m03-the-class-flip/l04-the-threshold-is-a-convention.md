# The threshold is a convention

The class II band is a range of intercepts, and its width is a number somebody chose. This lesson measures what that choice is worth at Ekene, and it is worth more than the tier's own arithmetic precision.

## The rule

$$|A| \le t \quad \Rightarrow \quad \text{class II}$$

with $t$ conventionally 0.02. That value is documented and widely used and it has no derivation. It reflects a judgement about what counts as a small intercept, made when the classification was introduced.

## What it does to the two Ekene cases

| $t$ | brine class | gas class |
| --- | --- | --- |
| 0.01 | I | III |
| 0.02 | I | III |
| 0.04 | II | III |
| 0.05 | II | III |

The gas case is class III at every threshold. The brine case changes name between 0.02 and 0.04.

Its intercept of 0.03434399848203321 is 1.7171999241016604 times the default threshold, so a modest widening of the convention renames it.

## Why this matters more than it looks

Because the class is what gets communicated.

The whole reason to compute an intercept and a gradient and then reduce them to a Roman numeral is that the numeral travels. It goes into a prospect summary, into a portfolio review, into a conversation with somebody who will never see the coefficients.

If the numeral depends on a convention, the convention travels invisibly with it. Two teams using thresholds of 0.02 and 0.04 will describe the same rock differently and neither will mention why.

## The comparison worth making

This tier has measured several things that move the answer. Set them side by side.

The approximation error between Shuey and exact Zoeppritz at 30 degrees is 0.0021746462042847164, which is about 3.5 percent of the gas intercept.

The class threshold, moved from 0.02 to 0.04, changes the brine case's name entirely.

So a convention with no derivation behind it has a larger effect on the reported result than the difference between an approximate theory and an exact one. That is a common shape in applied science and it is worth noticing when it occurs.

## What to do about it

State the threshold whenever you state a class. One clause.

Report the coefficients alongside the class, always. They are the quantities; the class is a summary of them.

And when a case sits near a boundary, say so. The Ekene brine case is class I under the usual convention and close to class II, and that sentence is more informative than either label alone.

## Reading it off the panel

The threshold is a control for this reason.

{{panel:rp-avo-explorer}}

Step it through 0.01, 0.02, 0.04 and 0.05 and watch the brine class tile change from I to II between the second and third settings while every coefficient tile stays fixed.

That is the lesson in one interaction: the numbers are properties of the rocks, and the name is not.

## Worked example

Work out what intercept would put the brine case exactly on the boundary, and how small a change in the rocks that represents.

The boundary at the default threshold is $A = 0.02$. The brine case is at 0.034344, so the intercept would have to fall by 0.014344.

The intercept is half the sum of the fractional velocity and density contrasts. A fall of 0.014344 means the sum must fall by 0.028688, which could come from the sand's velocity dropping by about 85 m/s, from 3200 to 3115, with everything else held.

Eighty five metres per second is well within the uncertainty of a velocity log calibration, let alone of a model. So the brine case's class is not merely a convention away from changing; it is also a plausible measurement error away.

## Exercise

State what should accompany a class call in a report, and why each item is needed.

Self check: the intercept and gradient themselves, because they are the quantities and the class is only a summary of them; and the threshold used, because the class boundary is a convention rather than a physical limit and different teams use different values. Where a case sits close to a boundary, that should be stated too, since at Ekene the brine case is 1.72 times above the default threshold and moves to class II at 0.04.
