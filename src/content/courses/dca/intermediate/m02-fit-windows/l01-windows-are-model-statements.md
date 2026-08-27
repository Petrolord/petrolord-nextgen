# Windows are model statements

At Associate level the rule was simple and correct: fit the primary window, and say so. This module turns that rule into a professional practice, and the practice starts with a change of attitude. A fit window is not a plotting preference and it is not a data-cleaning step. It is the strongest modelling assertion you will make about a well, and it is the one an auditor will question first.

## What a window asserts

Every window you set is three claims made at once, and you should be able to state all three out loud before you press fit.

**One regime.** You are asserting that a single physical process drove production across every row inside the boundary. For the Ekene primary window that process is depletion: rock and fluid expanding as pressure falls. When water injection starts, a second process joins in, and a window that spans both is asserting something that is not true.

**One stream.** You are asserting which fluid stream the fit describes and therefore which stream the forecast books. Oil and gross liquid are the same series until water breaks through and then they are not. Ekene-6 makes this concrete later in the module: after its breakthrough date its oil declines faster than the flood's own decline constant, because water cut is climbing underneath a gross rate that is behaving perfectly well.

**One operating policy.** You are asserting that choke, lift and offtake philosophy did not change inside the boundary. A well choked back for six months of facility work contains a step that no Arps parameter can represent, and the fit will spend $b$ trying.

If any of the three claims is false anywhere inside your window, the fit describes a system that never existed. It will still return numbers, and the numbers will still have an R2 next to them.

## The window also defines t0

There is a mechanical consequence that surprises people the first time. The engine measures time from the first row inside the window, not from first oil. Fitted $q_i$ is therefore the model rate at the window start, and moving the boundary moves $q_i$ even when the physics is untouched. Lesson 3 works this through on Ekene-1 with an exact identity you can check by hand. For now: a fitted $q_i$ is a statement about a date, and the date is the window's left edge.

## The calendar date is not the physical date

Here is the fact that separates a Professional window from an Associate one.

The Ekene field has exactly one flood event: injection starts 2023-01-01. The four producers do not respond on that date. Each one has its own travel time through the rock, recorded in the fixture as a response lag, and each one then ramps over six months to its own lift multiple before settling into a post-flood decline.

| Well | response lag | first month above base | ramp ends | lift | breakthrough |
|---|---|---|---|---|---|
| Ekene-1 | 5 months | 2023-07-01 | 2023-12-01 | 1.28 | 2025-06-01 |
| Ekene-3 | 6 months | 2023-08-01 | 2024-01-01 | 1.25 | 2024-09-01 |
| Ekene-5 | 9 months | 2023-11-01 | 2024-04-01 | 1.15 | none |
| Ekene-6 | 3 months | 2023-05-01 | 2023-10-01 | 1.35 | 2024-03-01 |

One field event, and already eight distinct boundary dates plus three breakthrough dates. Nothing in the rate file announces any of them. You find them by walking the rows, and lesson 4 shows you the walk.

This is why "post-flood" is not a window and "Ekene-5 from 2024-04-01" is. The reservoir's calendar is set by lag and ramp, not by the injection schedule and certainly not by the fiscal year.

## Worked example: choosing Ekene-1's primary end date

Ekene-1's flood-start row, 2023-01-01, reads 32.210476049246076 stb/d. That value sits exactly on the primary exponential, because the response model freezes the base decline at the flood start and the lag has not yet expired. So fitting Ekene-1 from 2020-01-01 with the end date at 2023-01-01 returns $q_i$ 120.000000000000, $D_i$ 0.00120000000000000 and R2 1.00000000000000, digit for digit the same as ending at 2022-12-01. The arithmetic does not notice the extra row.

The correct end date is still 2022-12-01. The regime changed on 2023-01-01 whether or not the residuals could tell, and your window is a claim about regime. Include that row and your window statement is false even though your fit is numerically identical. Auditors read window statements, not residuals.

Now move the end date two months further, to 2023-03-01, and the fit changes family: Hyperbolic at $b$ 0.05, $q_i$ 120.325815233076, $D_i$ 0.00122834891161236, R2 0.999812532094246. Two rows past the boundary and the answer to "what kind of well is this?" has already moved, at an R2 that no reviewer would query.

Stop and take the lesson from the pair. The boundary that keeps the fit honest and the boundary at which the fit starts to complain are not the same date. The first is earlier, and it is the one you use.

## The misconception to retire: pick the window with the best R2

This is the most common bad habit in decline work and it is circular. R2 is computed from the window, so choosing the window to maximise R2 lets the statistic choose the physics. Worse, the procedure has a systematic bias: it will happily trim inconvenient early rows, because early rows in a hyperbolic have the most curvature and the most leverage, and trimming them flattens the apparent decline and raises the booking.

Windows are chosen from knowledge of the well: what was done to it, when, and what the reservoir was doing. Then the statistics are read as a check on that choice, never as the source of it. If a window you can defend physically produces a poor fit, that is information about the model family, not permission to move the boundary.

## The window statement

Write one for every fit you book. Four lines is enough, and it makes the fit reviewable by someone who was not there.

- **Boundaries.** Start date and end date, with the row count.
- **Regime asserted.** What single physical process the window claims, and what event ended it.
- **Stream asserted.** Oil or gross, and whether water cut is material inside the boundary.
- **The evidence.** The row or the event that fixed each boundary.

For Ekene-1's primary booking that reads: 2020-01-01 to 2022-12-01, 36 monthly rows; primary depletion only; oil stream, no injected water present; end date fixed by the field flood start of 2023-01-01, the first date on which a second drive mechanism is active.

Four lines, and the fit is now defensible.

## Exercise

Write the window statement for Ekene-6's primary booking. You will need its first production date, its primary row count, and the event that fixes its end date. Then write a second window statement for Ekene-6's post-ramp period, using the table above: name the start date implied by its lag and ramp, name the date its breakthrough begins to split oil from gross, and say which of those two dates bounds the window on the right. Lesson 4 checks your answer against the engine.
