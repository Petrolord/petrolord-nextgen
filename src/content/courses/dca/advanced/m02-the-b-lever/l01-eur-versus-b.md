# EUR versus b

Hold everything except the exponent. Fix $q_i$ at 120 stb/d, $D_i$ at 0.0012 per day and the economic limit at 10 stb/d, which are Ekene-1's parameters, then vary $b$ across the range a real fit could return and watch the booking move.

{{panel:dca-uncertainty-explorer}}

| $b$ | EUR (stb) | ratio to $b = 0$ | time to 10 stb/d (days) | (years) |
|---|---|---|---|---|
| 0 | 91666.6666666667 | 1 | 2070.75554149000 | 5.673302853 |
| 0.25 | 112653.225353287 | 1.228944276581309 | 2870.69906068 | 7.864928933 |
| 0.5 | 142264.973081037 | 1.5519815245204083 | 4106.83602523 | 11.25160555 |
| 0.75 | 185086.013635292 | 2.0191201487486357 | 6052.68843438 | 16.58270804 |
| 1 | 248490.664978800 | 2.7108072543141826 | 9166.66666667 | 25.11415525 |
| 1.2 | 321875.914758613 | 3.5113736155485027 | 13003.4874682 | 35.62599306 |

Every one of those rows describes the **same well at the same starting rate declining at the same initial rate**. The only thing that changed is the second-order shape of the decline, and the reserves tripled.

## The response is convex, so the top of the range is the dangerous end

Read the ratio column as steps rather than levels. Each quarter of $b$ multiplies the previous booking by

1.228944276581309, then 1.2628575225865635, then 1.3009949647258734, then 1.3425685717584586

The multiplier grows. Uncertainty in $b$ is not linear in reserves, and a fixed uncertainty band on $b$ maps to a widening band on EUR as $b$ rises.

Put that in the units the engine actually works in. The grid moves in steps of 0.05, so ask what one rung is worth at each end of the range. From $b = 0.45$ to $b = 0.50$, the booking goes from 135464.1381907062 to 142264.97308103743 stb, a gain of 6800.834890331229 stb. From $b = 1.15$ to $b = 1.20$, it goes from 301134.0243262835 to 321875.91475861275 stb, a gain of 20741.890432329266 stb. **The same single step of the same parameter is worth three times as much volume near the top of the range.** One rung is inside anybody's fitting uncertainty. Near $b = 1.2$ that rung is worth more than a fifth of an entire exponential booking.

## The mechanism: b buys time, not rate

It is tempting to think a higher $b$ means a fatter well. It does not mean that in any period you have data for. What it means is that the well takes longer to die.

Compare the last column with the first. At $b = 0$ the well hits its limit after 2070.75554149000 days and stops. At $b = 1.2$ it is still above the limit at 13003.4874682 days, more than 35 years. Every barrel of the difference between 91666.6666666667 and 321875.914758613 stb is produced in a period that only exists because $b$ was raised. The extra volume is late volume, at low rates, over decades. That is why the next lesson can say something apparently paradoxical and mean it literally: the two most extreme rows of this table are nearly indistinguishable over any window you have actually observed.

## The misconception to retire: b is one parameter out of three

The comfortable framing is that an Arps fit has three parameters, so each carries roughly a third of the uncertainty, and $b$ is no more special than the others.

Rank them by what constrains them instead.

$q_i$ is constrained by the rate you can read off a chart. Get it wrong by five percent and you have made an obvious, checkable, arguable error, and the EUR moves by about five percent.

$D_i$ is constrained by the slope of the early history. Get it wrong by five percent and the EUR moves by about five percent in the exponential case, because EUR is $(q_i - q_L)/D_i$ and the dependence is exactly reciprocal.

$b$ is constrained by the curvature of the decline of the decline, which is the least visible feature of a rate history and the first thing scatter destroys. Get it wrong by the width of one grid rung near the top of the range and you have moved the booking by 20741.890432329266 stb on a well whose exponential booking is 91666.6666666667 stb.

So the three parameters are not peers. Two are read off the data and one is inferred from the shape of a shape, and the one that is inferred is the one the reserves number is most sensitive to. That asymmetry is the entire justification for the governance machinery in lesson 3.

## Worked example: the harmonic row on a calculator

The $b = 1$ row is fully hand-reachable and worth doing once so the table stops being a printout.

$$\text{EUR} = \frac{q_i}{D_i}\ln\!\frac{q_i}{q_L} = \frac{120}{0.0012}\ln(12) = 100000 \times 2.4849066497880004 = 248490.66497880008 \text{ stb}$$

Divide by the exponential booking, $(120 - 10)/0.0012 = 91666.66666666667$ stb, and you have the ratio 2.7108072543141826.

Now the time to the limit for the same row: $t = (q_i/q_L - 1)/D_i = 11/0.0012 = 9166.66666667$ days, which is 25.11415525 years.

Stop and check the exponential row the same way. $\ln(12)/0.0012 = 2070.7555414900003$ days, and $(120-10)/0.0012 = 91666.66666666667$ stb. Two well-known values on a pocket calculator, and you have anchored both ends of the argument yourself.

## Exercise

Compute the $b = 0.5$ row by hand from the Arps rate-cumulative form,

$$\text{EUR} = \frac{q_i^{\,b}}{D_i(1-b)}\left(q_i^{\,1-b} - q_L^{\,1-b}\right)$$

with $q_i = 120$, $D_i = 0.0012$, $b = 0.5$, $q_L = 10$. The intermediates are $\sqrt{120} = 10.954451150103322$ and $\sqrt{10} = 3.1622776601683795$, so the first factor is 18257.41858350554 and the second is 7.792173489934942. Confirm you land on 142264.97308103743 stb.

Then use the panel. Move the $b$ slider until the ratio tile first reaches 2.0, and report the $b$ at which the booking has exactly doubled relative to the exponential case. Finally, in one sentence: given that the grid returns $b$ in steps of 0.05, what is the smallest change in reported reserves this well can express near that doubling point, and would you be able to defend that number to an auditor as a measurement?
