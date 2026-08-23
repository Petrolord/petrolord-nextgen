# Combining neutron and density

You now have two independent porosity estimates at every depth: the density porosity from RHOB and the neutron apparent porosity NPHI. This lesson combines them into the single curve the rest of the course books, and explains why a combination is more trustworthy than either input.

## Why two tools beat one

The density and neutron tools fail in opposite directions, and that is the entire argument.

In shale, the neutron reads far too high because it counts clay-bound hydrogen as if it were pore water. The density porosity is disturbed too, but by a different mechanism (the shale grain density differs from the sand matrix value), and in the typewell shale it reads low rather than high. The errors do not stack; they oppose.

In gas, the pattern flips. Gas is light, so the bulk density drops and the density porosity reads too high. Gas is also hydrogen-poor per unit volume, so the neutron reads too low. Again the two tools straddle the truth from opposite sides.

A single-tool interpretation inherits that tool's bias in full. An average inherits only half of each bias, and where the biases are roughly equal and opposite, they cancel. This is the cheapest error reduction in petrophysics: no new measurement, just arithmetic on two curves you already have.

## The combination the engine uses

The app computes the neutron-density porosity as the simple arithmetic average:

$$\phi_{ND} = \frac{\phi_D + \phi_N}{2}$$

where $\phi_D$ is the density porosity and $\phi_N$ is the neutron reading on a compatible matrix scale. A root-mean-square variant exists and is preferred by some interpreters in gas zones, because it weights the larger of the two values more heavily and compensates better for the strong gas suppression of the neutron. The typewell holds oil and water only, so this course books the plain average throughout, and the capstone expects it.

The average is deliberately unglamorous. It takes no view on which tool is right. Where the tools agree, it returns what they both said. Where they disagree, it splits the difference and leaves the disagreement itself as information for you to interpret, which is exactly what the crossplot lesson later in this module does.

## Worked example

Compute $\phi_{ND}$ at the clean mid SAND_A sample, 2020 m, step by step.

1. Density porosity from RHOB = 2.3035 g/cc, with the typewell givens $\rho_{ma} = 2.65$ and $\rho_{fl} = 1.0$:

$$\phi_D = \frac{2.65 - 2.3035}{2.65 - 1.0} = \frac{0.3465}{1.65} = 0.2100.$$

2. Neutron reading at the same depth: $\phi_N = 0.13$.

3. Average:

$$\phi_{ND} = \frac{0.2100 + 0.13}{2} = \frac{0.3400}{2} = 0.1700.$$

The booked porosity at this depth is 0.1700, or 17.0 porosity units.

Notice what happened: the combination reads lower than the density porosity alone. The neutron reads low in this clean sand, the density reads high relative to it, and the average splits the disagreement rather than picking a side. Whether the true porosity is nearer 0.13 or 0.21 cannot be settled from these two curves at one depth; what the average guarantees is that you are not betting the whole interpretation on one tool's calibration.

For contrast, do the same at the water-leg sample, 2076 m: $\phi_D = 0.0980$ and $\phi_N = 0.098$, so

$$\phi_{ND} = \frac{0.0980 + 0.098}{2} = 0.0980.$$

Where the tools agree, the average changes nothing. Agreement between independent physics is the strongest quality signal a log analyst gets, and the water leg provides it.

## What this does to the interpretation

Booking $\phi_{ND}$ instead of $\phi_D$ moves the SAND_A zone mean from 0.2022 (density only) to 0.1762. That is a reduction of 2.6 porosity units in the number that flows into every saturation calculation and every volumetric downstream. The direction of the change is conservative here, and the professional habit is to know the size of that shift and be able to defend the choice, rather than to discover at review time that two team members booked different curves.

Keep in mind what the average does not fix. If both tools share a common-mode error, for instance a washed-out hole disturbing both measurements, the average is just as wrong as the inputs. The combination defends against independent, opposing errors, which are the common case in shale and gas, and the borehole quality checks from the beginner course remain in force.

## Exercise

Compute $\phi_{ND}$ at the shale point, 2000 m, where RHOB = 2.55 g/cc and NPHI = 0.30. As a self-check: the density porosity is $(2.65 - 2.55)/1.65 = 0.0606$, and the average is $(0.0606 + 0.30)/2 = 0.1803$. Then state in one or two sentences why this 0.1803 is still not a usable effective porosity for the shale, and which lesson of this module deals with that problem.
