# The diagnostic against the design

Predict a card, hand the surface half of it back to the diagnostic, and the pump card that comes out should be the one the prediction assumed. The two solvers share no code path, so the round trip is a real check.

{{panel:pd-balance-explorer}}

## The agreement

On ODUMA-4 the plunger stroke from the march is 98.526653100 in and from the diagnostic 98.826085067 in. They differ by 0.299431967 in, which is 0.303910 percent. A damped wave marched in time and a harmonic sum propagated in closed form, agreeing that closely, is the strongest single piece of evidence in this course that the march does what it claims.

## Where they part, and why

The diagnostic's maximum pump load is 4936.432691865 lb against the fluid load of 4690.299657039 lb that the march put on the plunger, a difference of 246.133034826 lb. Its minimum pump load is -207.880450457 lb against the 0 lb the march put on the plunger while it fell.

It overshoots at both ends, and the reason is structural rather than numerical. A truncated harmonic sum cannot reproduce the two vertical valve transfers, the sharpest feature of any pump card, and overshoot beside a discontinuity is what a Fourier sum does. On this case the true card sits inside the two extremes reported.

## More harmonics is not the repair

Twenty four harmonics were used out of a card of 186 points, whose cap is floor(N/2) - 1 = 92.

| Harmonics | Plunger stroke, in | Max pump load, lb | Difference from the march, in |
| --- | --- | --- | --- |
| 2 | 100.195381774 | 4879.135269 | 1.668728674 |
| 4 | 99.132917850 | 5069.393038 | 0.606264751 |
| 6 | 100.191576814 | 5125.900515 | 1.664923714 |
| 8 | 99.301566863 | 5086.315669 | 0.774913763 |
| 12 | 99.170537485 | 4932.635366 | 0.643884386 |
| 16 | 98.778844387 | 4960.176799 | 0.252191287 |

The last column does not descend. Four harmonics beat six, and past sixteen the difference settles into a band instead of shrinking: 0.299431967 in at 24 harmonics, 0.255951460 in at 32, and 0.344508847 in at 91, which is worse than 16. Refining until the answer stops moving is not available here, because it does not stop moving.

## The card it reads was already sampled

The surface card the design hands out holds 186 points, decimated from the 6110 steps the march computed. The diagnostic sees those and nothing else, so every number it returns inherits that subsample as well as its own truncation. The 0.303910 percent is the price of the whole round trip and cannot be charged to either solver alone.

## What the agreement licenses

The plunger stroke, confidently. Not the pump load extremes, which overshoot by construction: treat them as bounds the true card lies within and quote the fluid load from the design when the design is what you are reporting.

## Exercise

Write the two plunger strokes, their difference in inches and in percent, and the two pump load extremes against what the march assumed.

Then read the stroke difference at 4, 6, 16 and 91 harmonics and say what that sequence rules out.
