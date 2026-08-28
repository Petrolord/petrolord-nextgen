# The Rachford-Rice solve

Given K values, find the split. One scalar equation, and it is well behaved for a reason worth knowing.

{{panel:fluid-tuning-explorer}}

## The setup

Take one mole of feed with composition z. Suppose a fraction beta of it becomes vapour. Material balance on each component gives:

$$x_i = \frac{z_i}{1 + \beta(K_i - 1)}, \qquad y_i = K_i x_i$$

Both compositions must sum to one. Subtracting the two constraints gives the Rachford-Rice equation:

$$\sum_i \frac{z_i (K_i - 1)}{1 + \beta(K_i - 1)} = 0$$

One equation in one unknown.

## Why this form rather than either constraint alone

Because it is monotonic in beta.

Take the derivative and every term is negative, so the function decreases strictly from beta of zero to beta of one. A strictly monotonic function has exactly one root, and a root-finder cannot land on the wrong one.

Using either sum-to-one constraint on its own gives a function with poles and multiple roots, and a solver on it is unreliable. The subtraction is what makes the problem tractable, which is why it is the form everyone uses.

## The solution method

Newton's method converges fast and can step outside the valid interval, so the standard approach is Newton with a bisection safeguard: take the Newton step if it stays in the bracket, otherwise bisect.

That gives Newton's speed with bisection's guarantee, and it is what the engine does.

## Negative flash

The valid physical range for beta is zero to one. The engine allows the solver to go outside it deliberately.

A beta below zero or above one means the mixture is single phase at these conditions, and the size of the excursion says how far into the single-phase region it is. That is useful information rather than an error, and it makes the outer iteration better behaved, because the function remains smooth across the boundary instead of clipping at it.

The physical answer is then read off: negative beta means all liquid, beta above one means all vapour.

## The outer loop

Rachford-Rice takes K values as given, and the K values depend on the compositions it produces. So the whole thing is an outer iteration:

Guess K values. Solve Rachford-Rice for beta and the compositions. Compute fugacity coefficients from the equation of state for both phases. Update the K values from their ratio. Repeat until the fugacities match.

That is successive substitution. It is simple and it converges slowly near the critical point, so the engine accelerates it with the general dominant eigenvalue method, which extrapolates the sequence of updates.

## The engine's verification

The oracle implements the same flash with plain successive substitution and a bisection root-finder, no acceleration, no negative flash. Completely different numerics, same physics.

The two agree to around one part in ten billion across a grid of thirty-nine states. That is a strong statement that the acceleration is not changing the answer, only the number of iterations taken to reach it.

## The misconception to avoid

"Beta outside zero to one means the calculation failed." It means the mixture is single phase, and the engine uses the excursion as information. Treating it as a failure and clamping to the boundary loses that information and makes the outer iteration behave worse at exactly the conditions where it needs to behave well.

## Exercise

First, write the Rachford-Rice equation and explain in two sentences why it is preferred to either sum-to-one constraint on its own.

Second, describe the outer loop in four steps and say which part of it the general dominant eigenvalue method accelerates.
