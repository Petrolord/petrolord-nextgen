# Bounds and the prior

Two mechanisms that stop a regression from running away, and what each one is for.

## The bounds

Each knob has a range, chosen so that the tuned pseudo-component remains a plausible hydrocarbon fraction.

The multipliers on the criticals stay within a modest percentage of one. The binary interaction parameter and the volume shift are held inside ranges typical of real hydrocarbon systems.

The bounds are physics, not numerics. They encode the statement that the characterization correlations were uncertain by a certain amount and not by an unlimited amount.

## Why bounds alone are not enough

Because a regression with four knobs and fewer effective constraints will wander inside the bounds without leaving them.

Suppose only a saturation pressure is given as a target. Three of the four knobs affect it, so there is a two-dimensional family of knob settings that hit it exactly. The solver will pick one, and which one it picks is arbitrary.

That arbitrary choice is then carried into every prediction the model makes about anything else.

## The prior pull

The engine adds a weak regularisation that pulls the knobs toward their untuned starting values.

The weight is small, set so that a knob has to buy about two percent of target improvement to justify a full excursion to its bound. Small enough not to fight a real signal, large enough to stop an under-determined problem from drifting.

The effect is that when the data does not constrain a knob, the knob stays near where the characterization put it, and the tuned model degrades gracefully toward the untuned one rather than toward an arbitrary point.

## What the prior is saying

That the characterization correlations are worth something.

The starting values came from Soreide, Kesler-Lee, Lee-Kesler and Jhaveri-Youngren, which are published methods fitted to real data. They are not measurements of this fluid and they are not nothing.

A prior pull toward them expresses exactly that: absent evidence, prefer the published characterization. With evidence, move.

## Reading the result

Three things to check after a fit.

**Did any knob hit a bound?** If so, the fit wanted to go further than physics allows, and something else is wrong.

**How far did each knob move?** A knob that barely moved was either well characterized or unconstrained by the targets, and the two look identical in the output.

**Did the residual actually fall?** A fit that reduces the residual by a few percent has not done much, whatever the knobs did.

On Good Oil: no bounds hit, the criticals moved by under two percent, the volume shift moved by about a fifth, and the residual fell by a factor of twenty three.

## Under-determination is normal

Most real tuning problems have more knobs than independent information, because laboratory targets are correlated with each other.

The honest responses are to use fewer knobs, to add targets, or to regularise and say so. The dishonest response is to report the fitted parameters as though they were determined.

## The misconception to avoid

"Regularisation biases the answer, so an unregularised fit is more objective." An unregularised fit on an under-determined problem is not objective, it is arbitrary: the solver picks a point from a family and nothing distinguishes it. Regularisation makes the choice explicit and states what it prefers, which is more objective rather than less.

## Exercise

First, explain the difference between what the bounds do and what the prior pull does.

Second, name the three things to check after a regression converges, and say what each one would tell you if it came out badly.
