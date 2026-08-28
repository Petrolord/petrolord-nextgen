# The PVT track

Module 2 froze the formation volume factors at a single pressure and promised to measure what that convention cost. This lesson builds the machinery: a pressure on every period, a PVT table, and an interpolation between them. The next lesson runs it and reports the number.

## The pieces

Three things are needed to read a formation volume factor off a pressure.

**A pressure on every period.** Module 4 built two candidates: the closed-form model track, and the interpolated survey track. The engine uses the survey track, because that is what an operator actually has.

**A PVT table.** A list of pressures with the factors at each. Ekene's runs from 1800 to 3400 psia in 200 psi steps, evaluated on the field's own line $B_o(p) = 1.2(1 + 1.2\times10^{-5}(3200 - p))$:

| p (psia) | $B_o$ | $B_w$ | $B_g$ | $R_s$ |
|---|---|---|---|---|
| 1800 | 1.22016 | 1.02 | 0 | 400 |
| 2000 | 1.21728 | 1.02 | 0 | 400 |
| 2200 | 1.2144 | 1.02 | 0 | 400 |
| 2400 | 1.21152 | 1.02 | 0 | 400 |
| 3200 | 1.2 | 1.02 | 0 | 400 |
| 3400 | 1.19712 | 1.02 | 0 | 400 |

**An interpolator.** Linear between table rows, clamped flat outside the table. Below 1800 psia it returns the 1800 row; above 3400 psia it returns the 3400 row. A null pressure returns null rather than a guessed factor set.

## The interpolation is exact, and the reason matters

Run the interpolator over the Ekene pressure track and compare each result against the PVT line evaluated directly at the same pressure. The maximum relative difference is $1.8266655911794395 \times 10^{-16}$. That is exact, to floating point.

It is exact because $B_o$ is a straight line in pressure over this range, and linear interpolation of a straight line returns the line. Nothing about the 200 psi grid spacing helped; a 2000 psi spacing would have been equally exact.

That is a useful thing to have seen once, because it is not the general case. Below the bubble point $B_o$ curves sharply, and linear interpolation on a coarse grid then carries a real error that grows with the square of the spacing. The right lesson is not "interpolation is exact" but "interpolation was exact HERE, because the function was linear HERE, and I checked".

## Two ways a PVT table lies

**Clamping at the ends.** A pressure below the table's range gets the lowest row's factors, silently. If your reservoir falls below your table, your factors stop changing at exactly the moment they should be changing fastest. Check that your track stays inside your table.

**Mixed sources.** A table built partly from a lab report and partly from a correlation has a kink where they join, and the interpolated factors on either side of the kink are not consistent. The Petrolord engine deliberately takes only numbers, never correlations: the caller derives the table and hands across values. That keeps the correlation choice visible in the caller rather than hidden in the engine.

{{panel:wf-ledger-explorer}}

Toggle between the frozen and tracked modes and watch the cumulative line. On this field the two are nearly indistinguishable, which is itself the result: the panel is showing you that the convention was cheap.

## Where the pressure track enters

The engine attaches pressure to periods by interpolating the surveys onto each period's mid-month coordinate. That is the same machinery module 4 used for the trough, so the tracked factors inherit everything that track's cadence problem implies. In particular, the periods around the true trough get factors evaluated at a pressure that is 2.4 psi too high.

Two and a half psi of pressure moves $B_o$ by

$$1.2 \times 1.2\times10^{-5} \times 2.427063793101752 = 3.5 \times 10^{-5}$$

which is 0.003 percent of $B_o$. So the cadence error propagates into the factors and dies there. That will not always be true, and the way to know is to do this multiplication with your own numbers rather than to assume.

## The misconception to avoid

"Tracking pressure makes the ledger more accurate." It makes the ledger more RESPONSIVE to your pressure track. If that track is good, the ledger improves. If the track is an interpolation of six surveys with a known three-month timing error, you have replaced a stated convention with an unstated one, and the result looks more sophisticated while being no more true. Track when you can defend the track.

## Exercise

First, using the PVT table above, interpolate $B_o$ at 2100 psia by hand from the 2000 and 2200 rows, and confirm you get 1.21584. Then explain in one sentence why you did not need the table at all to get that number.

Second, suppose the Ekene pressure had fallen to 1700 psia during the flood. State what the interpolator would return for $B_o$, whether that value is right, and what the operator should have done to the table.
