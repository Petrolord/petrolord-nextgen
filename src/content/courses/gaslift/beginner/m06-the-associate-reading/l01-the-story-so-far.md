# The story so far

Six modules about one column of gas, and not a single valve setting in any of them.

## Gas has weight and the weight is not one number

z and the static gradient move with pressure and temperature together.

| sg | Pressure, psia | Temperature, degF | z | Gradient, psi/ft |
| --- | --- | --- | --- | --- |
| 0.6 | 100.0 | 80.0 | 0.986397962 | 0.002112418 |
| 0.65 | 500.0 | 100.0 | 0.932572676 | 0.011670185 |
| 0.65 | 1500.0 | 180.0 | 0.896752731 | 0.031855542 |
| 0.7 | 2500.0 | 220.0 | 0.894419892 | 0.053952003 |
| 0.8 | 3500.0 | 250.0 | 0.916168222 | 0.080711504 |

The flat 0.02 psi/ft rule sits somewhere in the middle of that spread and matches none of it.

## Three columns, marched and inverted

Column 1 lifts 201.016705 psi over 8000 ft at an average of 0.025127088 psi/ft, column 2 lifts 426.539804 psi over 11000 ft at 0.038776346 psi/ft, column 3 lifts 53.897603 psi over 4000 ft at 0.013474401 psi/ft. Their local gradients against the rule of thumb are 1.270257, 1.993598 and 0.680826 at surface, so the rule reads low on two and high on one.

Every one of them has a gradient that falls with depth, because the geotherm outruns the compression. Hold the temperature still and the same columns rise by 26.0096, 43.3641 and 10.1002 percent instead.

## The top valve

Valve 1 sits where the injection line first beats a full column of kill fluid on the unloading wellhead pressure. It is a fixed point, seeded by the weightless answer and iterated: 2000.000000000 ft becomes 2119.249955500 ft on westTexasOil, and the four published designs land at 2119.249955500, 2606.192537300, 2410.595626808 and 2354.019550242 ft.

It moves on kickoff pressure, kill fluid gradient, wellhead pressure and gas gravity, in that order of authority, and it does not move on the decrement at all.

## The negative result

At the 20 steps the engine uses, column 1 sits 5.0036e-4 psi from a 2000 step answer on 201.0167 psi of lift, and the error ratio near 4.0 in every block says a second order method is behaving as its order predicts. The chord under the plotted curve is negative and tiny, -1.2220e-4 psi at 64 samples on column 1. Nothing here is broken, and saying so took the same measurement that would have found a break.

## What the tier does not answer

Where the second valve goes, what any valve is set to, and whether the string will unload without injecting at two depths at once. The column is a ruler. It does not design.

## Exercise

Write the three things that fix the top valve and the one thing that does not, then say what each of the three would do to it if you doubled it.
