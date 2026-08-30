# Pseudo-pressure

The transform, its units, and the two things people get wrong with it.

{{panel:wt-regression-explorer}}

## The definition

    m(p) = 2 integral from 0 to p of  p' / (mu(p') z(p')) dp'

The units are psi squared per centipoise, which is not a pressure and does not behave like one.

Values are large. At 2000 psia in this course's gas, m is about 2.9e8. At 6000 psia the goldens give 1738288314.2505424.

Those magnitudes matter practically: a difference of two pseudo-pressures at nearby pressures is a small difference of large numbers, and computing it carelessly loses precision.

## How it is computed

The engine builds a table of (p, z, mu) and integrates 2p/(mu z) by trapezoid up the table, storing the cumulative integral at each pressure. Interpolation between table points is linear, with linear extrapolation on the last segment beyond the table.

The table resolution matters. The course's own runs use 200 points to 10000 psia; the fixture goldens were generated on a different mesh. The two agree to about four parts in a hundred thousand, which is the trapezoid rule's discretisation error and is a good illustration that a "transform" is a numerical procedure with its own error.

## The inverse

`pOfM` inverts m(p) by interpolation on the same table, and it is needed because analyses in pseudo-pressure space produce answers in pseudo-pressure space.

The most important case is the extrapolated pressure from a gas buildup. The Horner analysis returns a p* in psi squared per cp, which is not reportable. Inverting it gives a pressure, and the engine's `gasHornerAnalysis` returns both, with the inverted one as `pStarPressure`.

Forgetting to invert is the first of the two classic errors. A p* of 4.8e8 in a report is a pseudo-pressure that somebody forgot to convert, and it is recognisable by its magnitude.

## The compressibility

Gas compressibility is not the liquid one. For a real gas,

    cg = 1/p - (1/z)(dz/dp)

The engine computes it from the table by finite differences on z, and returns it from `makePseudoPressure` as `cgOf`.

It matters because ct appears in the skin equation and in the radius of investigation, and gas compressibility varies strongly with pressure. Using a constant ct evaluated at the wrong pressure is the second classic error, and it is silent.

The convention that works: evaluate the fluid properties at the INITIAL pressure and use them consistently, which is what the equivalent-liquid adapter in the next lesson does.

## What the transform does not fix

Pseudo-pressure linearises the pressure dependence of viscosity and compressibility in the diffusivity equation's coefficients. It does not linearise the TIME dependence.

The remaining non-linearity is in the storage term, and it is handled by a second transform, pseudo-TIME, which weights elapsed time by the varying mu ct. For a pressure transient over a few days the pseudo-time correction is usually small. For a production history over months it is not, and the rate transient module returns to it with a case where pseudo-time is half of material-balance time.

So: pseudo-pressure for the pressure axis, pseudo-time for the time axis, and the second one is needed less often but matters more when it is.

## The misconception to avoid

"m(p) is just a rescaled pressure." It is an integral of a non-linear function of pressure. Differences in m are not proportional to differences in p, ratios are not preserved, and a mean of two m values does not correspond to the mean of the two pressures. Every arithmetic step has to be done in one space or the other, consistently, and converted at the boundary.

## Exercise

Using m(2000) = 293027042.5469171 and m(4000) = 967928373.9508052, compute the pseudo-pressure at the arithmetic mean pressure of 3000 psia if m were linear in p, and compare it against the goldens' value of 605563023.7388964.

State the percentage error of the linear assumption, and say what that implies about averaging pressures in gas well analysis.
