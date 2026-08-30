# Residuals in log space

What the optimiser is actually minimising, and why it is not the pressure difference.

{{panel:wt-regression-explorer}}

## The obvious choice, and why it is wrong

The natural residual for a fit is the difference between the model and the data:

    r_i = model_i - data_i

Minimise the sum of squares of those and you have ordinary least squares.

On a well test that is a bad choice, and the reason is the log-log plot. A well test spans decades of time and decades of pressure change. On this buildup the pressure change runs from about 15 psi at the first point to about 266 psi at the last.

A one percent error at the last point is 2.7 psi. A one percent error at the first point is 0.15 psi. Squared, the late point contributes three hundred times as much to the objective. So a plain least-squares fit is dominated by the late data, and the early data, which carry the storage coefficient and much of the skin, contribute almost nothing.

## The log residual

The engine uses

    r_i = ln( model_i / data_i )

which is the relative error, to first order. A one percent discrepancy contributes the same amount wherever it occurs, and every decade of the plot gets equal weight.

That is the standard practice in pressure transient analysis and it is why fits are shown on log-log axes: the axes and the objective function agree.

The engine's `logResidual` also handles the degenerate cases. If either the model or the data value is not positive, the logarithm is undefined, and it charges a fixed penalty of 5 instead. That keeps the optimiser away from parameter regions that produce non-physical output without letting it crash.

## The derivative in the residual vector

The engine does not fit the pressure alone. It builds a residual vector with TWO blocks: one log residual per point on the pressure change, and one log residual per point on the Bourdet derivative.

    residuals = [ ln(dp_model/dp_data) for each point,
                  w * ln(deriv_model/deriv_data) for each point ]

with w the derivative weight, 1 by default.

The derivative of the model is computed with the same Bourdet routine, at the same smoothing window, on the same abscissa as the data's. That symmetry is essential: a derivative computed differently on the two sides would compare two different quantities.

## Why include the derivative at all

Because pressure is an integral and integrals are insensitive.

Two models can differ visibly in their derivative and hardly at all in their pressure, because the pressure curve smooths the difference away. A fit on pressure alone will happily accept a model whose SHAPE is wrong provided the total pressure change comes out right, and shape is where the diagnosis lives.

Including the derivative forces the fit to match the shape as well as the level. In practice it is what stops a fit sliding between a boundary effect and a permeability change.

## The cost of including it

The derivative is noisy on real data, and putting noisy quantities in a residual vector transfers that noise to the parameters.

That is what the weight is for. A weight of 1 gives the derivative equal standing with the pressure. On noisy data a smaller weight is common. A weight of 0 drops it entirely.

On this buildup, which is noiseless, the weight barely matters: dropping the derivative term entirely still recovers all three parameters to six figures, with a smaller residual because there are fewer terms and each is smaller.

The panel lets you switch it and watch. On clean data it is a non-event. That is worth seeing precisely so that you know the weight is a noise decision rather than a physics one.

## The misconception to avoid

"A smaller sum of squared residuals is a better fit." It is a better fit TO THE OBJECTIVE YOU CHOSE. Change the residual definition, the weighting, or the smoothing window, and the ranking of two candidate models can change. The number is not comparable across different objective functions, and comparing SSRs from fits run with different settings is a common and meaningless exercise.

## Exercise

Open the panel, fit the homogeneous model to the buildup with the derivative included, and note the sum of squared residuals. Then fit it again with pressure only.

The second number is smaller. Say why that is guaranteed rather than informative, and state what you would have to hold constant for a comparison of two SSRs to mean anything.
