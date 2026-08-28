# Volume translation

A constant shift that fixes the densities and disturbs nothing else.

{{panel:fluid-tuning-explorer}}

## The problem

A two-parameter cubic reproduces phase equilibrium well and liquid density badly. Peng-Robinson typically predicts liquid molar volumes several percent too large, and the error is systematic rather than random.

That is structural. Two parameters cannot satisfy both the equilibrium behaviour and the volumetric behaviour across a wide range, and the equation was fitted to prioritise the first.

## Peneloux's fix

Compute the equilibrium exactly as before. Then shift the molar volume:

$$v_{\text{corrected}} = v_{\text{EOS}} - \sum_i x_i c_i$$

with one constant per component. Expressed dimensionlessly against the component's own b parameter, the constant is called the volume shift.

## Why it is free

Because it cancels in every equilibrium quantity.

A constant shift changes the fugacity of each component in a phase by the same multiplicative factor. The equilibrium condition is an equality between two fugacities, and the K value is their ratio, so both are untouched.

That is an unusually clean result. Most corrections to a model trade one error for another; this one improves the densities and provably leaves the phase behaviour alone.

## Where the values come from

Jhaveri and Youngren published a correlation against molecular weight, and the engine's component library carries per-component shifts from it. For the pseudo-component the same correlation is applied to the characterized molecular weight.

Good Oil's C7+ gets 0.15389683656773767, which is a large shift and says the untranslated equation was predicting a molar volume about fifteen percent too big for that material.

## Where it goes wrong on this fluid

The correlation was fitted to pure hydrocarbons and to well-defined petroleum fractions. A single pseudo-component standing for a whole C7+ distribution is neither.

The result is the nine API bias the Professional tier measured. The engine's fixture note is specific about the mechanism: the pure C7+ pseudo recovers a standard-condition specific gravity of 0.9075 against the defined 0.8515.

## Which is why it is a knob

The Expert tier's fourth tuning parameter is this volume shift, set absolutely rather than multiplied.

It is the right thing to tune for three reasons. It is a correlated value rather than a measured one. It is being applied outside the population it was fitted to. And it moves the stock tank gravity, which is one of the four measured targets, almost independently of everything else, because it cannot affect the phase split.

That last property makes the regression better behaved than it would otherwise be: one knob has an almost private effect on one target.

## What it cannot fix

The saturation pressure. Since the shift cancels in the equilibrium, no value of it moves the phase boundary at all.

So the two large biases the Professional tier found need different knobs. The gravity bias needs the volume shift; the saturation pressure bias needs the parameters that do affect the equilibrium, which are the criticals and the binary interaction parameter.

That separation is worth seeing before the regression runs, because it explains why the four knobs are the four they are.

## The misconception to avoid

"Volume translation improves the model, so more of it is better." It improves the density at the value that is correct for the material and makes it worse at any other. It is not a free accuracy dial; it is a parameter with a right answer that has to be obtained from somewhere, and for a pseudo-component that somewhere is either a correlation outside its range or a regression against measured density.

## Exercise

First, explain in two sentences why a constant volume shift leaves the K values unchanged.

Second, of the two large untuned biases on Good Oil, say which one the volume shift can fix and which one it provably cannot, with the reason.
