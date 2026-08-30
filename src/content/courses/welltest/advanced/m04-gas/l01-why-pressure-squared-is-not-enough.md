# Why pressure squared is not enough

Gas is compressible, its viscosity changes with pressure, and the liquid equations assume neither.

## What breaks

Every equation in the first two tiers assumed a slightly compressible fluid of constant viscosity and constant compressibility. Oil is close enough to that over the pressure range of a test.

Gas is not. Between 2000 and 4000 psia at 180 F, a 0.65 gravity gas changes its z factor from 0.8905871966416155 to 0.9625948022132558, its viscosity by tens of percent, and its compressibility by more than a factor of two.

Those quantities appear in the diffusivity equation. When they vary with pressure, the equation is no longer linear, and everything built on linearity fails: superposition, the logarithmic solution, the straight lines, all of it.

## The two classical fixes

**Pressure squared.** For an ideal gas at constant mu z, the product of density and mobility works out proportional to pressure, so the equation becomes linear in p squared rather than in p. Analyse p squared and the liquid machinery applies.

This is exact only if mu z is constant. It is a good approximation at LOW pressures, below about 2000 psia, where mu z happens to be nearly flat.

**Pseudo-pressure.** Al-Hussainy, Ramey and Crawford defined

    m(p) = 2 integral from 0 to p of  p' / (mu(p') z(p')) dp'

which linearises the equation without assuming anything about mu z. It is exact for the real gas, and it is what modern analysis uses everywhere.

The pressure-squared method is the special case of pseudo-pressure when mu z is constant, and the pressure method is the special case when p/(mu z) is constant, which holds at high pressures above about 3000 psia.

## The size of the error

Take the two pressures above. Pseudo-pressure at 2000 psia is 293027042.5469171 psi squared per cp; at 4000 psia it is 967928373.9508052.

The ratio is 3.30320493814433.

The pressure-squared method would say the ratio is 4000 squared over 2000 squared, which is exactly 4.

So over that interval the pressure-squared approximation overstates the driving force by about 21 percent, and any deliverability or permeability calculation built on it inherits that.

That is not a rounding error. It is the difference between a well that meets its contract rate and one that does not.

## Where the error comes from

The integrand is 2p / (mu z). At low pressure, mu z is small and nearly constant, so the integrand is nearly proportional to p, and integrating gives something nearly proportional to p squared. The approximation holds.

At high pressure, mu rises substantially and z rises too, so the integrand grows more slowly than p. Integrating gives something that grows more slowly than p squared. The approximation overstates.

The crossover is around 2000 to 3000 psia for typical gases, which is exactly the range where many tests are run, and it is why the pseudo-pressure form is the only one worth using as a default.

## What the engine does

`buildGasPvtTable` builds a table of z and viscosity against pressure, using the Papay correlation for z, Lee-Gonzalez-Eakin for viscosity, and Sutton pseudo-criticals, or a laboratory table if one is supplied.

`makePseudoPressure` integrates 2p/(mu z) by trapezoid over that table and returns m(p), its inverse, and the gas compressibility as functions.

The laboratory table takes precedence over the correlations when it is available, which is the right default: a measured PVT beats a correlation, and the file says so.

## The misconception to avoid

"Pseudo-pressure is a refinement of pressure squared." They are different approximations of the same exact quantity, valid in different pressure ranges, and neither is a refinement of the other. Pseudo-pressure is the exact form and the other two are its low-pressure and high-pressure limits. Using pseudo-pressure everywhere costs one table lookup and removes the question.

## Exercise

Using the two pseudo-pressures above, compute what permeability a pressure-squared analysis would report relative to a pseudo-pressure analysis of the same data over that interval.

Then say at which of the two pressures, 2000 or 4000 psia, the pressure-squared approximation is the better one, and why.
