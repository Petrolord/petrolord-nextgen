# The ramp convention

The golden ramps heat a rock from 20 to 200 degC at a constant rate and tabulate its reflectance at every whole degree. Before you can reproduce a single tabulated value, you need the convention that generated the table, because an integrator over a changing temperature has choices to make, and two correct programs making different choices produce visibly different tables. This lesson pins the choices.

## The three choices

First, the step size. The ramp is divided into sub-steps of 0.01 Ma. At 3 degC per Ma that is one step per 0.03 degC; the full 180 degree climb takes 6000 steps. At 1 degC per Ma it takes 18000.

Second, the temperature each step uses. The rock's temperature changes continuously within even a small step, and the kinetic step from module 2 needs one constant value. The convention is the midpoint: a step running from time $t$ to $t + 0.01$ Ma is integrated at the temperature halfway through, $T(t + 0.005\,\mathrm{Ma})$. Midpoint evaluation cancels the first-order error that using the start or end temperature would introduce, which matters because the rate is exponential in temperature and always curls upward: a start-point rule systematically under-reacts, an end-point rule over-reacts, and the midpoint splits the difference to second order.

Third, the reporting grid. The table records Ro at every whole degree, and an entry is written the first time the ramp temperature reaches or passes that degree. The graded values "Ro at 150" are entries of that table, not interpolations.

## Why 0.01 Ma

At constant temperature, step size is irrelevant, as you proved in module 2. On a ramp it matters exactly as much as the temperature changes within a step. At 3 degC per Ma and 0.01 Ma steps, the within-step change is 0.03 degC, and the rate change across 0.03 degC is a factor of about 1.005 at the steepest part of the ladder. The residual integration error lands far below the 1e-9 agreement observed between the engine and the independent Python oracle, which is the operational meaning of "converged": halving the step changes nothing you can see at the precision the fixtures are compared at.

The fast 10 degC per Ma ramp has 0.1 degC of change per step and is the least converged of the three, which is one reason the fixtures grade the 1 and 3 degC per Ma values and use the 10 degC per Ma curve for pattern only.

## What the fixture is, and is not

Notice that a ramp is a pure temperature history: no burial, no lithology, no heat flow, no depth. That is deliberate and it is what makes this module checkable. Any real rock's temperature track is some complicated staircase produced by a burial history and a transient heat solver; the Expert tier builds those. A ramp isolates the kinetics, and heating rate is the honest one-parameter summary of any track's pace.

The rates were chosen to bracket geology. Basins mostly heat their source rocks at something of order 1 to 10 degC per Ma; 3 is a defensible middle, and the capstone calls it the reference. When module 5 talks about reading real basins, these three curves are the frame.

## Worked example

How many kinetic sub-steps has the 3 degC per Ma ramp executed by the time its table writes the 150 degC row, and how long has the rock been heating? From 20 to 150 degC is 130 degrees, which at 3 degC per Ma takes 43.333 Ma, and at 0.01 Ma per step that is 4333 steps, each evaluated at its midpoint temperature. The 1 degC per Ma ramp reaches the same row after 130 Ma and 13000 steps. Three times the steps, three times the time at every temperature along the way: module 3's headline is already visible in the bookkeeping.

## Exercise

State the three conventions in one line each. Then answer in a sentence: why does a start-of-step temperature rule systematically under-predict maturity on a heating ramp?

As a self check: sub-steps are 0.01 Ma; each is integrated at its midpoint temperature; the table reports at whole degrees, written when the ramp first reaches each degree. A start-of-step rule always evaluates the exponential rate at the coolest moment of the step, and since the Arrhenius rate curves upward in temperature the average true rate within the step is always higher than the start-point rate, so every step under-reacts and the errors accumulate in one direction.
