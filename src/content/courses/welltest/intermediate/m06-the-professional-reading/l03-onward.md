# Onward

From diagnosis to fitting, and the new class of error that comes with it.

## What the next tier adds

You can now identify a flow regime and analyse it with the right straight line. The Expert tier replaces the straight lines with a regression: pick a model from the catalog, let Levenberg-Marquardt adjust its parameters until the model's pressure and derivative match the data's, and read the parameters off.

It is better in every obvious way. It uses all the data instead of a window. It models wellbore storage rather than discarding it. It fits pressure and derivative together. On the buildup you analysed at the Associate tier, where the best straight line could not get closer than about three percent on permeability, the regression recovers the planted 85 mD, 6.5 skin and 0.015 bbl/psi storage to six significant figures.

## And the new problem

A regression will fit whatever model you give it, and it will report parameters and confidence intervals for that model whether or not the model is right.

Fit a sealing-fault model to the buildup, which has no boundary in it of any kind, and it converges. It reports the correct permeability, the correct skin, the correct storage, and a fault at about three thousand feet with a confidence interval a few tens of feet wide.

There is no fault. The extra parameter found something to do and the confidence interval says nothing about whether the boundary exists.

It gets worse. Write the same pressure change two arithmetically equivalent ways, differing in the thirteenth decimal place, and that fault moves by over a hundred feet to a confidence interval that does not overlap the first. The permeability does not move at all.

That is the Expert tier's central lesson: a fitted parameter is only as meaningful as the data's ability to constrain it, and the fit's own diagnostics do not tell you which parameters those are.

## The other three things

**Rate history.** Real wells do not produce at one rate. The Expert tier builds a three-rate drawdown, recovers the well from it properly with superposition, and shows that analysing the last period alone as though it were the whole test reports a permeability 40 percent high.

**Gas.** Pressure is the wrong variable for a gas well because viscosity and compressibility change with it. The pseudo-pressure transform fixes that, and between two pressures in this course's gas the pressure-squared shortcut overstates the drive by about a fifth. Then two accepted deliverability methods, on the same three data points, return absolute open flows four percent apart, and the one with the better r squared gives the bigger number.

**Production data.** Most wells are never tested. Rate transient analysis uses months of rate and flowing pressure instead of days of shut-in, measures oil in place rather than permeability, and is now the commonest form of well analysis there is.

## Before you go

Two habits from this tier are worth fixing.

**Plot the derivative first, always.** Not after the analysis to confirm it. Before, to decide what the analysis should be.

**Write the regime sequence down before writing any number.** Interval, slope, level, and the ordering argument. If you cannot write that for a regime, you have not diagnosed it, and any number that follows from it is a number attached to a guess.

## The one sentence

The features tell you which model. Only fitting tells you the parameters. And nothing tells you that the model is right except the physics you brought with you.

## Exercise

Take the seven fixtures and rank them by how confident you would be in a permeability from each, given only a derivative plot and a straight-line analysis.

Then say which of the seven you would want a model fit for before reporting anything, and why.
