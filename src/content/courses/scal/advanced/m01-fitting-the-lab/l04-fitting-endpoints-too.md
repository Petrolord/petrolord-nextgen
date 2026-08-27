# Fitting endpoints too

Everything so far held the endpoints fixed: connate saturation and residual oil were read off the table, the endpoint permeabilities were taken from the table's end rows, and only the two exponents were free. That is the engine's default, and it is usually right. But `fitCoreyToKrTable` accepts `fitEndpoints: true`, which grows the parameter vector from $[n_w, n_o]$ to $[n_w, n_o, k_{rw,max}, k_{ro,max}]$, and knowing when to open that door is an Expert skill in itself.

## What changes mechanically

With endpoints fixed, the model the residuals see is fully pinned at both ends: $k_{rw,max}$ IS the last row's water value, $k_{ro,max}$ IS the first row's oil value, straight from the table. The optimizer can only bend the curves between the ends. With `fitEndpoints: true`, theta grows to four, the endpoint permeabilities become free parameters bounded to $(10^{-3}, 1]$, and their starting guesses are still the table's end values. The saturation endpoints $S_{wc}$ and $S_{or}$ stay fixed either way; the option frees the vertical scale of each curve, never the horizontal window.

On the Ekene plant the four-parameter fit returns $n_w = 2.5$, $n_o = 2$, $k_{rw,max} = 0.3$, $k_{ro,max} = 0.9$, with an rmsLog of exactly 0. Freeing the scale removed even the last-bit tension that pinned endpoints imposed, and the optimizer landed on the plant in all four coordinates. One honest wrinkle is worth knowing: with the sum of squared residuals at a hard zero, the curvature scaling that builds confidence intervals degenerates, and the kernel reports the interval bounds as null. Perfect data buys you a perfect answer and takes away the error bar, because an error bar is a statement about residuals and there are none.

## When to free the endpoints

Fix them when the end rows are trustworthy. A steady-state measurement that actually reached residual oil gives you $k_{rw,max}$ directly, and handing that fact to the fit as a constraint is strictly better than asking the fit to rediscover it from curvature.

Free them when the end rows are the least trustworthy rows in the table, which on real core is common: the final water point may have been taken before the flood truly reached residual, and unsteady-state interpretations often extrapolate the ends rather than measure them. In that situation a pinned fit forces the whole curve through a wrong anchor, and the error leaks into the exponents, which are the numbers you actually wanted. Freeing the endpoints lets the interior points, usually the well-measured ones, vote on where the ends should have been.

The cost is statistical, and lesson 3 gave you the vocabulary for it: two more parameters sharing the same twenty four points means wider confidence intervals on everything. On a rich table the trade is cheap. On a five-point table it can dissolve the fit's ability to say anything at all, and the engine's refusal threshold, at least the parameter count plus two usable points, is the hard floor under that trade.

## Reading a disagreement between the two fits

Run both fits on the same table and compare. If the pinned and free fits agree, as they do on the plant, the end rows are consistent with the interior and you may quote the pinned fit with its tighter intervals. If they disagree materially, the table is telling you its ends and its middle describe different curves, and the difference between the two fitted $k_{rw,max}$ values is a direct estimate of how far the lab's endpoint is from what the trend implies. That number belongs in your report either way; which fit you carry forward depends on whether you trust the endpoint measurement or the trend more, and that is a judgment about the laboratory, not about the mathematics.

## At the panel

{{panel:sc-design-explorer}}

In the panel's fit mode, run the default pinned fit first and note the fitted exponents and the rmsLog at the $10^{-16}$ scale. The panel's lab grid is the clean plant, so this is your baseline. Now imagine, without the panel needing a control for it, what each tile would do if the last water row read 0.24 instead of 0.3: the pinned fit would tilt $n_w$ upward to chase a lowered anchor, while the free fit would move $k_{rw,max}$ down and leave $n_w$ near 2.5. Sketch both predictions in your notes; the exercise asks you to defend them.

## The misconception to avoid

The misconception is that more free parameters means a better fit, because the residuals can only go down. The residuals do go down; the ANSWER can get worse. Every parameter you free spends the same fixed budget of information the table contains, and a freed endpoint that the data cannot actually resolve turns into a wide, wandering estimate whose uncertainty contaminates the exponents through their covariance. Freeing endpoints is a modelling decision about which rows you distrust, never a general upgrade.

## Exercise

First, state the two fitted parameter vectors on the Ekene plant, pinned and free, and explain why the free fit's rmsLog of exactly 0 together with null confidence intervals is internally consistent rather than contradictory.

Second, a real table's pinned fit gives $n_w = 2.9$ while its free fit gives $n_w = 2.45$ with $k_{rw,max} = 0.22$ against a tabulated end value of 0.3. Say what physical situation in the laboratory this pattern suggests, which fit you would carry into a displacement calculation, and what single additional lab measurement would settle the question.
