# Checking a price by re-solving

A shadow price is a derivative at the optimum. The direct test of one is to move the limit and solve again. The digest does that for the two binding Apapa specifications, one whole unit each way.

## The re-solves

| re-solve | total cost $ | saving against the optimum $ | shadow price $ per unit |
| --- | --- | --- | --- |
| Sulfur limit 51 | 698149.8809 | 551.6796 | 551.8026 |
| Sulfur limit 49 | 699253.4861 | -551.9256 | 551.8026 |
| RVP limit 10 | 695050.1663 | 3651.3942 | 4448.9659 |
| RVP limit 8 | 703453.0642 | -4751.5037 | 4448.9659 |

The optimum these are measured against is the Apapa total of 698701.5605 $. The saving column is that total minus the re-solved cost, so a positive saving is relief that paid and a negative one is a tightening that cost money.

## Reading the sulfur rows

Raising the sulfur maximum to 51 ppm saves 551.6796 $. Lowering it to 49 ppm costs 551.9256 $, printed as a saving of -551.9256. The shadow price is 551.8026 $ per ppm. The digest prints all three and says why they can differ: a shadow price is a derivative at the optimum, and one whole unit of relief can differ from it, because the rows move non-linearly in the limit and the optimal vertex can change.

The first reason applies to every specification row. The limit L sits inside each coefficient, w_i - L d_i, so moving L reshapes the whole row, and the recipe that meets the new row is a new set of volumes.

## Reading the RVP rows

Raising the RVP maximum to 10 psi saves 3651.3942 $. Lowering it to 8 psi costs 4751.5037 $, printed as -4751.5037. The shadow price is 4448.9659 $ per psi. Here the index adds its own curvature: the index slope that turns index points into psi is read at 9 psi, and across a whole psi each way the slope is a different number.

A second reason can enter too. As a limit moves, the optimum can reach a point where a different set of constraints holds exactly. From there on it sits on a different vertex, and the rate that held at the first vertex no longer describes it.

## What a reader should conclude

The shadow price is the right figure for the question it answers: what the next small increment of relief is worth, at this optimum. It is the rate at the margin. A whole unit of relief is a finite move, and the finite move is priced by solving again. The engine gives a reader both and states which is which.

For a planner the practice is simple. Read the shadow price for the next small step of relief. Before committing to a large change in a limit, such as renegotiating a cargo's RVP by a whole psi, re-solve and read the saving the re-solve prints.

The oracle that holds the blending engine to account computes relief by exact re-solve with the limit moved, a check module six reads.

{{panel:crude-recipe-explorer}}

In the panel, move the sulfur limit one ppm at a time away from 50 and read the saving at each step beside the shadow price at the optimum.

## Exercise

Read the four re-solve rows. For sulfur, read the saving at 51 ppm, 551.6796 $, and at 49 ppm, -551.9256 $, beside the shadow price of 551.8026 $ per ppm. For RVP, read 3651.3942 $ at 10 psi and -4751.5037 $ at 8 psi beside 4448.9659 $ per psi. Say what each pair of re-solves shows about the shadow price as a rate at the optimum, and say what a planner should do before relying on a price for a whole unit of relief.
