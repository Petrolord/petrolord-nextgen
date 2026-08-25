# The polarity crossover

The brine reflection changes sign partway out the gather. This lesson locates that crossing and shows why it is worth locating precisely.

## The three answers

| method | crossing angle |
| --- | --- |
| Shuey, two term | 26.92 degrees |
| Shuey, three term | 29.293564554985373 degrees |
| exact Zoeppritz | 29.870555217606523 degrees |

Three methods, three answers, spread over three degrees.

## Why the spread is large here

Because the reflection is small near the crossing. That is definitional: the crossing is where it is zero.

A method that is accurate to a few thousandths in reflection coefficient is accurate to a few thousandths everywhere, including where the coefficient itself is a few thousandths. Near the crossing the relative error is therefore enormous, and the angle at which the curve reaches zero is correspondingly uncertain.

This is a general property of zero crossings and it applies to any quantity located by one.

## What the crossing is used for

Two things, and both are sensitive to it.

Stack design. If a class I reflection changes polarity at 29 degrees, a full offset stack averages positive and negative contributions and partially cancels. Stacking only the offsets inside the crossing preserves the amplitude. Getting the crossing wrong by three degrees means including or excluding a range of offsets that carry the opposite sign.

Interpretation of the gather. An interpreter looking at a class I gather sees a peak at the near offsets and a trough at the far, and reads the transition. Where that transition sits is a direct observation that can be compared against a model, and comparing it needs the model's own value to be trustworthy.

## Why the exact solution should be used for this

The capstone asks for the exact Zoeppritz value at 30 degrees rather than the Shuey value, and the crossing is the reason the distinction is worth making.

At 30 degrees the brine reflection is -0.001164 by Shuey and -0.000190 by the exact solution. Both are small. Their ratio is six, and their difference in sign is nothing, because they agree in sign.

But a report that said the brine case turns negative before 30 degrees would be right under Shuey and wrong under the exact solution by a fraction of a degree, and any statement about which offsets carry which polarity inherits that.

## Reading it off the panel

The red vertical line marks the crossing of the Shuey curve, and the solid exact curve crosses slightly to its right.

{{panel:rp-avo-explorer}}

Look closely at where the blue solid and blue dashed lines meet the zero line. They are visibly apart, and both are near 30 degrees. That small horizontal gap is the difference between an approximate theory and an exact one, drawn at the one place on the chart where it is easiest to see.

Notice also that the gas curve never crosses. Its crossing tile reads none, because a class III reflection stays negative over the whole recorded range.

## Worked example

Work out how much of a stacked amplitude a full offset stack loses on the brine case, relative to stacking only inside the crossing.

Approximate the stack as an average of the reflection over the angle range. Using the exact curve at 0, 10, 20, 30 and 40 degrees: 0.034457, 0.029501, 0.016174, -0.000190 and -0.006588.

Averaging the first three, which is roughly a stack to 20 degrees, gives 0.026711.

Averaging all five, roughly a stack to 40 degrees, gives 0.014671.

So the full stack is about 55 percent of the limited one. Half the amplitude is lost to cancellation, and an interpreter comparing a full stack against a near stack would see exactly that.

That is a good reason to model the crossing before designing the stack, and a good reason to want the crossing angle to better than three degrees.

## Exercise

State why a zero crossing is harder to locate accurately than a peak, and what that implies for using one as a calibration point.

Self check: near a zero crossing the quantity itself is near zero, so a fixed absolute error in the method becomes an unbounded relative error, and the angle at which the curve reaches zero moves a long way for a small change in the curve. It implies that a crossing should be located with the exact solution rather than an approximation, and that a crossing observed in data carries a wide uncertainty even when the data are good.
