# Checking a price by re-solving

A shadow price is the value of relief at the margin, a derivative at the optimum. The direct test of one is to move the limit and solve again. The digest does that for the two binding Apapa specifications, one whole unit each way, and says what it expects: "the saving from one whole unit of relief is a different number, and the table prints both."

## The re-solves

| re-solve | total cost $ | saving against the optimum $ | shadow price $ per unit |
| --- | --- | --- | --- |
| Sulfur limit 51 | 698149.8809 | 551.6796 | 551.8026 |
| Sulfur limit 49 | 699253.4861 | -551.9256 | 551.8026 |
| RVP limit 10 | 695050.1663 | 3651.3942 | 4448.9659 |
| RVP limit 8 | 703453.0642 | -4751.5037 | 4448.9659 |

The optimum these are measured against is the Apapa total of 698701.5605 $. The saving column is that total minus the re-solved cost, so a positive saving is relief that paid and a negative one is a tightening that cost money.

The digest also prints what holds at each re-solve:

| re-solve | binding | components at their availability |
| --- | --- | --- |
| the optimum (Sulfur 50, RVP 9) | Sulfur, RVP | Butane |
| Sulfur limit 51 | Sulfur, RVP | Butane |
| Sulfur limit 49 | Sulfur, RVP | Butane |
| RVP limit 10 | Sulfur | Isomerate, Butane |
| RVP limit 8 | Sulfur, RVP | Reformate |

## Reading the sulfur rows

Raising the sulfur maximum to 51 ppm saves 551.6796 $. Lowering it to 49 ppm prints a saving of -551.9256 $, a tightening that cost money. The shadow price is 551.8026 $ per ppm. At 51 and at 49 the same specifications bind and the same component sits at its availability, so the digest says the optimum stays at the same vertex. The gap comes from the limit itself: it "multiplies every volume in the sulfur row (w_i - L d_i), so the cost is not a straight line in L even at one vertex."

## Reading the RVP rows

Raising the RVP maximum to 10 psi saves 3651.3942 $. Lowering it to 8 psi prints a saving of -4751.5037 $. The shadow price is 4448.9659 $ per psi. Here what holds changes. At 10 psi only Sulfur binds, and Isomerate joins Butane at its availability. At 8 psi Reformate is the component at its availability. The digest's reading: "The RVP re-solves change what holds, so the optimum moves to a different vertex, and the RVP row is in index units, which are not a straight line in psi."

## What a reader should conclude

The shadow price answers one question: what relief is worth at the margin, at this optimum. A whole unit of relief is a finite move, and the finite move is priced by solving again. The two are different numbers, and the engine gives a reader both. A reader who quotes the 551.8026 $ per ppm quotes it as the rate at the optimum, and a reader who quotes 551.6796 $ quotes it as the saving from the re-solve at 51 ppm.

The oracle that holds the blending engine to account computes relief by exact re-solve with the limit moved by a step of 1/10^7 of a unit each way, a check module six reads.

{{panel:crude-recipe-explorer}}

In the panel, move the sulfur limit one ppm at a time away from 50 and read the saving at each step beside the shadow price at the optimum.

## Exercise

Read the four re-solve rows. For sulfur, read the saving at 51 ppm, 551.6796 $, and at 49 ppm, -551.9256 $, beside the shadow price of 551.8026 $ per ppm. For RVP, read 3651.3942 $ at 10 psi and -4751.5037 $ at 8 psi beside 4448.9659 $ per psi. Then read what holds at each re-solve, and say for each specification which reason the digest gives for the whole-unit saving being a different number from the shadow price.
