# One vessel, one job

A separator is a drum sized so that gravity has time to pull the liquid out of the gas and hold it while it settles. This engine answers one question about that drum: how big it has to be.

## The chain, in the order it runs

Conditions give the compressibility factor and the densities. The mist extractor gives K. K and the two densities give the settling velocity. The vessel follows from the settling velocity and the retention time.

On the ABANA-1 test separator that chain runs as follows: 600.000000 psig becomes 614.700000 psia, a gas gravity of 0.680000 gives Ppr 0.922896 and Tpr 1.488478, the correlation returns z 0.908065, the gas weighs 2.239712 lb/ft3 and arrives at 4.825708 ft3/s, the liquid weighs 55.171463 lb/ft3, a wire mesh pad gives K 0.300000, settling is 1.458422 ft/s, the gas needs 2.052551 ft of diameter, and at the 3 ft vessel the studio prefers the height is 10.964382 ft.

## Every link carries the one before it

Nine numbers, and each one is an input to the next. A gas density of 2.239712 lb/ft3 exists only because z came back 0.908065 at that pressure and temperature. The settling velocity of 1.458422 ft/s exists only because the gas weighs 2.239712 lb/ft3 and the liquid 55.171463 lb/ft3. The diameter of 2.052551 ft exists only because the gas arrives at 4.825708 ft3/s and settles at 1.458422 ft/s. A single wrong condition at the top produces a vessel that is confidently the wrong size at the bottom, with every intermediate figure printing normally on the way down.

## What the retired app did instead

The Suite app this engine replaced hardcoded z at 0.850000 for every gas at every condition, used one K at every pressure, sized only two-phase vessels, and took its gas velocity from the diameter of the previous render. The last of those is the worst kind of fault, because the number on the screen was a correct calculation on a diameter the user had already replaced.

## What sizing does not answer

This engine sizes a vessel. What leaves each stage of a separation train at a given pressure and temperature is a flash calculation, and it lives in a different engine, engines/fluid/separator.js. A vessel that is large enough and a stream that splits the way a flowsheet says it will are two separate claims.

## The mistake

Reading a sized vessel as a performance guarantee. The diameter of 2.052551 ft says the gas has room to let a drop fall at 1.458422 ft/s. It does not say what the gas leaving the vessel contains, and nothing in this method ever will.

## Exercise

Write the ABANA-1 chain from 600.000000 psig to the height at the 3 ft vessel, naming what each step consumes from the step before it. Then say which of those nine numbers the retired app would have got wrong first, and why every number after it would still have printed.
