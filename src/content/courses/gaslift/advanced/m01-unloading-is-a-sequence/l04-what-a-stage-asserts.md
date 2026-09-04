# What a stage asserts

A stage row looks like a measurement of the well at a moment. It is six claims, and they are not equally well founded.

{{panel:pd-unloading-explorer}}

## The six claims

Stage 4 of midDecrementKnifeEdge says the point of injection transfers to valve 4 at 6871.141344247 ft, the surface injection pressure is 1084.4500 psia, the injection pressure at that depth is 1279.335341477 psia, the production pressure at that depth is 773.102720982 psia, the fluid level is 6871.141344247 ft, the gas rate through the valve is 1505.775891086 Mscf/d and it passes the target, and valve 3 is still open.

Two of those come off the static gas column march. One, the production pressure, is a straight line on the declared unloading gradient of 0.09 psi/ft from a wellhead of 154.7 psia. One, the fluid level, is set equal to the valve depth by declaration. One is an orifice throughput correlation. One is a comparison.

## The passes flag has enormous headroom

The design target is 600.0 Mscf/d. The smallest stage rate anywhere in the string is 1347.108582683 Mscf/d at stage 6 and the largest is 1946.971134442 Mscf/d at the orifice. Every stage passes, on every published case. A flag that is true with that much room on every stage of every published case is not discriminating between designs, and it is not a prediction of injection rate either: Thornhill and Craver is an orifice equation, it does not know that a real valve throttles on its stem before it is fully open, so the number is an upper bound.

## What changes underneath a constant verdict

Valves 1 to 3 pass their gas in the critical regime and valves 4 to 7 in the subcritical one. The passes flag reads true across that boundary without noting it. Reading the flag alone, a design where every valve is choked and one where none of them are look identical.

## The mistake

Treating the stage list as a record of what the well did. Nothing in it is timed, nothing in it is measured, and the transfer is asserted rather than tested: the engine does not ask whether the well actually unloads to the next valve, it computes what the string looks like once it has. A design that will stall part way through prints a complete seven stage table.

## What it refuses

There is no inflow relation anywhere in this module and no multiphase outflow, so the production pressure in every stage row is the declared straight line and not a computed traverse. The annulus column is static, with no injection rate in it, so the casing pressure at every stage is shut in gas. Intermittent lift is not modelled.

## Exercise

Read stage 4 of midDecrementKnifeEdge in the panel and sort its six reported quantities into the ones computed from the gas column, the ones read off a declared gradient, and the one that is set by definition.

Then say what a passes flag of true at 1505.775891086 Mscf/d against a 600.0 Mscf/d target tells you about the gas the valve will really pass.
