# What it refuses

Every honest model has a boundary. This one is unusually explicit about where its boundary is, and the refusals are the most useful thing in the documentation.

## No chemistry

There is no reaction kinetics anywhere in the acid engine. No stoichiometry, no mineralogy, no preflush design, no spending rate along the flow path.

Acid is tracked purely as a volume of pore space. The sandstone rule is a stated planning rule: the volume needed is the pore volume of the treated annulus times a pore volume factor, 1.5 in the published case. In carbonate the equivalent lever is the pore volumes to breakthrough, 1 in the published case, and that number is a laboratory result you supply. It is not computed here and it cannot be.

## No time, and no three dimensions

The matrix side has no time in it at all. It gives you a volume and a skin, and how long you pump for is not modelled.

The fracture side is two dimensional. Height is an input, 30 m in the published case, held fixed. Fractures grow in height in real rock and this engine will not tell you when. There is no proppant settling and no proppant transport, so the pack is placed as the arithmetic says rather than as gravity says.

## Inputs it will not accept

The engine throws rather than guess. A permeability contrast below 1 is refused, because that would mean the damaged rock is better than the rock around it. A damaged radius inside the wellbore radius is refused. An acid front inside the wellbore radius is refused. A porosity outside the open interval between 0 and 1 is refused. A fracture pressure at or below reservoir pressure is refused, since there would be nothing to inject against. And the matrix rate refuses any case where the drainage logarithm plus the skin is not positive, because a negative denominator is not a large rate, it is nonsense.

## What it never gives you

No production forecast. No decline curve. No barrels, no cash. The outputs are a skin and a geometry, and a skin is a dimensionless statement about pressure drop, never a rate of oil. Turning it into a rate is a reservoir engineering job that happens somewhere else.

## Exercise

List three things you might reasonably want from a stimulation app that this one refuses to give.

For the pore volumes to breakthrough, say where the number has to come from.

Then explain in one sentence why a negative value of the drainage logarithm plus skin is refused rather than reported.
