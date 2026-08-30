# The story so far

Five modules, one side force, and what it does to steel.

## The claim

The friction force this model computes does two things the previous tiers did not follow: it pushes back on the string, which buckles it and eventually stops load reaching the bit, and it grinds against the casing, which takes wall off it invisibly.

Both are the same side force, read for a different consequence.

## What each module established

**Module 1.** A string in compression is a different mechanical object from a rope in tension. Two buckling limits: sinusoidal, where the pipe snakes along the low side, and helical, where it wraps and starts pressing outward. The limit expression carries EI, buoyed weight, sin(inclination) and the inverse of the radial clearance, so a vertical hole has a limit of exactly zero and a tighter hole has a higher limit than a washed-out one. The helical limit is 2 root 2 less 1 times the sinusoidal one, to sixteen digits, in every case, because both come from the same expression. The engine flags buckling and does not change the friction, so past the limits its answers are optimistic.

**Module 2.** Two capacities and two utilizations, computed independently against their own ratings with no interaction term. On the vertical well tension is 7.557 times torsion; on the horizontal well the ratio inverts. Tension utilization scales with the string's true vertical depth and torsion with its contact length, and a lateral is all contact length and no TVD. Combined loading, bending stress, connections and dynamic peaks are all outside the check, which makes it a screening indicator rather than a pipe strength calculation.

**Module 3.** Wear volume is the wear factor times the side force times the sliding distance, and the sliding distance depends only on the product of rpm and hours. Converting a volume to a depth needs the crescent geometry, which is nonlinear: doubling the wear factor raises the depth by about 1.6 rather than 2. The inversion is a bisection, not a formula. The wear concentrates just above the shoe on this well because that is where the build below starts to bite.

**Module 4.** Wear lands where side force lands, and a narrow spike matters more than a broad loss. The wear factor is the biggest lever by a wide margin and rpm is nearly useless on its own. Burst derates in proportion to wall thickness and collapse derates much faster, which the engine deliberately does not compute. And the whole chain inherits a fitted friction factor, a model gap and a laboratory constant with a factor-of-twenty range, so the answer is reliable in shape and soft in magnitude.

**Module 5.** The horizontal well tripping in is 282 kN into compression against a sinusoidal limit around 170 kN, so its reported hookload is the optimistic end of a range the model cannot see. Lock-up is a positive feedback the model structurally cannot predict, and it produces a hard limit on lateral length rather than an economic one. On a long lateral torque binds first, then weight transfer, and hookload is comfortable throughout. And the disagreement with the independent oracle is stated in full: worst relative 6.70e-2 and worst absolute 1632.220696788194 N, both on the horizontal well in compression, discretisation for the most part, with a residual of a few tens of newtons that the one closed-form case attributes to the oracle.

## The numbers to carry

- The helical over sinusoidal ratio: 1.8284271247461903, always.
- Drill pipe torsional capacity here: 100465.75263363292 N.m. Tensile: 3167446.9781754497 N.
- Vertical well utilizations: 0.20310094303602616 tension, 0.026874829772549985 torsion. The horizontal well inverts that ratio.
- Friction torque per metre of lateral for this pipe at 0.35: about 7.81 N.m.
- The oracle's error on the one closed-form case: 42.6224374640733 N. The engine's: about 4e-9 N.

## The one sentence

A side force is a hookload, a torque, a buckling state and a groove in the casing, and the same number produces all four with the same uncertainty in each.
