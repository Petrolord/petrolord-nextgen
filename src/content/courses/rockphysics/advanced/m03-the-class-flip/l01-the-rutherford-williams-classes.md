# The Rutherford-Williams classes

The classes are a naming scheme for regions of the intercept and gradient plane. They are useful, they are widely used, and they are a convention rather than a physical boundary. This lesson is the scheme itself.

## The original three

Rutherford and Williams introduced three classes in 1989 to describe gas sands.

**Class I** has a large positive intercept and a negative gradient. The sand is harder than the shale above it, so the near offsets show a positive reflection, and the reflection weakens with offset and often changes polarity. These are typically well consolidated sands.

**Class II** has an intercept near zero. The impedances nearly match, so the near offsets show almost nothing, and the response is dominated by the gradient. These are the hardest to see on a stack and the ones AVO was invented for.

**Class III** has a large negative intercept and a negative gradient. The sand is softer than the shale, so the reflection is negative at all offsets and brightens with offset. These are the classic bright spots of unconsolidated young sands.

## The fourth

Castagna and Swan added class IV later: a negative intercept with a positive gradient. The reflection is negative and dims with offset.

Class IV occurs where the sand's shear velocity is not much above the shale's, so the shear term in the gradient is weak and the positive density term wins. It matters because it breaks the rule of thumb that a gas sand brightens with offset, and a class IV gas sand looks, on a gradient, like the opposite of what an interpreter is trained to look for.

The previous module showed how easily a bad shear estimate can move a class III case into class IV, which is why the class exists in this course at all.

## How the engine decides

$$\text{class} = \begin{cases} \mathrm{I} & A > t \\ \mathrm{II} & |A| \le t \\ \mathrm{III} & A < -t, \ B \le 0 \\ \mathrm{IV} & A < -t, \ B > 0 \end{cases}$$

with $t$ a threshold on the intercept, conventionally 0.02.

Everything hinges on that threshold and on the sign of $B$ in the negative intercept region. Nothing hinges on the size of $B$.

## What the scheme is good for

Communication, mostly, and it is good at it. Saying a prospect is class III conveys the expected shape of the gather in one word to anybody who knows the scheme.

It is also a useful check on a forward model. If your model predicts class II for a rock that everything else says is a soft young sand, something is wrong with the model.

## What it is not good for

Quantitative work. The class is a label applied to a two dimensional continuum, and the boundaries are arbitrary lines drawn on it.

Two prospects can be the same class and behave very differently, because a class covers a large region. Two prospects can be different classes and sit a hair apart, on either side of a threshold that somebody chose.

The Ekene brine case is the second kind, and the next three lessons work through it.

## Worked example

Classify the two Ekene cases by hand.

Brine: $A = 0.03434399848203321$, which is greater than 0.02, so class I. The gradient is not consulted.

Gas: $A = -0.06282494068620303$, which is less than -0.02, so the gradient decides. $B = -0.2565633444602355$, which is negative, so class III.

Note the asymmetry in how much information each call used. The brine call used one number and ignored the gradient entirely. The gas call used both.

That is worth remembering when comparing two class calls: they are not equally informed.

## Exercise

A prospect models at $A = -0.05$ and $B = +0.02$. State its class and what its gather would look like.

Self check: the intercept is below -0.02 so the gradient decides, and a positive gradient gives class IV. The gather would show a negative reflection at the near offsets that becomes weaker with offset, which is the opposite of the brightening a class III gas sand shows, and it would be easy to dismiss as not a hydrocarbon response by an interpreter using the class III rule of thumb.
