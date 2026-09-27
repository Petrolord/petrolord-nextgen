# Cycle service on a Poisson

{{panel:materials-stock-calculator}}

Under a cycle service level, the Poisson level is read off the cumulative column: the smallest level whose cumulative probability is at or above the stated target. The engine walks up the whole levels one at a time.

## The PSV kits at 0.95

At a mean of 2.000000 kits, the cumulative probability at level 4 is 0.947347, just short of 0.95; at level 5 it is 0.983436. The engine's reason names both, verbatim:

> level 5: P(X <= 5) = 0.983436 is at or above 0.95; at 4 it is 0.947347 (Poisson mean 2)

The level is 5, the safety stock is 3.000000 kits (the level less the mean), and the achieved cycle service is 0.983436.

## At or above: a stated reading

When a target equals a cumulative probability exactly, the engine meets a Poisson cycle service target at or above it, and compares at twelve significant digits. On a stated case with a mean of 1, where the target is set to the cumulative probability at level 1 itself, verbatim:

> level 1: P(X <= 1) = 0.735759 is at or above 0.7357588823428847; at 0 it is 0.367879 (Poisson mean 1)

The target is met at level 1. This is a reading the engine states; its alternative, a target met only strictly above, would need level 2 here. Raise the target to 0.7358 and level 1 fails under either reading:

> level 2: P(X <= 2) = 0.919699 is at or above 0.7358; at 1 it is 0.735759 (Poisson mean 1)

## A public-domain check

MIL-HDBK-338B, Electronic Reliability Design Handbook (1 October 1998, public domain), gives the chance of a stated number of failures or fewer as the Poisson cumulative probability. Its example 5.3.8.1 asks:

> "If the lamp failure rate is 0.001 failures per hour, what is the reliability for the mission (i.e., the probability that no more than two lamp failures will occur)?" (MIL-HDBK-338B (1 October 1998) example 5.3.8.1, p. 5-27)

The mission is 500 hours, so the Poisson mean is 0.500000. The engine's cumulative probability at level 2 is 0.985612; the handbook prints 0.986. How such a count sizes a spare against the cost of downtime is a question the Expert tier takes up.

## Whole steps on a slow mover

Each step up the table adds one whole unit. Stating 0.95 on the PSV kits buys an achieved 0.983436; stating 0.90 lands on level 4 at 0.947347, one kit fewer. A very slow mover can need no stock at all; on a mean of 0.05:

> level 0: P(X <= 0) = 0.951229 is at or above 0.9 (Poisson mean 0.05)

## Exercise

Open the stock calculator, choose the view "Stock for Poisson demand" and start from "The PSV kits on the Ekene register". Confirm the level 5 and the reason. Set the control "Service level (stated)" to 0.90 and confirm that the level falls to 4. Then set it to 0.99 and read the level and the achieved cycle service.

Next start from "A target met exactly" and read the reason. Change the cycle service level to 0.7358 and confirm the level moves to 2. Finally start from "MIL-HDBK-338B, the lamps", read the mean and find the cumulative probability at level 2 in the table.
