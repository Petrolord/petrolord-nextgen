# When inverse Gassmann refuses

The engine that computes the dry frame throws an error rather than returning a number when its inputs are inconsistent. This lesson is about when that happens and what it is telling you.

## The two guards

The dry frame must be positive. A negative or zero bulk modulus is not a rock, and the inverse relation can produce one when the inputs do not describe a physically possible rock.

The dry frame must be below the mineral modulus. A frame stiffer than the mineral it is made of is impossible, since removing material and leaving pores can only soften.

The engine checks both and refuses to continue if either fails. That refusal is deliberate: a wrong dry frame propagates silently into a velocity that looks plausible, and a wrong velocity is worse than no velocity.

## What sets one of them off

The common cause is a mismatch between the porosity and the log.

Suppose the true porosity is 0.25 but the petrophysical model says 0.10. The inverse relation is then told to attribute a large observed stiffness to a rock with very little fluid in it, so the frame has to be stiff to account for it. Push that far enough and the required frame exceeds the mineral modulus, and the calculation refuses.

The same thing happens from the other side. Too high an assumed porosity with a soft log can drive the computed frame negative.

A third cause is a fluid modulus that does not match the zone. Running a substitution with a brine modulus on an interval that was actually logged with gas in the pores means the equation is asked to remove far more fluid stiffness than was ever there.

## Why the refusal is useful

Because the failure is diagnostic rather than random.

An error at this step says that at least one of the four inputs is wrong, and usually says which. If the frame comes out above the mineral modulus, the porosity is probably too low or the log is reading a stiffer rock than the model describes. If it comes out negative, the porosity is probably too high.

Compare that with the alternative. An implementation that returned a silent NaN, or clipped the answer to a plausible range, would let the study continue and produce a substituted velocity that nobody could trace back to the bad input.

## The limits Gassmann itself carries

Even when the arithmetic succeeds, the relation rests on assumptions that can fail without any error being raised, and those are the dangerous cases.

The pore space must be connected, so that fluid pressure can equilibrate. Isolated vuggy porosity in a carbonate breaks that.

The rock must be isotropic. A strongly laminated shaly sand is not, and Gassmann applied to it gives an answer with no error message attached.

The fluid must not react with the frame. Some clays soften on contact with fresh water, which changes the frame itself and puts the whole method outside its own terms.

And the loading must be slow relative to fluid equilibration, which is the low frequency assumption from the last lesson.

None of those produce an exception. They produce a number that is quietly wrong, which is why knowing the assumptions matters more than knowing the equation.

## Worked example

Find where the guard actually fires for this rock, by sweeping the assumed porosity and watching the recovered frame.

| $\phi$ | $K_{dry}$ (GPa) |
| --- | --- |
| 0.14 | 0.026839408158251688 |
| 0.15 | 1.3606230814994766 |
| 0.20 | 5.356003950985403 |
| 0.25 | 7.350343061720982 |
| 0.30 | 8.545876262672467 |
| 0.40 | 9.911218279431846 |
| 0.50 | 10.66928959955524 |

The frame rises with porosity, and it never comes anywhere near the 37 GPa mineral modulus at the top end. At a porosity of 0.95 it is still only 12.0 GPa.

The guard fires at the other end. Below a porosity of about 0.14 the calculation refuses, with the message that the dry frame must be below the mineral modulus. At 0.13 and lower, the equation is being asked to explain 13.32 GPa of observed stiffness in a rock with almost no fluid in it, and the only frame that could do that is stiffer than the mineral itself.

Two things are worth taking from that. The failure mode for this rock is an assumed porosity that is too LOW, not too high, which is the opposite of the intuition that a high porosity is the risky assumption. And the frame is nearly zero at a porosity of 0.14, meaning that just below the guard the answer is already meaningless well before the exception arrives. An error is the last warning you get, not the first.

## Exercise

An inverse Gassmann run returns an error saying the dry frame modulus is not below the mineral modulus. List the three inputs you would check, in order.

Self check: check the porosity first, since it is the most leveraged and the most likely to be wrong, and for this rock the error means the assumed porosity is too LOW rather than too high; then the fluid modulus, in case the zone was logged with a different fluid than the one assumed; then the mineral modulus, in case the lithology model is describing a stiffer mineral than the rock actually contains. The saturated modulus from the log is worth checking last, since it is the closest to a measurement.
