# Holding on a falling limb

A crossing where the tubing requirement is still falling can be perfectly stable. The reason is not that the outflow rises. It is that it falls more slowly than the inflow does.

{{panel:pd-node-explorer}}

## The rule that is nearly right

A well is stable to the right of the tubing minimum and unstable to the left. Two of the three teaching wells obey it. BONNY-7 sits 728.644315 stb/d right of a minimum rate of 627.069742 stb/d and FORCADOS-3 sits 281.389786 stb/d right of 1843.619418 stb/d, and both carry the flag the operating point is on the rising friction limb as yes.

ESCRAVOS-9 does not obey it. Its stable crossing sits 792.375394 stb/d to the left of a minimum at 1802.135341 stb/d, and the well flows there.

## The actual condition

The crossing holds when the residual is increasing at it: the outflow slope minus the inflow slope, positive. That is a statement about a difference, and neither term is required to have any particular sign. The outflow slope has only to exceed a negative number, so it may be negative itself.

## Three slopes at one point

ESCRAVOS-9 operates at 1009.759948 stb/d and 1829.772050 psia, 105.421380 psi above the bottom of its own tubing curve and far to the left of it.

| Slope at the operating point | psi per stb/d |
| --- | --- |
| Outflow | -0.28613256 |
| Inflow | -0.45150309 |
| Residual | 0.16537053 |

Both curves fall. The reservoir gives up 0.45150309 psi on every stb/d while the tubing hands back only 0.28613256, so the gap between them widens with rate and the crossing holds. The engine's own stability test agrees, and it calls the second crossing, at 456.989718 stb/d and 2067.583276 psia, unstable.

## Why the shortcut breaks

It fails on the physics: the steeper the inflow, the more falling outflow a well tolerates. FORCADOS-3's inflow steepens below its bubble point of 2450 psia, to -0.72224059 psi per stb/d at 2482 stb/d and -2.41200162 at 4012 stb/d. It fails on arithmetic too, because its landmark is badly located.

| Well | Sampled min rate | True min rate | Rate error | Pressure error |
| --- | --- | --- | --- | --- |
| BONNY-7 | 604.341111 | 627.069742 | -22.728631 | 0.76036884 |
| FORCADOS-3 | 1811.804452 | 1843.619418 | -31.814966 | 0.25586360 |
| ESCRAVOS-9 | 1845.027656 | 1802.135341 | 42.892315 | 0.27064549 |

Rates in stb/d, errors in stb/d and psi, true minima at 20001 points. Near a minimum the pressure is flat, so a large rate error costs almost nothing in pressure, and the error does not even keep one sign. The rate at which the minimum sits is the least reliable feature of the curve, and the shortcut is built on it.

## Where the correlation comes from

On most wells the friction limb slope is large. BONNY-7's friction term climbs from 0.011969 psi at 4.32 stb/d to 11968.524642 psi at 4324.44 stb/d against an inflow slope of -0.50000000 psi per stb/d, so the outflow dominates and the limb decides. It stops dominating where the outflow slope is small, near the minimum, which is where wells in trouble sit.

A rule that works everywhere except where the answer is hard is not a rule.

## Exercise

Read the outflow and the inflow slope at ESCRAVOS-9's operating point, then say why the crossing holds, without using the words rising, friction limb, or minimum.
