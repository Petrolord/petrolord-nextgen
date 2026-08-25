# Inverting the curve

Prediction runs the curve backward: log a velocity, recover a stress, subtract from the overburden. This lesson owns the inversion completely, its formula, its error gain, and its edges, because the backward direction is where Bowers earns its living and where its mistakes are made.

## The inversion, formally

$$\sigma' = \left( \frac{V_{fts} - V_{ml}}{A} \right)^{1/B}$$

in the published domain, conversions at the edges as always. With $B = 0.75$, the outer exponent is $4/3$: the inversion raises to a power ABOVE one, where the forward curve raised to a power below one. Lesson 4's exercise round-tripped the graded point through exactly this formula; the machinery is proven. Now the properties.

## The error gain

Differentiate the inversion and the sensitivity falls out; more usefully, run it numerically at the TD point. The velocity there is 3691.0906301457703 m/s, stress 43.752391704220855 MPa. Perturb the velocity by 10 m/s, a 0.27 percent change, well inside real sonic uncertainty, and re-invert. The engine's arithmetic: at 3701.0906301457703 m/s the loading stress is 44.0217913361992 MPa, a shift of 0.2694 MPa; at 3681.0906301457703 it is 43.48340613482635, a shift of 0.2690 the other way.

So at the TD point the inversion converts 10 m/s of velocity into about 0.27 MPa of effective stress, and every pascal of stress error is a pascal of pore pressure error through the subtraction. Thirty-seven m/s of sonic bias, unremarkable across a washed-out interval, is a full megapascal of pressure. In mud units at TD, 10 m/s is worth 6.7 kg/m3 of floor.

Two structural remarks. The relative gain is the $1/B = 4/3$ power acting on the velocity-above-mudline fraction, so higher-velocity rock has larger ABSOLUTE gain, the flattening curve read backward: where the forward curve is flat, the inverse is steep. And the gain is the price of sensitivity, exactly as with Eaton's exponent: a method that reads small velocity changes as pressure must amplify velocity error the same way. There is no calibration that escapes this; there is only knowing the number.

## The domain edges

Below the mudline velocity the inversion has no answer and the engine throws; that edge was lesson 2's. The subtler edge is UNCERTAINTY near it: at velocities just above 1524 m/s the term $V - V_{ml}$ is small, its relative error is huge, and the 4/3 power amplifies from there. Bowers stress estimates in very shallow, very slow sediment are structurally fragile, which matters for shallow-hazard work, and is why shallow prognoses lean harder on the frame and on analogue data than on any velocity inversion.

At the other end there is no mathematical ceiling: any fast velocity inverts to some enormous stress. The physical ceiling is the overburden: an inverted stress above $S$ implies negative pore pressure, and the honest reading of such a result is almost always a lithology change, a cemented streak read as if it were compaction, the Bowers cousin of Eaton's fast-side trap, module 2's blind-spot lesson wearing new units.

## Inversion plus frame equals prognosis

Assemble the full Bowers prognosis recipe, parallel to the Eaton workflow: frame as always; screen samples as always; invert each screened velocity to a loading stress; subtract from the overburden; done. No trend, no onset rule needed until reporting. Run mentally at TD: velocity 3691.0906301457703 inverts to 43.752391704220855, overburden 91.12306695073282, pore pressure 47.37067524651197 MPa. That number is 0.038 short of Eaton's 47.408579625, and the whole of module 5 hangs on those two sentences; here, note only that the recipe is genuinely shorter than Eaton's, trend-free, and correspondingly blind to different things: it cannot manufacture a spurious onset from a bad trend, and it cannot use trend quietness as a QC, both consequences of the same absence.

## Worked example

Invert a mid-ramp sample by hand. At 3000 m the log reads 297.76677602422825 us/m, velocity $10^6 / 297.76677602422825 = 3358.333032825104$ m/s. To ft/s: $/ 0.3048 = 11018.152994833017$. Less mudline: 6018.152994833017. Over A: 601.8152994833017. Power 4/3: $601.8152994833017^{4/3} = 5081.020717296159$ psi. To SI: $\times 6894.757293168361 = 35.03240464731723$ MPa, matching the engine's bowersSigmaLoading exactly. Check against Eaton at the same depth: effective stress there is $66.83114254343904 - 33.307730125 = 33.52341241843904$ MPa. Bowers reads 1.509 MPa MORE stress, hence 1.509 MPa LESS pore pressure, at 3000 m. Module 5 explains why the two methods, so nearly equal at TD, drift apart mid-ramp, and what the drift teaches about reading cross-checks.

## Exercise

Using the error-gain figure, state the velocity accuracy required at TD for a Bowers pore pressure good to 0.5 MPa, and compare it with the trend accuracy Eaton needed for 1 MPa in the Professional tier's module 4.

Self check: at 0.0269 MPa per m/s, a 0.5 MPa target needs velocity good to about 18.6 m/s at TD, half of one percent of the 3691 m/s reading. Eaton needed the TREND good to 1.7 us/m in 259.55, two thirds of one percent, for a 1 MPa budget; per megapascal of pressure accuracy the demands are one percent of velocity against two thirds of one percent of trend, the same order. Neither method is the cheap one; they spend the accuracy budget on different inputs, which is exactly why running both is worth more than running either twice.
