# What to do instead, and what never to do

A refusal is only useful if it comes with a route. This lesson is the route, and it is also the general rule the tier wants you to carry off this module and apply to every package you use afterwards.

## The two routes the engine names

> Size the vent from API 2000 against the heat input above, or from the vent manufacturer's certified capacity curve

Both routes start from a quantity the engine does return. The heat input above is the fire duty, which on this tank is 25892440.2513 Btu/hr at an environment factor of 1.000000. The standard turns that duty into a required air-equivalent capacity by a relation this package does not carry, and a vent manufacturer's certified curve does the same job for a specific device.

## The environment factor is a credit

One of the inputs to the duty is worth understanding before you take a duty anywhere:

| RELATION: the fire duty on this tank, with and without a stated drainage credit | value |
| --- | --- |
| with no credit, Btu/hr | 25892440.2513 |
| with a stated environment factor of 0.300000, Btu/hr | 7767732.0754 |
| difference (first less second) | 18124708.1759 |
| ratio (first over second) | 3.333333 |

A ratio of 3.333333, quoted from the relation line. The engine bounds the factor and says why:

> the environment factor is a credit for drainage, insulation or a water spray and lies between 0 and 1: a factor above 1 would be a penalty, which this relation does not carry

A credit of that size has to be earned by a physical provision that exists and is maintained: drainage that sends a spill away from the tank, insulation rated for fire exposure, or a water spray system with a supply behind it.

## What never to do

Do not fill a withheld field. A figure from a similar package will not do, nor will a rule of thumb, nor a number obtained by rearranging the duty until the units work. Units working is not evidence: the two plausible forms of the missing relation both produce scfh of air and they differ by a factor of about 24.

Do not present the duty as though it were a vent capacity. It is a heat input in Btu an hour and a vent is specified in scfh of air equivalent, and a datasheet that carries the duty in a capacity field will eventually be read as a capacity.

Do not treat the refusal as a bug to be worked around. It is the package telling you the boundary of what it can source, which is the most valuable thing a calculation package ever says.

## The general rule

Withholding beats guessing whenever the plausible alternatives differ by more than a rounding. That is the sentence to carry away. When you meet a null with a reason beside it, read the reason, find the size of the disagreement, and decide whether you are in a tolerance argument or in a different argument entirely.

## Exercise

Read the environment factor relation and its note in this lesson and say what a factor above 1 would represent physically. Then name the provision a facility would have to have in place before a credit of the size shown could be claimed.
