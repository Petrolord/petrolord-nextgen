# The story so far

Five modules, and one object underneath all of them: a valve that is a balance of pressures, sitting at a depth another valve chose.

## The claim

A gas lift string is not a list of valves. It is one recursion that fixes the depths and one force balance run at each of them, and every setting on the sheet is downstream of both. Change an input near the top and the sheet below it is wrong without looking wrong.

## What each module established

**Spacing is a recursion.** Valve 1 sits where the injection line first overcomes a full column of kill fluid, at 2119.249994721 ft on westTexasOil, and it is the one depth a decrement cannot move. Take that design from 25.00 to 20.00 psi per valve and valve 6 moves 162.471207387 ft while valve 1 moves 0.000000000 ft. Hold the surface pressure instead and the same well needs 6 valves rather than 8, and multipoints at five stages instead of three.

**The valve itself.** A dome, a bellows and a port, with R the fraction of the bellows the port occupies. A 0.25 in port is R of 0.158346404 in a 0.31 in2 bellows and 0.063749851 in a 0.77 in2 one, so R quoted for a port alone means nothing. The dome is a thermometer as much as a spring: a 1000.0 psia charge at 60 degF reads 1355.233465958 psia at 220.0 degF, and the linear rule of thumb misses by -11.233466 psi.

**Setting a string.** The rack opening is what a tester dials with atmosphere on the far side. The closing test is a different claim, and on an injection operated string its two roads agree. On a production operated string they do not: the casing side clears by 379.101060 to 724.986977 psi while the rule that should judge it misses by 31.822047 to 52.249541 psi.

**Spread.** R times the differential across the port, and equally the gap from the opening pressure to the dome. westTexasOil valve 1 carries 47.285654927 psi of it against 26.481994875 psi of drop per stage, so it is still open when valve 2 takes over.

**Throughput.** Thornhill and Craver on the port area, flat below a pressure ratio of 0.551208318 and falling steeply above it, and chosen out of a catalogue rather than sized, so what depends on it moves in steps.

## The one sentence

Every number on a valve sheet is a claim about a valve at a depth at a stage, and none can be checked without the other two.

## What this tier does not do

It sets a string. It does not walk one down. Stage by stage unloading, the point of injection and the margins those verdicts sit on belong to the next tier.

## Exercise

Write the five module claims in one sentence each, with the number you would defend each with.

Then name the two that would both change if one decrement changed.
