# The sign of the skin inverts

Not a precision problem. The opposite conclusion.

{{panel:wt-buildup-explorer}}

## The result

The well has a planted skin of plus 6.5. It is damaged.

Fit the semilog line through all forty buildup points and the analysis reports a skin of minus 2.6837412661474804. That says the well is stimulated: performing better than an undamaged well, nothing to fix.

The data are correct. The fit is a proper least squares. The r squared is 0.9004033647584739, which looks like a reasonable correlation. And the answer is not merely imprecise, it is the reverse of the truth on the one question the test was run to settle.

## The mechanism

Work through it in the order the arithmetic runs.

The early points are storage-affected and steeper than radial flow. Including them tilts the fitted line, so the slope m comes out much too large: 79.08878233809047 instead of the 21.520588235294117 the planted permeability implies.

A large slope gives a small permeability, so k comes out at 23.12907021605519 mD instead of 85.

Now look at the skin formula:

    S = 1.1513 [ (p1hr - p_wf)/m - log10( k / (phi mu ct rw^2) ) + 3.2275 ]

The first term has m in the denominator, so an inflated slope shrinks it. The second term has k inside a logarithm with a minus sign in front, so a smaller k makes that term less negative, which also pulls the skin down. Both effects push the same way.

A tilted line therefore produces a small permeability AND a small skin, together, and on this well the combination is enough to carry the skin across zero.

## Why the two errors do not warn you

If the two errors had opposite signs, the result would look inconsistent and somebody would check. Because they reinforce, the answer is internally coherent: a modest reservoir with a well that is doing fine in it. That is a perfectly plausible reservoir description. Nothing about it invites suspicion.

This is the general shape of the most dangerous errors in interpretation. They are not the ones that produce absurd numbers; those get caught. They are the ones that produce a consistent, plausible, wrong picture.

## What it would cost

Two engineers analyse this buildup. One fits everything, one fits the late data.

The first reports 23 mD and a stimulated well. The conclusion is that the reservoir is poorer than mapped and the completions are fine, so the field needs more wells and no interventions.

The second reports a good reservoir and a well spending a large fraction of its drawdown crossing damage. The conclusion is that the completions need work and the well count may be right.

The first engineer's report leads to capital spent drilling and to a well that keeps paying its damage penalty for the life of the field.

## The tell

There is one, and it is available even without the derivative.

A skin of minus 2.7 on a well with no fracture and no acid job is physically odd. Negative skins have causes: a hydraulic fracture, a successful stimulation, a natural fracture intersected, a deviated well, or a thickness used in the analysis that was smaller than the interval actually flowing. If none of those apply, a negative skin is a reason to go back to the window rather than a result to report.

Asking "what would have made this well stimulated?" is a thirty-second check that catches this error most of the time.

## The misconception to avoid

"The skin is imprecise, but its sign is reliable." Nothing in the arithmetic protects the sign. The skin is a difference of two terms of similar size, and both of them move with the window. A quantity whose value can move from minus 2.7 to plus 6 as the window narrows has no reliable sign until the window is justified.

## Exercise

Take the skin formula and the numbers for the widest window: m = 79.08878233809047 psi per cycle and k = 23.12907021605519 mD, with the reservoir properties from module 1.

Compute the middle logarithmic term for that permeability and for 85 mD. State how much of the skin difference between the two windows comes from the logarithmic term alone, and how much must therefore come from the first term.
