# The volume shift

The correction that makes a cubic equation of state give sensible liquid densities, and the parameter that carries this model's largest bias.

## The problem it fixes

Cubic equations of state predict phase EQUILIBRIUM well and liquid DENSITY badly. Peng-Robinson typically gets liquid molar volumes wrong by several percent, and the error is systematic.

That was known from the beginning and it is a structural limitation: a two-parameter cubic cannot get both the vapour-liquid equilibrium and the liquid volume right across a wide range.

## The fix

Peneloux and co-workers proposed translating the volume: compute the equilibrium as usual, then shift the molar volume of each phase by a constant per component.

$$v_{\text{corrected}} = v_{\text{EOS}} - \sum_i x_i\, c_i$$

The shift is dimensionless when expressed against the component's own b parameter, and Jhaveri and Youngren published a correlation for it against molecular weight.

## Why it is free

Because the shift cancels exactly in the equilibrium calculation.

Fugacity coefficients determine phase splits, and a constant volume translation changes the fugacity of a component in both phases by the same factor. The ratio is unchanged, so the K values are unchanged, so the phase split is unchanged.

That is a genuinely useful property: the volume translation improves densities without disturbing anything that was already right. The engine applies Peneloux to volumes and densities only, and reports untranslated fugacities, precisely because the translation is not supposed to touch them.

## Good Oil's C7+ shift

Jhaveri-Youngren gives 0.15389683656773767 for this pseudo-component.

That is a large shift. It says the untranslated equation of state predicts a molar volume about fifteen percent larger than it should for this material, which is the scale of the problem the translation exists to fix.

## Where it goes wrong here

The correlation was fitted to pure hydrocarbons and to well-defined petroleum fractions. Applied to a single lumped pseudo-component standing for a whole C7+ distribution, it is being asked for something outside what it saw.

The result on this fluid is documented and it is large: the untuned model produces a stock tank oil about nine API too heavy. The engine's own fixture notes say the pure C7+ pseudo recovers a standard-condition specific gravity of 0.9075 against the defined 0.8515.

A nine API error in stock tank gravity is not subtle. On an oil sold on gravity it is an economics error, and it comes entirely from one correlated parameter applied outside its comfort zone.

## Why it is pinned rather than patched

The engine's gate for this study sets the API tolerance just above the observed bias and holds it there.

That is deliberate. A gate set loose enough to pass hides the bias; a gate set at the correct answer fails and gets ignored. A gate set just above the KNOWN bias passes today and fails the moment the bias changes, which is exactly what a regression pin is for.

And the bias is then the first thing the tuning fixes. The Expert tier's volume shift knob is aimed straight at it.

## The misconception to avoid

"A volume shift is a fudge factor, so a model using one is unreliable." It is a correction with a clean theoretical justification and a proof that it does not disturb the equilibrium. What is uncertain is its VALUE for a pseudo-component, not its legitimacy. The distinction matters, because the response to an uncertain value is to measure or tune it, while the response to an illegitimate method would be to stop using it.

## Exercise

First, explain in two sentences why a constant volume translation leaves the phase split unchanged.

Second, state the volume shift the engine gives Good Oil's C7+ and the stock tank gravity error that follows from it, and say why the engine's gate is set just above that error rather than at zero.
