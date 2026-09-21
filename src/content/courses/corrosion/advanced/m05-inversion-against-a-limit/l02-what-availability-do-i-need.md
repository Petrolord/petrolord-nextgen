# What availability do I need

{{panel:fc-inhibitor-integrity-explorer}}

A corrosion inhibitor programme has two numbers in it and only one of them is on the datasheet. Efficiency is what the chemical removes while it is on the steel. Availability is the fraction of the time it is there. The engine takes them as separate inputs and returns the effective protection they give between them, along with the shortfall in percentage points against the datasheet figure.

The forward question asks what a programme delivers. The inverse question is the one a programme manager actually has: to reach a stated effective protection at the efficiency we have bought, what availability do we need?

## Bisect the engine's own field

The method is the same as the life inversion. Hold the efficiency where it is, bracket the availability, and narrow the bracket until the `effectiveInhibitionPct` the engine returns first reaches the target. Read the availability at the turn.

Doing it that way rather than on paper keeps every clamp and every guard in the loop. The engine clamps an efficiency below zero up to zero and one above a hundred down to a hundred, it clamps an availability above a hundred the same way, and it names each clamp it applied in a field. A bisection walks into those clamps if the bracket reaches them. An algebraic rearrangement walks past them without noticing.

## Why this inversion is clean enough to grade

Several of the eighteen graded fields in this course rest on this arithmetic, and the reason is worth stating precisely. Effective protection, the shortfall, the retained fraction and the metal-loss ratio are arithmetic over two typed percentages. No correlation constant is anywhere in the chain. There is no fugacity coefficient in it, no held threshold and no band edge.

Two of those quantities are ratios of engine rates rather than pure arithmetic, and they stay clean for a different reason. The two rates share the whole correlation chain, so the chain divides out exactly and only the corrosion inhibitor arithmetic is left. The capstone checks measure that invariance rather than claiming it, by re-running at conditions that move the rate by more than half and cross the fugacity cap and checking that the ratio does not move.

Read the shipped case with that in mind. The rate is 0.754524 mm/yr and the uninhibited rate on the same conditions is 5.203611 mm/yr. Every held constant in the module is in both of those numbers, and every one of them cancels in their ratio.

## The warning that goes with it

The engine fires a warning on the effective shortfall at any efficiency, and the trigger measured by bisecting the availability at which it first appears is 0.100000 percentage points of shortfall. The warning names the effective figure and the metal-loss ratio in its own words, so the inversion and the warning are reading the same field.

## Exercise

Fix an efficiency and a target effective protection and find the availability that first reaches the target, by bisecting the field the engine returns. Record the bracket and the answer. Then repeat the exercise at a different efficiency and say how the required availability moved and which of the two inputs is doing the limiting.
