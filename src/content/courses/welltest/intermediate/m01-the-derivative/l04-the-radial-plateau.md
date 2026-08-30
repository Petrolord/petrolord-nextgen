# The radial plateau

The flat stretch, its height, and how to read a permeability off it without fitting anything.

{{panel:wt-diagnostic-explorer}}

## The plateau

During infinite-acting radial flow the Bourdet derivative is constant at

    70.6 q B mu / (k h)      psi

For the buildup in this course at the planted 85 mD, that is 9.344117647058821 psi.

Two facts follow, and they are the reason the derivative plot is the primary diagnostic.

**Where the derivative is flat, radial flow is happening.** That is the window justification the Associate tier could not produce.

**How high the flat part sits is the permeability.** No line fitting, no window choice, no least squares. Read the height, divide it into 70.6 q B mu / h, and you have k.

## Reading it in practice

The plateau is read as an average over the flat stretch rather than off a single point, because individual derivative values carry the noise of two differences.

The engine gives you the raw series and it is the caller's job to average. In this course the convention is stated wherever it matters: the mean derivative over the points inside a named window.

On the buildup, differentiated against Agarwal equivalent time with L = 0.1, the plateau is taken over the twelve points at an equivalent time of 5 hours or more. That value is a graded capstone field and the panel reports it.

## Why the plateau is above the theoretical value

The measured plateau on this buildup sits slightly ABOVE 9.344117647058821 psi.

The reason is the same one that made the Associate tier's permeability come out low: the transition out of wellbore storage has not entirely finished. The derivative approaches the plateau from above, because storage-affected data have a higher derivative than radial flow, and by the end of the test it has not quite arrived.

So a permeability read off the plateau is slightly LOW, in the same direction and for the same reason as the semilog answer. The two methods share the bias because they share the cause.

They do not share the magnitude. The derivative plateau is a local reading over the last stretch, while the semilog line is a fit that spans whatever window you gave it, so the plateau is less affected by whatever is going on earlier. This is the derivative's second practical advantage: it is a more local estimate.

## The consistency check

Because the plateau and the semilog slope are two independent readings of the same quantity, they can be checked against each other:

    plateau should be 70.6/162.6 = 0.4342 times the slope in psi per cycle

If they disagree by more than a few percent, one of two things is true: the semilog window included data that were not radial, or the derivative was over-smoothed. Both are worth finding before the result is reported, and this is a five-second check that almost nobody runs.

## When there is no plateau

Sometimes there is not one, and the derivative plot says so plainly.

A test stopped before storage died has no flat stretch at all. A fractured well in linear flow for the whole test has a half-slope line and no plateau. A well in a channel goes from storage straight into linear flow.

In each of those cases, the correct answer to "what is the permeability" is that this test does not determine it. That is a real and defensible result, and it is far more useful than a semilog line fitted to a stretch that happened to look straight.

## The misconception to avoid

"There is always a radial plateau somewhere." There is not. Radial flow requires that the disturbance has left the wellbore and the well's own geometry behind, and has not yet reached anything. Some tests never satisfy both at once, and the Professional tier's module 4 has a fixture where radial flow occupies a quarter of a decade at the very end of a test that ran for three hundred hours.

## Exercise

Open the panel on the buildup and read the derivative plateau. Then open it on the drawdown and read that plateau.

Both are the same well and the same rock. State the two values, say which is closer to 9.344117647058821 psi, and explain the difference in terms of what each test had to get past before radial flow began.
