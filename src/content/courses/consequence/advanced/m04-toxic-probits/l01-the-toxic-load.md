# The toxic load

{{panel:cq-harm}}

A toxic gas harms through what a person breathes over time. The Associate tier ended at a concentration at a receptor; this module turns a concentration held for a time into a lethality probability. The measure that carries it is the toxic load, and its form decides how much a brief high concentration matters against a long low one.

## The toxic load and its exponent

The engine exports its toxic presets as `TOXIC_PROBITS`, each of the form Y = a + b ln(C^n t), with t in MINUTES and C in the unit the preset states. The toxic load is C^n t. Time always enters to the first power. The concentration enters to the power n, and n is different for every substance and every source.

When n is one, doubling the concentration and doubling the time do the same thing. When n is above one, the concentration counts for more, so a short exposure to a high concentration is worse than a long exposure to a low one with the same product of concentration and time.

Take the Lees preset for chlorine, lees-chlorine: a = -8.29, b = 0.92, n = 2, in ppm. Chlorine for 10 minutes (stated):

| chlorine ppm, stated | lees toxic load | lees probability |
| --- | --- | --- |
| 50 | 25000.000000 | 0.000035 |
| 100 | 100000.000000 | 0.003487 |
| 200 | 400000.000000 | 0.077409 |
| 400 | 1600000.000000 | 0.441437 |

Each doubling of the concentration raises the toxic load by more than double, because n is 2: from 100000.000000 at 100 ppm to 400000.000000 at 200 ppm. The toxic load unit is printed with every result, here (ppm)^2 min, so the unit and the exponent always travel with the number.

## Minutes and the preset's unit

Two unit traps sit in this form. The first is time. A thermal probit takes seconds; a toxic probit takes minutes, and the argument name says so: `exposureMinutes`. The second is the concentration unit. The Lees presets, as OSD/30 prints them, are in ppm. The Purple Book presets, whose names begin pb-, are in mg/m3. A concentration in the wrong unit gives a wrong toxic load, and the next lessons deal with converting it.

## Which toxic probits are graded

The Lees toxic coefficients are graded in this course, because OSD/30 Table 2 prints, for thirteen substances, the ppm that gives one percent and fifty percent at 5 and 30 minutes, and all fifty-two of those values reproduce through the engine's inverse within one percent or one ppm. That printed column is the second route.

The Purple Book toxic coefficients have one published worked case behind them, for carbon monoxide: 21,300 mg/m3 for 30 minutes, printed as a probit of 5.97 and a probability of 0.835, where the engine gives 5.967660 and 0.833393. Every other Purple Book substance rests on the transcription alone, so every graded toxic probit in this course uses a Lees preset.

## Exercise

On the harm panel's toxic view, choose lees-chlorine and enter each concentration in the table above for 10 minutes. Confirm the toxic loads and probabilities. Then hold 200 ppm and change the time to 20 minutes, and compare the result with 400 ppm for 10 minutes, which has the same product of concentration and time. Write one sentence explaining which exposure is worse and why the exponent decides it.
