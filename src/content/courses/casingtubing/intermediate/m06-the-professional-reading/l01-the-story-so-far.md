# The story so far

Five modules, seven cases, fourteen verdicts, and the worst point is not where you would look.

## The claim

A rating is a capacity and a load case is a load, and the whole of string design is comparing them at every depth rather than at one.

## What each module established

**Module 1.** A load case is two pressure columns and an axial profile on a 51 point grid down the true vertical depth. Both pressures are carried separately, not just their difference, because the triaxial check needs them separately. The section boundary is not a grid point, so each section is evaluated from its first interior point to its last, and on this string that misses the boundary by 19 m. Seven canonical cases cover the life of a string.

**Module 2.** The burst differential's slope is the inside gradient less the outside one, so a case with gas inside governs at the TOP and a case with mud inside governs at the BOTTOM. The gas kick puts its worst point at the wellhead with a safety factor of 1.6904923854809817, and a check that evaluated only the section bottom would have reported 2.396900745393525, overstating the margin by 41.8 percent. The pressure test governs at the shoe on both sections and is the worse of the two burst cases on both.

**Module 3.** Full evacuation is the pessimistic collapse case and it gives the lowest collapse number in the suite, 1.2882443095792595 at the shoe. Partial evacuation puts its fluid level at 1504.7518195805999 m, below the section break, so section 1 is byte-identical between the two cases and section 2 gains 47 percent. Cementing is milder than both and is the only one of the three that certainly happens. The collapse regime is plastic everywhere on this string, and the derating from tension contributes nothing at the deepest point because nothing hangs below it.

**Module 4.** The axial profile is buoyed weight plus overpull, with a buoyancy factor of 0.8165605095541402 at this mud weight. Overpull is applied to the running case only and it costs the lower section proportionally more. The triaxial check uses the exact Lame wall stresses at the bore and at the outside surface, adds a bending stress from the dogleg with both signs, and reduces to the tension check exactly under pure tension. Four minima are tracked independently and only two of them report a depth.

**Module 5.** Four design factors and a warning band at 1.1 times three of them. Thirteen of fourteen evaluations pass and the fourteenth is a WARNING on the pressure test in section 2, produced by the TRIAXIAL check rather than by the burst one the case is named after. The burst number cleared its own warning threshold by 0.0023376873879474847, so that conclusion is true and it is thin.

## The numbers to carry

- Burst governs at the top when the inside column is lighter than the outside one.
- The design factors are 1.1 burst, 1.0 collapse, 1.6 tension, 1.25 triaxial.
- The warning band is 1.1 times the design factor, and it does not apply to tension.
- Buoyancy factor is one minus mud density over 7850.
- Four minima, four possible depths, two of them reported.

## The one sentence

Seven load cases exist because no single one of them is worst everywhere, and the scan exists because no single depth is worst either.
