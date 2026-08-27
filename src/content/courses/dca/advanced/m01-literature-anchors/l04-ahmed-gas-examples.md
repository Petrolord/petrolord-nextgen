# The Ahmed gas examples

Three cases in the fixture file come from Ahmed, *Reservoir Engineering Handbook*, 4th edition (Gulf Professional / Elsevier, 2010, ISBN 978-1-85617-803-7), chapter 16, pp. 1244 to 1257, typed from the same library copy the well-test Earlougher fixture came from and accessed 2026-07-18. Two of them are gas wells on exponential decline and they are the subject of this lesson. The third, Example 16-3, is Ikoku's hyperbolic well, and it gets a lesson of its own.

These two cases are not here because exponential decline is hard. They are here because each contains a trap that only appears when you try to reproduce somebody else's arithmetic, and both traps are about **which number the author used where**.

## Example 16-1: one parameter, two values

Case `ahmed-reh-16-1-exponential-rate-cum`, pp. 1244 to 1246. A dry gas field. The book plots cumulative against rate, reads $q_i = 344$ MMscf/d off the straight-line intercept, and then produces **two** declines from the same plot:

- a graph-point decline, from Eq. 16-11, $(344 - 197)/352000 = 0.000417613636363636$, printed as 0.000418 per day
- a least-squares decline of 0.000401 per day

Both are in the fixture's `given` block, as `di_graph_per_day` and `di_lsq_per_day`, with a note recording which the book uses where: the part-b time answers use the least-squares value, the part-a cumulative at 80 MMscf/d uses the graph read.

Test the note. Published times are 1560 days to reach 184 MMscf/d and 3637 days to reach the 80 MMscf/d economic limit. With the least-squares decline,

$$t = \frac{\ln(344/184)}{0.000401} = 1560.36383981150 \text{ days}, \qquad t = \frac{\ln(344/80)}{0.000401} = 3637.44394688159 \text{ days}$$

Both land within half a day of the printed integers. Now try the graph decline on the same question and you get 3489.50962368305 days, which misses by 147 days. The note is right about part b.

Part a is the reverse. The published cumulative at the economic limit is 633600 MMscf, and the case's `gp_rel` tolerance is 0.005. With the graph decline,

$$G_p = \frac{344 - 80}{0.000418} = 631578.947368421 \text{ MMscf}$$

a relative error of 0.00318979266347694, inside the allowance. With the least-squares decline the same formula gives 658354.114713217 MMscf, which is off by 0.0390689941812137, nearly eight times the tolerance. The note is right about part a as well.

**The lesson is not that one of these declines is correct.** They are two honest estimates of the same quantity from the same plot, differing by four percent because reading a line by eye and regressing it are different operations. The lesson is that reproducing a published result means reproducing the author's *choices*, not just the author's equations, and that a fixture which does not record those choices cannot be used to validate anything. Anyone who tried to match this example with a single Di would conclude the engine was broken.

There is a working habit in this too. When you inherit somebody else's decline analysis, ask which decline is quoted in the reserves table and which is quoted in the production forecast. If they differ by four percent, that is not necessarily sloppiness. Ask before assuming.

## Example 16-2: the monthly forecast and the misprint

Case `ahmed-reh-16-2-exponential-monthly-forecast`, pp. 1246 to 1249. A gas well, everything in months. $q_i = 1240$ MMscf/month; the decline comes from the book's least-squares fit of the first six months, $3.48325/91 = 0.0382774725274725$, printed as 0.0383 per month. Nothing gets converted to days at any point, because nominal declines scale linearly and the Arps forms do not care what the unit is.

The printed forecast table and the engine, side by side:

| month | printed $q$ | engine $q$ | printed $G_p$ | engine $G_p$ |
|---|---|---|---|---|
| 1 | 1193 | 1193.405971 | 1217 | 1216.554277 |
| 2 | 1149 | 1148.562752 | 2387 | 2387.395517 |
| 5 | 1026 | 1023.892335 | **4643** | 5642.497777 |
| 6 | 986 | 985.4187311 | 6647 | 6647.030518 |
| 12 | 783 | 783.1048997 | 11931 | 11929.37599 |

Eleven of the twelve rows agree to within the case's `rate_abs` of 3 and `gp_abs` of 6. One does not, and it is not close: month 5 prints a cumulative of 4643 where the model gives 5642.497777231364, a gap of almost exactly 999.

That is a dropped digit, and the fixture says so in a `misprint` field attached to the row:

> printed 4643 breaks the monotone cumulative progression; (qi-q)/Di gives 5642 - a dropped-digit misprint, row excluded from Gp assertions

Look at what the fixture does and does not do with it. It does not silently correct the value to 5642. It does not drop the row from the table. It does not weaken the case's tolerance until the bad row passes, which is the failure mode that quietly destroys an oracle suite. It records the printed value verbatim, states the evidence that it is a typesetting error (a cumulative that goes backwards is impossible), and excludes that one row from the cumulative assertions while the rate assertion on the same row still runs.

That is the whole discipline for handling a source error: **verbatim, flagged, excluded, and visible.** If you ever find yourself editing a published number so a test will pass, stop. Either the number is wrong and you say so in writing next to it, or your engine is wrong.

The case closes with an economic-limit calculation. At 30 MMscf/month the printed life is 97 months and the printed cumulative is 31600 MMscf. The engine gives

$$t = \frac{\ln(1240/30)}{0.0383} = 97.1715215910425 \text{ months}, \qquad G_p = \frac{1240 - 30}{0.0383} = 31592.6892950392 \text{ MMscf}$$

The time is within the case's `t_econ_abs` of 0.5 and the cumulative is within its `gp_econ_rel` of 0.001 at a relative error of 0.000231351422811298.

## Worked example: check month 12 by hand

Two lines, and worth doing once so the month unit stops feeling strange.

$$q(12) = 1240\,e^{-0.0383 \times 12} = 1240 \times e^{-0.4596} = 783.1048997484478 \text{ MMscf/month}$$

$$G_p(12) = \frac{1240 - 783.1048997484478}{0.0383} = 11929.375985680213 \text{ MMscf}$$

against printed values of 783 and 11931. Stop and note the direction of the second gap: at month 12 the engine sits 1.624014319786511 MMscf **below** the printed cumulative, while at month 2 it sits 0.395517 MMscf **above** it. Random-sign, small-magnitude gaps down a column are the signature of the author's own rounding, exactly as in the Weaver harmonic table. A one-sided drift would mean something else.

## Exercise

Work Example 16-2 at month 9. Compute the rate and the cumulative from $q_i = 1240$ MMscf/month and $D_i = 0.0383$ per month, compare against the printed 879 and 9441, and state whether each is inside the case's `rate_abs` of 3 and `gp_abs` of 6.

Then a judgement question on Example 16-1, in three sentences. Suppose you were handed this field's data with no book, you fitted it with the engine, and it returned a single least-squares $D_i$ of 0.000401 per day. You then computed the cumulative at the 80 MMscf/d limit and got 658354.114713217 MMscf, four percent above what the operator has been booking. Describe how you would find out whether the difference is a bug, a convention, or a genuine disagreement, and say which of the three you would bet on first.
