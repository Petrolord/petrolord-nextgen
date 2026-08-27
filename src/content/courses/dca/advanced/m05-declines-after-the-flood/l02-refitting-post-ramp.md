# Refitting post-ramp

The Professional tier walked one well across one boundary. Ekene-5, start date marched forward a month at a time, R2 climbing 0.518, 0.889, 0.954, 0.989 and then locking at 1 with the decline constant locking at 0.00035 per day. The conclusion there was the plateau rule: the boundary is the first start date after which the answer stops changing, not the first date that clears a quality threshold.

Take that as read. This lesson does the two things the Professional treatment could not: it refits all four producers, which turns one anecdote into a field measurement, and it shows why the same contamination is obvious on one well and invisible on another.

{{panel:dca-fit-explorer}}

## Four wells, four windows, one constant

Each producer has its own ramp-end date, because each has its own lag, and each has its own right-hand limit, because breakthrough ends the clean regime. Force the Exponential model on each clean window and the engine returns this.

| Well | Clean window | Rows | qi (stb/d) | Di (per day) | R2 |
|---|---|---|---|---|---|
| Ekene-6 | 2023-10-01 to 2024-02-01 | 5 | 57.64254156173296 | 0.000350000000000003 | 1.00000000000000 |
| Ekene-1 | 2023-12-01 to 2025-05-01 | 18 | 41.229409343034995 | 0.00035000000000000016 | 1.00000000000000 |
| Ekene-3 | 2024-01-01 to 2024-08-01 | 8 | 45.231993083244205 | 0.0003499999999999994 | 1.00000000000000 |
| Ekene-5 | 2024-04-01 to 2025-12-01 | 21 | 47.59933774834437 | 0.0003500000000000004 | 1.00000000000000 |

Four independent fits, four different window lengths from 5 rows to 21, four different start dates spread over seven months, and one decline constant to fifteen digits. The trailing digits differ because the four fits accumulate floating-point error differently, not because the wells differ.

That is the Expert reading of the post-flood regime, and it is a stronger statement than anything the boundary walk alone can support. The post-ramp decline is a property of the flood, shared by every well it supports, and it is measurable four times over. A single well's clean refit is an estimate; four wells agreeing is a field parameter. The right-hand boundaries are worth noticing too. Ekene-6's clean window closes on 2024-02-01 not because the data runs out, but because water arrives on 2024-03-01 and changes what the stream is. That is the next lesson.

## Why the contamination hides on some wells and not others

Now push each window start back one month, so that each window carries exactly one row of unfinished ramp, and refit.

| Well | Window with one ramp row | Rows | Di (per day) | Percent low | R2 | Quality tier |
|---|---|---|---|---|---|---|
| Ekene-6 | 2023-09-01 on | 6 | 0.00009588595753599152 | 72.60401213257386 | 0.09572812278817722 | Poor |
| Ekene-3 | 2023-12-01 on | 9 | 0.00025164848493239024 | 28.10043287645993 | 0.7299377678083072 | Poor |
| Ekene-1 | 2023-11-01 on | 19 | 0.0003252995966401834 | 7.057258102804738 | 0.9638359796654178 | Excellent |
| Ekene-5 | 2024-03-01 on | 22 | 0.00033718949081430467 | 3.6601454816272354 | 0.9886766989253964 | Excellent |

Read the rows in that order, because the ordering is the point and it runs the opposite way to intuition.

The same defect, one contaminated row, is fatal to the fit statistic on the shortest window and nearly undetectable on the longest. On Ekene-6 the intruding row drags R2 to 0.0957 and the decline to a seventh of its true value: nobody could submit that. On Ekene-5 the same intruding row leaves R2 at 0.9887, a number that clears the Excellent band with room to spare, while the decline is 3.66 percent low. On Ekene-1 it leaves R2 at 0.9638, still Excellent, while the decline is 7.06 percent low.

R2 is a whole-window average of residuals. One bad row out of six dominates that average; one bad row out of twenty-two is diluted by twenty-one good ones. So the reliability of the fit statistic as a contamination detector falls as the window gets longer, which means it is weakest exactly where analysts trust it most. Long histories feel safe. A long history is where a regime boundary error goes unnoticed.

