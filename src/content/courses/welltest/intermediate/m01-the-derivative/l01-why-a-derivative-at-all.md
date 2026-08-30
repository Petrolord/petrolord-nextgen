# Why a derivative at all

The Associate tier ended with a question it could not answer. This is the tool.

## The question

Which points are in the straight line?

The Associate tier's answer was to narrow the window until the reported permeability stopped moving. That works, roughly, and it is what people did for thirty years. It has two defects: it cannot tell you WHY a window is right, and it cannot tell you when there is no radial flow in the test at all.

Both defects come from the same source. On a semilog plot, a gentle bend and a straight line look alike, and the eye is very bad at telling them apart when the total pressure change is large.

## What differentiation does

Take the pressure change and differentiate it with respect to the natural logarithm of time:

    derivative = d(dp) / d(ln t)

During radial flow, dp is linear in ln t. The derivative of a linear function is a constant. So radial flow, which is a sloping line on a semilog plot and a curve on a log-log plot, becomes a FLAT LINE on a log-log plot of the derivative.

Flat is something the eye is extremely good at. A one percent tilt in a horizontal line is visible; a one percent change in the slope of a rising curve is not.

That is the entire argument for the derivative, and it is sufficient.

## The value the flat line takes

The constant is not arbitrary. In radial flow,

    derivative = 70.6 q B mu / (k h)      psi

which is exactly half the semilog slope, because 162.6 is 70.6 times the natural logarithm of 10, near enough, and differentiating a base-ten logarithmic line with respect to a natural logarithm divides by ln 10.

For this reservoir at the planted 85 mD, the radial derivative plateau sits at

    70.6 x 450 x 1.25 x 0.9 / (85 x 45) = 9.344117647058821 psi

So the derivative plot does not merely say WHERE radial flow is. Its height says what the permeability is, independently of any line fitting.

## What else it reveals

Every flow regime has a characteristic behaviour in dp, and differentiating turns each of them into a straight line of a characteristic slope on the log-log derivative plot:

| regime | pressure change goes as | derivative slope |
|---|---|---|
| wellbore storage | t | 1 |
| radial flow | ln t | 0 |
| linear flow | sqrt(t) | 1/2 |
| bilinear flow | t to the quarter | 1/4 |
| closed boundary, late | t | 1 |
| constant-pressure boundary | approaches a constant | falls steeply |

Six regimes, six recognisable shapes, all on one plot. That is why the log-log plot of pressure change and its derivative together is where every modern interpretation starts, and why the rest of this tier is spent reading it.

## What it costs

Differentiation amplifies noise. That is not a small effect: a derivative is a difference of differences, and gauge noise that is invisible on a pressure plot can swamp a derivative completely.

The whole design of the Bourdet derivative, which is the next lesson, is about controlling that amplification without destroying the shape. And the module ends with a demonstration of what a single bad point does when it is not controlled.

## The order of work

The professional order, which this tier follows, is:

1. Prepare the data: decimate, despike, check the rate history.
2. Plot dp and its derivative on log-log axes.
3. Identify the regimes and their boundaries.
4. Choose the analysis window from the regimes, not from a rule of thumb.
5. Run the straight-line analysis on that window.
6. Confirm with a model fit.

The Associate tier did step 5 alone. Steps 2 to 4 are this tier. Step 6 is the Expert tier.

## The misconception to avoid

"The derivative is a refinement." It is the diagnosis. The straight-line analysis is the measurement, and a measurement without a diagnosis is a number attached to an unidentified regime. Every failure in the Associate tier was a diagnosis failure, not an arithmetic one.

## Exercise

The radial derivative plateau is 70.6 q B mu / (k h) and the semilog slope is 162.6 q B mu / (k h).

Compute the ratio and check it against 1/ln(10) times 2, or equivalently 2 log10 e. Then say what that ratio means for a plot that shows both a semilog slope in psi per cycle and a derivative plateau in psi, and how you would use one to check the other.
