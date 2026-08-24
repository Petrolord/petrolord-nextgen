# Wood's equation

Module 2 gave you three fluids at reservoir conditions. Module 3 gave you the solid frame. Real pore space rarely holds one fluid, and the Ekene capstone case holds brine and gas together at 80 percent water saturation. Before anything can be said about the rock, the two pore fluids have to be replaced by one effective fluid with a single bulk modulus and a single density. Wood's equation is the rule that does it.

## The two formulas

A fluid mixture is described by saturations $S_i$ that sum to one. Wood's equation mixes the bulk moduli harmonically and the densities linearly:

$$\frac{1}{K_f} = \sum_i \frac{S_i}{K_i} \qquad \rho_f = \sum_i S_i \rho_i$$

The modulus half is a Reuss average over the fluid phases, the same harmonic average you met as the lower bound in the previous module. Here it is not a bound. It is the answer, and the reason is physical rather than conventional.

## Why the fluid mix is exactly Reuss

Fluids cannot support shear. They have zero shear modulus, so a fluid mixture cannot sustain a stress difference between its phases the way a mineral mixture can. Squeeze a pore that holds brine and gas together, and both phases end up at the same pressure, because gas can flow and brine can flow and nothing in a pore holds a pressure difference between them.

Equal stress in every phase is precisely the Reuss assumption. In a mineral mixture that assumption is one extreme of a range of possible geometries. In a well mixed pore fluid it is what actually happens, so the Reuss average stops being a lower bound and becomes the physical result.

That reasoning also names the condition under which Wood's equation applies. The phases must be intimately mixed at a scale much smaller than a seismic wavelength, and the pressures must have time to equalise within a wave cycle. That is called uniform saturation, and it is the assumption the engine makes. When gas sits in patches large enough that pressure cannot equalise across them, the mixture stiffens toward the Voigt side and Wood's equation understates the modulus. Hold that caveat. The last lesson of this module returns to it.

## Getting the units right before you start

The two inputs arrive in different units, and this is exactly where the capstone catches people.

Module 2 reported the brine bulk modulus in GPa and the gas bulk modulus in MPa, because that is the natural scale for each fluid. At 60 degC and 25 MPa, with 35,000 ppm salinity and 0.6 gas gravity:

| phase | K as reported | K in Pa | density (kg/m3) |
| --- | --- | --- | --- |
| brine | 2.6978112899395996 GPa | 2697811289.9395995 | 1017.8249875 |
| gas | 55.71865290286663 MPa | 55718652.90286663 | 172.66679461728904 |

You cannot add a GPa term to an MPa term. The engine works entirely in Pa, and so should you when you do this by hand. Convert both to Pa, do the mixing, then convert the result back to whichever unit you are reporting in. The Wood mix for this course is reported in MPa, because at 20 percent gas the answer is a small number of hundreds of MPa rather than a number of GPa.

## The working at Sw 0.8

Water saturation is 0.8, so gas saturation is 0.2 and the two sum to one. The compliance sum is

$$\frac{1}{K_f} = \frac{0.8}{2697811289.9395995} + \frac{0.2}{55718652.90286663}$$

Take the two terms one at a time, both in reciprocal Pa:

- the brine term is 2.9654e-10, which is 7.6 percent of the total
- the gas term is 3.5895e-9, which is 92.4 percent of the total

Inverting the full precision sum of those two terms gives

$$K_f = 2.573340919366766 \times 10^{8} \text{ Pa} = 257.3340919366766 \text{ MPa}$$

which is the value the capstone grades, with a tolerance of 0.5 MPa. Working from the two rounded terms above rather than the full precision ones lands well inside that tolerance, so hand arithmetic is a valid check on the engine here.

The density half of Wood's equation is the subject of the next lesson, and it is far less interesting, which is itself the point.

## Read the two terms again

Almost the whole compliance came from the gas. The phase that occupies one fifth of the pore space contributed 92.4 percent of the softness, and the phase that occupies four fifths contributed 7.6 percent.

That is the harmonic average behaving as harmonic averages do. It weights compliances, not moduli, and the gas compliance is enormous because the gas modulus is small. Module 2 recorded that brine is 48.42 times stiffer than gas at these conditions, and that single ratio is what puts the gas term two orders of magnitude above the brine term in the sum.

The consequence is worth stating baldly, because the whole course turns on it. The mixed fluid modulus of 257.3340919366766 MPa is nothing like a weighted average of 2697.8113 MPa of brine and 55.7187 MPa of gas. It sits far closer to the gas. A pore fluid takes on the character of its softest phase, and it does so long before that phase is anywhere near half the pore volume.

The panel below lets you set the water saturation and re-read the fluids, the frame and the Wood mix together.

{{panel:rp-fluid-explorer}}

## Exercise

Without using the panel, say what Wood's equation must return for the mixed fluid modulus and density at a water saturation of 0.0, and check your answer against the fluid table in this lesson. Then say what that tells you about the formula.

Self check: at Sw 0.0 the brine term drops out of the sum and the compliance is 1.0 divided by the gas modulus, so the mix must return the gas properties unchanged, which is 55.7187 MPa and 172.66679461728904 kg/m3. What that shows is that Wood's equation reduces to the single phase case at both ends of the saturation range, which is a required property of any mixing law and a free check you can run on any implementation of one.
