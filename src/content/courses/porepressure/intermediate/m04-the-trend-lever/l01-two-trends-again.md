# Two trends again

Module 1 promised that the fitted trend would return with consequences. This module delivers them, quantitatively, and then extracts the working discipline. First, a careful restatement of what the two candidates are, because the details decide the damage.

## The candidates

The header trend: 656 us/m at the mudline, decaying at 0.6 per km toward the matrix time of 220 us/m. This is the trend the well's sonic was constructed on, and the capstone's specified choice. Above the ramp top the log sits on it exactly.

The fitted trend: 650.0000000000014 us/m and 0.7000000000000015 per km, the exact least-squares fit through the twelve shale picks, sharing the 220 us/m matrix time. The Associate tier established that the fit is clean: all twelve picks lie exactly on this curve, the residuals are zero, and re-fitting reproduces it to fourteen decimals. Nothing about the FIT is wrong.

What is wrong, for the purpose of a prognosis on this well, is the picks. They were drawn from a population that follows a slightly different exponential than the well's own sonic. On a real well this happens for mundane reasons: picks taken in a neighbouring well, picks biased toward the cleanest shales, picks concentrated in a depth range where the trend is locally steep, a regional trend applied to a local well. The golden well compresses all of those into one honest disagreement, 6 us/m at the mudline and a sixth in the decay rate.

## Small numbers, and why they will not stay small

Set the two trends side by side at increasing depth, values from the trend equation:

At the mudline: 656 versus 650, gap 6.0 us/m. At 1000 m: 459.28187333699555 versus 433.5316806303065, gap 25.75. At 2500 m: 317.2847498247154 versus 294.72279568369134, gap 22.56. At 4000 m: 259.5530276341839 versus 246.14832692884366, gap 13.40.

The gap grows to a maximum of 26.84 us/m at 1400 m and then narrows again, because both curves converge toward the same matrix time; in PROPORTION to the shrinking trend values, the disagreement keeps growing with depth. What Eaton consumes is the proportion: the ratio uses the trend as a numerator, so a trend low by four percent drags the ratio down by four percent regardless of the absolute microseconds.

And module 2 taught what the exponent does to a ratio error: cubes it, roughly triples it for small departures, then multiplies by a budget of tens of MPa. That chain is about to run.

## The direction of the error

The fitted trend sits BELOW the header trend at every depth. A low trend says the rock ought to be faster than it is, everywhere, so every ratio drops below its true value and every depth gains phantom pressure. The error is systematic, one-signed, and grows with depth. It will not average out, because it is not noise; it is bias, injected at the single point where the method defines normal.

Keep the contrast with log noise in mind. A noisy sonic sample perturbs one depth, is visibly spiky, and is screened by eye or caliper. A biased trend perturbs every depth coherently and produces a curve that looks perfectly smooth and professional. The most dangerous errors in this method are the ones that produce beautiful curves.

## What would happen with the bias reversed

Worth thirty seconds now, because module 2 flagged it: a trend HIGH by the same amounts would push every ratio above its true value, suppressing real overpressure and, in normally pressured section, reporting pressures below hydrostatic. The visible symptom, subhydrostatic pressure in undrilled shale, is exactly the trend alarm of module 2's lesson 5. The fitted trend on this well errs on the loud side, which is the side you can catch; hold onto the knowledge that the quiet side exists and is worse.

## Worked example

Compute the proportional trend error at 3000 m. Header: 292.07031526461174 us/m. Fitted: $220 + 430\, e^{-2.1}$ with $e^{-2.1} = 0.1224564282529819$, giving $220 + 52.65626414878222 = 272.65626414878225$ us/m. The fitted trend is low by 19.41405111582949 us/m, which is 6.65 percent of the header value.

Module 2's small-departure rule says a ratio error of 6.65 percent becomes roughly $3 \times 6.65 = 20$ percent of the budget in phantom handover. The budget at 3000 m is 35.523412418439044 MPa, and twenty percent of it is about 7 MPa, on a depth whose true overpressure is 2. The next lesson runs the exact numbers; this estimate says in advance they will be ugly.

## Exercise

State, in one sentence each, the three properties of a trend error that make it more dangerous than a log error, using this module's vocabulary.

Self check: it is systematic rather than local, biasing every sample in the same direction instead of one; it is amplified, entering through the ratio where the exponent roughly triples it before the budget scales it to megapascals; and it is invisible in the product, yielding a smooth plausible curve with no spike to catch the eye, so it must be caught at the input, by defending the trend itself, rather than at the output.
