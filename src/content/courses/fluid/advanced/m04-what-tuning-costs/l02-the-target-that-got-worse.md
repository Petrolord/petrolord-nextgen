# The target that got worse

Bo went from 0.31 percent out to 1.13 percent out. Why that is the right outcome and not a failure.

{{panel:fluid-tuning-explorer}}

## What happened

Before tuning, the formation volume factor was the model's best target: 1.4694525613484382 against a measured 1.474, an error of -0.30851008490921433 percent.

After tuning it is 1.4573161052573853, an error of -1.131878883488105 percent. Nearly four times worse.

Everything else improved substantially.

## Why a least-squares fit does this

It minimises the SUM. A target that starts close contributes little to the sum, so the solver has almost nothing to lose by moving it and a great deal to gain by improving the ones that start far away.

That is not a defect in least squares. It is what least squares is: a statement that all residuals are equally important per unit of relative error, and that the total is what matters.

If Bo mattered more than the others, the fix would be to weight it more heavily, and the fit would then give up more elsewhere. The engine's target structure accepts per-target weights for exactly that.

## Why it could not be avoided by better knobs

Because the coupling is physical rather than numerical.

Bo is reservoir volume at the bubble point divided by stock tank volume. Total GOR is total gas divided by that same stock tank volume. Stock tank gravity is the density of that same liquid.

One knob, the volume shift, sets how dense the stock tank liquid is. Making it lighter to fix the nine API error necessarily changes its volume, and both of the other two divide by that volume.

No arrangement of four knobs escapes that. The only escape is more independent physics, which means splitting the plus fraction so that the composition of the stock tank liquid can change independently of its density, and that brings its own problems.

## What this says about four-target fits generally

That the frontier is real. With four knobs and four coupled targets there is a surface of achievable error combinations, and improving one point on it moves others.

A fit that reports every target improving is either using more parameters than targets, or has targets that were nearly independent, or has not converged. It is worth being suspicious of.

## What to do about it in practice

**Decide what the model is for, before tuning.** A model built to forecast recovery cares most about the formation volume factor and the saturation pressure. A model built for facilities design cares most about the gas-oil ratio and the stock tank gravity. Weight accordingly, and say you did.

**Report the ledger.** Whatever the weights, the before-and-after table tells a reader what the tuning bought and what it spent.

**Consider not tuning that target at all.** If Bo was already within a third of a percent, leaving it out of the objective and checking it afterwards as a prediction is a defensible design, and it turns a fitted target into a validation.

That last option is worth taking seriously. It converts one of the four measurements from something the model was told into something the model has to get right, which is the only kind of check a tuned model can have.

## The misconception to avoid

"The tuning made the model worse at Bo, so the tuning was harmful." The tuning made the model far better overall and worse at one target, deliberately and reportably. Whether that is harmful depends entirely on what the model is for, which is a decision the engineer makes and the solver cannot.

## Exercise

First, state the before and after errors on the formation volume factor and explain in two sentences why a least-squares solver traded it away.

Second, describe how you would restructure the tuning if the model's purpose were a depletion forecast, and say what you would gain and lose.
