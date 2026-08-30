# Two extremes, one band

Turning two inequalities into a range of acceptable landings.

{{panel:cd-spaceout-explorer}}

## The two conditions

The contraction case needs the insertion depth to be at least its magnitude plus the margin. That is a lower bound on the landing.

The elongation case needs the bore below the seals to be at least its magnitude plus the margin, which is an upper bound on the landing.

## The band

Between those two bounds, both conditions hold. That interval is the band.

Its lower edge is the contraction requirement. Its upper edge is the bore length less the elongation requirement. Its width is the bore length less the sum of the two requirements.

## When it is empty

When the sum of the two requirements exceeds the bore length. Then the lower bound is above the upper bound and no landing satisfies both.

That is a hardware problem and not a landing problem, and the only fixes are a longer bore, a smaller margin, or a design case list that does not include one of the extremes.

## Finding it numerically

You could write the two inequalities down and solve them, and for this model that is exact.

The engine finds it by bisection instead, on the pass or fail predicate at each end. That is slower and it has one advantage worth having: it does not assume the analytic form. If the space out rules ever grew a nonlinearity, the bisection would still find the edges and the closed form would quietly be wrong.

## Its middle

The midpoint of the band is the landing equally far from both failures. It is not the midpoint of the bore unless the two cases happen to be equal.

That is the recommended landing in the absence of the arguments from the previous module.

## What the band tells you beyond the landing

Its width is the tolerance on execution. A band a metre wide means the space out can be half a metre out in either direction and still be acceptable. A band ten centimetres wide means the pup joint selection has to be right.

That is a useful thing to know before the string goes in the hole.

## Exercise

Write down the two inequalities and derive the two edges of the band.

Derive the width in one line and say what it depends on.

Then say what an empty band means and list the three ways to fix it.
