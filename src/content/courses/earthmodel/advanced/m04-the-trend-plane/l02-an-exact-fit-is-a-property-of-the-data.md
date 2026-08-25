# An exact fit is a property of the data

Four points, three coefficients, and yet the fitted plane passes through all four values to machine precision: residuals of order $10^{-16}$. A least-squares fit with a spare degree of freedom landing exactly on every point should stop you. This lesson is about what that exactness means, what it does not mean, and how the same method behaves on data that was not built to flatter it.

## The residuals

Misfit at each control point, value minus plane:

W1: $-4.4 \times 10^{-16}$. W2: $-1.7 \times 10^{-16}$. W3: $+6.7 \times 10^{-16}$. W4: $-1.1 \times 10^{-16}$.

Float dust, all four. With four points and three parameters, generic data leaves one dimension of misfit that least squares distributes among the points; zero misfit means the data had no component in that dimension to distribute. In plain terms: THE FOUR VALUES WERE ON A PLANE BEFORE THE FIT ARRIVED.

And they were, by construction. The fixture generated the zone A porosities by evaluating $0.38 - 0.00004x - 0.00001y$ at the control locations; W2's fifteen-digit 0.2935651232824187 is that plane at its migrated control point. The fit is not discovering structure; it is returning the recipe the values were cooked from. The engine, given planar data, correctly reports a plane; the exactness is a property OF THE DATA.

## Why this matters beyond the fixture

Because the inference "residuals are tiny, therefore the trend model is right" is everyday practice, and this fixture is a controlled demonstration of its weakness in small samples. Four points is one point more than a plane needs; near-zero residuals at n barely above p is weak evidence about the world and strong evidence about how the numbers were produced. Contrast the ReservoirCalc ladder's trend lesson, where six wells fit a porosity plane with residuals up to 8 percent of the values: THAT is what real data looks like against a trend, and its plane summarised without honouring anybody.

The Expert reflex, on seeing a suspiciously perfect fit: count degrees of freedom, then ask where the values came from. Derived values, points computed from a surface, from another model, from an interpolation, carry their generator's structure, and fitting the same family of model back to them returns the generator with zero residual, tempting you to report certainty you do not have. W2's porosity here is exactly such a derived value.

## What the exact fit licenses and what it does not

On this fixture, the exact fit licenses precise statements about the MODEL: the graded probe is hand-computable, the trend map in block 0 is the generating plane, and the trend-versus-kriging comparisons of module five are clean because both methods see consistent data. It licenses nothing about GEOLOGY: no earth has exactly planar porosity, and the fixture does not claim one; it trades realism for checkability, the same bargain every golden model in this course family makes, stated openly.

The practical residue for real work: always PRINT the residuals of a trend fit, never just the coefficients. Residual patterns, not coefficients, carry the diagnosis: random scatter says the trend family is adequate; a bowl or saddle says the family is too simple; machine zeros say look upstream at how the values were made.

## Worked example

Demonstrate the sum-to-zero property that any least-squares fit with an intercept must satisfy, as a check independent of exactness. Sum the four residuals: $(-4.4 - 1.7 + 6.7 - 1.1) \times 10^{-16} = -0.5 \times 10^{-16}$, zero to float precision. This holds for ANY data, planar or not, because the intercept's normal equation forces it; on the ReservoirCalc fixture the six messy residuals also summed to zero. So residuals summing to zero certifies the FIT ran correctly, while residuals being individually zero characterises the DATA. Two different zeros, two different messages, worth keeping rigorously apart.

## Exercise

Suppose a fifth control point were added at (1500, 2400) with a logged, not derived, porosity of 0.301. The plane predicts 0.296 there. Without refitting: state the sign of the new fit's residual at the new point, what happens to the residuals at the original four points, and which single sentence of this lesson the refitted model would no longer support.
