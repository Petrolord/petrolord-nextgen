# The danger of freedom

The Professional tier gave you the cheap version of this lesson. One extra parameter, an aquifer that was not there, six surveys that had no way to object, and an answer that was not merely wrong but negative, at a fit statistic of 0.999485673716372. One freedom, on a regression with two coefficients, on a tank where the two terms were indistinguishable.

A history match has more freedoms available, a more flexible model behind them, and a fit statistic in units a reviewer finds persuasive. Everything that went wrong there goes wrong here, with better cover.

## The same tank, four ways

Here is the Dake tank of module 2, matched four times. The data does not change between rows. The aquifer model does not change. The only thing that changes is how many parameters the optimiser is allowed to move.

| free parameters | count | rms error psi | matched oil in place stb |
|---|---|---|---|
| $N$ | 1 | 4.31298999061806 | 310198605.412900 |
| $N$, $r_R$ | 2 | 0.533912409817980 | 330212861.271306 |
| $N$, $k_{aq}$ | 2 | 1.90144796130047 | 305373480.952866 |
| $N$, $r_R$, $k_{aq}$ | 3 | 0.469240203266468 | 327539079.935172 |

Every one of those runs converged. Every one of them is a legitimate use of the engine. The middle two are the same number of parameters.

Start with the first two rows, because that pair is the whole lesson. Freeing the reservoir radius alongside the oil in place improves the root mean square pressure error by a factor of 8.07808530258443, from four psi to half a psi, on a history spanning 1280 psi of drawdown. By every fit statistic you have, the two parameter match is enormously better. And it moves the oil in place by 20014255.8584060 stb, 6.45207796204157 percent, away from Dake's published answer and away from Dake's stated truth of 312 MMSTB.

Better fit. Worse answer. Not by accident, and not because the second parameter was a silly one to free: the reservoir radius at the contact is genuinely uncertain and genuinely affects influx.

## The part that should frighten you

Now read the uncertainties the two runs report.

| match | matched $N$ | standard error | 95 percent interval |
|---|---|---|---|
| $N$ only | 310198605.412900 | 0.272191698829105 percent | 308550351.872983 to 311855663.803355 |
| $N$ and $r_R$ | 330212861.271306 | 0.278974659845899 percent | 328414716.799611 to 332020850.988587 |
| $N$ and $k_{aq}$ | 305373480.952866 | 0.645388379309786 percent | 301547210.026266 to 309248302.649352 |

The two parameter match with the radius reports a tighter relative error than the one parameter match, and its interval contains neither the one parameter answer nor Dake's truth. The two parameter match with permeability reports an interval that does not overlap the radius match's interval at all. The gap between them is 19166414.1502590 stb, and the two central answers are 24839380.3184400 stb apart, 8.13409869152125 percent.

Two matches. Same eleven observations. Same aquifer model. Same engine. Each frees exactly two parameters. Each converges. Each quotes an uncertainty under one percent. Their intervals do not touch.

A confidence interval from a match is a statement about the curvature of the objective function near the point the optimiser stopped at, conditional on the model and the fit set being right. It measures how sharply the misfit rises as you move that parameter, and nothing else. It does not know that a different parameter could have been freed instead. It cannot see the possibility that the model class is wrong. When the model is in doubt, the reported error bar is the least informative number in the result, and it is invariably the one that gets quoted.

## Degrees of freedom against data

The arithmetic constraint is easy and it is not the binding one. The engine refuses to run unless there are at least one more fitted observation than there are free parameters, so eleven annual observations minus the initial row leaves ten fit points and permits up to nine parameters. Ekene, with six surveys, permits five.

Nobody should go anywhere near either limit. A pressure history is not ten independent facts. It is one smooth decline sampled ten times, and a smooth curve carries perhaps two or three genuinely independent features: how fast it falls at first, how much it flattens, and where the flattening begins. Those are what the parameters are competing for. Free two parameters that both control how much the curve flattens and they will trade against each other freely, which is exactly what the radius and the permeability are doing in the table above. Both change how much water arrives late. The data cannot tell you which one did it, so the optimiser splits the difference in whatever proportion the starting values and the local curvature happen to favour.

The fourth row makes the point again from the other side. Adding a third parameter to the two parameter radius match improves the root mean square error by 12.1128869384325 percent, from 0.533912409817980 to 0.469240203266468 psi, and moves the oil in place by 2673781.33613396 stb. A twelve percent improvement in a fit statistic that was already below a psi, bought with a whole extra parameter, on a gauge that does not read to a psi. That is a purchase with no value on either side of the ledger, and it is the shape of most over parameterised matches: the last freedoms buy almost no fit and move the answer anyway.

## The rule, and it is not a formula

**Free a parameter only when you can name what in the data constrains it.** The oil in place is constrained by the overall depth of the pressure decline against the produced volumes. The aquifer radius is constrained by how much the decline flattens late. If you cannot point at a feature of the observed history that would look different had the parameter been different, that parameter is not being estimated. It is being spent.

And when two parameters are constrained by the same feature, free one of them and fix the other on independent evidence, then say which one you fixed and why. That is not a weaker answer than freeing both. It is the only honest one available, and the next lesson is about how to write it down.

## At the panel

{{panel:mb-tank-explorer}}

The panel does not run history matches, it runs the regression, and that is useful here because it shows the same disease in a setting simple enough to see through.

Open Ekene with the aquifer selector on "None (the truth)" and read the oil in place tile: 12139208.1 stb, agreeing with the volumetric booking. Now move the selector to "Pot aquifer (not needed here)". One extra parameter. The fit statistic stays above 0.999, and the oil in place goes negative.

Count the freedoms while you do it. The closed model fits one coefficient to six points. The pot model fits two. The data gained nothing and the model gained a way to be wrong, and the output does not flag it, because a regression cannot know that the term you added does not exist. Then look at the survey table's ratio column, which is unchanged by the selector, and ask which of the two things on your screen is data and which is model.

Everything in the table earlier in this lesson is that same trade, at higher resolution and with better manners.

## Exercise

You have the four row table above and nothing else. Decide what you would report as the oil in place for this field, and write the two sentences of justification you would put beside it.

Then do the harder half. Write the sentence you would put in the same report about the answer you did not choose: name the alternative match, its parameter set, its fit statistic and its oil in place, and say why a reader is entitled to see it. If that sentence feels like it weakens your case, say so explicitly, and then decide whether that feeling is a reason to leave it out.
