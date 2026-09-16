# Four scenarios, and the one computed here

{{panel:fc-fire-drum-explorer}}

The Relief & Flare Studio answers four questions over one facility. What orifice a pressure safety valve (PSV) needs, what load a pool fire puts on it, what drum keeps liquid out of the flare header, and how long a vessel takes to depressure. The Associate tier took the first of those apart, valve by valve and fluid by fluid. This tier takes the second and the third, which are the two places a number arrives from somewhere other than the caller's keyboard.

## The sentence this tier is built on

The engine never chooses the case. Every sizing route in this module takes a relief load as an input. Hand the gas route a pounds an hour figure and it returns the area that figure demands at the relieving pressure you stated. It will do the same for a load that is ten times too large or a tenth of the real one, and it will do it without hesitating, because which scenario governs is not the question it was asked.

There is exactly one route that computes its own load, and it is the API 521 fire case. It starts from vessel geometry and a liquid level, and it needs two answers the caller supplies: whether the plot has adequate drainage and firefighting, and what environment factor the insulation earns. Past those two answers the chain is arithmetic the engine does for itself, from a wetted area through a pool fire duty to a relief load the gas route can size against.

## What that means for the other scenarios

A blocked-in discharge, a control valve failing open, a tube rupture, thermal expansion in a liquid-packed line: every one of those is a real relieving case and none of them is computed here. For each of them somebody works out a load by hand or in another tool, types it into the gas, liquid or steam route, and reads an area back. The area is correct for the load it was given and says nothing at all about whether the load was right.

That is why the tier begins here rather than with geometry. A wetted area is easy to check. A governing case is a judgment, and the studio records it only as the number you typed.

## The module surface, read as an object

| how the module divides | count |
| --- | --- |
| exports, counted by reading the module | 22 |
| returning a bare number, with NaN for a refusal | 7 |
| returning an object | 12 |
| published tables | 2 |
| derived constants | 1 |

The four API 520 Part I sizing routes are gas and vapour in both flow regimes, liquid with the published viscosity correction, steam with the Napier correction, and the API 521 fire case with its heat input evaluated at the actual relieving pressure. The flare side adds three more: droplet settling with a horizontal knockout drum, point-source radiation solved in both directions, and an adiabatic blowdown march. This tier lives in the fire case and the drum. The blowdown march and the point source are the Expert tier's.

## Exercise

Write down the four questions the studio answers over one facility. Then name the single route that computes its own relief load, and list the two answers the caller has to supply before it can. Finally, say in one sentence what the gas route does when the load it is handed belongs to the wrong scenario.
