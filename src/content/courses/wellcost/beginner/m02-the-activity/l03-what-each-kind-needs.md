# What each kind needs

Each kind reads a small set of fields and is completely blind to the rest.

{{panel:wc-time-explorer}}

## The required fields

| Kind | Needs | Rule |
| --- | --- | --- |
| drill | top depth, bottom depth, rate of penetration | bottom must exceed top, rate must exceed zero |
| trip | depth, trip speed | depth at least zero, speed must exceed zero |
| casing | depth, run speed, flat hours | depth at least zero, speed must exceed zero, flat hours at least zero |
| flat | duration hours | duration at least zero |

Miss a required field and the engine names the activity and the field. It does not guess a default.

## The one optional field

Only the casing flat term is optional. Leave it out and the engine treats it as zero, which reduces a casing activity to a bare running calculation. Every other field above must be present and finite.

Note the asymmetry in the depth rules. A trip or a casing run may legitimately be at zero depth and the engine allows it. A drill activity may never have a zero or negative interval, because a drill activity that does not deepen the hole is not a drill activity.

## What each kind ignores

A drill activity ignores any flat hours you attach to it. A trip ignores hole size, string weight, mud weight and whether the hole is vertical or horizontal. A casing activity ignores the depth the hole started from, because it does not move the hole. A flat activity ignores depth and rate entirely.

More importantly, every kind ignores every other activity. There is no interaction term anywhere in the model. The 100 hours of the intermediate hole would be 100 hours whether it were the second activity or the ninth.

## The continuity rule sits outside the formulas

The one place where activities do see each other is the depth check. A drill activity must start at the depth the hole has reached, and that is enforced by the programme walk, not by the duration formula.

So a drill activity can be arithmetically valid and still be rejected, because its arithmetic is fine and its place in the queue is not.

## Exercise

In the panel, delete the rate of penetration from the surface hole activity and record the error.

Then set the casing flat term on the 13-3/8in job to zero and note the new activity duration and the new total.

Finally, list which of the four kinds could be evaluated correctly if you knew nothing at all about the hole depth.
