# A documented bias is not a bug

Two errors, both large, both expected, both pinned. What that changes.

## What the tier found

| quantity | error |
|---|---|
| saturation pressure | +5.938198064045652 percent |
| total gas-oil ratio | +3.3599319244332757 percent |
| stock tank gravity | -8.894358353620603 API |
| formation volume factor | undefined under the model |

## Why none of these is a defect

A defect is behaviour nobody intended and nobody knows about. Each of these is:

**Understood.** The saturation pressure bias traces to a single lumped pseudo-component; the gravity bias traces to a generalized volume shift correlation applied to that lump.

**Reproducible.** The same inputs give the same numbers every time, and the engine's gates run them on every change.

**Recorded.** The tolerances in the gate suite sit just above the observed values, and the fixture's own text says they are pinned rather than accepted.

**Directional.** Heavy oils saturate high, lean condensates dew low, single pseudo-components come out dense. Those directions transfer to other fluids even when the magnitudes do not.

## What a pinned bias buys

A test that passes today and fails the day the behaviour changes.

Set the tolerance loose enough to be comfortable and the test tells you nothing: any regression inside the slack passes silently. Set it at the true answer and it fails immediately and gets disabled.

Set it just above the observed bias and it does the one useful thing a regression test can do, which is notice change.

That is a general technique and it is worth taking away from this course independently of anything about fluids.

## What it does not buy

Accuracy. A pinned bias is still a bias, and a study that uses this model untuned inherits all of it.

The pin is a statement about the software's stability, not about the fluid. Confusing the two would be the same error as reading a green test suite as evidence that a deck describes the right field, which the simulation course spent a module on.

## How to report an untuned model

Say untuned, and give the comparison.

> The compositional model is untuned. Against the Core Laboratories study it reproduces the saturation pressure to +5.9 percent and the total gas-oil ratio to +3.4 percent, and it returns a stock tank gravity 8.9 API light, a known consequence of the generalized volume shift on a single C7+ pseudo-component. It does not report a formation volume factor at the stated reservoir conditions, because its saturation pressure exceeds them.

Four sentences and a reader knows exactly what they have.

## What the Expert tier does with it

Tunes. Four bounded knobs on the pseudo-component, regressed against these same four measurements, and the biases mostly close.

Mostly, and not entirely, and the tier is largely about what does not close and why. The instinct that a fit which improves everything must be better is the one it takes apart.

## The misconception to avoid

"If the biases are known, the model should just correct for them." The direction is known and the magnitude is fluid-specific, so a general correction would fix this study and break another. Corrections that are fitted to a specific fluid are called tuning, they are done deliberately with stated targets, and they are reported. A correction baked into a library silently is the same thing without any of the accountability.

## Exercise

First, list the four things that make a bias documented rather than a defect, and check each one against the stock tank gravity error.

Second, write the four-sentence report paragraph for an untuned model on a fluid of your own, leaving the numbers blank where you would need to measure them.
