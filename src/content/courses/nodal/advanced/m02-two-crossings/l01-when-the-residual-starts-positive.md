# When the residual starts positive

One sign, read at the left hand end of the scan, decides whether a well can have one solution or must have two.

{{panel:pd-node-explorer}}

## The easy case

BONNY-7's dead column is 2570 psia against a reservoir pressure of 2740 psia, 170 psi below it, and the flag the column outweighs the reservoir at low rate reads no. Its residual starts at -192.336636 psi at 4.324444 stb/d, dips to -989.578610 psi at 477.119848 stb/d, and rises to +12517.903995 psi. One sign change, one crossing.

Such a well flows the moment it is opened.

## The case the tier exists for

FORCADOS-3's dead column is 4310 psia against a reservoir pressure of 3720 psia, standing 590 psi above it, and the same flag reads yes. Its residual starts at +575.820837 psi at 4.135950 stb/d.

That does not mean dead. It means this rate is unavailable.

The residual falls to -509.628610 psi at 985.078572 stb/d, then climbs to +3284.465003 psi. Sign changes = 2 changes, at 234.488087 and 2125.009203 stb/d.

A continuous function with the same sign at both ends crosses an even number of times. Even means zero or two. It never means one. A well whose column outweighs its reservoir crosses twice or not at all, and that precondition is the whole reason this tier exists.

## Why the column loses at low rate

| Rate, stb/d | Gravity, psi | Friction, psi | Gravity share | Required, psia |
| --- | --- | --- | --- | --- |
| 4.14 | 3333.187930 | 0.001796 | 0.99999946 | 4293.189726 |
| 262.37 | 2537.939031 | 7.228229 | 0.99716002 | 3505.167260 |
| 520.61 | 2049.063143 | 28.458942 | 0.98630150 | 3037.522085 |
| 778.85 | 1718.108793 | 63.693936 | 0.96425309 | 2741.802729 |

Each step sheds hundreds of psi of weight for a few psi of friction, while the reservoir gives up 0.63615646 psi for every stb/d. The tubing sheds faster, so the gap closes and reverses.

## The trap

Sample the residual near zero rate, see it positive, and report dead. For FORCADOS-3 that is wrong by 2125.009203 stb/d.

A genuinely dead well never goes negative. The golden deadWell reads 988.172727 psi at 30.0000 stb/d, 1290.000000 psi at 300.0000 stb/d and 1940.762069 psi at 570.0000 stb/d, with 0 crossings on an open flow of 600.000000 stb/d.

From the two end readings alone, that well and FORCADOS-3 are indistinguishable. From the minimum they are not. A positive residual at low rate is a question; the minimum is the answer.

## What the sign will not tell you

Not that the well flows, not where the crossings are, and not that the well can reach them. FORCADOS-3's crossings are 1890.521117 stb/d apart; the pinched golden instrument's are 20.000000 stb/d apart. Both started positive.

Nor is it fixed. FORCADOS-3's dead column reads 4210, 4310, 4410 and 4510 psia at wellhead pressures of 860, 960, 1060 and 1160 psia.

## Exercise

Record each well's dead column at zero rate, its reservoir pressure, and its residual at the lowest sampled rate.

Then state how many crossings each sign permits, and name the one further number that decides which.
