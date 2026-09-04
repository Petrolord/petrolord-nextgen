# Heading

A well that cannot hold its lower crossing does not sit quietly there. It surges, dies back and surges again.

{{panel:pd-node-explorer}}

## The runaway

FORCADOS-3's unstable heading crossing is 234.488087 stb/d at 3570.828888 psia, a genuine solution of the equations.

Displace it upwards and the residual is negative all the way to -509.628610 psi at 985.078572 stb/d, so the well accelerates until the residual returns to zero at 2125.009203 stb/d: a rise of 1890.521117 stb/d from a nudge. Displace it downwards and the residual is positive, +575.820837 psi at 4.135950 stb/d, so the slowing feeds itself.

## Why the column does it

| Rate, stb/d | Gravity, psi | Friction, psi | Gravity share | Required, psia |
| --- | --- | --- | --- | --- |
| 4.14 | 3333.187930 | 0.001796 | 0.99999946 | 4293.189726 |
| 262.37 | 2537.939031 | 7.228229 | 0.99716002 | 3505.167260 |
| 778.85 | 1718.108793 | 63.693936 | 0.96425309 | 2741.802729 |
| 1295.33 | 1298.616735 | 176.176764 | 0.88054140 | 2434.793500 |

Every step of rate takes hundreds of psi off the requirement while friction barely charges for it, and the reservoir over the same stretch gives up 0.63615646 psi per stb/d. So a well that slows finds the tubing far more expensive, and slows further. That is loading up, in two columns.

## Where it ends

At FORCADOS-3's dead column of 4310 psia against a reservoir pressure of 3720 psia. A fully loaded well is 590 psi short and will not restart itself, and the flag the column outweighs the reservoir at low rate reads yes.

BONNY-7 cannot do this. Its dead column of 2570 psia sits 170 psi below its reservoir pressure of 2740 psia, the flag reads no, and its residual is negative from 4.324444 stb/d upwards, so there is no threshold to fall below. It is not the stronger well: it operates at 1355.714057 stb/d against FORCADOS-3's 2125.009203 stb/d.

## The number to act on

The threshold is the lower crossing rate. Gas lift, nitrogen kick-off and swabbing exist to clear it.

It moves. FORCADOS-3's window is 2064.445505 stb/d at a wellhead pressure of 860 psia and 1473.513228 stb/d at 1160 psia, with the dead column at 4210 and 4510 psia, so choking raises the floor and lowers the ceiling. A threshold quoted without its wellhead pressure is not a threshold.

Friction does it too: doubling FORCADOS-3's friction constant from 0.000105 to 0.00021 moves its tubing minimum from 2348.191408 psia at 1843.619418 stb/d to 2608.483199 psia at 1367.221296 stb/d.

## What the model can and cannot say

It can say an equilibrium exists at 234.488087 stb/d, that the well will not return to it, and that one leaving upwards arrives at 2125.009203 stb/d.

It cannot say what the well does instead: no period, no amplitude, no duration. A nodal solution does not predict heading. It predicts an equilibrium the well cannot hold, and heading is what a real well does in place of holding it.

## Exercise

Record the gravity term, the friction term and the required pressure at three rates below the tubing minimum rate.

Then say why a small drop in rate there makes the next drop more likely, using the two terms rather than the word instability.
