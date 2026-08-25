# Ro at 150 on the capstone ramp

This lesson delivers the first of the two graded ramp values: the reflectance of a rock heated at 3 degC per Ma, read at 150 degC. The number is 0.9871413464062039, and by the end of the lesson you will know what stands behind every part of it.

{{panel:bs-kinetics-explorer}}

## The value in its table

Set the panel's rate to 3 and follow the middle curve. It leaves 20 degC at the floor value 0.20189651799465538, because nothing has reacted yet, and climbs smoothly. Selected rows of its table:

| T (degC) | Ro, 3 degC per Ma |
|---|---|
| 60 | 0.3462245030986587 |
| 100 | 0.5525862957151584 |
| 120 | 0.6949014132952521 |
| 140 | 0.8570249352898226 |
| 150 | 0.9871413464062039 |
| 160 | 1.1540860005781945 |
| 180 | 1.5214648867977838 |
| 200 | 2.0071081015001817 |

The 150 row is the graded value, tolerance 0.002. The rock arrives there 43.333 Ma after the ramp began, having executed 4333 midpoint sub-steps.

## What the state looks like at that moment

The reflectance corresponds, through the inverse map, to F = 0.4289345833269452: just over half of the scheme's 0.85 total has reacted. Inside the ladder, the picture is the moving front from module 2: the bins up to about 46 kcal are drained, the 48 to 52 kcal bins are partially reacted, and everything from 56 kcal upward is essentially intact. The curve's smoothness across the whole climb is those hand-offs blending: as each bin exhausts, the next one's reaction picks up in an overlapping relay.

It is worth saying what the 150 degC row does not represent: an equilibrium, a destination, or a property of 150 degC. Stop the ramp at 150 and hold it, and Ro keeps rising, slowly, as module 4's stall lesson quantifies. The row records the state of a rock that has been heating at this particular pace and has just now passed this particular temperature.

## Reading the whole curve

Two observations to take from the table, both of which the exam will probe. Between 60 and 150 degC the reflectance roughly triples; between 150 and 200 it doubles again in only 50 degrees. On the log axis of the panel this is close to a straight line: each degree of the ramp multiplies Ro by a nearly constant factor of about 1.013. The reason is the interaction of two exponentials, the Arrhenius rate sweeping up the ladder and the read-out's $e^{3.7F}$, and the near-cancellation into a loglinear curve is a known and convenient feature of Easy%Ro's design.

Second, the curve enters the conventional oil window band, Ro 0.55, at 100 degC, and reaches Ro 1.0 at 151 degC. Those two rows bracket the capstone value: the graded 150 degC reading is a rock at the very top of the classic window, F at 0.43, and one degree short of the round Ro 1.0 crossing.

## Worked example

Verify the graded value's plausibility with the loglinear approximation, no integrator. From 100 degC, Ro 0.5525862957151584, apply the constant per-degree factor 1.013 across 50 degrees: $0.55259 \times 1.013^{50} = 0.55259 \times 1.9083 = 1.0546$. The true value is 0.9871413464062039, so the shortcut lands within 7 percent. The approximation is a sanity net, not a substitute: if your integrator ever disagrees with it by a factor of two, you have a bug, and module 2's units lesson tells you which kind to suspect first.

## Exercise

From the table, compute the ratio of Ro at 160 to Ro at 140 and express it as a per-degree factor. Then answer in a sentence: what would holding the temperature at 150 degC do to the value, and which lesson quantifies it?

As a self check: $1.1540860005781945 / 0.8570249352898226 = 1.3466$ over 20 degrees, which is $1.3466^{1/20} = 1.015$ per degree, consistent with the loglinear reading of the curve. Holding at 150 degC would let Ro continue to rise past 0.9871 as the partially reacted bins drain, and the isothermal stall lesson in module 4 puts numbers on how quickly that continuation slows.
