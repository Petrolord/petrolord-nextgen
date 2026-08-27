# The benchmark verdict

The engine has produced its answer to Dake Exercise 9.2 and Dake has published his. The remaining question is the one that decides whether any of this can be put in front of a reserves committee: did it pass, and what exactly is being claimed when you say so.

## The two numbers, side by side

Dake's own answer for the oil in place on this field is 312 MMSTB, and his reD 5 unsteady state solution gives a cumulative influx of about 89.2 MMrb at year 10. The engine returns 307.221409553720 MMSTB and 88.0645883139400 MMrb.

That is a miss of 1.53159950201266 percent on the oil in place and 1.27288305612107 percent on the water influx, both low. The gaps in absolute terms are 4.77859044628002 MMSTB and 1.13541168606000 MMrb.

Resist the temptation to read those two misses as one coupled result. Module 1 showed that within a single model, more influx forces less oil, so a run that is low on both would look self contradictory. It is not, because these are two separate comparisons against two separately produced published numbers: Dake's influx figure comes from his Hurst and van Everdingen solution, not from a Carter-Tracy march, and his 312 MMSTB does not come from that influx figure either. Comparing against a book is not a controlled experiment, and reasoning about the sign of a difference is only valid when everything except the one thing under test is held fixed.

## What the tolerance is for

The engine records more than a pass. On this path it returns a validation tier of `benchmark_verified` and a validation tolerance of 3.53 percent. The current miss of 1.53159950201266 percent is inside it.

The number to understand is 3.53, not the pass. A tolerance on a benchmark is not slack granted to a piece of software so that it can get away with being sloppy. It is an estimate of how far two correct calculations of the same quantity can legitimately sit apart when they use different methods. If that spread is three percent, then agreement to within three percent is the strongest claim the comparison can support, and asserting agreement to within a tenth of a percent would be asserting against the reference author's arithmetic rather than against the physics.

Three independent measurements of the spread on this exact case say that the recorded tolerance is about the right size.

The first comes from Dake himself. The fixture records both his truth value of 312 MMSTB and his own least squares Hurst and van Everdingen fit of 310.2 MMSTB. One author, one dataset, one method, and a spread of 0.576923076923081 percent between his fit and his own answer. Measured against that fit rather than against the truth, the engine is 0.960216133552550 percent away.

The second comes from inside this repository. There are two implementations of Carter-Tracy here, and they differ in how they represent the bounded aquifer: the material balance engine blends a Lee and Wattenbarger rational fit into the pseudo steady state line with a hyperbolic tangent transition, while `aquiferInflux.js` inverts the exact bounded circle Laplace form by the Stehfest algorithm. Fed the identical case, they return 88.0645883139400 and 86.1334685654881 MMrb, a difference of 2.19284480337055 percent. Neither is wrong. They are two numerical routes to the same solution family.

The third measures the Carter-Tracy approximation itself. Take the boundary out, so both methods are on the same infinite acting footing, and compare the recursion against the full superposition it was invented to replace, with identical $U$ and identical dimensionless time. The convolution gives 149.344654829452 MMrb and Carter-Tracy gives 151.540144278610 MMrb, agreeing to 1.47008237533918 percent. That is the price of trading the sum for the recursion, measured rather than asserted, and it is a good deal.

Three spreads, all between half a percent and two and a quarter percent, against a recorded tolerance of 3.53 percent and a miss of 1.53 percent. The verdict holds together.

For completeness, the Fetkovich oil path in the same engine is validated against this same Dake production data and its record carries a tolerance of 10 percent, with the wording attributing it to the spread between Fetkovich and Hurst and van Everdingen. Different method, wider legitimate spread, larger tolerance. The tolerance travels with the method, not with the case.

## The record is dated

One more thing belongs in a verdict lesson, because it is the sort of detail that separates reading a result from trusting one.

The provenance string attached to this path quotes an engine OOIP of 301.0 MMSTB, an error of 3.53 percent, an R squared of 0.9998 and drive indices of 0.608, 0.392 and 0.011 summing to 1.010, from a validation run dated 2026-05-17. The engine today returns 307.221409553720 MMSTB, an R squared of 0.999975248425736, and indices of 0.567843338103932, 0.417877131928747 and 0.0114445927296736 summing to 0.997165062762353.

The gate still passes, and it passes more comfortably than the record says, because the recorded tolerance of 3.53 was set from that older and larger miss. But the numbers inside the reference no longer describe the run. A provenance string is a dated record of one execution, not a live assertion, and it should be read with its date attached. Module 5 takes validation tiers and provenance apart properly.

## Worked example: writing the verdict down

A benchmark verdict belongs in one sentence with four components: the reference, the quantity, the miss and the tolerance. For this case:

The engine's Carter-Tracy oil path reproduces Dake Exercise 9.2 with a finite aquifer at $r_{eD}$ 5, returning 307.221409553720 MMSTB against Dake's 312 MMSTB, a difference of 1.53159950201266 percent, inside the recorded tolerance of 3.53 percent for this path.

Now strike out each component in turn and see what the sentence still supports. Without the reference it is a number. Without the quantity it is unfalsifiable. Without the miss it is an assertion of faith. Without the tolerance it is the most common failure of all: a claim of agreement with no statement of what agreement was required, which cannot be checked by anyone and cannot be failed by anything.

What the sentence does not say is also worth naming. It does not say the engine will be within 1.5 percent on your field. Dake 9.2 has an exceptionally clean pressure history, per row laboratory PVT and a mapped aquifer radius ratio. A benchmark establishes that the implementation of a method is faithful. It says nothing about whether the method suits your data.

## Exercise

A colleague runs the same fixture after a code change and reports 336 MMSTB with an R squared of 0.9997, and writes in the commit message that the result still matches Dake.

First, compute the percentage difference against Dake's 312 MMSTB and against the previous engine value of 307.221409553720 MMSTB, and state whether the run passes the recorded tolerance of 3.53 percent for this path. Second, the colleague points out that 336 is within the 10 percent tolerance recorded on the Fetkovich path for the same production data. Write the two sentence reply explaining why that tolerance is not available to a Carter-Tracy run. Third, draft the verdict sentence you would accept in its place, with all four components present, and add one sentence naming the check you would ask for before the change is merged.
