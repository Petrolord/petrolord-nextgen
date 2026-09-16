# The story so far

One stream, one vessel, and every number this tier owns, read once from the gauge pressure to the height of the drum.

## The chain on ABANA-1

600.000000 psig becomes 614.700000 psia. A gas gravity of 0.680000 gives pseudo-criticals of 372.642400 degR and 666.055360 psia, and with 95.000000 degF as 554.670000 degR that gives Ppr 0.922896 and Tpr 1.488478. The correlation returns z 0.908065. The gas weighs 2.239712 lb/ft3 and arrives at 4.825708 ft3/s.

The oil at 33.000000 API weighs 53.675380 lb/ft3 and the water at 1.040000 specific gravity weighs 64.896000, and 2600.000000 bpd against 400.000000 bpd weights them into a mixture of 55.171463 lb/ft3. A wire mesh pad gives a base K of 0.350000, derated to 0.300000 at 600.000000 psig. Settling is 1.458422 ft/s. The gas needs 3.308855 ft2, which is 2.052551 ft of diameter, and at the 3.000000 ft vessel the studio prefers, the liquid stands 4.964382 ft deep and the drum is 10.964382 ft tall.

## The five things each number came from

| dimension | what set it |
| --- | --- |
| the gas density | pressure, temperature, gravity and z |
| the actual gas rate | the standard rate and the conditions |
| the settling velocity | K and the two densities |
| the diameter | the gas rate and the settling velocity |
| the height | the retention volume and the allowance |

Nothing in the list is a preference. Each figure is the output of the row above it, which is why a condition typed wrongly at the top reaches the drum at the bottom without ever looking wrong on the way.

## What this tier refuses to guess

A missing or out of domain input is thrown with its own name: "gasSg must be a finite, positive gas gravity with air = 1 (got undefined)". A state the method has no answer for is returned as data: { error: "settling needs a positive K and a liquid denser than the gas" }. A gas outside the correlation's range is refused with the range quoted, as at Tpr 3.176 and at Ppr 37.306.

The distinction between the two is worth carrying forward. A throw names an input somebody has to go and fix. A returned error says the inputs were fine and the method has no answer for the state they describe, which is why it arrives as data a caller can display beside the results rather than as a stop.

## What is held rather than settled

The pressure derating that took K from 0.350000 to 0.300000, and the 0.120000 floor that catches it at high pressure, are recorded as customary practice whose published form has not been checked against a source. Every settling velocity and every margin in this tier carries that gap, and the engine's own advice where the derating bites is that a vendor K is the only honest input.

## Exercise

Write the ABANA-1 chain from 600.000000 psig to the 10.964382 ft vessel, naming what each step consumed. Then give one thrown refusal and one returned error in the engine's words, and say which number in the chain rests on an unverified rule.
