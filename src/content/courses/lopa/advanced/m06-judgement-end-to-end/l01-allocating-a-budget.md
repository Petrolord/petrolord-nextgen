# Allocating a PFDavg budget

{{panel:lp-proof-test}}

{{panel:lp-sif-builder}}

A safety instrumented function is a series sum, so its required PFDavg is a budget to be divided among its subsystems. Once the sensors and the logic solver have taken their share, what is left belongs to the final elements, and that remainder is what decides how long the final element test interval may be. This is the work of an Expert: turning one required figure from a layer of protection analysis into a maintenance schedule that a site can actually run.

## The requirement and the parts already spent

The ORONI row at a tolerable mitigated event likelihood of 1e-7 per year requires a PFDavg of 0.007407407407. The IDU function's transmitters and logic solver, both on a one year proof test, take the following.

| part | architecture | PFDavg on a one year test |
| --- | --- | --- |
| transmitters | 2oo3 | 0.000369505528 |
| logic solver | 1oo1 | 0.000136440000 |
| the requirement | | 0.007407407407 |
| left for the valves | | 0.006901461880 |

Subtract the two from the requirement and the valves may take 0.006901461880. That single number is the whole brief for the final element: whatever interval, architecture and coverage the valves end up with, their PFDavg has to stay under it.

## Turning the remainder into an interval

Hand that remainder to the longest interval search as the target for the valve subsystem and the answer comes back as 35393.040486 hours, which is 4.040301 years, with the state FOUND. A state of FOUND matters here as much as the number: it says a crossing exists, so the budget is reachable by scheduling alone, with no new hardware.

## Why the valves get the largest share

On this function the valves carry 71.78 percent of the PFDavg at a one year test, the transmitters 20.61 percent and the logic solver 7.61 percent. A mechanical final element being the weakest link is common in practice, and it is why the final element proof test interval is the first lever anybody reaches for. It is also why the budget is best spent in that order: fix the cheap parts of the sum first, then let the expensive part have everything that remains.

## What the budget does not settle

The allocation is arithmetic and the schedule is judgement. An interval of 4.040301 years has to survive contact with the turnaround calendar, the availability of an isolation, the validity of the failure rates over four years and the architectural constraint, which this engine does not check. The budget says what is affordable. It does not say what is wise, and a verification note records both the number and the reasoning that accepted it.

## Exercise

Take the requirement of 0.007407407407 and the remainder of 0.006901461880. Work out what fraction of the whole requirement the valves have been allowed. Then suppose the transmitters were moved to a shorter interval so that their PFDavg fell by half: recompute the remainder, and write one sentence saying whether you would expect the valve interval to rise by more or less than the same proportion.
