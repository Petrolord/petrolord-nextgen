# Natural frequency

A rod string is a bar held at the top and free at the bottom, and a bar like that rings at a speed of its own that has nothing to do with the pump hanging off it.

{{panel:pd-string-explorer}}

## The quarter wave

A uniform bar's fundamental is one quarter wavelength over its length. Take the published uniform string, 7/8 rods over 6000 ft, and a rod wave speed of 16288.760984482 ft/s: sixty times the velocity over four times the length gives 40.721902461206 spm, and that is what the engine returns to every figure.

Only two things enter that, the length and the wave speed, and the wave speed barely moves with rod size. A 3/4 rod carries 16288.557542 ft/s and a 7/8 rod 16288.760984 ft/s. Rod diameter drops out because both the stiffness and the mass per foot scale with the area, so a uniform 5000 ft string of 3/4 rods and a uniform 5000 ft string of 7/8 rods ring at 48.865672625 and 48.866282953 spm, nearly the same note from strings weighing 8170.000000 and 11120.000000 lb.

## Three routes to one number

The oracle solves a finite element eigenvalue and reports 40.722116061 spm for the uniform string. The engine scans for a sign change and reports 40.721902461206 spm, a difference of -2.1360e-4 spm. A dense mode scan, walking the same transfer matrix on a two million point grid, also returns 40.721902461 spm.

On the published taper the same three routes give 53.362201213 spm from the oracle, 53.362124005810 spm from the engine scan, a difference of -7.7207e-5 spm, and 53.362124006 spm from the dense mode scan.

## The shorthand, and what it costs

The field rule of 245000 over the depth gives 40.833333333 spm on 6000 ft, which is 0.111430872 spm away from the engine's answer. Close enough to sketch with. It carries no taper factor at all, so on a string with sections it is answering a different question.

## What the engine computes first

For a stepped string it takes the uniform quarter wave the string would have if it were all one size, calls it the base note, then applies a taper factor. On the published taper the base is 48.866038821915 spm and the factor is 1.092008382351, giving 53.362124006 spm.

## What the note is not

It is not a resonance the unit will be driven at, and it is not a measurement. It is the free vibration of an idealised bar, with no fluid load, no damping and no pump on the end. What it is used for is a gate: a design at or above its own string's fundamental is refused.

## Exercise

Compute the quarter wave note of the published uniform string from 16288.760984482 ft/s and 6000 ft, and compare it with the industry shorthand.

Then say why two uniform strings of the same length but different rod sizes ring at almost the same speed, quoting 48.865672625 and 48.866282953 spm.
