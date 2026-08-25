# The capstone walkthrough

The Professional capstone grades six values. This lesson works all six in order, with the tolerance each carries and the shortest defensible route to it. Treat it as a rehearsal: every number here has been derived somewhere in the course, and each section names where.

{{panel:bs-kinetics-explorer}}

## The two anchors

Ro at zero reaction, tolerance 0.001. The read-out at F = 0: $e^{-1.6} = 0.20189651799465538$. Calculator arithmetic, module 2 lesson 2.

Ro at full reaction, tolerance 0.005. F at the weight sum 0.85: $e^{-1.6 + 3.7 \times 0.85} = e^{1.545}$. By hand this is 4.687971627022013; the engine's summation order gives 4.687971627022019, and either lands mid-tolerance. If your value differs in the third digit instead of the fifteenth, module 2 lesson 4 tells you where to look.

## The ramp pair

Ro at 150 degC on the 3 degC per Ma ramp, tolerance 0.002: 0.9871413464062039. Ro at 150 on the 1 degC per Ma ramp, same tolerance: 1.1129254516555198. Both are rows of the golden tables, generated with the module 3 conventions: 0.01 Ma midpoint sub-steps, whole-degree reporting. If you are reproducing them with your own integrator, the checks are the convergence halving test and the expectation that the slow ramp reads 12.74 percent higher; if you are reading them from the panel, set the rate control and read the 150 tile.

The order of the two is itself gradeable understanding: slow wins at equal temperature, module 3 lesson 3, because its rock spent three times as long at every degree of the climb.

## The clock pair

Type II transformation ratio at 100 degC, tolerance 0.0005 each: 0.022481215976523083 at 10 Ma, 0.05477927380797565 at 50 Ma. Constant temperature, so whole-Ma steps suffice, module 4 lesson 2. The four-bin hand route reproduces the 10 Ma value to 0.07 percent: bins 46 through 52, survival factors from the 100 degC rates, contributions summed. The 50 Ma value's dominant term is the 48 kcal bin at seventy percent drained; the pair's ratio, 2.44 for five times the time, is the stall of module 4 lesson 3, and quoting it is the fastest way to show an examiner you know why the numbers sit where they sit.

## The traps, collected

Four ways this capstone is failed by people who can integrate. Normalising F to 1, which corrupts both anchors and every ramp value; module 2 lesson 1. Reporting the Python oracle's digits where they differ from the engine's in the last places, harmless inside tolerance but a sign of quoting rather than computing; the fixtures lesson of the Associate tier. Start-of-step temperature evaluation, 7 percent low at rate 3; module 5 lesson 4 diagnosed exactly this. And answering the TR fields with the vitrinite state or the Ro fields with the kerogen state: the separation is the tier's first lesson and the grader's favourite distinction.

## Worked example

Rehearse the full submission in the panel. Rate control to 3: read 0.9871413464062039 at the 150 marker. Rate to 1: read 1.1129254516555198. Anchor tiles: 0.20189651799465538 and 4.687971627022019, unchanged by any control, and say why in one sentence: they are endpoint states, independent of history. Temperature control to 100, type to II: clock tiles read 0.022481215976523083 and 0.05477927380797565. Six values, four controls touched, and every movement predicted before it was observed.

## Exercise

Write the six values from memory with their tolerances, then check them against this lesson. For any you missed, name the module and lesson that derives it.

As a self check: 0.20189651799465538 (0.001) and 4.687971627022019 (0.005), module 2; 0.9871413464062039 and 1.1129254516555198 (0.002 each), module 3; 0.022481215976523083 and 0.05477927380797565 (0.0005 each), module 4. If the anchors slipped, revisit the closed forms; if the ramp pair's order slipped, reread the slow-ramp lesson; if the TR pair's magnitudes slipped, the stall lesson is the cure.
