# Zoeppritz

The exact solution to the reflection problem has been known since 1919. This lesson says what it solves and why it is not what anybody uses.

## The problem

A plane compressional wave arrives at a plane interface between two elastic halfspaces. Four waves leave: a reflected compressional wave, a reflected shear wave, a transmitted compressional wave and a transmitted shear wave.

The amplitudes of those four are fixed by requiring that displacement and stress are continuous across the interface, which gives four equations in four unknowns.

Solving that system gives the exact reflection coefficient for the compressional wave, which is what a seismic survey records.

## What it needs

Both halfspaces' compressional velocity, shear velocity and density, and the incidence angle. Six rock numbers and one geometry number, the same inputs Shuey uses.

The difference is not the inputs. It is that Zoeppritz's solution makes no approximation about the size of the contrasts or the size of the angle.

## The complex part

Past the critical angle, where the transmitted compressional wave stops propagating, the solution becomes complex. The reflection coefficient acquires a phase as well as an amplitude, and the wave transmitted into the lower medium becomes evanescent, decaying with depth rather than travelling.

At Ekene there is no critical angle within the recorded range. The gas sand is faster than the shale, so a critical angle exists at $\arcsin(2743/2905.6972) = 70.7$ degrees, far beyond anything a survey records. The imaginary part of the solution is zero throughout the 0 to 40 degree range this tier uses.

That is worth knowing because it is not always true. A brine sand under a slow shale can have a critical angle inside the recorded offsets, and everything linearised breaks down there.

## Why nobody uses it for interpretation

Two reasons, and the first is not the one people cite.

The usual reason given is that it is complicated. That is true and it does not matter, since a computer evaluates it as easily as Shuey's form.

The real reason is that it cannot be inverted. Zoeppritz's solution gives an amplitude from six rock properties. A seismic gather gives an amplitude curve, which is far less information than six properties, so the problem cannot be run backwards without extra assumptions.

Shuey's rearrangement solves that by collapsing six properties into two coefficients that a curve can actually determine. The approximation buys invertibility, and that is the trade.

## Where it is used

Forward modelling, which is what this tier does. When you have the rocks and want the response, there is no reason to approximate.

And as a reference. Every linearisation is checked against the exact solution, which is what the next three lessons do for Shuey's on this interface.

## Worked example

Confirm that the exact solution reduces to the impedance contrast at normal incidence, which is the one case where it simplifies.

At zero degrees the incident wave has no horizontal component, so the shear waves are not excited and the four wave system collapses to two.

The result is $R_0 = (I_2 - I_1)/(I_2 + I_1)$, and for the gas case that is $-0.0629911815139045$, which is what the engine returns at zero degrees.

Compare that with the Shuey intercept of $-0.06282494068620303$. The two differ by $0.00016624$ even at the angle where the approximation should be exact, because the intercept is the linearised impedance contrast rather than the impedance contrast itself.

That small gap at zero degrees is a good preview of the next lesson: an approximation that is already imperfect where it is best does not improve with angle.

## Exercise

State why the exact solution is used for forward modelling but not for inversion.

Self check: forward modelling supplies all six rock properties and wants an amplitude, which the exact solution gives with no approximation and no cost. Inversion has an amplitude curve and wants rock properties, and a curve cannot determine six independent numbers, so the problem needs a form with fewer coefficients. Shuey's two coefficients are what a gather can actually resolve, and that is what the approximation buys.
