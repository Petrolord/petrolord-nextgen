# Anchored, free and limited

The three boundary conditions at the bottom of a tubing string, and how to tell which one you have.

{{panel:cd-spaceout-explorer}}

## Anchored

The tubing is latched or screwed into the packer and cannot move relative to it.

Displacement at the bottom is zero, by construction. Length change turns entirely into force. The string is statically indeterminate and the force is what the design has to survive.

## Free

The seal assembly sits in a bore long enough that it never reaches either end over any case.

Force at the bottom from length change is zero. The string is free to find its own length and the seals simply slide. Whatever pressure differential acts across the seal area still produces a piston force, but the length change contributes nothing.

## Limited

The seals can move some distance and then cannot.

This is the interesting case and it is the usual one, because bores are finite. The string is free until the travel is used up, and anchored after that. Which regime it is in depends on the case, so a single completion can be free under production and anchored under stimulation.

## How to tell which you have

Compare the available travel against the length change for the case in question. If the available travel exceeds the change with margin to spare, the case is free. If it does not, the case is limited and something has to take the remainder.

That comparison is precisely what the space out calculation in the next module does, case by case.

## Why the answer is per case and not per well

Because available travel is fixed by the hardware and the landing, and length change varies by operation.

A well can be perfectly free through its whole production life and become anchored in the middle of a stimulation, which is exactly when the loads are largest. That is why the design case is nearly always the coldest one and not the normal one.

## The design implication

Choose the bore and the landing so that every case the well will ever see stays in the free regime, with margin. Then the completion never loads up and the seals never reach a shoulder.

That is achievable when the bore is long enough, and the rest of this tier is about how long that is and where to land in it.

## Exercise

Define the three boundary conditions and say what is zero in each of the first two.

Explain why the same completion can be in different regimes for different operations.

Then say which operation is usually the design case, and why it is not the normal producing condition.
