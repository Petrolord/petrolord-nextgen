# How the solver actually looks

A node solution is a root find on one number, not a look at a picture.

{{panel:pd-node-explorer}}

## The residual

At any rate the reservoir supports a flowing pressure and the tubing requires one. The engine subtracts them, outflow minus inflow: the residual. Positive means the tubing wants more than the reservoir can give, so that rate is unavailable. Negative means a surplus. Zero is where the well sits.

## The scan

`solveNodeCore` builds a grid of rates running from a small fraction of the absolute open flow up to just under it, evaluates the residual at every point, and walks the list for adjacent samples of opposite sign. A sign change is a bracket; a bracket is refined by a root find to any precision. No sign change anywhere returns the status dead. The documented default is 40 grid points.

## One crossing: BONNY-7

| Reading | Value |
| --- | --- |
| Absolute open flow | 4324.444444 stb/d |
| Lowest sampled rate | 4.324444 stb/d |
| Spacing at nGrid 40 | 110.661425 stb/d |
| Residual at the lowest sampled rate | -192.336636 psi |
| Minimum residual | -989.578610 psi at 477.119848 stb/d |
| Residual at the highest sampled rate | 12517.903995 psi |
| Sign changes | 1 |
| Operating point | 1355.714057 stb/d at 2062.142971 psia |

## Two crossings: FORCADOS-3

FORCADOS-3's dead column at zero rate is 4310 psia against a reservoir pressure of 3720 psia, 590 psi above it, so the residual starts positive: 575.820837 psi at 4.135950 stb/d. It dips to -509.628610 psi at 985.078572 stb/d and climbs to 3284.465003 psi. Two sign changes, two crossings: 234.488087 stb/d at 3570.828888 psia, and 2125.009203 stb/d at 2366.909222 psia.

BONNY-7's dead column of 2570 psia sits below its reservoir pressure of 2740 psia, so its residual starts negative and there is one crossing. That comparison predicts the crossing count before any solve.

## What the scan is trusting

That if a crossing exists, some adjacent pair straddles it. A single crossing changes the sign once and for all, so it cannot be missed. Between two crossings the negative region has a finite width, and a finite width can fall entirely between two samples. Every residual is then correct, every one is positive, and the routine reports a live well dead.

The published `deadWell` case shows what a real dead verdict looks like: residuals of 988.172727 psi at 30.0000 stb/d, 1290.000000 psi at 300.0000 stb/d and 1940.762069 psi at 570.0000 stb/d, against an open flow of 600.000000 stb/d. Dead by a thousand psi, not by a hair. One status word covers both, so read the residual before accepting any verdict.

## Exercise

In the panel, record for BONNY-7 and for FORCADOS-3 the residual at the lowest sampled rate, the minimum residual and the rate at which it occurs.

From the low end sign alone, state how many crossings you expect on each, before reading the crossing count the engine returns.
