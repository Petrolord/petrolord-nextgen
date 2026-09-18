# This module has its own friction factor

{{panel:fc-inhibitor-integrity-explorer}}

The Pipeline and Line Sizing course computes a friction factor and a Reynolds
number for a pipe. So does this module. They use a different correlation and a
different laminar to turbulent transition, so on the same pipe the two will not
agree, and the engine states that in its own docstring rather than leaving a
reader to discover it. This is a real disagreement between two modules on one
platform and this course's job is to name the seam.

So the vocabulary is deliberate throughout this tier. When the number is this
one, write this module's friction factor and this module's Reynolds number, and
say that the line sizing course computes its own.

## What this module's friction factor is built from

It has two branches with a hard switch between them, and four constants, all
four measured out of the engine's behaviour and all four held for literature.

| constant | measured out of the engine |
| --- | --- |
| the Blasius coefficient | 0.046000000000 |
| the Blasius exponent | -0.200000000000 |
| the laminar constant | 16.000000000000 |
| the friction branch switch, Reynolds | 4000.000000 |

Held for literature means no source for the number exists in this repository.
The engine declares all four in its own list, and nothing in this course grades
a friction factor or a wall shear because of it.

## The two branches on real streams

| stream | Reynolds | branch | friction factor | wall shear Pa | film risk |
| --- | --- | --- | --- | --- | --- |
| Etelebou | 313781.4400 | turbulent | 0.003660 | 10.914770 | low |
| Kanbi | 363816.0533 | turbulent | 0.003553 | 5.438833 | low |
| Tunu | 1063231.0691 | turbulent | 0.002867 | 369.638295 | high |
| Opukushi | 193290.8250 | turbulent | 0.004032 | 3.436459 | low |
| Angiama | 3.3754 | laminar | 4.740191 | 8.031496 | low |

The Angiama stream runs at a Reynolds number of 3.3754, which puts it in the
laminar branch, and the friction factor it gets there is 4.740191 against the
0.002867 the Tunu stream gets in the turbulent branch. Those two figures come
from different expressions.

## After the factor, the shear

The friction factor is the middle of the calculation rather than the end of it.
The Reynolds number is formed first, from a density, a velocity, a diameter and
a viscosity, and it is a definition rather than a correlation. The friction
factor is then read off one of the two branches, and the wall shear follows from
the factor and the flow. That split is why this course grades a Reynolds
number and grades no friction factor and no shear.

## Why the seam matters to a reader

Two numbers on one platform that answer the same question differently will be
compared by somebody sooner or later. If you take this module's Reynolds number
into a line sizing calculation you will be mixing two correlations, and the
mismatch will show up as a disagreement neither screen explains. Use each module's own number
inside that module, and when the two differ, read the difference as a property
of the two correlations rather than as a property of the pipe. A reader who
carries one module's figure into another module's screen has built a
disagreement that neither screen is equipped to explain.

## One number, two owners

Nothing here is a naming problem better labels would solve. Two modules
genuinely compute a friction factor for the same pipe with different
correlations, and removing the duplicate is a cross-module decision rather than
a repair either course can make alone, so this course names the seam and leaves
it in plain view.

## Exercise

Record this module's Reynolds number, friction factor and wall shear for the
Tunu stream and for the Angiama stream. State which branch each landed in and
what the switch Reynolds number between the branches is. Then write one sentence
saying which other course on this platform computes its own friction factor for
the same pipe.
