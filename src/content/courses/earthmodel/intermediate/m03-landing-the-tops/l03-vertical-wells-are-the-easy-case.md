# Vertical wells are the easy case

Three of the four wells tie with arithmetic a person can do without a computer, and that is not a triviality to skip: the vertical wells are the tier's control group. When the machinery produces hand-checkable integers on W1, W3 and W4, you have evidence the machinery is right, and only then does its answer on W2 deserve trust.

{{panel:em-tie-explorer}}

## Why the integers are exact

For a vertical well, every step of the landing collapses. The trajectory is one vertical segment, so x and y never move from the wellhead and TVDSS is MD minus KB, a subtraction of integers. The surface is then read at the wellhead's coordinates. In this fixture the wellheads of W1, W3 and W4 sit at positions where the sampled surface values are also exact or half-integer: 1507, 1538 and 1565 at W1; 1559, 1598 and 1598 at W3; 1555.5, 1596 and 1596 at W4.

So the residuals come out as small exact numbers: W1 reads minus 2, plus 2, plus 5; W3 reads plus 1, plus 7, plus 37; W4 reads plus 0.5, plus 6, plus 36. When the capstone grades W1 BaseB at 5 and W3 TopA at 1 with a tolerance of 0.01, it is grading numbers with no rounding in them at all; any disagreement is a mistake, not a precision issue. This mirrors a pattern you have met before in this course family: exact-by-construction values graded tightly, precisely because they are exact.

## The control-group logic

Suppose you had built the tie machinery yourself and W1 came out at minus 2.4 instead of minus 2. The candidate faults are few and specific: a wrong KB sign convention (a plus where a minus belongs shifts every residual in the well by twice the KB), sampling the surface at the wrong location, or an off-by-one in the surface indexing. Each fault has a distinctive fingerprint on the three vertical wells. A KB error shifts all three residuals of one well equally; a surface-index error swaps residual patterns between tops; a location error changes W1 but not necessarily W4. The vertical wells are cheap, decisive diagnostics, and any workflow that goes straight to the deviated well has thrown its controls away.

Run the experiment in the panel now: select W1, W3, W4 in turn and read the residual tiles against the integers above.

## What the verticals cannot check

The controls validate datums, sampling and indexing. They cannot validate the curvature arithmetic, because their doglegs are zero; a bug in the ratio factor would leave every vertical well perfect and silently corrupt W2. The converse design also fails: a fixture of only deviated wells would leave datum conventions untested under the trajectory's complexity. The fixture needs both, and has both, which is a lesson about test design as much as about geology.

## Worked example

Predict, before touching the panel, what W4's residual tiles will read, from the numbers already in this course: picks 1584, 1630, 1660; KB 28; surfaces at the wellhead 1555.5, 1596, 1596. TVDSS values: 1556, 1602, 1632. Residuals: plus 0.5, plus 6, plus 36. Now select W4 and check all three tiles. The 0.5 at TopA is the smallest residual in the entire tie table, and the 36 at BaseB is the third largest; one well contains both extremes, which module four will explain rather than leave as a curiosity.

## Exercise

Write the fingerprint table for the three fault classes described above: for each of "KB sign error at W1", "TopA and TopB surface indices swapped", and "surfaces sampled at (y, x) instead of (x, y)", state what W1's three residuals would become. The third one requires care: W1's head is at (1100, 2100), so the swapped read happens at (2100, 1100), which is outside the frame's y range. What does the engine report for a sample outside the frame, and what would the tie row show?
