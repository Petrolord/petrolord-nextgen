# Peng-Robinson 1978

The specific cubic the engine implements, and the 1978 modification that matters for heavy components.

## The equation

$$p = \frac{RT}{v - b} - \frac{a\,\alpha(T)}{v(v+b) + b(v-b)}$$

The denominator of the attraction term is the difference from van der Waals and from Soave-Redlich-Kwong. It was chosen to improve liquid density predictions and it does, which is why Peng-Robinson dominates reservoir work.

## The two parameters

For a pure component, from its critical properties:

$$a = \Omega_a \frac{R^2 T_c^2}{p_c}, \qquad b = \Omega_b \frac{R T_c}{p_c}$$

with the constants fixed by the critical-point conditions:

$$\Omega_a = 0.457235529, \qquad \Omega_b = 0.077796074$$

Those are exact algebraic values rather than fitted ones. They come from requiring the first and second derivatives of pressure with respect to volume to vanish at the critical point, which is what defines a critical point.

## The temperature function

$$\alpha(T) = \left[1 + \kappa\left(1 - \sqrt{T_r}\right)\right]^2$$

The alpha function carries all the temperature dependence of the attraction term, and kappa is where the acentric factor enters. That is the whole role of the acentric factor in the equation: it decides how fast the attraction weakens with temperature.

## What 1978 changed

The original 1976 paper gave kappa as a quadratic in the acentric factor:

$$\kappa = 0.37464 + 1.54226\,\omega - 0.26992\,\omega^2$$

That works up to an acentric factor of about 0.49. Beyond it the quadratic turns over and starts giving worse answers.

The 1978 modification adds a cubic branch for heavier components:

$$\kappa = 0.379642 + 1.48503\,\omega - 0.164423\,\omega^2 + 0.016666\,\omega^3, \qquad \omega > 0.49$$

## Why the branch matters here

Good Oil's C7+ pseudo-component has an acentric factor of 0.6690835265426222.

That is well past 0.49, so it takes the 1978 branch. Every heavy pseudo-component in every reservoir fluid does, which is why the 1978 modification is not an optional refinement for this work: it is the branch the most important component in the mixture lands on.

The engine's harness records a case where a C10 component sat near the switch, at 0.4 against 0.491, and the branch choice was visible in the result. Components near the boundary are worth knowing about, because two implementations that place the switch differently will disagree there.

## Both branches, one function

The engine implements both and selects on the acentric factor. That is worth stating because an implementation carrying only the 1976 form is a different equation for the component that matters most, and the difference does not announce itself.

## The misconception to avoid

"Peng-Robinson 1978 is a minor update to Peng-Robinson 1976." For light components it is identical, because they never reach the branch. For the heavy pseudo-component that carries most of a black oil's mass it is a different correlation for kappa, and kappa controls the temperature dependence of the attraction term. Which version an implementation carries is a question worth asking.

## Exercise

First, write down what each of the three parts of the equation does: the repulsion term, the attraction term, and the alpha function.

Second, Good Oil's C7+ has an acentric factor of 0.6690835265426222. State which kappa branch it takes and say why that makes the 1978 modification structural rather than optional for this fluid.
