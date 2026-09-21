# One step is not enough

A coefficient is a slope. A finite pressure drop is therefore an integration along that slope, and multiplying one coefficient by a whole pressure drop is the crudest possible way of doing it.

{{panel:fc-coldend-explorer}}

## What a single multiplication assumes

Take the coefficient at the inlet, multiply it by the pressure drop, subtract the result from the inlet temperature. That is one rectangle under a curve, drawn at the left-hand edge. It assumes the slope holds all the way down.

It does not hold. The coefficient depends on the pressure and on the temperature, and the march is changing both of them at every step. Along the AGBADA let-down from 1180.000000 psia to 640.000000 psia the coefficient at the inlet is 0.061607962 and the coefficient at the last half step is 0.071833233. A single rectangle drawn at the first of those cannot be the area under a curve that ends at the second.

## Measuring the error rather than asserting it

The module can be asked the same question at any step count, so the size of the error is measurable rather than a matter of opinion. Marched at a step count nothing downstream would ever use, the same routine over the same let-down reports a cooling of 36.316559445 degF. That is the reference every other answer is read against.

| steps | cooling, degF | arrival, degF | cooling over the 20000-step answer |
| --- | --- | --- | --- |
| 1 | 36.271170079 | 59.728829921 | 0.998750174391 |
| 2 | 36.306809467 | 59.693190533 | 0.999731528034 |
| 20 | 36.316483434 | 59.683516566 | 0.999997906978 |

A single step gives 36.271170079 degF of cooling and an arrival of 59.728829921 degF. Two steps give 36.306809467 and 59.693190533. The module's default of twenty gives 36.316483434 degF of cooling and an arrival of 59.683516566 degF.

## Why the single step is closer than you expect

Read the last column. The one-step answer is 0.998750174391 of the reference, which is already close, and that is worth being honest about. The single step is not wildly wrong on this let-down. It is simply wrong by an amount nobody measured, and an error nobody measured is the one that shows up on a different stream at a different pressure with a different size.

The whole argument for marching is that the error becomes a thing you can quote. Having quoted it, you can also decide that one step is enough for a screening pass, which is a legitimate decision made with evidence rather than an assumption made without it.

## The habit this sets up

Two questions follow a marched answer and neither is optional. The first is how the step was taken, because a step evaluated at the start of an interval and a step evaluated at its middle converge at different rates. The second is how many steps were taken, because the answer is only as good as that count makes it. The next two lessons take those in order.

## Exercise

Record the cooling and the arrival temperature at one step, at two steps and at twenty steps, and the reference cooling the converged march reports. Record the ratio the lab prints for each of those three against the reference. Then say, in one sentence, what a single multiplication of a coefficient by a pressure drop assumes about the coefficient.