There is no version of this that a threshold fixes. Moving the Excellent band to 0.99 would catch Ekene-1 and Ekene-5 here and would reject perfectly good fits of real, scattered data everywhere else. The detector has to be something other than goodness of fit.

## The stability test, generalised

Push each window start one month the other way instead, into the clean regime, and refit.

| Well | Window one month later | Rows | qi (stb/d) | Di (per day) | R2 |
|---|---|---|---|---|---|
| Ekene-6 | 2023-11-01 on | 4 | 57.02050066001885 | 0.0003500000000000059 | 1.00000000000000 |
| Ekene-1 | 2024-01-01 on | 17 | 40.78448831301038 | 0.00035000000000000016 | 1.00000000000000 |
| Ekene-3 | 2024-02-01 on | 7 | 44.74387876695068 | 0.00034999999999999945 | 1.00000000000000 |
| Ekene-5 | 2024-05-01 on | 20 | 47.10215945583964 | 0.00035000000000000043 | 1.00000000000000 |

Every decline constant is unchanged. Every $q_i$ has moved down. That split is the whole diagnostic, and it is why the test works even on a well where you have no idea where the ramp ended.

$D_i$ is a property of the regime, so a window wholly inside the regime returns it no matter where the window starts. $q_i$ is the fitted rate at the first row of the window, a bookkeeping convention rather than a physical quantity, so it moves whenever the window start moves. A window start you can shift by a month without moving $D_i$ is inside one regime. A window start you cannot shift without moving $D_i$ is straddling two.

This is also why the Expert capstone asks for Ekene-5's decline from a window starting 2024-05-01 rather than from the earliest clean start on 2024-04-01. Both are correct windows and both return the same constant. The graded quantity is the one that does not depend on which of them you chose, and the $q_i$ that goes with it, 47.10215945583964 stb/d against 47.59933774834437 stb/d from a month earlier, is lower simply because the curve has run one more month downhill.

## Worked example: a five-row booking by hand

Ekene-6's clean window has five rows and can be worked without an engine at all. On noise-free exponential data the least-squares fit of $\ln q$ against $t$ passes exactly through every point, so any two rows give the answer. Take the first and the last:

$$D_i = \frac{\ln(57.64254156173296 / 55.2136863610599)}{123} = 0.0003499999999999999 \text{ per day}$$

123 days is 2023-10-01 to 2024-02-01. The engine's five-row regression returns 0.000350000000000003. Do the same on Ekene-3's clean window, 45.231993083244234 stb/d on 2024-01-01 and 41.98257486522918 stb/d on 2024-08-01, 213 days apart, and you get 0.0003500000000000005.

Two rows and a logarithm reproduce what the engine does with the whole window. That is a property of clean data, and stating it that way makes the real question visible: the engine adds nothing to the answer here, so everything that can go wrong is upstream, in which rows you handed it.

## The misconception to retire: a five-row window is too short to book

It is a natural objection and it has the criterion backwards. Length is not what makes a window fittable. Regime purity is. Ekene-6's five rows return the field's decline constant exactly, while Ekene-5's twenty-two rows with one bad row at the front return a decline that is wrong by 3.66 percent at an R2 of 0.9887.

The honest form of the objection is different and it stands: a five-row window gives you almost no ability to *detect* contamination from the statistics, because with that few rows the fit will either be visibly ruined or perfect. So a short window has to be defended from the regime log, from the dates you can point at, rather than from the fit. Which is where the defence should have come from anyway.

## Exercise

Do the stability test on Ekene-1 without looking at the ramp-end date first. Fit Exponential from 2024-02-01 to 2025-05-01, then from 2024-03-01 to 2025-05-01, and compare the $D_i$ tiles. Then walk backwards a month at a time until $D_i$ moves, and record the first start date at which it does. Check the date you land on against the well's lag of 5 and ramp of 6 months from 2023-01-01. Finally, write one sentence explaining why you had to stop the window at 2025-05-01 rather than running it to the last row of history, using only the `flood_response` block of the fixture as evidence.
