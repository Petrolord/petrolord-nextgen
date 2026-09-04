# The biggest drop

The branch eating the most pressure is a fact about the answer, and on a healthy system it usually names the line working hardest.

{{panel:pd-network-explorer}}

## What the drop is

A branch drop is the difference between the two solved node pressures at its ends, and nothing more. On AGBADA WEST the biggest belongs to the AGBADA-2 flowline at 476.806786 psi, running from a wellhead at 1257.276513629 psia to a north manifold at 780.469728020 psia.

| Branch | Drop, psi | Mass, lb/d |
| --- | --- | --- |
| AGBADA-2 flowline | 476.806785609 | 6004.874117054 |
| AGBADA-9 flowline | 406.581740456 | 3992.446687538 |
| Trunk | 323.783893593 | 12955.677150912 |
| Loop leg | 192.879045250 | 3402.582062368 |
| North bypass | 191.685834427 | 9553.095088544 |
| AGBADA-12 flowline | 50.706533886 | 640.000000000 |
| AGBADA-6 flowline | 40.343600289 | 2318.356346320 |
| Crosslink | -1.193210823 | -589.864625170 |

The crosslink is the ugly row and it stays in. Its drop and its mass are both signed from the drawn `from` to the drawn `to`, and the solve found it running the other way.

## Why it is not the answer on its own

The gate fixture makes the point on three branches. A choked flowline at 600.000000 psi over 2000.000000 lb/d and a trunk at 200.000000 psi over 42000.000000 lb/d give a biggest drop of the choked leg. A second fixture puts that flowline at 150.000000 psi over 300.000000 lb/d and the trunk at 250.000000 psi over 40300.000000 lb/d, and the biggest drop becomes the trunk. Nothing was fixed. The trunk was asked to carry everything, which is its job.

## What the check says about the same answer

Those drops come out of a solve reporting converged = true after 11 iterations at a residual of 1.546141e-11 lb/d. `checkConservation` on that answer reports produced = 13300.677150912 lb/d against delivered = 12955.677150912 lb/d, a gap of 345 lb/d, 2.593852900 percent of what the engine says was produced. A drop is a difference of solved pressures, so it is exactly as good as the pressures. The masses beside them are not the masses the streams carry.

## What a drop refuses to tell you

It will not say why. The module does not model pipe hydraulics at all: the branch relation is a callback the consumer supplies, so no drop in this result can be resolved into a length, a bore, a roughness or a friction factor by anything inside the module. Nor can conductances be compared across branch laws, since a turbulent one is in lb/d per root psi and a linear one in lb/d per psi.

## The careful mistake

Taking the largest drop to the meeting as the thing to fix. The AGBADA-2 flowline has the largest drop on this network and it is also the flowline carrying the most, 6004.874117054 lb/d.

## Exercise

Rank the branches by drop on the panel and record the top three with their masses.

Then say which of the three you would still not spend money on, and what number you would want beside the drop before you did.
