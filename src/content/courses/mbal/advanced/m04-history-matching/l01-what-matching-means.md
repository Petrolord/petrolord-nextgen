# What matching means

Everything you have done in this course runs one way. You know the pressures, you know the produced volumes, you form $F$ and $E_t$ at each survey, and you ask what oil in place best explains the voidage. The pressure is an input. It goes into the terms and it never comes back out.

A history match runs the other way. It asks: given candidate parameters, what pressure history would this tank have produced, and how far is that from the pressure history we actually measured? Then it adjusts the parameters until the two agree. The pressure stops being an input and becomes the thing being predicted, which is why the engine's own comment on the method calls it the inverse material balance equation.

That is not a refinement of the straight line solve. It is a different question with a different answer, and the two answers do not have to agree.

## What the simulator actually does

`simulatePressureHistory` takes the inputs, an in place scale (the oil in place $N$ for an oil case, the gas in place $G$ for a gas case) and returns a pressure at every row of the production history.

At each timestep the cumulative withdrawals are known, because they are measured at surface and have nothing to do with what the pressure did. So the balance

$$F(p) = N E_t(p) + W_e(p)$$

is a scalar equation in one unknown, the pressure. The engine solves it by a safeguarded false position search, bracketed between the initial pressure and a floor at the larger of 50 psia and two percent of the initial pressure, iterating until the bracket closes to a thousandth of a psi. Both $F(p)$ and $E_t(p)$ are evaluated by calling the same per timestep code the regression uses, on a two point series consisting of the initial row and a candidate row at the trial pressure. That is a deliberate choice and worth noticing: it means the PVT precedence chain you learned in the Professional tier, per row values then lab table then correlation, is identical on both sides by construction rather than by anyone remembering to keep two code paths in step.

The aquifer coupling is where it gets more careful. A pot aquifer delivers influx as a pointwise function of pressure, so it can be solved inside the root search. Fetkovich and Carter-Tracy cannot, because their influx at any step depends on the whole pressure history up to that step, and Carter-Tracy's pressure drop convention even reaches forward to the next observation. For those the simulator iterates a fixed point: solve every step with the influx frozen, recompute the influx from the full simulated series using the engine's own marching routines, and repeat until the series stops moving. The tolerance is 0.2 psi and the cap is 25 sweeps, and if it does not settle you get a warning saying so.

## What the matcher does with it

`runHistoryMatch` wraps that simulator in a Levenberg-Marquardt search. The residual at each fitted row is the observed pressure minus the simulated pressure, in psi. The parameters are transformed to natural logs before the search, because every one of them is strictly positive and the log transform enforces that without any special handling at the boundary. The default iteration cap is 30. Fitted rows are every timestep except the initial one and any you have excluded.

What comes back is a set of matched parameters with standard errors and 95 percent intervals from the curvature at the optimum, the observed and simulated pressure series, the residuals, a root mean square error and a maximum absolute error in psi, and a full forward run at the matched parameters.

One trap in that result object, and it is documented in the source rather than hidden. The forward run inside the result re-estimates the oil in place by regression from the OBSERVED pressures, exactly as it always did. So `forward.estimated_ooip_stb` is your straight line answer, not your matched answer. The matched answer is `matched_ooip_stb`. On a case where the two differ, reading the wrong field means reporting a number your match never produced.

## Worked example: the Dake tank, matched on one parameter

Take Exercise 9.2 from module 2, the wedge reservoir with the finite Carter-Tracy aquifer and eleven annual pressure observations. Module 2 read it the usual way: the regression returns an oil in place of 307221409.553720 stb, and that is the number the Expert capstone grades.

Now match it instead, with the oil in place as the only free parameter and the aquifer held exactly as configured. The search converges in 4 iterations and returns

$$N = 310198605.412900 \ \text{stb}$$

with a root mean square pressure error of 4.31298999061806 psi and a worst single miss of 7.16187806899097 psi, across a history that falls 1280 psi. The residuals, observed minus simulated, run

| year | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 |
|---|---|---|---|---|---|---|---|---|---|---|
| psi | 7.16 | 6.94 | 4.83 | 4.31 | 2.47 | 1.53 | 0.29 | -1.49 | -3.22 | -4.85 |

Three things to take from that.

First, the matched oil in place is 310198605.412900 stb against the regression's 307221409.553720 stb. They differ by 2977195.85917908 stb, or 0.969071739988384 percent. Same data, same engine, same aquifer model, two different questions, two answers a million barrels apart. Neither is a mistake.

Second, the matched value lands on Dake's own answer. Dake solved this exercise by least squares against the Hurst and van Everdingen unsteady state solution and reported 310.2 MMSTB. The match returns 310198605.412900 stb, which is 1394.58710044622 stb away from that, a relative agreement of 0.000449576757074863 percent. Dake's stated truth for the field is 312 MMSTB, so the match sits 0.577370059968092 percent below the truth and reproduces the published fit almost exactly. It is matching what Dake matched.

Third, look at the sign pattern in the residual row. Positive early, crossing over around year 7, negative late. That is not noise. Noise alternates. A run of one sign followed by a run of the other is the signature of a model that has the wrong shape in time, and it is telling you something the root mean square error alone would not: the fit is spending its error budget on a systematic drift rather than scattering it. Whether that drift is the aquifer arriving on a slightly wrong clock, or the finite aquifer's boundary being felt at a slightly wrong time, is a question for the next lessons. The point here is that the residual series carries information the summary statistic throws away, and you look at it every time.

## Exercise

Write down, in your own words, the two questions being asked by the regression and by the match on this same tank. Be precise about what is held fixed in each and what is being solved for.

Then answer three things. First, why does the match not simply reproduce the regression's answer, given that both use the same balance equation and the same PVT? Second, the match reports a 95 percent interval of 308550351.872983 to 311855663.803355 stb, which does not contain Dake's stated truth of 312 MMSTB, missing it by 144336.196645021 stb. Say what that interval is actually a statement about, and why it can exclude the truth without anything having gone wrong in the arithmetic. Third, if you had to hand one of these two oil in place numbers to a reserves committee, which would you hand over and what would you write beside it?
