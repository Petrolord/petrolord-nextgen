# Fugacity and equilibrium

The condition that decides how a mixture splits, and the quantity that expresses it.

## The condition

Two phases are in equilibrium when, for every component, the fugacity in the liquid equals the fugacity in the vapour.

$$f_i^L = f_i^V \quad \text{for every } i$$

That is the whole criterion. Everything a flash calculation does is a search for the split that satisfies it.

## What fugacity is

A corrected pressure. For an ideal gas the fugacity of a component is its partial pressure. For a real mixture it is the partial pressure multiplied by a fugacity coefficient that accounts for non-ideality:

$$f_i = \phi_i\, x_i\, p$$

The fugacity coefficient is what the equation of state computes. Given a composition, a pressure, a temperature and a root of the cubic, there is a closed-form expression for the natural logarithm of the fugacity coefficient of every component in that phase.

## Why fugacity rather than chemical potential

They express the same condition. Chemical potential is the thermodynamically fundamental quantity and it goes to negative infinity as a mole fraction goes to zero, which is inconvenient numerically.

Fugacity is well behaved at zero composition and it has units of pressure, so a residual expressed in fugacities is a quantity an engineer can reason about. It is the same physics in more usable coordinates.

## The K value

The ratio of the vapour to the liquid mole fraction for a component:

$$K_i = \frac{y_i}{x_i} = \frac{\phi_i^L}{\phi_i^V}$$

The second equality is the equilibrium condition rearranged. So the K values are not an independent thing to be found: they follow from the fugacity coefficients, which follow from the equation of state.

K greater than one means the component prefers the vapour. Methane's K is large, the heavy end's is small, and the spread between them is what makes a separation happen at all.

## The closed form

The fugacity coefficient for Peng-Robinson has an analytic expression. No integration is needed at run time.

That matters for speed, and it also matters for verification: an independent implementation can get the same quantity by a completely different route, integrating the residual Helmholtz energy numerically, and the two must agree.

The engine's oracle does exactly that. The closed form and the quadrature agree to around one part in a thousand billion, which is a strong statement that the algebra was transcribed correctly.

## Why volume translation does not appear here

Because it cancels.

Shifting the volume of a phase by a constant changes the fugacity of every component in that phase by the same factor. The RATIO across the two phases is unchanged, so the K values are unchanged, so the split is unchanged.

The engine therefore reports untranslated fugacities and applies the translation only to volumes and densities. The next lesson is what that buys and what it does not.

## The misconception to avoid

"Equal fugacity means equal concentration." It means equal escaping tendency. A component can sit at a mole fraction of 0.7 in the vapour and 0.05 in the liquid and be in equilibrium, because the fugacity coefficients differ by exactly the factor that makes the products equal. The whole of separation depends on that not being equal concentration.

## Exercise

First, state the equilibrium condition and explain in two sentences why K values are a consequence of it rather than an input to it.

Second, explain why the engine can report an untranslated fugacity and a translated density from the same calculation without being inconsistent.
