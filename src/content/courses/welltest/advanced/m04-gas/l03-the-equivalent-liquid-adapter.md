# The equivalent-liquid adapter

A constant that is not a formation volume factor, and why it is there.

## The situation

The liquid straight-line machinery in `analysis.js` is correct, tested, and already written. The gas equations have the same shape with different constants: the Darcy coefficient is 1422 q T / (k h) instead of 141.2 q B mu / (k h), and the semilog slope is 1637 q T / (k h) instead of 162.6 q B mu / (k h).

Rather than write a second set of functions, the engine adapts. Feed the liquid analysis pseudo-pressures instead of pressures, with a fabricated formation volume factor chosen so that the liquid constants come out to the gas ones:

    B_eq = 1637 T / (162.6 mu_i)

Then 162.6 q B_eq mu_i / (m h) equals 1637 q T / (m h), which is the gas permeability, and the skin formula, which uses phi mu_i ct_i rw squared, is the correct gas expression evaluated at initial conditions.

## The number

For a reservoir at 640 degrees Rankine with an initial gas viscosity around 0.02 cp, the adapter's B comes out in the hundreds of thousands.

It is not a formation volume factor. It is not dimensionless in the way a formation volume factor is. It has no physical interpretation at all: it is the constant that makes one equation turn into another.

## Why this is worth a lesson

Because it will appear in a debug output, a log line or an intermediate table, and it looks like a catastrophic input error.

An engineer who sees B = 291226 in a well test calculation has every reason to stop and check, and the answer is that the calculation is correct and the quantity is not what its name suggests.

This is a general hazard of adapter patterns in engineering software. A structure designed for one physical quantity is reused for another by substituting an equivalent, and the field names lie about what they hold. The engine's file header documents the substitution explicitly, which is the minimum defence.

## The other substituted quantities

The same adapter passes:

- `q` as the gas rate in Mscf/D rather than stb/d;
- `mu` as the viscosity at INITIAL conditions, not at the flowing pressure;
- `ct` as the total compressibility at initial conditions;
- pressures as pseudo-pressures throughout.

So the returned p1hr is a pseudo-pressure, the returned p* is a pseudo-pressure, and the returned slope is in psi squared per cp per cycle.

Only the permeability, the kh and the skin come out in the units their names suggest. Everything else needs converting back, and `gasHornerAnalysis` converts p* for you and leaves the rest.

## The apparent skin

One more thing the adapter returns that is not what it says.

The skin from a gas analysis is the APPARENT skin, s' = s + D q, where D is the non-Darcy coefficient and q is the rate. It contains a real, rate-independent skin and a rate-dependent turbulence term, added together.

A single-rate test cannot separate them. Two tests at different rates can: plot the apparent skin against rate, and the intercept is s while the slope is D.

The engine has no function for that separation, because it would need multiple tests as input, and the course grades nothing about D. Both of those are stated in the final module.

## What to do about all this

Two habits.

**Read the adapter's documentation before reading its output.** The engine's gas file header states every substitution in its first thirty lines. It is worth the two minutes.

**Convert at the boundary, immediately.** Take the analysis output, invert the pseudo-pressures, label the skin as apparent, and carry only converted quantities into anything downstream. Intermediate values in an adapted space should not leave the function that produced them.

## The misconception to avoid

"The software returned a formation volume factor of 291226, so something is wrong with the inputs." Nothing is wrong. A quantity named B in a gas analysis is an adapter constant. The general lesson is that a field name in reused code is a claim about the original design, not about the current contents.

## Exercise

Compute B_eq for a reservoir at 200 F with an initial gas viscosity of 0.018 cp.

Then confirm that 162.6 times your B_eq times 0.018 equals 1637 times the temperature in Rankine, and state in one sentence what would go wrong if the viscosity used in the adapter and the viscosity used in the skin term were evaluated at different pressures.
