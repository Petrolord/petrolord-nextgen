# Fitting the trend

Twelve picks, one equation, two unknowns. The matrix transit time is fixed at 220 us/m, so what remains to be found is the mudline transit time and the compaction constant. This lesson does that fit and reads the result.

## Linearising the exponential

The NCT is not linear in its parameters, but it becomes linear with one rearrangement. Start from the equation and move the matrix value across:

$$dt(z) - dt_{ma} = (dt_{ml} - dt_{ma}) \, e^{-c z}$$

Take the natural logarithm of both sides:

$$\ln(dt(z) - dt_{ma}) = \ln(dt_{ml} - dt_{ma}) - c z$$

That is a straight line in $z$. Its slope is $-c$ and its intercept is $\ln(dt_{ml} - dt_{ma})$. So the fit is ordinary least squares on the transformed picks, which has a closed form solution. There is no iteration, no starting guess and no convergence to worry about. The engine computes the sums, solves for slope and intercept, then converts back: $c$ is the negative of the slope, and $dt_{ml}$ is $dt_{ma}$ plus the exponential of the intercept.

The transform is also where the matrix value earns its keep. Every pick must be greater than $dt_{ma}$, otherwise the logarithm is of a negative number and the fit is meaningless. The engine throws with the index of the offending pick rather than returning a NaN, which is a useful error to see, because a pick at or below the matrix transit time is either a bad pick or a bad matrix value.

## Why the matrix value is fixed

You could try to fit all three parameters at once. It is a poor idea. The matrix value and the compaction constant trade off against each other, because a lower floor with a slower decay looks much like a higher floor with a faster decay over the depth range you have data for. The fit becomes ill conditioned, the parameters wander, and small changes in the picks produce large changes in the answer.

Fixing $dt_{ma}$ from lithology, at 220 us/m here, removes that ambiguity and leaves a two parameter problem with a clean solution. The cost is that a wrong matrix value biases both fitted parameters, which is a good reason to state the matrix value you used every time you report a trend.

## What the fit returns

Run the least squares fit through the twelve picks with the matrix transit time fixed at 220 us/m and it returns a mudline transit time of 650.0000000000014 us/m and a compaction constant of 0.7000000000000015 per km. Both are graded by the capstone, the first with a tolerance of 0.5 us/m and the second with a tolerance of 0.005 per km. Inside the engine that constant is held in per metre, so the fit that reads 0.7000000000000015 per km here is the same fit that the code carries as 0.0007 per m.

Look at the digits. The mudline value is 650 followed by twelve zeros and then a 14. The compaction constant is 0.7 followed by the same pattern. A least squares fit to real data does not do this. What you are seeing is a fit that has recovered its input parameters exactly, to the limit of double precision arithmetic, and the trailing digits are floating point rounding rather than anything about rocks.

The reason is that these twelve picks were drawn from a clean exponential. Every pick lies on one curve, with no scatter at all, so the least squares problem has an exact solution and the residuals are zero. You can see it directly by evaluating the fitted trend at the depth of a pick:

| z (m) | pick (us/m) | fitted trend (us/m) |
|---|---|---|
|  500 | 523.0158785790468 | 523.015879 |
| 2000 | 326.0366944948908 | 326.036694 |
| 3500 | 257.1062421947293 | 257.106242 |

The fitted trend passes through every pick.

## Real picks never do this

Take that as a warning rather than as a standard to aim for. Picks taken by hand off a real sonic log scatter. Shale beds differ in mineralogy, the tool has noise, the hole is not perfectly in gauge, and the compaction relation itself is an approximation. A good real fit leaves residuals of a few us/m, sometimes more, and the residuals carry information. A residual pattern that drifts systematically with depth says the exponential form is not describing this well. A single large residual says one pick deserves a second look.

If a fit to picks you took yourself comes back with residuals at the tenth decimal place, do not congratulate yourself. Check whether you have accidentally fitted a curve to itself, for example by picking off a modelled trend curve rather than off the log.

The fitted trend here is a curve you can now put on the same plot as the log and as the frame from the last module. The panel does that, and it reports the well's own trend and the fitted trend at whatever depth you choose.

{{panel:pp-frame-explorer}}

## Exercise

Using the fitted parameters, evaluate the fitted normal compaction trend at 2500 m below the mudline, then compare it with the value the well's own trend gives at that depth.

Self check: with a mudline transit time of 650 us/m, a matrix transit time of 220 us/m and a compaction constant of 0.7 per km, which is 0.0007 per m, the fitted trend at 2500 m is $220 + (650 - 220) \, e^{-0.0007 \times 2500} = 294.722796$ us/m. The well's own trend at the same depth gives 317.284750 us/m. The two curves are not the same curve, and they differ by far more than the 0.5 us/m tolerance the capstone allows on a transit time. The next lesson is about which of them is right.
