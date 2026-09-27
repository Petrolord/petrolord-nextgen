# Summing by category

{{panel:prms-aggregation-calculator}}

The Expert tier asks one question: when several projects are added up, reconciled from one year to the next and cut at an economic limit, what does each figure say and where does it stop? This module starts with the simplest total there is, the arithmetic sum. Every practical in this tier runs in the course's own aggregation calculator, which calls the same vendored engine every lesson quotes.

## One class, one call

The engine's `aggregate` function takes the projects of one class at a time: Reserves, Contingent Resources or Prospective Resources. Each project states a distribution, and the engine reads a low, a best, a high and a mean off it with the canonical closed-form readers of lib/stats. It then adds the projects category by category. The engine cites its rule in its basis, verbatim:

> SPE-PRMS 2018 (June 2018, v1.03 with the 2022 errata; CC BY-NC-ND 4.0, cited by section): 4.2.5, 4.2.6; 17 CFR 229.1202(a)(3) (Regulation S-K Item 1202); Guidelines for Application of the PRMS (November 2011): 6.3

SPE-PRMS 2018 is cited by section only: its licence is non-commercial and no-derivatives, and this course is sold. In the course's words, PRMS 4.2.5.2 adds the lows for the total low, the bests for the total best and the highs for the total high.

## The Ekene Reserves

The Ekene field is synthetic, written for this platform by a stated script. Its Reserves aggregation holds three projects at the field level in MMbbl, each with a stated distribution:

| project | distribution (stated) | low | best | high | mean |
| --- | --- | --- | --- | --- | --- |
| EKN-1 | triangular min 2.628420, mode 16.097684, max 31.737202 (fitted) | 8.890000 | 16.650000 | 24.990000 | 16.821102 |
| EKN-2 | lognormal mean 6.000000, standard deviation 1.800000 | 3.945035 | 5.746958 | 8.371921 | 6.000000 |
| EKN-U | normal mean 4.000000, standard deviation 0.800000 | 2.974759 | 4.000000 | 5.025241 | 4.000000 |

| category | arithmetic sum (engine) |
| --- | --- |
| 1P | 15.809794 |
| 2P | 26.396958 |
| 3P | 38.387162 |

The engine's line, verbatim:

> arithmetic summation by category: 1P 15.809794, 2P 26.396958, 3P 38.387162 MMbbl (PRMS 4.2.5.2)

## What the words mean here

"Proved" in this course is the cumulative 1P, the low estimate of Reserves; the increment is Proved (P1). The arithmetic 1P of 15.809794 is the sum of three low estimates, and it carries the P90 label only as an outcome label. Whether it is the P90 of the total is a separate question, and the last lesson of this module takes it up. A figure that depends on inputs is quoted with them, so this one travels with its class (Reserves), its unit (MMbbl), its level (field) and its three distributions.

## A constant

Equal low, best and high make a project a constant. In the start "A constant project added", EKN-C at 1.200000 joins the three, and its value is added to every category: the arithmetic 1P rises from 15.809794 to 17.009794 (engine). A constant has no range, and the sum treats it like any other project.

## Exercise

Open the aggregation calculator on the view "Aggregation: arithmetic and probabilistic" and start from "Ekene Reserves at the field level". Read the project table and add the three low estimates, the three best and the three high yourself; compare your sums with the arithmetic table. Then switch to "A constant project added", find the constant in the box and check that the 1P, 2P and 3P each rise by its value. Finally set the Class (stated) control to "not stated" and read what the engine asks for.
