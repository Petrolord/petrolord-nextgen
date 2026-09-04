# Onward

A head requirement and a stage count are half a design. The other half is the machine that turns the stack and the wire that feeds it.

## What the Expert tier adds

**Head becomes horsepower, and there are two of them.** The published sizing method takes the power at the head the stack makes. This package builds the amps, the drop and the cable pick on the power at the head required, understating by 0.04695948, 0.18964476, 0.55381969 and 0.76450191 hp on the four cases of this tier, the last being 2.503380 percent. That was recorded and not fixed, and knowing which defects you may fix is part of the work.

**Horsepower becomes amps.** A submersible nameplate is power, volts and amps at full load, so current at part load is the nameplate current scaled by the load fraction: 125.00 hp on a 250 hp, 2400 V, 67 A plate is a load fraction of 0.5000000000 and 33.500000 A.

**Amps become a cable.** 7200 ft of 2 AWG at 180 degF: the conductor goes from 0.1593000000 to 0.1951239150 ohms per 1000 ft, the drop is 81.51704573 V, 3.39654357 percent, so surface needs 2481.51704573 V, 143.98680570 kVA apparent, and 4.72992077 kW goes to heat in the cable. The pick runs on that drop alone, because the shipped table carries no ampacity column and every candidate passes the ampacity check by construction.

**One field name, two quantities.** `loadFraction` in the sizing is utilisation against the motor's usable rating, after a thrust derate. `loadFraction` in the current calculation is the electrical load against the plate, before it. Both are right, and at a load fraction of 0.89714 with a 12 percent derate they sit 12.2337 points apart.

**A running pump gets diagnosed.** The head a stack should make against the head it is making, flagged below 0.85 and above 1.15. The message used to print the threshold it had just failed: at a ratio of 0.8450 it read 85 percent, and now reads 84.5 percent.

## Before you go

Everything from this tier stays in force. The gradient still belongs to the fluid inside the pump, the rate is still an in situ rate, and the margin the rounding buys is still bounded by one stage rather than by a percentage.

## The one sentence

You can turn a well into a head requirement and a stack. The next tier turns that stack into amps at the surface, and says which numbers along the way are decisions, which are conventions and which are artefacts of a seam.

## Exercise

Write the four translations of an ESP design in order, naming the quantity each produces.

Then say which two this tier has done, and what a stage count is missing without the other two.
