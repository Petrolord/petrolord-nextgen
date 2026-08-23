# Linear Vsh for shaly-sand work

In the Associate course you learned that the linear Vsh transform is the conservative upper bound and that Larionov tertiary is the realistic choice for young clastic sections. Then the beginner workflow used Larionov throughout. The Professional workflow now does something that looks like a step backwards: it switches to the linear transform,

$$V_{sh} = IGR = \frac{GR - 20}{120 - 20}$$

clamped to the range 0 to 1. This lesson explains why that switch is deliberate, and why it is the standard practice when shale volume feeds a saturation equation.

## Two reasons for going linear

The first reason is historical calibration. The shaly-sand saturation models you will meet in module five, Simandoux from 1963 and the Poupon-Leveaux Indonesia equation from 1971, were developed and calibrated in an era when the linear gamma ray index was the routine shale-volume estimate. The empirical behaviour of these equations, and decades of accumulated experience with what their outputs mean, rests on being fed a conservative Vsh. Feeding them an aggressively corrected Larionov volume gives clay less weight than the calibrations assumed, and quietly weakens the correction the equations exist to make.

The second reason is the direction of safety. In the beginner workflow, Vsh was a gatekeeper: it flagged samples as shale and excluded them through the cutoff. Overstating clay there cost you net pay, so the realistic Larionov correction protected value. In the shaly-sand workflow, Vsh has the opposite job: it is a correction term that removes clay conductivity from the resistivity signal before saturation is computed. Understating clay there means under-correcting, which leaves Archie's error partly in place. If you must err, err by giving the correction slightly too much clay to work with. The linear transform is exactly that deliberate upper bound.

Note what is conserved through the switch: the anchors. Clean sand is still 20 API and pure shale is still 120 API. Only the curve between the ends changes.

## The clamp

The linear formula can leave the 0 to 1 range whenever the gamma ray wanders outside the anchors, and on real logs it does. A very clean streak reading 15 API gives a raw index of $(15 - 20)/100 = -0.05$, and a hot shale at 130 API gives 1.10. Negative shale volume and shale volume above one are both physically meaningless, so the workflow clamps: anything below 0 becomes 0, anything above 1 becomes 1. The engine applies the clamp automatically, but you should understand it as an interpretation statement: readings beyond the anchors carry no additional information about clay volume beyond "clean" or "shale".

## Worked example

Run the transform at the three reference depths from the previous lesson.

At 2020 m, mid SAND_A, GR reads 20 API:

1. Index: $(20 - 20)/(120 - 20) = 0/100 = 0$.
2. Clamp: already in range.
3. $V_{sh} = 0.0000$. The sample is treated as perfectly clean, and every saturation model in module five will therefore return the identical Archie answer here.

At 2000 m, in the shale, GR reads 120 API:

1. Index: $(120 - 20)/100 = 1.0000$.
2. Clamp: already in range.
3. $V_{sh} = 1.0000$. Pure shale.

Compare Larionov tertiary at the same two points: at IGR 0 it returns 0, and at IGR 1 it returns $0.083 \times (2^{3.7} - 1) = 0.996$, which is 1 within the precision of the empirical constant. The two transforms agree at both ends. The disagreement lives in the middle: at IGR 0.5, the linear transform reports $V_{sh} = 0.50$ while Larionov tertiary reports 0.2162, less than half. Every mid-range sample in the well carries roughly this factor-of-two difference between the two conventions, which is why a workflow must declare its transform and stick to it.

## What this means downstream

Because the typewell's target sands are clean, with GR sitting at or near the 20 API anchor through most of SAND_A, the practical effect of the switch is smaller than the factor of two suggests. The SAND_A mean linear Vsh works out to about 0.05 over the gross interval. But the effect is not zero: the few slightly shaly samples near the zone edges receive a larger clay correction under the linear convention, and you will see the consequence in module six, where the choice of saturation model moves one marginal sample across the pay cutoff and changes booked net thickness by half a metre. Small decisions propagate.

Keep the division of labour clear in your head from this point on. Larionov tertiary remains the right answer when the question is "how much clay is really in this rock". The linear index is the right input when the question is "how much conductivity should the saturation equation attribute to clay". Same log, same anchors, different jobs.

## Exercise

Compute the linear $V_{sh}$ for GR readings of 45, 70 and 95 API using the typewell anchors, then compute Larionov tertiary for the same three indices and take the difference. As a self-check: the linear values are 0.25, 0.50 and 0.75; the Larionov values are 0.0746, 0.2162 and 0.4852; the differences are 0.1754, 0.2838 and 0.2648. Notice where the gap is widest. State in one sentence why a saturation equation calibrated for linear Vsh would under-correct if you fed it the Larionov values instead.
