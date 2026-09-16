# The environment factor, and its credits

{{panel:fc-fire-drum-explorer}}

The environment factor is the third input to the pool fire duty and the only one that is a judgment rather than a geometry or a boolean. It is the insulation and drainage credit, and it enters this engine as a typed number checked against its own published table.

## What the factor does to a duty

| environment factor | duty with drainage Btu/hr | duty without Btu/hr | relief load with drainage lb/hr |
| --- | --- | --- | --- |
| 1.000000 | 4434115.2612 | 7284617.9291 | 34641.5255 |
| 0.850000 | 3768997.9720 | 6191925.2397 | 29445.2967 |
| 0.500000 | 2217057.6306 | 3642308.9645 | 17320.7627 |
| 0.300000 | 1330234.5784 | 2185385.3787 | 10392.4576 |
| 0.150000 | 665117.2892 | 1092692.6894 | 5196.2288 |

The factor multiplies the duty directly, so it passes straight through to the relief load and from there to the required area. A bare uninsulated vessel takes a factor of one. Credits below one are earned by insulation that survives a fire, by water application, by an earth-covered or underground installation, and the published table names each case.

## A typed input, and what that obliges you to do

The factor is a number somebody read off a table. The engine does not compute it, cannot check it, and has no way to know whether the insulation you claimed credit for is rated to hold at fire temperatures for the duration the credit assumes.

That puts two obligations on the caller. Name the table row the factor came from. And say what physical provision on the plant earns it, because a credit claimed against insulation that spalls off in the first minutes of a fire is a credit that reduces a calculated duty and no real one.

The factor also interacts with the drainage answer in a way worth noticing. Both of them are credits for the same kind of thing, which is a plant provision that makes the fire less severe. Claiming both is legitimate where both provisions exist. Claiming both where neither has been confirmed compounds two optimistic judgments into one duty that is much lower than the vessel deserves.

## Reading the table without inventing a relationship

The table above prints duties at five factors. It prints no ratio between any two of its rows, and none should be formed. What the columns license is the direction: a smaller factor gives a smaller duty and a smaller load, all the way down.

The reason that restraint matters here is specific. The factor multiplies the duty, and the relief load is the duty divided by a latent heat, so a reader who divides two rows is tempted to conclude something about the whole chain from a figure the engine never produced. Read the printed rows and stop there.

## What it does to the letter

At an environment factor of 0.300000 the whole teaching chain lands on orifice G, where at 1.000000 it lands on K. The factor is a lever with the same reach as the drainage answer, and, like that answer, it is a judgment that leaves no trace in the number it produces.

## Exercise

Record the duty and the relief load at each of the five environment factors in the table. Then write down the two obligations a typed factor puts on the caller, and say why claiming a low factor together with a drainage credit deserves a second look.
