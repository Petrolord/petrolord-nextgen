# The story so far

This tier is one subtraction, read carefully. Everything else in it follows from taking that subtraction seriously.

## The object is the residual

Two curves give a pressure at the same depth and rate, so they can be subtracted. Outflow minus inflow is one signed number at every rate: positive means the rate is unavailable, negative means surplus, zero means the well can sit.

Its size is a margin, and that one number sorts four wells. BONNY-7's minimum residual is -989.578610 psi. FORCADOS-3 at a wellhead of 960 psia has -509.628610 psi, and choked to 1469.15 psia, -0.478610 psi. The published `deadWell` case has 988.172727 psi at 30.0000 stb/d, nothing negative anywhere. No status field does that.

## The count is decided before the solve

Compare the dead column at zero rate with the reservoir pressure. Below it the residual starts negative and there is exactly one crossing: BONNY-7, 2570 psia against 2740 psia, residual -192.336636 psi at the lowest sampled rate, one crossing at 1355.714057 stb/d. Above it there are two crossings or none: FORCADOS-3, 4310 psia against 3720 psia, residual 575.820837 psi, crossings at 234.488087 and 2125.009203 stb/d.

Of two crossings the lower is the heading branch and the upper holds, because a dip descends through its first root and ascends through its second. The distance between them is the window, the margin no status word carries: 2064.445505 stb/d for FORCADOS-3 at a wellhead of 860 psia, 1473.513228 at 1160 psia, 57.851719 at 1469.15 psia, flowing and stable throughout.

## The instrument has a resolution

`solveNodeCore` samples the residual on a grid, default 40 grid points, and looks for adjacent samples of opposite sign. Detection is guaranteed only where the spacing is smaller than the window. Choked FORCADOS-3 is found at 40 grid points, reported dead at 50, found again at 60. Finer was worse and then better, so refining until the answer stops changing is not a method here. The honest check is whether the residual ever goes negative.

Detection is the fragile stage, not classification: the stability test labels crossings 20 stb/d apart correctly every time.

## Why all of it converges near tangency

Lift the tubing curve slightly and the dip shallows, the crossings run together and the window closes: three descriptions of one event. On the closed form pair a uniform lift took the residual at 1000.0000 stb/d from -40.000000 psi to -0.100000 psi and the window from 400 stb/d to 20 stb/d.

Sensitivity is therefore largest exactly where the scan is least able to see the well. That is the sentence to carry out of this tier.

## Exercise

Write the two comparisons that decide the shape of a node problem before any solve: the one that fixes how many crossings to expect, and the one that decides whether a grid can find them.

For each, name the numbers needed and where they come from.
