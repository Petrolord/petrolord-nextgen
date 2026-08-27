# Normalization

A type curve is one curve that stands in for a group of wells, used when a well has too little history to speak for itself. Before any group can be fitted, its members have to be put on the same axes, because two wells that came on production eighteen months apart at different rates cannot be plotted together in calendar time and raw barrels. That preparation step is normalization, and the engine's version is deliberately simple. Read it before you trust anything built on top of it.

## What the function actually does

`normalizeByTimeAndRate` runs two passes over the rows you hand it.

`normalizeByTime` drops any row with a non-positive rate or no date, sorts what is left by date, takes the **first surviving row's date** as the origin, and writes `t_normalized` as days from that origin.

`normalizeByRate` then takes the **maximum rate in the array it was given**, writes `rate_normalized` as rate divided by that peak, and records the peak on every row.

Two design decisions hide in those two sentences. The clock starts at each well's own first production rather than on a shared calendar date. The divisor is the observed peak rate rather than the fitted $q_i$. Both are reasonable and neither is inevitable, and both change what your pooled cloud looks like.

## On the two Ekene hyperbolics

Normalize each well's primary window and the fixture returns:

| Well | Rows | First date | Peak (stb/d) | $t$ range (days) |
|---|---|---|---|---|
| Ekene-3 | 34 | 2020-03-01 | 150.000000000000 | 0 to 1005 |
| Ekene-6 | 28 | 2020-09-01 | 90.0000000000000 | 0 to 821 |

The 184-day calendar offset between the two wells is gone. Both now begin at $t = 0$ and both begin at a normalized rate of exactly 1.000. On a plot they start from the same corner.

## What normalization removes, and what it leaves alone

It removes the level and the calendar. It does not touch the shape. Fit each normalized well on its own and the engine returns $q_{i,norm} = 1.00000000000000$ with $D_i = 0.00200000000000000$ and $b = 0.49999999999999994$ for Ekene-3, and $q_{i,norm} = 1.00000000000000$ with $D_i = 0.00100000000000000$ and $b = 0.35$ for Ekene-6, both at R2 1.00000000000000. That is exactly what you want from a scaling: dividing every rate by a constant cannot change $D_i$ or $b$, and neither can shifting a clock that already started at each well's own zero.

So normalized wells still disagree wherever their shapes disagree:

| $t$ (days) | Ekene-3 normalized | Ekene-6 normalized |
|---|---|---|
| 0 | 1.000000 | 1.000000 |
| 365 | 0.536703833407130 | 0.709284499865980 |
| 730 | 0.334124093688396 | 0.521995215920740 |

At two years one well is at 33 percent of its peak and the other at 52 percent, having started from the same point on the same axes. That table is this whole module in miniature. Normalization makes wells comparable. It does not make them similar, and reading a shared starting point as evidence of a shared decline is the error the rest of the module is built to prevent.

## The peak divisor and the ramp trap

The Ekene fixture is noise-free and every planted decline peaks on its first point, so peak and $q_i$ coincide. Real wells often peak in the second or third month, after clean-up and while the choke is still opening. Then the clock still starts at first production while the divisor comes from a later month, so the normalized curve rises to 1.000 and then falls, and an Arps fit through that rising limb is fitting a shape Arps does not describe.

Two habits follow. Check where each well's peak sits before pooling anything. And if the ramp is long, consider starting each well's clock at its peak month instead of its first month, which is a judgement the engine's function does not make for you.

## Pool first or normalize first

The order matters, and getting it wrong is easy because both routes run cleanly and return a plausible-looking answer.

`normalizeByRate` divides by the maximum of whatever array it receives. Hand it the two wells' raw rows concatenated and there is one global peak, 150 stb/d, so Ekene-6's first point normalizes to 0.600000000000000 instead of 1.000. `normalizeByTime`, given the same concatenated array, takes one origin, 2020-03-01, so Ekene-6's first point lands at $t = 184$ days instead of 0 and its last at 1005.

Fit that and you get a type curve with $q_{i,norm}$ 1.00452351440113, $D_i$ 0.00245955922995233, $b$ 0.9000000000000002 and R2 0.981509708835585. Read that R2 twice. It is **higher** than the correct route returns, produced by a procedure that has quietly turned Ekene-6 into a well that started six months late and never reached its own peak. High R2 out of a wrong procedure is the recurring theme of this module, and here it shows up before you have fitted anything you meant to fit.

Normalize each well, then pool the normalized points. In code that is a map followed by a flatten, never a flatten followed by a map.

## Worked example

Normalize Ekene-6's one-year point by hand. The well came on 2020-09-01, so 2021-09-01 is $t = 365$ days on its own clock. Its model rate there is 63.8356049879382 stb/d and its peak is 90 stb/d, so

$$t_{norm} = 365, \qquad q_{norm} = \frac{63.8356049879382}{90} = 0.709284499865980$$

Now Ekene-3 at its own one-year point, from 80.5055750110695 stb/d and a peak of 150 stb/d, gives 0.536703833407130. Both wells now report a one-year normalized point, on identical axes, and the two points are nowhere near each other. Stop and run both divisions on a calculator before reading the next lesson, because the next lesson asks a single curve to pass through both of them.

## Exercise

Take the two-year model rates, 50.1186140532594 stb/d for Ekene-3 and 46.9795694328666 stb/d for Ekene-6, and normalize each one against its own peak. Confirm 0.334124093688396 and 0.521995215920740.

Then answer in one sentence each. Which well is further down its own curve at the same normalized time, and does that make it the faster-declining well in barrels? Would the two normalized values move any closer if you first rescaled both wells to a common initial rate? And what would you check on a real well before accepting that its peak rate is a sensible divisor?
