# A pool fire, and its edge

The ERHA bund is 18.000000 m across, which is 254.4690 m2 of pool burning at 0.055000 kg/m2/s, so 13.9958 kg/s and 601819.1967 kW. The flame stands 23.7996 m tall by Thomas, and the radius to 4.730000 kW/m2 is 59.5294 m from the pool centre.

{{panel:fc-layout-explorer}}

## From a bund to a radius

The bund diameter gives the pool area, the area times the burning rate gives the mass burning rate, and that times the heat of combustion gives the heat release. The Thomas correlation gives the flame height from the pool diameter and the burning rate, and the point source model then solves for the radius at which the intensity falls to the allowable.

Each step is arithmetic on the step before, and every one of them is driven by the size of the bund.

## The radius and the setback are different numbers

The radius of 59.5294 m is measured from the centre of the pool. The setback from the pool edge is 50.5294 m, and the engine reports both with a setbackStatus of beyond-pool-edge. The difference between them is 9.0000 m, which is half the pool diameter and nothing else.

That gap is the defect this course was built after. The layout check measures centre to centre, and a tank icon sits at the centre of its bund, so passing the setback from the EDGE into a centre-to-centre check made every comparison short by half the bund. It failed open, and on this plot that did not show up as a pass. Judged the retired way ERHA still returns 6 breaches against 6, so the defect showed as a smaller number instead, which is the harder kind to notice.

## Four published pools

| case | pool m | allowable kW/m2 | heat release kW | flame m | radius m | edge setback m | status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| pool20mAt4p73 | 20.000000 | 4.730000 | 742986.6626 | 25.6078 | 66.1438 | 56.1438 | beyond-pool-edge |
| pool6mAt1p58 | 6.000000 | 1.580000 | 66868.7996 | 11.0910 | 34.3330 | 31.3330 | beyond-pool-edge |
| pool40mAt4p73Tau0p9 | 40.000000 | 4.730000 | 3428105.9036 | 44.5990 | 134.7867 | 114.7867 | beyond-pool-edge |
| withinPoolEdgeEdgeCase | 20.000000 | 4000.000000 | 742986.6626 | 25.6078 | 2.2745 | 0.0000 | within-pool-edge |

On every row the two distances differ by half the pool diameter: 10.0000 m on the 20.000000 m pools, 3.0000 m on the 6.000000 m pool and 20.0000 m on the 40.000000 m pool. The status is what tells a reader which world the answer is in.

## What it means on this plot

The crude tank stands 43.1555 m from Transfer pump A and 44.1452 m from Transfer pump B, against a radius of 59.5294 m from the tank centre. Both fail, by 16.3739 m and 15.3842 m. The heater treater at 50.1598 m fails by 9.3696 m, and against the retired edge figure of 50.5294 m it would have read only 0.3696 m short, a breach a tenth of its true size.

Those three shortfalls are reported as fractions of the requirement as well: 0.275056, 0.258430 and 0.157395. The fraction is the useful figure when comparing failures on items of different sizes, because a short distance can be badly short without being short by many metres.

## The mistake

The mistake is passing the edge setback into a centre-to-centre comparison, or the centre radius into an edge-to-edge one. Both are correct numbers and each is wrong in the other place, and the error is always half the pool.

## Exercise

Work the ERHA pool from an 18.000000 m bund to its radius, giving the area, the mass burning rate, the heat release and the flame height. State the radius, the edge setback and the difference between them. Then explain why passing the edge setback into the layout check failed open.
