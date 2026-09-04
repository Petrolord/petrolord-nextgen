# The same network, a different guess

Change nothing but `initialPressures` and the same network produces four different amounts of mass. One run is the solution, and the shipped default is not it.

{{panel:pd-fight-explorer}}

## Seven runs, one network

AGBADA WEST, separator at 265 psia, same wells, same eight branches, same tolerance and cap. Only the starting pressures move. The second column is where t4 was LEFT, which is not the same as a pressure that was solved.

| Start | t4, psia | Pinned | Flowline, lb/d | Rate, lb/d | Gap, lb/d |
| --- | --- | --- | --- | --- | --- |
| default | 831.176262 | yes | 640.000000 | 985.000000 | 345.000000 |
| t4 at 400 | 400.000000 | yes | -640.000000 | 985.000000 | 1625.000000 |
| t4 at 600 | 600.000000 | yes | -640.000000 | 985.000000 | 1625.000000 |
| t4 at 831 | 831.000000 | yes | 640.000000 | 985.000000 | 345.000000 |
| t4 at 1200 | 1182.577035 | no | 640.000000 | 640.000000 | 0.000000 |
| t4 at 2000 | 2000.000000 | yes | 640.000000 | 0.000000 | -640.000000 |
| all at 1500 | 841.695631 | yes | 640.000000 | 985.000000 | 345.000000 |

`converged` is true on all seven.


## One row closes, and it is the answer

AGBADA-12's allocation stops binding at 1013.848652 psia and its inflow falls to line capacity at 1182.577035 psia, which is what the 1200 psia start returns to the last digit. There the well delivers 640.000000 lb/d, the line carries 640.000000 lb/d, and the balance closes at 0.000000 lb/d. A well cannot push 985 lb/d through a line passing 640, so its node pressure rises until inflow matches what leaves. Nothing was throttled.

## The other six are not solutions

All six pin the node and all six are out of balance, and the one run that pins nothing is the one that closes. The 400, 600 and 831 psia starts sit below 1013.848652 psia where the allocation binds, so each reports 985.000000 lb/d into a 640.000000 lb/d line, two of them with the flowline running BACKWARDS at its limit and the gap at 1625.000000 lb/d. The 2000 psia start reports a well making nothing beside a line carrying 640.000000 lb/d.

## The default starts inside the trap

The engine default puts every unknown at the separator pressure, and the flat top runs from zero to 1013.848652 psia, so the default begins deep inside it and ends at 831.176262 psia reporting `converged` true. The shipped guess reliably misses an answer the solver can reach.

## The mistake

Ranking these runs by reported residual. The two worst rows, at a gap of 1625.000000 lb/d, carry the smallest residual on the table, 2.2737e-12 lb/d, while the default at 345.000000 lb/d reports 1.5461e-11. The residual improves as the answer worsens, so it picks the two furthest from the solution first. `pinned` would have ranked them correctly.

## Exercise

Run this network from 400 and 1200 psia at t4 and record `converged`, `pinned`, the well rate and the gap at each. Then say which of those four fields told you the truth.
