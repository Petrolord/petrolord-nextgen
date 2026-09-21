# A concentration that changes

{{panel:cq-harm}}

A real exposure is rarely one steady concentration held for a fixed time. A cloud arrives, peaks and thins; a person shelters, moves or is evacuated. The toxic load handles that by adding up the exposure step by step. This lesson shows how, and why the result is larger than an average would suggest whenever the exponent is above one.

## Summing the toxic load

The engine's `toxicDose` function sums the toxic load over a history. Its model string, verbatim: "D = sum(C^n dt)". Each step is a concentration and the minutes it lasted; the function raises each concentration to the power n, multiplies by its minutes, and adds the steps. The unit of the concentration and the exponent must be the ones the preset you will use expects: ppm for a Lees preset, mg/m3 for a Purple Book one.

A history (stated): 150 for 5 minutes, 90 for 10 minutes, then 30 for 20 minutes, at n = 2.

| way of treating the history | toxic load |
| --- | --- |
| summed step by step | 211500.000000 |
| the time-weighted mean, 64.285714, held for the whole time, derived | 144642.857143 |

## Why the peak counts for more

The step by step toxic load is 211500.000000; the average held for the same time gives 144642.857143. The difference comes entirely from the exponent. With n above one, raising a high concentration to the power n makes it count for more than its share of the time, and doing the same to a low one makes it count for less. Averaging first throws that away, and so it understates the harm of any exposure that has a peak in it.

The first step here is the shortest in time, 5 minutes, yet at 150 it carries most of the toxic load. That is the physical point a history captures. For a Lees chlorine preset, with n = 2, a brief high concentration from a passing cloud can matter more than a long low tail. For a substance whose preset has n = 1 the peaks would carry no extra weight, and the average would give the same toxic load as the sum.

## What the history cannot do

The history carries no probit of its own. It returns a toxic load, and the probit follows from the preset's a and b through the general form Y = a + b ln(V). An empty history is refused:

> history: must be a non-empty list of { concentration, minutes }

The engine does not invent a concentration history either. A history comes from the analyst, from measurements or from a stated scenario, and the consequence note says where each step came from.

## Exercise

On the harm panel's toxic view, set the toxic load exponent to 2 and type the history above, one step per line. Confirm the toxic load of 211500.000000. Then replace the history with a single step of 64.285714 lasting the whole time of the history; the toxic load matches 144642.857143 to about two decimals, because the typed mean is rounded. Finally, reorder the three original steps and record whether the toxic load changes, and write one sentence explaining your finding.
