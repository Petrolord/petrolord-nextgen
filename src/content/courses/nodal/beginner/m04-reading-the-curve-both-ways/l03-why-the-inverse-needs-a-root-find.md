# Why the inverse needs a root find

Five families, five forward expressions, and exactly one inverse: a bracketed search on whichever forward relation you calibrated.

{{panel:pd-ipr-explorer}}

## The engine solves rather than rearranges

Every family is written as rate from pressure, so the inverse question runs the expression backwards. Write five inverse formulas by hand and a sixth family added later can leave a stale inverse behind that returns a confident wrong number. Solve instead and the physics lives in one place. The closed forms survive in the oracle that checks the engine, which is where a second opinion belongs.

## Two properties make the search safe

The bracket. At the reservoir pressure the rate is 0.000000 stb/d, on the published straight-line, Vogel and Fetkovich cases alike. At 0 psia it is the open flow: 5760.000000, 1500.000000 and 124.766308 stb/d. Any rate between the two is bracketed by 0 psia and the reservoir pressure, with the forward relation minus the target taking one sign at each end.

Monotonicity. The slope is negative everywhere measured: -0.55555556 psi per stb/d at all five sampled rates of the published straight-line case, and -0.91168461, -1.24939025 and -3.57770876 at 75.0000, 750.0000 and 1425.0000 stb/d on the published Vogel case. A monotone function crosses any value once, so the root found is the only root.

Brent's method exploits both. Bisection halves the bracket and keeps the half holding the sign change; the secant and inverse quadratic steps fit a line or a parabola through points already evaluated and jump. Brent falls back to bisection whenever the clever step misbehaves.

## The piecewise case, where rearranging really bites

A composite is continuous at the join by construction: BONNY-7's rate at the bubble point is 2880.000000 stb/d against an undersaturated block of 2880.000000 stb/d. Continuous is not smooth. Its slope is -0.50000000 psi per stb/d at 216, 649, 1297, 1946 and 2595 stb/d and -0.57666066 at 3243. Rearranging by hand means deciding which block the answer lands in before you have the answer. A bracketed search walks across the join without noticing it.

## How you know it closed

| Case | Test | Rate reproduced, stb/d |
| --- | --- | --- |
| straight line, 3200 psia | 900 stb/d at 2700 psia | 900.000000 |
| Vogel, 2400 psia | 700 stb/d at 1500 psia | 700.000000 |
| Fetkovich, 3500 psia | 1100 stb/d at 2900 psia | 1100.000000 |

The published straight-line case also reads 2880.000000 stb/d at 1600 psia forwards and 1600.000000 psia at 2880.0000 stb/d backwards. Saying the round trip closes beats saying two numbers look right: it tests the machinery, not your confidence in it.

## What it refuses

A root outside the bracket. Ask BONNY-7 for more than 4324.444444 stb/d and zero pressure comes back, looking exactly like a solved answer. And it refuses to say the model is right: all three families reproduce BONNY-7's test, and their open flows are 5480.000000, 3233.247201 and 4324.444444 stb/d. Convergence is not agreement.

## Exercise

Read BONNY-7 forwards at a pressure of your choosing, feed the rate back as an inverse reading, and confirm you land where you started. Then ask for a pressure above 4324.444444 stb/d and say why the reply is not a solved root.
