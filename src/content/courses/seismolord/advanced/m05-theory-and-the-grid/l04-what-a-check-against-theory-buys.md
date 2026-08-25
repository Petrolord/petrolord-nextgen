# What a check against theory buys

The capstone could have asked for five numbers instead of six. The sixth, the theoretical tuning thickness, adds no information about the wedge that the other five do not carry. It is there because a measurement without an independent check is an assertion, and this lesson is about what the check is actually doing.

## The two routes to the same quantity

**Route one, the model.** Build 31 reflectivity series, convolve each with a sampled Ricker, search a window on each output trace for its largest absolute value, and take the argmax across the 31 results. Thousands of floating point operations, several design decisions, and one answer: 16 ms.

**Route two, the theory.** Differentiate $(1 - 2u^2)e^{-u^2}$, set the derivative to zero, solve, and convert to time. Half a page of algebra and one answer: 15.5939 ms.

Nothing is shared between the routes except the wavelet's definition. They use different mathematics, they are implemented in different places, and they would fail for different reasons. That is the property that makes their agreement informative.

## What the check would have caught

It is worth being concrete about the failures this comparison detects, because a check that cannot fail is not a check.

**A sign error in the reflection pair.** If the base coefficient were entered as positive, the model's argmax would return 0 ms rather than 16 ms. The theory would immediately disagree and the error would be found before any interpretation was built on it.

**A frequency unit error.** Entering the frequency in radians per second rather than hertz would move the modelled tuning thickness by a factor of $2\pi$. The theoretical value uses the same input, so this particular error would move both together, which is a reminder that a check catches errors in the process rather than errors in the inputs.

**A search window that is too narrow.** If the window did not reach the peak on the thinnest beds, the rising limb would be depressed and the argmax could move. The theory would flag the mismatch.

**A grid too coarse to locate the maximum.** This one the check does not merely detect, it quantifies: the residual disagreement of 0.406 ms is the grid's contribution and nothing else, because every other source of disagreement has been ruled out.

## Agreement is not proof

The two routes agreeing to within one sample means that neither contains an error large enough to move the answer by more than a sample. It does not mean the model is correct in every respect.

The model could still have the wrong reflection coefficients, since the theory does not involve them. It could be using the wrong frequency, since both routes take the same frequency as input. It could be producing traces that are wrong everywhere except at their maxima. A check bounds the errors it is sensitive to, and says nothing about the rest.

The professional habit that follows is to know what each of your checks is sensitive to, and to hold more than one. In this tier the tuning thickness is checked against theory, the isolated amplitude is checked against the reflection coefficient, and the zero at zero thickness is checked against exact cancellation. Together those three pin the model at three unrelated points.

## How to report the pair

Report the measurement and the check as one statement, with the residual named:

> Modelled tuning thickness 16 ms on a 2 ms grid at 25 Hz, against a theoretical Ricker value of 15.59 ms. The 0.41 ms difference is the grid interval and is expected.

Every part of that does work. The measurement is the deliverable. The theory establishes that the model is behaving. The residual is quantified so a reader can see it was not overlooked, and attributed so nobody has to wonder whether it indicates a problem.

Compare it with reporting 16 ms alone. That is not wrong, and it invites two questions the writer already knew the answer to.

## Worked example

A colleague builds a wedge at 45 Hz on a 4 ms grid and reports a tuning thickness of 12 ms. Is the model behaving?

Theory gives $389.8484/45 = 8.66$ ms. The 4 ms grid offers 8 ms and 12 ms as candidates, and 8 ms is much nearer to 8.66 than 12 ms is. A model that picks 12 ms is therefore suspect, and the residual of 3.3 ms, or 39 percent, is far larger than a grid interval can explain when a better candidate exists.

The check has caught something. The likely explanations are a search window too narrow at 45 Hz, or a frequency entered as something other than 45. Either way the wedge should not be used until the disagreement is understood.

## Exercise

State the residual between the modelled and theoretical tuning thicknesses at 40 Hz, express it as a fraction of the sample interval, and say whether it is consistent with the grid being the only cause. Then name one error in the model that this check would not detect.

As a self-check: the residual is $10 - 9.746210 = 0.253790$ ms, which is 13 percent of the 2 ms sample interval, and it is consistent with the grid alone because the theoretical value lies between two available samples and the model chose the nearer of them. An error the check would not detect is a wrong pair of reflection coefficients, since the theoretical tuning thickness does not involve the coefficients at all and would agree just as well if the pair were plus and minus 0.20.
