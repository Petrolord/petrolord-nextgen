# Where spacing stops

Four things end a string, three of them raise a warning, and one of the four quietly suspends the minimum spacing the design declared.

{{panel:pd-valve-explorer}}

## The four stops

The recursion ends when the next mandrel reaches the floor, when the increment falls below the minimum spacing, when the valve count runs out, or when the stage pressure drops to the unloading wellhead pressure. Driving westTexasOil into each shows their signatures: maxValves 5 gives 5 valves stopping on maxValves at 6530.440873303 ft with a valveLimit warning, and 200.0 psi per valve gives 3 valves stopping on injectionPressure at 3633.800691274 ft with a shallowTarget warning.

## The exemption

| Case | Stop reason | Last increment, ft | Stated minimum, ft |
| --- | --- | --- | --- |
| westTexasOil | targetDepth | 131.375432376 | 250.0 |
| deepHighPressure | minSpacing | 319.359713665 | 300.0 |
| constantPressurePPO | targetDepth | 152.956208919 | 200.0 |
| midDecrementKnifeEdge | targetDepth | 430.416867128 | 275.0 |

When the recursion lands at or past the floor the engine pushes that mandrel onto the floor and stops, and that branch returns before the minimum spacing is tested. So westTexasOil sets its last mandrel 131.375432376 ft from its neighbour against a stated 250 ft minimum, constantPressurePPO sets one 152.956208919 ft away against a stated 200 ft minimum, and neither raises a warning. Two of the four published cases violate their own declared minimum.

## Why the goldens did not catch it

The check exists. deepHighPressure proves it works: its recursion wanted a valve inside the 300 ft minimum, so the string stopped at 7 valves with its deepest mandrel at 8644.662255376 ft, still 1855.337744624 ft short of its 10500.0 ft floor, and the warning was raised. The independent oracle orders the same two branches the same wrong way, so on the target depth cases both sides skip the same test and agree perfectly. A check written into the engine and into its oracle in the same wrong order is invisible to the comparison between them, and the golden file then records agreement where there is no coverage at all.

## The mistake

Reading a targetDepth stop as the clean outcome and the minSpacing stop as the awkward one. It is the other way round here. A minSpacing stop tells you the rule was applied; a targetDepth stop tells you the last increment was never checked, so check it yourself.

## What it refuses

The target depth mandrel is exempt from minSpacingFt, and the module states this as a limit rather than fixing it. Nothing in the output flags the exempt increment, and the warning list is empty of it.

## Exercise

Read the last increment for westTexasOil and constantPressurePPO in the panel and compare each with the minimum spacing its design declares.

Then run deepHighPressure and say what its warning list holds that the other two lack.
