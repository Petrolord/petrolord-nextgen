# The comparison that would catch it

One line at the top of `propagateStreams`, comparing `wellStreams[id].massLbD` against `wellRates[id]`, closes both holes at once.

{{panel:pd-fight-explorer}}

## What that one comparison would have printed

On the teaching network AGBADA WEST it would fire on one well. AGBADA-12 is allocated 985 lb/d on a flowline that cannot pass more than 640 lb/d in either direction. Its stream is handed in at 985.000000000 lb/d and the solve says its flowline carries 640.000000000 lb/d, so the check would name a 345.000000000 lb/d disagreement at the door, before the propagation had walked a single branch. The other three wells would pass at 6004.874117054, 2318.356346320 and 3992.446687538 lb/d, exactly.

## And it catches the other failure too

Hand the same network well stream masses that are simply wrong and the same comparison fires. At a multiplier of 2.00 the trunk stream comes back at 26601.354302 lb/d against a solved trunk of 12955.677151 lb/d, `ok` true and no warnings. At 0.80 it is 10640.541721 lb/d, same verdict. A caller error and a solver hole are different mistakes with one symptom, and one comparison sees both.

## The function already knows how to refuse

`propagateStreams` is not a function without a refusal path. Give it solved flow directions that form a loop and it returns `ok` false with a message: the network is recirculating, a gathering system does not do that, check for a branch connected backwards. So the module refuses a topology it cannot walk and accepts an input mass it can walk but has no reason to trust. The difference is not capability, it is that one condition was thought about and the other was not.

## Why this has to be established from the engine

`oracle_network.py` is a genuinely independent referee for the physics: Gauss-Seidel with a bracketed bisection at each node, no Jacobian, no linear algebra, not even the same iteration structure. It records no defects at all across the 4 cases it publishes. It also never calls `checkConservation`, never ranks a bottleneck and never propagates a stream. Nothing outside the engine has ever looked at this comparison, so a reader who waits for an oracle to raise it will wait forever.

## The mistake

Assuming that a mass appearing in two places in one result means it was reconciled once. On the answer this network returns, `converged` is true after 11 iterations at `residualLbD` 1.546141e-11 lb/d with `pinned` t4, and `checkConservation` on that same answer reports produced 13300.677150912 lb/d, delivered 12955.677150912 lb/d, gap 345.000000000 lb/d, 2.593852900 percent. Two masses, one word, and the only comparison between them is the one the reader makes.

## Exercise

Write the check you would put at the top of the propagation, in one sentence, and say what it would report on each of the four wells of this network. Then say whether it should warn or refuse, and defend the choice.
