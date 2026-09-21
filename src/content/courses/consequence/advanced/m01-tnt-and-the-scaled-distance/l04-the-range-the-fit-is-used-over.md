# The range the fit is used over

{{panel:cq-harm}}

Every curve fit has a span of data behind it and a span where it is merely arithmetic. The Kinney and Graham fit will return a number for any positive Z you type, so the engine has to decide where it stops trusting that number. This lesson is about that decision, who made it, and what the engine says when you step outside it.

## The span, and its label

The engine exports the span as `KINNEY_GRAHAM_Z_RANGE`, 0.05 to 40. Its basis carries the range, verbatim: "Z in [0.05, 40] m/kg^(1/3) (judgement; see findings)".

The word JUDGEMENT is there on purpose. The engine's validation record says the sources it read print no range for the Kinney and Graham fit itself. The span is borrowed from the Kingery-Bulmash compilation, a different set of blast curves that does state one. So the lower and upper limits are a reasoned choice by the engine's authors, and a course that teaches the fit has to teach that its edges are chosen. A learner who quotes an overpressure near either edge should know the limit beside it is a judgement with a named origin.

## Where the edges fall for BONGA

For BONGA's 500 kg of TNT the farthest tabled distance, 300 m, gives Z of 37.797631 and an overpressure of 2247.931733 Pa. That is inside the span, close to its far edge. At the edge itself, Z of 40, the fit gives a ratio of 0.020934, which is 2121.136283 Pa. Beyond it the engine returns no overpressure.

The near edge, Z of 0.05, is enforced the same way, so a target very close to the charge gets no figure either.

## The refusal

A scaled distance outside the span is refused, and the refusal names its field:

> scaledDistanceMKg13: Z lies outside 0.05 to 40 m/kg^(1/3), the range this fit is used over

The inverse carries its own refusal, for an overpressure the fit cannot give anywhere inside the span:

> overpressurePa: lies outside the overpressures the fit gives over Z = 0.05 to 40 m/kg^(1/3)

Neither refusal carries a number. The engine declines to extrapolate and tells you which input to change. It never hands back a figure from outside the span with a warning attached. The Briggs sigmas behave differently, returning a figure with a warning outside their usual distances.

## Exercise

On the harm panel's blast view, set the TNT mass to 500 kg and raise the distance from 300 m in steps until the engine refuses. Record the last distance that returned an overpressure, the field the refusal names, and the scaled distance at which you crossed the edge. Then draft one sentence for a consequence note that states the range the fit was used over and says it is a judgement borrowed from another compilation.
