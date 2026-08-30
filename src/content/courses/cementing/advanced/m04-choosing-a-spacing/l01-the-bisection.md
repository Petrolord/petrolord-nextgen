# The bisection

The largest spacing that still reaches the target, found rather than guessed.

{{panel:cm-standoff-explorer}}

## The question

Given a centralizer, a casing, a hole and a trajectory, what is the WIDEST spacing at which the minimum standoff anywhere on the string still reaches 67 percent?

Wider is cheaper, so the answer is the design.

## The search

    if (minStandoff at 30 m >= target) return 30
    if (minStandoff at 3 m  <  target) return null
    then bisect between 3 and 30, 40 times

Two guards and forty halvings.

## The two guards, which are the interesting part

**The upper guard.** If even the widest spacing in the search range already meets the target, return the widest. There is nothing to optimise: the well is easy.

**The lower guard.** If the TIGHTEST spacing in the range still misses the target, return NULL.

Null means not achievable. Not a very small number, not the tightest spacing, not a best effort. Null.

## Why null and not the tightest spacing

Because those are different answers and a reader has to be able to tell them apart.

"Run them at 3 m" is a design. "This cannot be centralized to the API target with this device in this hole" is a different conversation, about a different centralizer or a different hole size or accepting a lower standoff across a stated interval.

Returning 3 m for both would hide the second case inside the first, and the reader would run 3 m centralizers and still fail.

## The monotonicity the bisection assumes

That the minimum standoff falls as the spacing rises. Both terms do: the deflection is linear in the spacing and the sag is quartic, and both reduce the standoff.

So the function is monotone and the bisection is valid. That is worth checking rather than assuming, and the spacing sweep in module 3 shows it directly.

## The answers on this course's wells

    slant       13.05523892558449 m
    horizontal  11.187558579905271 m

Both achievable, and neither at the guard.

## Forty iterations

The range is 27 m wide, so forty halvings resolve it to about 2.5 times ten to the minus eleven metres. Far beyond the precision of anything else in the calculation.

That is fine. The bisection costs nothing and the alternative is quoting an interval.

## Exercise

The bisection runs 40 times over a range of 27 m.

Compute the final interval width, and then say how many iterations would have been enough to resolve the answer to a millimetre.
