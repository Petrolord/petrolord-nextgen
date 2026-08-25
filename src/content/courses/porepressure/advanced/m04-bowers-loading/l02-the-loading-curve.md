# The loading curve

One curve, five engine points, and the habits of reading it. The loading curve is the normal-compaction concept of the Bowers world: what velocity a rock SHOULD have at a given effective stress, if its stress has only ever grown.

## The equation, complete

$$V = V_{ml} + A\,\sigma'^{\,B}$$

with the golden parameters $V_{ml} = 5000$ ft/s, $A = 10$, $B = 0.75$, and the crucial small print that $\sigma'$ enters in psi and $V$ emerges in ft/s, the published domain, converted at the edges; lesson 3 is devoted to exactly that. The engine's SI edges take pascals in and metres per second out.

## The curve in five points

Engine values of the loading velocity at round effective stresses:

At 5 MPa: 1949.944709834568 m/s, the graded point. At 10 MPa: 2240.3507591923435. At 29.240177382128643 MPa: 3125.808993287662, a point chosen for module 5 reasons. At 43.752391704220855 MPa: 3691.0906301457703, the TD point. At 50 MPa: 3919.263125861896.

Two shapes to internalise. The curve rises steeply at low stress and flattens: from 5 to 10 MPa buys 290 m/s, from 43.8 to 50 buys 228 over a bigger interval. Power 0.75 means each additional megapascal of grain load stiffens the rock a little less than the last. And the curve starts at 1524 m/s at zero stress, the mudline velocity converted, which anchors its physical meaning: everything above 1524 is stress's contribution.

## Reading it forward: the QC direction

Forward, stress to velocity, the curve answers: what should this rock read? That is the quality-control direction. Take a depth where pressure is known, compute the effective stress, evaluate the curve, compare with the log. On this well at TD: known effective stress 43.714487325732826 MPa, and the curve, evaluated there, gives 3689.682402180745 m/s; the observed 3691.0906301457703 sits 1.408 m/s above it. Forward evaluation is how a Bowers calibration is checked against every measured-pressure point a basin owns.

## Reading it backward: the prediction direction

Backward, velocity to stress, it answers the working question: this rock reads $V$, what stress is it carrying? Inverting the equation:

$$\sigma' = \left( \frac{V_{fts} - 5000}{A} \right)^{1/B}$$

in the published domain, with the conversions at the edges. The exponent $1/B = 4/3$ exceeds 1, and that has an operational consequence worth naming now: the inversion AMPLIFIES velocity errors. A velocity slightly wrong becomes a stress more wrong, by roughly the factor $1/B$ in relative terms, and the pore pressure inherits the miss through the subtraction. Lesson 5 quantifies this with engine numbers; it is Bowers' cousin of the Eaton exponent's error gain, and neither method escapes the trade of sensitivity for error amplification.

The inversion also has a hard domain edge: it requires $V$ above the mudline velocity. At or below 1524 m/s the parenthesis is zero or negative and the engine refuses, throwing rather than returning a fiction. A velocity that low claims the rock carries no grain load at all, and the honest output is an error, not a pressure.

## What the loading curve assumes

The name is the assumption: LOADING. The curve describes rock whose effective stress has only ever increased, so that velocity and stress walked up the curve together. Undercompaction respects this: the stress stalls, the point stops climbing, but never retreats. So this well, whose overpressure is encoded undercompaction, should live ON the loading curve everywhere, and module 5 confirms it does.

What breaks the assumption is stress REDUCTION after burial: uplift, or late overpressure charging that pushes pore pressure up and effective stress down. Velocity does not walk back down the loading curve, because compaction is largely irreversible; the rock keeps most of its stiffness and follows a flatter path, the unloading curve. Reading an unloaded rock with the loading inversion misattributes its velocity to high stress, under-reading its pore pressure, sometimes badly; module 5's centrepiece puts a 19 MPa number on exactly that mistake.

## Worked example

Evaluate the curve at 20 MPa by hand through the published domain, practising for lesson 4's graded route. Convert: $20 \times 10^6 / 6894.757293168361 = 2900.7547546041847$ psi. Power: $2900.7547546041847^{0.75} = 395.2603579193691$. Times $A$: 3952.603579193691 ft/s. Plus mudline: 8952.603579193691 ft/s. Convert: $\times 0.3048 = 2728.7535709382373$ m/s, and the engine's bowersVLoading at 20 MPa returns exactly that. The chain is four operations and two unit conversions, and every graded Bowers value in the capstone is this chain or its reverse.

## Exercise

Using the five-point table, answer without computing: a shale sample reads 3000 m/s. Bracket its loading effective stress between two table values, then state what additional fact you would need before converting that stress to a pore pressure.

Self check: 3000 m/s sits between the 10 MPa point at 2240.35 and the 29.24 MPa point at 3125.81, so the loading stress is between 10 and 29.24 MPa, nearer the top of the range given the curve's flattening. To make a pore pressure you need the overburden at the sample's depth, since $PP = S - \sigma'$: Bowers converts velocity to effective stress without ever knowing depth, but pressure needs the frame, which is depth's contribution to the answer.
