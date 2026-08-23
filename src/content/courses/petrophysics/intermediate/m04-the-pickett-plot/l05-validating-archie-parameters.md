# Validating Archie parameters

The fit is done: the typewell's water leg returned $m = 2.000$ and $a R_w = 0.0500$ ohm.m, matching the given parameter block. This closing lesson steps back and asks the professional questions. What exactly has been validated? What has not? And when should you distrust a Pickett fit altogether?

## What the fit validates

The fit confirms $a R_w$ and $m$, jointly, in the lithology of the leg. Each part of that sentence carries weight.

Jointly, because the two parameters were estimated from the same six points and trade off against each other at the edges of the data. Slope errors leak into the intercept: if noise tilted the fitted line slightly, both $m$ and $a R_w$ would move together. On the typewell's noise-free leg this hardly matters, but on real data you should think of the result as a validated pair, not two independently proven numbers.

In the lithology of the leg, because pore geometry sets $m$. The leg samples the clean sand at the base of SAND_B. Its $m = 2$ travels upward to SAND_A only because the sands are the same rock; the moment lithology changes, a carbonate stringer, a cemented interval, a different depositional facies, the exponent can change with it, and the leg says nothing about that.

## What the fit cannot see

Three blind spots, all structural rather than accidental:

* $n$ never enters. The saturation exponent multiplies $\log S_w$, which is zero everywhere in the leg. A water leg is constitutionally incapable of testing $n$; that parameter must come from core electrical measurements or regional experience. The typewell's $n = 2$ remains an assumption, and every saturation you compute inherits it.
* $a$ and $R_w$ stay entangled. The intercept delivers only their product. The course reports $a R_w = 0.0500$ ohm.m for exactly this reason. Splitting the product needs outside information: a produced-water sample measured in the laboratory, a regional salinity trend, or an $a$ fixed by convention. Claiming a validated $R_w$ on the strength of a Pickett fit alone overstates what you know.
* The leg pick itself. The fit is only as good as the assertion that $S_w = 1$ across the window, and the previous lessons already flagged that as interpretation.

## When the fit misleads

Four situations bend or break the method, and all four appear regularly in real wells:

* Thin legs. Six points spanning a narrow porosity range fix the line poorly; small noise swings the slope hard. Report the point count and porosity span with any fit.
* Shaly legs. Clay conducts. Shaly water-leg samples plot below the clean-sand water line, and a line fitted through them drags $m$ and $a R_w$ away from the values that apply in the clean reservoir. Fit only clean intervals, or correct for shale before fitting.
* Invasion. If mud filtrate has pushed formation water away from the borehole, the deep resistivity is not reading true $R_t$, and the leg is calibrated to the wrong fluid. Deep reading tools and time-lapse logging mitigate this; a fresh-mud well with salty formation water is the classic failure case.
* Transition zones. Just above the free water level, saturation is close to but not exactly 1. Including those samples tilts the line toward higher apparent $m$. Keep the window at the bottom of the leg, well below the transition.

## The professional sequence

Put the module together as a repeatable procedure. Identify the leg and defend the identification. Fit the line in log space and read the pair ($a R_w$, $m$) with its point count. Compare against the given or regional values and state both in the report, with the discrepancy if there is one. Only then run saturation models updated with whatever the comparison taught you.

On the typewell the comparison closes cleanly: fitted 0.0500 ohm.m against given $R_w = 0.05$ with $a = 1$, fitted 2.000 against given $m = 2$. That agreement is by design, and it is the course's checkpoint that the Archie parameter set is sound before the next module deliberately changes the saturation model. When Simandoux and Indonesia produce different saturations from Archie in the shaly intervals, you will know the difference comes from the shale physics, because the underlying clean-sand parameters have been validated here.

## Exercise

A colleague fits a water leg in a nearby well and reports $m = 2.31$, $a R_w = 0.031$ ohm.m from 4 points spanning porosities 0.11 to 0.12, in an interval the gamma ray shows as moderately shaly. List the three strongest reasons to distrust the fit before accepting it into the field parameter set. As a self-check, your reasons should touch the point count and porosity span, the shale conductivity pulling points below the clean water line, and the joint drift of slope and intercept when a line is fitted through biased points. State in one sentence what data you would request before reconciling their parameters with the typewell's.
