# A plane through the points

The first of the two population methods fits a plane through the control values and evaluates it anywhere. This lesson derives the machinery: what is being minimised, how the engine solves it, and what the golden fit produces.

## The model

The trend method models porosity as a linear function of position:

$$\phi(x, y) = a + b\,x + c\,y$$

Three coefficients: a base level and two horizontal gradients. Fitting means choosing $a, b, c$ to minimise the sum of squared misfits over the control points. The classic least-squares normal equations do it: three linear equations in the three unknowns, built from sums of $x$, $y$, $xy$, $x^2$, $y^2$, $\phi$, $x\phi$ and $y\phi$ over the points, solved by Gaussian elimination with partial pivoting. The engine refuses two degenerate inputs, with specific messages: fewer than three points, since three coefficients need three equations, and collinear points, where the normal matrix goes singular because a plane through a line is free to rotate about it.

Note what the weights do here: nothing. The trend fit is UNWEIGHTED; every control point votes equally regardless of its MD interval. That is a deliberate asymmetry against the constant method, which uses the weights, and it means the trend and the constant disagree about more than shape.

## The golden fit

Through the four zone A points, the engine recovers:

$$\phi(x, y) = 0.38 - 0.00004\,x - 0.00001\,y$$

to machine precision: $a = 0.38000000000000367$, $b = -4.000000000000019 \times 10^{-5}$, $c = -1.0000000000001448 \times 10^{-5}$. Porosity declines eastward at 0.004 per 100 m, four times faster than it declines northward. The signs match the raw observation from module three, west high, east low, and put a number on it.

The graded probe evaluates the plane at (1250, 2250):

$$0.38 - 0.00004 \times 1250 - 0.00001 \times 2250 = 0.38 - 0.05 - 0.0225 = 0.3075$$

Three multiplications, hand-exact, graded at 0.001. The engine's value is 0.30750000000000016; the arithmetic contains nothing capable of manufacturing error beyond float dust.

## Trend answers a different question

Keep the method's epistemology distinct from kriging's before meeting the residuals next lesson. A trend fit asks: what REGIONAL LAW best describes these points? Its output is a law, evaluated anywhere, including at the control points, where it feels no obligation to reproduce the data. Kriging will ask: given these exact values at these places, what is the best estimate HERE? One is regression, the other interpolation; one summarises, the other honours. Fields use both because both questions are real: a trend for the geology's shape, an estimator for the map that respects the wells.

## Worked example

Evaluate the plane at all four control points, since next lesson turns on it. W1 (1100, 2100): $0.38 - 0.044 - 0.021 = 0.315$. W2 (1610.8719179395334, 2200): $0.38 - 0.06444 - 0.022 = 0.2936$, and at full precision 0.29356512328241885. W3 (1900, 2700): $0.38 - 0.076 - 0.027 = 0.277$. W4 (2050, 2150): $0.38 - 0.082 - 0.0215 = 0.2765$. Every one lands ON the data to the shown digits. Hold that thought with suspicion; it is next lesson's whole subject.

## Exercise

Using the fitted plane, compute the porosity difference it predicts between the model's northwest corner (1000, 2950) and southeast corner (2200, 2000), and decompose the difference into its x-driven and y-driven parts. State which direction dominates and by what factor.
