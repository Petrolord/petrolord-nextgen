# The gravity bias

Nine API light, from one correlated parameter, on the number the oil is sold on.

{{panel:fluid-study-explorer}}

## The number

Measured 40.7 API. Untuned model:

$$31.8056416463794 \text{ API}$$

That is -8.894358353620603 API. The model's stock tank oil is far heavier than the laboratory's.

## Where it comes from

The Jhaveri-Youngren volume shift on the C7+ pseudo-component, which the characterization module traced.

The engine's own fixture note is explicit about the mechanism: the pure C7+ pseudo recovers a standard-condition specific gravity of 0.9075 against the 0.8515 the report defines. The pseudo-component is being made too dense, and stock tank gravity is mostly the density of the heavy end.

## Why this one is worse than the others

Because API gravity is a compressed scale. A specific gravity error of about six percent turns into nine API, because:

$$\text{API} = \frac{141.5}{\text{SG}} - 131.5$$

The subtraction of 131.5 magnifies small proportional errors in SG into large absolute errors in API near the middle of the range. That is a property of the units rather than of the model, and it is why gravity errors look alarming.

It is still a real error. Six percent on a stock tank density is a six percent error in the stock tank volume, which is the denominator of the formation volume factor and of every stock tank barrel the model will ever report.

## What it costs

**Economics.** Crude is priced on gravity, and the difference between 31.8 and 40.7 API is the difference between a medium sour discount and a light sweet premium. A model used for anything commercial has to have this right.

**Stock tank volumes.** A denser stock tank oil means fewer barrels from the same mass, so the total gas-oil ratio and the formation volume factor both move.

**Nothing about the reservoir.** The phase equilibrium is untouched, because the volume shift cancels in the fugacity ratio. The model still knows correctly what splits into what; it just gets the density of the liquid wrong.

That last point is worth holding onto, because it says which conclusions survive the bias and which do not.

## Why the report should carry it either way

If you tune the model, say the untuned gravity was nine API out, because that is the size of the correction the tuning is making and a reader should know how much work it did.

If you do not tune, say it more loudly, because every stock tank volume in the study inherits it.

The bias is not a secret in either case. What varies is whether the report treats it as a fixed property of the model or as something that was addressed.

## The gate

The engine's literature gate for this study sets the API tolerance at 10, which is just above the observed 8.9 bias, and the fixture's own citation text says why: the tolerance is set to REGRESSION-PIN a documented bias rather than to certify an acceptable answer.

A reader who saw the tolerance without the note might think ten API of error was considered fine. It is not; it is being watched.

## The misconception to avoid

"Nine API is so large it must be a bug." It is a documented consequence of applying a generalized volume shift correlation to a single lumped pseudo-component, and it is reproducible, pinned and understood. Bugs are things nobody expected. This was expected, measured and written down, which is what separates a limitation from a defect.

## Exercise

First, state the measured and modelled stock tank gravities and the specific gravities behind them, and explain why a six percent error in specific gravity becomes nine API.

Second, name one conclusion from this model that the gravity bias invalidates and one that it leaves untouched, with a reason for each.
