# What dissolved gas does

The second link: putting the gas back in, which thins the oil considerably.

{{panel:fluid-correlation-explorer}}

## The effect

Dissolved gas lowers oil viscosity, and the effect is large. Light molecules going into solution get between the heavy ones and make the liquid flow more easily.

The engine uses Beggs and Robinson (1975), which takes the DEAD oil viscosity and the solution gas ratio and returns the live oil viscosity at the bubble point:

$$\mu_{ob} = A\,\mu_{od}^{\,B}, \quad A = 10.715(R_s + 100)^{-0.515}, \quad B = 5.44(R_s + 150)^{-0.338}$$

Both coefficients depend only on Rs, and the dead oil viscosity enters raised to a power less than one, which compresses the range: a very thick dead oil is thinned proportionally more than a thin one.

## Ekene

Dead oil at 32 API and 180 F is 2.3437444714709295 cp. Put the designed 400 scf/stb into it:

$$\mu_{ob} = 0.7559673199800581 \text{ cp}$$

The oil has been thinned to less than a third of its dead value. That is the size of the effect, and it is why a viscosity quoted without saying whether it is live or dead is close to meaningless.

## The two chains, and why they differ

Feed the chain the CORRELATED solution gas of 421.94 scf/stb instead of the designed 400 and it returns 0.7341185203712621 cp, which the simulation course reported.

Same correlations, same fluid, different answer, because the input differed. Neither is wrong. What is wrong is quoting either one as "the correlated viscosity of the Ekene oil" without saying which solution gas ratio went in.

This is the whole course in one comparison. The number is not the answer; the number plus the chain that produced it is the answer.

## Against the designed value

Designed: 1.8 cp. Correlated at the designed Rs: 0.756 cp.

That is a factor of 2.4, and it is the largest disagreement anywhere in Ekene's fluid description. The volume properties agreed to a few percent; the transport property does not agree at all.

The previous module traced what that would do to the mobility ratio. The point here is why it happens: volume behaviour is well captured by gravity and temperature, and viscosity is not.

## Where the correlation is weakest

At high solution gas ratios and for heavy oils. Beggs and Robinson's data covered a wide range but the fit is a two-parameter power law and real oils depart from it in both directions.

The engine attaches the published range and warns outside it, and the honest reading is that even inside the range a live oil viscosity from a correlation carries tens of percent of uncertainty rather than a few.

## The misconception to avoid

"More gas always means less viscosity, so the effect is simple." The direction is simple and the magnitude is not. The relationship saturates, so the first 100 scf/stb thins the oil far more than the next 100, and a correlation fitted mostly to moderate solution gas ratios will not extrapolate well to a rich one.

## Exercise

First, use the panel to compute the live oil viscosity at the bubble point for Ekene at the designed 400 scf/stb, and state the ratio to the dead oil value.

Second, the same chain gives 0.7559673199800581 cp at 400 scf/stb and 0.7341185203712621 cp at 421.94 scf/stb. Explain in two sentences why both numbers are correct and what has to accompany either one when it is quoted.
