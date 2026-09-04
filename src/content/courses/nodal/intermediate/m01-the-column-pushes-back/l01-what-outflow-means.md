# What outflow means

The tubing does not deliver a pressure. It demands one, and the size of the demand depends entirely on the rate you assumed.

{{panel:pd-vlp-explorer}}

## A requirement, not a delivery

Hand the tubing a rate and a wellhead pressure and it hands back the bottomhole pressure that combination costs. The arithmetic runs opposite to reservoir intuition: a rate drives a pressure, and that pressure is a bill.

## The floor and the dead column

| Well | Wellhead pressure, psia | Gravity constant, psi | Dead column, psia | Reservoir pressure, psia |
| --- | --- | --- | --- | --- |
| BONNY-7 | 420 | 2150 | 2570 | 2740 |
| FORCADOS-3 | 960 | 3350 | 4310 | 3720 |

BONNY-7's dead column stands 170 psi below its reservoir pressure, so the well starts itself. FORCADOS-3's stands 590 psi above, and the digest's verdict is that the column outweighs the reservoir at low rate. One subtraction, no curve.

## Not a number, a function of rate

| BONNY-7 rate, stb/d | Required bhp, psia |
| --- | --- |
| 4.32 | 2545.501142 |
| 964.35 | 1617.153368 |
| 1924.38 | 3140.705429 |
| 4324.44 | 12560.087474 |

Same well, same string, same 420 psia wellhead. None of those is the well's flowing pressure, and the sequence falls before it rises, so it has a bottom.

FORCADOS-3 runs from a loaded end of 4293.189726 psia at 4.135950 stb/d to a friction end of 3310.421637 psia at 4135.949669 stb/d, ending below where it started. BONNY-7's ends far above.

## The dry gas case has no bottom

| Rate, Mscf/d | Required bhp, psia |
| --- | --- |
| 13.2893 | 952.986300 |
| 2225.9571 | 991.537315 |
| 6651.2928 | 1244.436062 |
| 11076.6285 | 1627.613595 |
| 13289.2963 | 1842.190804 |

It only rises, and its reported minimum of 13.289296 Mscf/d at 952.986300 psia is the sampling window's left edge, which the digest states outright. Nothing in a dry gas column gets lighter when flowed faster. The bend is a liquid phenomenon.

## What it refuses

It has no reservoir in it, so it cannot say whether the well flows. Outside its window it is arithmetic about the impossible: 12560.087474 psia at 4324.44 stb/d against 2740 psia. And it refuses gauge pressure. Wellhead pressure enters additively, so a psig reading typed as psia is wrong at every rate and never cancels.

## The mistake

Comparing one outflow figure against a static reservoir pressure. BONNY-7's 1617.153368 psia looks comfortable under 2740 psia, but 2740 psia is what the reservoir holds at zero rate, not while delivering the 964.35 stb/d that figure assumed. At 1924.38 stb/d the same well asks 3140.705429 psia, above the static pressure entirely.

## Exercise

In the panel, read BONNY-7's required bottomhole pressure at 964.35 stb/d and at 1924.38 stb/d.

Then name the one further quantity you would need to say whether the well reaches either rate.
