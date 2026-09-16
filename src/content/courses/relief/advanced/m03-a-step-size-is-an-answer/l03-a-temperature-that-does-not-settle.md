# A temperature that does not settle

A convergence study is a claim about one quantity at a time. The step refinement in this module converged the time. It said nothing at all about the temperature beside it, and this lesson is about why, and about what the temperature does instead of settling.

{{panel:fc-blowdown-explorer}}

## A column that never moved

Across all seven step sizes in the refinement study the final temperature reads 340.807983 degR. It is identical at 0.800000 s and at 0.012500 s, so the whole sixty-four-fold refinement left it exactly where it began.

The reason is the one the orifice sweep already gave: the end state is fixed by the pressure ratio across the blowdown and by the isentropic exponent. Neither is a function of the step size, so the temperature cannot move under refinement and the study does not test it.

This is a general trap. A convergence table with several columns looks like a convergence statement about all of them. It is only a statement about the columns that moved. Reading a constant column as confirmation is reading an absence of evidence as evidence.

## What the temperature does along the way

Inside a run the temperature never settles either, and that is a different point. It falls at every one of the 270 stations and reaches nothing. There is no steady value, because nothing puts heat back in: the march gives the vessel no heat from the metal or the surroundings, so the only equilibrium available to it is the end pressure you told it to stop at.

Read the ends of the trajectory. The vessel starts at 545.000000 degR and finishes at 340.807983 degR. Stop it earlier and it finishes warmer, at 464.976597 degR for an end pressure of 600.000000 psia. Stop it later and it finishes colder, at 232.011700 degR for an end pressure of 25.000000 psia. The temperature is a consequence of where you chose to stop.

## Two quantities, two kinds of check

So the march holds two answers of different character and each needs its own instrument.

The time is an integral. It accumulates step by step, it can be wrong by a little at every step, and a refinement study is the right instrument for it.

The final temperature is an algebraic consequence of two pressures and an exponent. Refinement cannot check it. What checks it is an independent statement of the same relation, which is what the published cases do: the published final temperature sits beside the published time on every one of the five blowdown rows.

Ask of any output of any march which of those two it is before you decide what would count as evidence for it.

## Exercise

Record the final temperature at the coarsest and finest steps in the refinement study and say why the two are identical. Explain in one sentence why a constant column in a convergence table is not a convergence result. Then record the final temperature at end pressures of 600.000000, 145.000000 and 25.000000 psia, and say which instrument is right for the time and which for the temperature.
