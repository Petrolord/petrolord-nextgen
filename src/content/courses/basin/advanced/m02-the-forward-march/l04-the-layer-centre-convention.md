# The layer centre convention

Every layer's kinetics run at one temperature per step: the temperature interpolated at the layer's centre depth. This lesson pins that convention, works the graded final temperature, and prices what the one-point representation ignores.

## The convention

After each step's thermal solve, the engine takes each layer's midpoint, half way between its current top and bottom, samples the temperature profile there by linear interpolation between the cell-centre nodes, and hands that single value to both kinetic states for the step. For the source at present day: top 2800, bottom 3200, centre 3000 m, and the sampled value is the capstone's 149.76037539670858 degC, tolerance 0.1.

The choice is a compromise stated plainly: kinetic state is carried per layer, not per cell, so one temperature must represent the layer, and the centre is the unbiased single point. The thermal grid itself is finer, cells of at most 100 m, so the profile being sampled is well resolved; the coarseness is only in the kinetics' representation of the layer.

## What the centre misses

A 400 m layer spans real thermal range. At today's roughly 26 degC per km around the source, its top-to-bottom spread is about 10 degrees, top near 145 and bottom near 155 around the 149.8 centre. The Professional tier priced ten degrees at the reacting front as a factor of about five in rate, so the layer's bottom matures meaningfully faster than its top, and the model's single-Ro-per-layer answer is best read as the maturity of the layer's middle.

For the capstone fixture this is a definition, not an error, because the graded values are defined on the same convention that computes them, and the independent oracle uses it identically. For real work it sets a modelling grain size: a source interval whose internal maturity profile matters should be entered as several thinner layers, each with its own centre, which the input format permits. The convention's cost falls quadratically with layer thickness, since the centre is exact for a linear profile and layers thin as they subdivide.

## The graded value's anatomy

Trace 149.76037539670858 to its parts, because the exam will probe the chain. Geometry put the centre at 3000 m, module 2's stacking. The boundary conditions supplied 15 degC at the surface and 60 mW/m2 at the base, module 1's history read at age zero. The conductivity stack, porosity-blended per cell, set the two-gradient-like structure of today's profile, the Associate tier's physics generalised. And the transient machinery, by the quiet ending, had fully relaxed. Change any link, the surface temperature most invisibly, and the graded value moves: with a 10 degC surface the whole column shifts down about five degrees at depth, far outside the 0.1 tolerance.

That last point carries a trap worth naming: this basin's surface is 15 degC, the Associate tier's teaching column used 10, and the engine's own default when settings omit it is 20. Three numbers, three roles; the capstone uses the project's 15.

## Worked example

Estimate the source's top and bottom temperatures at present day from the centre value and the local gradient, then state what the model would report if the source had been entered as two 200 m layers. With 149.76 at 3000 m and about 26 degC per km locally: top near 144.6, bottom near 155. Entered as two layers, the model would run kinetics at the two sub-centres, near 2900 and 3100 m, roughly 147.2 and 152.4 degC, and report two reflectances bracketing the single-layer answer, the deeper half a few hundredths of Ro ahead by the Professional tier's rate arithmetic.

## Exercise

State where the kinetics' temperature comes from each step, in one line. Then answer in one sentence each: why is the centre convention harmless for the capstone but a grain-size decision in real work, and which three surface temperatures circulate in this course and where does each belong?

As a self check: the kinetics receive the thermal profile sampled at the layer's current midpoint depth. It is harmless on the capstone because the graded values are defined by the same convention, while in real work a thick source's internal spread, about ten degrees per 400 m here, is invisible unless the interval is subdivided. The three surface temperatures: 15 degC is the reference basin's setting, 10 degC the Associate tier's steady column fixture, 20 degC the engine default when a project omits the setting.
