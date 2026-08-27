# Forcing the wrong model

The Associate tier forced all three families on Ekene-3 and looked at what happened to R2, to RMSE and to the forward rates. This lesson runs the same experiment across all four producers and converts every result into the only currency that matters at Professional level: the booked volume. A wrong model is not a statistics problem. It is a reserves problem, and it has a direction you can predict before you compute anything.

{{panel:dca-fit-explorer}}

## The full table

Every row below is the same recipe: the well's own primary window, the model selector forced, and the resulting parameters booked at a 10 stb/d economic limit through the matching closed form. The final column compares that booking against the correct one, which for each well is the fit that recovers its planted truth exactly.

| Well (planted b) | Forced model | fitted b | R2 | RMSE (stb/d) | EUR at 10 stb/d | error |
|---|---|---|---|---|---|---|
| Ekene-1 (0) | Exponential | 0 | 1.00000000000000 | 1.42601125915484e-14 | 91666.6666666667 | 0 |
| Ekene-1 (0) | Hyperbolic | 0.05 | 0.999900032238145 | 0.254289275530349 | 92982.7598852383 | +1.43573805662359% |
| Ekene-1 (0) | Harmonic | 1 | 0.872429987742299 | 9.08390029303620 | 138869.483739477 | +51.4939822612476% |
| Ekene-3 (0.5) | Exponential | 0 | 0.987334417750128 | 3.58830309063897 | 93383.7804938312 | -16.0747364730492% |
| Ekene-3 (0.5) | Harmonic | 1 | 0.951593684935824 | 7.01499799089027 | 144074.580828728 | +29.4817697424951% |
| Ekene-5 (1) | Exponential | 0 | 0.984166702451300 | 2.08207753352300 | 90196.9554518665 | -41.2419399441714% |
| Ekene-5 (1) | Hyperbolic | 0.9500000000000003 | 0.999934526382689 | 0.133888840068019 | 148352.186019487 | -3.35719635017790% |
| Ekene-6 (0.35) | Exponential | 0 | 0.998720846254715 | 0.490577833332924 | 89624.5162700159 | -14.8595150406673% |
| Ekene-6 (0.35) | Harmonic | 1 | 0.993488578081531 | 1.10683903225531 | 156463.504642519 | +48.6354316665648% |

Six of those rows are a genuinely wrong family fitted to noise-free data. Five of the six report an R2 in the Excellent band, at or above 0.95, while missing the booking by between 14.8595150406673 and 48.6354316665648 percent. Only Ekene-1 forced harmonic, at R2 0.872429987742299, falls to the Fair tier and gets itself flagged.

That is the headline. The quality tier caught one wrong model in six, and the one it caught was not the worst.

## The direction rule

Now look only at the sign of the error column, alongside the direction of the $b$ error.

| Well | true b | forced b | b error | booking error |
|---|---|---|---|---|
| Ekene-1 | 0 | 1 | high | +51.4939822612476% |
| Ekene-3 | 0.5 | 0 | low | -16.0747364730492% |
| Ekene-3 | 0.5 | 1 | high | +29.4817697424951% |
| Ekene-5 | 1 | 0 | low | -41.2419399441714% |
| Ekene-5 | 1 | 0.95 | low | -3.35719635017790% |
| Ekene-6 | 0.35 | 0 | low | -14.8595150406673% |
| Ekene-6 | 0.35 | 1 | high | +48.6354316665648% |

Every single row obeys the same rule: **the sign of the booking error is the sign of the $b$ error.** Force $b$ too low and you buy a thin tail and under-book. Force $b$ too high and you buy a fat tail and over-book. This holds regardless of what the fit does to $q_i$ and $D_i$ to compensate, because $b$ controls the tail and the tail is where the volume between the last data point and the economic limit lives.

The magnitude is not predictable in the same way. Ekene-6 forced harmonic over-books by 48.6 percent on a $b$ error of 0.65, while Ekene-1 forced harmonic over-books by 51.5 percent on a $b$ error of 1.0. How far the limit sits below $q_i$ matters, and so does $D_i$. Trust the sign, compute the size.

## Worked example: Ekene-6 forced harmonic, by hand

This one is short enough to do on paper, and doing it is the best way to feel where the extra volume comes from.

The forced harmonic fit of Ekene-6's primary window returns $q_i = 93.6153810033389$ stb/d and $D_i = 0.00133821021526847$ per day. The harmonic EUR is

$$\text{EUR} = \frac{q_i}{D_i}\ln\!\left(\frac{q_i}{q_{limit}}\right)$$

Take it in three steps.

$$\frac{q_i}{D_i} = \frac{93.6153810033389}{0.00133821021526847} = 69955.6616256723$$

$$\frac{q_i}{q_{limit}} = \frac{93.6153810033389}{10} = 9.36153810033389, \qquad \ln(9.36153810033389) = 2.23660960394805$$

$$\text{EUR} = 69955.6616256723 \times 2.23660960394805 = 156463.504642519 \text{ stb}$$

Stop and run those three lines on a calculator now. Then compare with the correct booking for this well, 105266.626461929 stb from the hyperbolic fit at $b = 0.35$. The forced harmonic added 51196.878180590 stb, more than half as much oil again, from a fit whose R2 was 0.993488578081531 and whose worst monthly miss over the whole window was around a barrel a day.

The mechanism is visible in the arithmetic. The harmonic fit had to raise $q_i$ from the well's true 90 stb/d to 93.6 and raise $D_i$ from 0.001 to 0.00134 in order to track a history that a flat-tailed model does not naturally match. Those two adjustments buy the history match. Then the logarithm, which is the harmonic's signature and which has no ceiling, spends the tail.

## The misconception to retire: the history-match fallacy

"The model that matches the history best will forecast the future best."

That sentence is true only if the model family is right. When the family is wrong, matching the history harder means distorting the parameters harder, and the distortion is spent entirely on the extrapolation. Ekene-5 forced hyperbolic is the cleanest demonstration in the table: it is the best-matching wrong fit in the whole set, RMSE 0.133888840068019 stb/d and R2 0.999934526382689, and it still misses the booking by 3.36 percent because the grid cannot reach $b = 1$. Fit quality measures agreement inside the window. Booking error measures disagreement outside it. Nothing forces the two to correlate, and in this table they barely do.

The practical consequence for a Professional workflow: choose the family from physics and from the shape of the residuals, then use RMSE to rank candidates within that choice, then report the booking sensitivity to the families you rejected. That last step is what turns a fit into a defensible number.

## Exercise

Before touching the panel, predict the sign of the booking error for two cases: Ekene-1 forced hyperbolic, and Ekene-3 forced exponential. Use only the direction rule and the planted exponents, 0 for Ekene-1 and 0.5 for Ekene-3. Then run both in the panel over the primary windows, compute the EUR at 10 stb/d from the reported parameters, and check your signs against the table above. Finally, explain in one sentence why Ekene-1 forced hyperbolic misses by only 1.4 percent while Ekene-1 forced harmonic misses by more than 51 percent, given that both are the same well and the same window.
