# The certified valve equation

{{panel:fc-sizing-explorer}}

The liquid route is the shortest equation in this module and the only one with a loop inside it. This lesson takes it in its simplest state, with the viscosity left out entirely, so that the loop can be introduced afterwards against a known answer.

## AKASO, stated

AKASO is the liquid stream this tier follows. It states 860.000000 gpm, a set pressure of 310.000000 psig, a 10.000000 percent overpressure allowance, a back pressure at the valve outlet of 40.000000 psig, a specific gravity of 0.840000, a viscosity of 85.000000 cp, a Kd of 0.650000, a Kw of 1.000000 and a Kc of 1.000000.

Called with the viscosity left out, the engine returns an area of 1.839323 in2 at a correction of 1.000000, with no Reynolds number and no iterations at all.

That absence is worth looking at directly. The returned Reynolds number is not zero and it is not a large number standing in for infinity. It comes back as a null, because with no viscosity stated there is no Reynolds number to report. A caller who formats that field without checking it prints the word null on a screen. A caller who does arithmetic on it gets zero, because that is what a null becomes in arithmetic here, and zero is a perfectly plausible looking Reynolds number. The absence has to be handled as an absence.

## Pressures in gauge, and a difference

The liquid equation works on the differential across the valve. AKASO's relieving pressure is 341.000000 psig and its outlet pressure is 40.000000 psig, so the differential is 301.000000 psi. Both figures are gauge and the atmospheric constant never enters the route.

## The leading constant, and the certified coefficient

The liquid leading constant is 38.000000000000, recovered from one inviscid area at unit coefficients rearranged against its own stated inputs. The validation oracle checks the same constant against the published SI form of the same equation, so the customary packaging of the units is checked rather than asserted.

Kd is a different kind of number. At 0.650000 it is the valve manufacturer's own certified discharge coefficient, and the figure this engine defaults to is a placeholder for whatever the certified one turns out to be. It is always stated in this course for that reason. Notice how much smaller it is than the 0.975000 the gas and steam routes state: a liquid service certified coefficient is a different quantity from a vapour one, and the two are not interchangeable.

Every coefficient is validated on the way in. Each one has to be a fraction of an ideal, which means above zero and no more than one, and a value outside that range is refused rather than used.

## Exercise

Write out the AKASO inputs and say which two of them the differential across the valve is built from. Then state what the engine returns for the Reynolds number when no viscosity is given, and say what a caller should do with that field before printing it.
