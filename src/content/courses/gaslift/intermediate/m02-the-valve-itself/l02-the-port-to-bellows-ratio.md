# The port to bellows ratio

R is the fraction of the bellows the port occupies, and it multiplies the shop's dial setting by one over one minus itself.

{{panel:pd-valve-explorer}}

## R belongs to a pairing, not to a port

| Port, in | Area, in2 | R on 0.31 in2 | 1/(1-R) on 0.31 in2 | R on 0.77 in2 | 1/(1-R) on 0.77 in2 |
| --- | --- | --- | --- | --- | --- |
| 0.125 | 0.012271846 | 0.039586601 | 1.041218293 | 0.015937463 | 1.016195579 |
| 0.1875 | 0.027611654 | 0.089069852 | 1.097779015 | 0.035859291 | 1.037193006 |
| 0.25 | 0.049087385 | 0.158346404 | 1.188137263 | 0.063749851 | 1.068090618 |
| 0.375 | 0.110446617 | 0.356279409 | 1.553469026 | 0.143437165 | 1.167456675 |
| 0.5 | 0.196349541 | 0.633385616 | 2.727661659 | 0.254999404 | 1.342280805 |
| 0.625 | 0.306796158 | 0.989665024 | 96.758816160 | 0.398436568 | 1.662335088 |
| 0.75 | 0.441786467 | 1.425117635 | -2.352290089 | 0.573748658 | 2.346033671 |

A 0.25 in port is R of 0.158346404 in a 0.31 in2 bellows and 0.063749851 in a 0.77 in2 bellows. Quoting R for a port size alone is meaningless, and so is quoting a test rack multiplier without saying which bellows it came from.

## The multiplier runs away

One over one minus R is well behaved while the port is small and stops being so quickly. On the 0.31 in2 bellows it walks 1.041218293, 1.097779015, 1.188137263, 1.553469026, 2.727661659, then 96.758816160 at a 0.625 in port, then turns negative at 1.425117635. The algebra has no idea that a port cannot be larger than the bellows it sits in. It returns -2.352290089 with the same confidence it returns 1.041218293.

## The mistake

Chasing throughput by opening the port up and reading only the throughput column. The 0.31 in2 catalogue stops at 0.3125 in for a reason, and the 0.77 in2 catalogue runs to 0.75 in, where R is 0.573748658 and the multiplier is 2.346033671. Every psi of dome charge becomes more than two psi of test rack opening, and the same port area that passes more gas also widens the pressure interval the valve stays open across. A port choice is never only a throughput choice.

## What it refuses

Nothing in the module clamps R below one, warns on a negative multiplier, or checks that a port exists for the bellows it is asked about. The published cases each carry a catalogue matched to their bellows, 0.125 in through 0.3125 in on the 0.31 in2 valves and 0.25 in through 0.75 in on the 0.77 in2 valves, and that matching is the designer's guard rather than the engine's.

## Exercise

Read R and the test rack multiplier for a 0.25 in port in both bellows sizes.

Then find the smallest port in each bellows column whose multiplier exceeds two, and say what a multiplier that size means for a valve that has to close on a falling casing.
