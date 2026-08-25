# Two errors that do not cancel

The vertical assumption breaks the tie in two distinct places at once, and understanding them separately is what turns last lesson's cautionary tale into transferable judgement about when the assumption is survivable.

## Channel one: the depth error

Assuming vertical converts MD straight to depth, so every metre of hole spent travelling sideways is misbooked as a metre of depth. At W2's picks the overbooking is 53.33656265794434, 88.48374891555864 and 106.05734204436567 m. The channel's size is pure trajectory: it grows monotonically along the hole, at the hold's rate of $1 - \cos 45^\circ$, about 0.293 m of error per metre of hole. It does not depend on the model at all; any consumer of depths, ties, correlation panels, volumetrics, inherits it identically.

## Channel two: the location error

Assuming vertical also reads the surface at the wrong place: the wellhead instead of the landing, 168.4455110683407, 253.2983248107264 and 295.72473168191937 m west of the truth at the three picks. What this channel costs depends on the SURFACE, not the trajectory: it is the surface's own relief between the two locations. For W2's TopA, the clamped surface climbs from 1524 at the wellhead to 1532.42 at the landing: 8.42 m. For BaseB, 1573.0 to 1578.91: 5.91 m. On a flat surface this channel would cost nothing however wrong the location; on a faulted or steep surface it can dominate.

## Why "they might cancel" is a false hope

Write the swing, vertical-assumption residual minus true residual, in terms of the channels: it is the depth overbooking PLUS the surface's rise from head to landing. Cancellation therefore requires the surface to get SHALLOWER toward the landing, by an amount that happens to match the overbooking. On this model neither condition holds anywhere along W2: the surfaces all deepen eastward, so at every pick the channels COMPOUND. TopA: 53.34 plus 8.42 gives a 61.76 m swing. TopB: 88.48 plus 15.20 gives 103.68. BaseB: 106.06 plus 5.91 gives 111.97. Even had the surface sloped the other way, the depth channel scales with sideways TRAVEL while the location channel scales with surface RELIEF across that travel, and no mechanism links the two magnitudes. Counting on cancellation is betting that two unrelated quantities agree, on a model where they do not even have the right signs to try.

The TopA sign flip is the compounding at its most damaging: the overbooked depth pushes the residual up while the true landing sits over deeper surface, so the honest minus 35.76 is buried under enough compounded error to surface as plus 26.

## The transferable rule

Before trusting a vertical assumption, bound both channels. Channel one is bounded by $MD \times (1 - \cos I_{max})$: at 5 degrees of unnoticed deviation over a 2000 m hole, at most 7.6 m; at 15 degrees, 68 m. Channel two is bounded by lateral reach times the steepest surface gradient in play: reach $MD \sin I_{max}$, here 174 m at 5 degrees, times a gradient read off the map. If both bounds are inside the tolerance of the task at hand, the assumption is safe FOR THAT TASK; if either is not, build the trajectory. The golden model's answer for W2 at 45 degrees is unambiguous: nothing about it is inside any tolerance this course uses.

## Worked example

Bound the channels for W3 as if its verticality were merely assumed rather than surveyed, with a worst case of 3 degrees of unnoticed deviation over its 1655 m of hole. Channel one: $1655 \times (1 - \cos 3^\circ) = 1655 \times 0.00137 = 2.27$ m. Channel two: lateral reach $1655 \sin 3^\circ = 86.6$ m; the local TopA relief is roughly 1 m per 100 m (the surface climbs about 8 m over the 800 m from W1 toward W2's landing at this latitude of the map), so about 0.9 m. Both bounds sit below the 5 m band of the small residuals in the table, so W3's ties are robust to survey doubt of this size, and the eastern BaseB story survives: 36 and 37 m residuals cannot be manufactured by 3 degrees of hidden deviation.

## Exercise

Compute both channel bounds for a hypothetical 2500 m well believed vertical within 10 degrees, over a surface with gradients up to 5 m per 100 m. State whether a 12 m residual at its deepest pick could be an artefact of the assumption, and which channel dominates in your bound.
