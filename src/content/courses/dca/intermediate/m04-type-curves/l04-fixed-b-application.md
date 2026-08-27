# Fixed-b application

You have a type curve. Applying it does not mean using its parameters. `applyTypeCurve` borrows exactly one number from the pooled fit and re-derives everything else from the target well's own history, which is both more sensible than it sounds and more dangerous than it looks.

## What the function does

- It refuses to run on fewer than 5 valid rows, or on a type curve whose $b$ is zero or missing.
- It sorts the target's history and sets $t = 0$ at the target's own first row.
- It borrows $b$ from the type curve and nothing else. The pooled $q_{i,norm}$ and $D_i$ are discarded.
- With $b$ fixed, the hyperbolic becomes linear. Raise the rate equation to the power $-b$ and

$$q^{-b} = q_i^{-b}\left(1 + b D_i t\right) = q_i^{-b} + b D_i q_i^{-b}\, t$$

  so $q^{-b}$ plotted against $t$ is a straight line. The function runs an ordinary least-squares regression of $q^{-b}$ on $t$.
- It recovers the parameters from the line: $q_i = \text{intercept}^{-1/b}$ and $D_i = \text{slope} / (b\, q_i^{-b})$.
- It rejects the fit if the intercept or the slope comes out non-positive, which is what a rising history produces.
- It scores R2 and RMSE against the target's own rows and labels quality: 0.85 and above Good, 0.6 and above Fair, otherwise Poor.

Two things to carry away. This is a linear regression rather than a grid search, which is why it is fast, why it never has to pick a model, and why it almost always returns something. And the returned $q_i$ and $D_i$ are compensators: they absorb whatever the borrowed $b$ gets wrong over the history window.

## Applied to Ekene-6

Take the pooled Ekene-3 plus Ekene-6 curve from the last two lessons, borrow its $b = 0.05$, and apply it to Ekene-6's own 28 primary rows:

| Quantity | Fixed-b match | Ekene-6's own fit |
|---|---|---|
| $q_i$ (stb/d) | 88.8116671130696 | 89.9999999999999 |
| $D_i$ (1/d) | 0.000893152170857701 | 0.00100000000000000 |
| $b$ | 0.05 (borrowed) | 0.35 |
| R2 | 0.999047938405246 | 1.00000000000000 |
| RMSE (stb/d) | 0.423232559356918 | 4.31997628804008e-14 |
| Quality label | Good | Excellent |

Watch the compensation. $b$ was forced down by 0.30, and both of the free parameters moved down with it. A smaller $b$ means the decline stiffens rather than softening, so the regression lowers $D_i$ to keep the early history from falling away too fast, and trims $q_i$ to balance the first few months. Nothing here is an independent estimate of anything. Every parameter in a fixed-b match is conditional on the borrowed exponent.

## Getting the EUR

The applied match is a hyperbolic with $b = 0.05$, so the Associate tier's hyperbolic EUR closed form applies unchanged:

$$EUR = \frac{q_i^{\,b}}{D_i(1-b)}\left(q_i^{\,1-b} - q_{limit}^{\,1-b}\right)$$

At a 10 stb/d limit, with the full-precision parameters:

$$q_i^{\,0.05} = 1.25147881165751, \qquad D_i(1-b) = 0.000848494562314816$$

$$\frac{1.25147881165751}{0.000848494562314816} = 1474.94028511307$$

$$q_i^{\,0.95} - 10^{\,0.95} = 70.9653781476684 - 8.91250938133745 = 62.0528687663309$$

$$EUR = 1474.94028511307 \times 62.0528687663309 = 91524.2759502962 \text{ stb}$$

Stop and run that chain yourself, with the full-precision $q_i$ and $D_i$ rather than rounded ones. Two power keys, one division, one subtraction, one multiplication. If you land on 91524.3 stb you have it, and you have reproduced the number the Professional capstone asks for.

Two notes on the form. $b = 0.05$ is safely below 1, so the $(1-b)$ in the denominator is harmless; a borrowed $b$ of exactly 1 would need the harmonic logarithm instead. And the same parameters give the life from the time-to-limit formula:

$$t_{limit} = \frac{(q_i/q_{limit})^{b} - 1}{b D_i} = 2583.69556071181 \text{ days}$$

which is 7.07861797455291 years.

## The quality word means less than it appears to

Two functions in the same engine score this one fit. `applyTypeCurve`'s own scale runs Good, Fair, Poor, with Good starting at R2 0.85 and nothing above it, so R2 0.999047938405246 and R2 0.851 both print **Good**. Hand the same R2 to `getFitQuality`, whose bands start Excellent at 0.95, and the same fit reads **Excellent**. Neither word looked at anything beyond the history rows. The next lesson shows what this particular Excellent actually bought.

## The returned forecast is not a booking

`applyTypeCurve` also hands back a forecast array, and its shape is worth knowing before anybody sums it. For Ekene-6 it starts at $t = 851$ days, which is 30 days after the last history point, steps 30 days at a time, and runs to $t = 4451$ days in 121 rows. It contains no economic-limit logic at all. It is a plotting aid. Book from the closed form using the returned parameters, exactly as above.

## Named misconception

**"Applying a type curve means using the type curve."** It means using its $b$. The pooled $q_{i,norm}$ of 1.00042521426751 and $D_i$ of 0.00131674836694260 never touch the target well. If a report shows a type-curve application whose $q_i$ is the pooled $q_{i,norm}$ multiplied by a peak rate, a different method was used and the report should say which.

{{panel:dca-typecurve-explorer}}

Leave the pool on the default two wells and set the apply-to-well selector to Ekene-6. Read the applied $q_i$, $D_i$, R2 and quality tiles against the table above, then read the EUR tile against your hand chain.

## Exercise

Repeat the EUR chain for the same fixed-b match at the other two limits from the Associate tier's sensitivity work. You should get 97865.1994120820 stb at a 5 stb/d limit and 79274.4192889547 stb at a 20 stb/d limit, against Ekene-6's true bookings of 117307.074530524 and 86373.1382895878 stb.

Then answer in one sentence each. Does the borrowed-b error grow or shrink as the economic limit rises, and why does that direction make sense given which part of the curve $b$ controls? And what does the fact that the error is smallest at the highest limit tell you about where a type-curve booking is safest to use?
