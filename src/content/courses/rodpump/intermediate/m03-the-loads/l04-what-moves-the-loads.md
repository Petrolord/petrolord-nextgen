# What moves the loads

Three inputs a designer types move the peak and the minimum, by very different amounts and for very different reasons. One of them is never measured.

{{panel:pd-card-explorer}}

## Damping, the input nobody measures

The damping ratio is typed, not measured. Walked across ODUMA-4 it does this.

| Damping ratio | Peak, lb | Minimum, lb | Converged |
| --- | --- | --- | --- |
| 0.0800 | 19220.576765 | 3062.738292 | true |
| 0.1000 | 19231.260898 | 2839.843559 | false |
| 0.1200 | 19545.877783 | 2625.472706 | true |
| 0.1400 | 19865.857474 | 2420.523442 | true |
| 0.1600 | 19993.718835 | 2065.460467 | true |
| 0.1800 | 20145.840447 | 1778.918975 | true |
| 0.2000 | 20509.510669 | 1819.760728 | true |

Across the nine contiguous rows of the full sweep the peak moves 2223.684206 lb and the minimum moves 2115.653830 lb, while the plunger stroke moves 13.541308 in. The widest peak in that sweep is at 0.0600, and the 0.0500, 0.0600 and 0.1000 rows all come back with `notPeriodic` and converged false, so the sweep is not even clean over the range the engine's own header calls the field range, about 0.05 to 0.15 of critical.

Two thousand pounds at each end of the card, from a number somebody chose.

## Plunger size, which moves the load and the volume together

| Plunger, in | Fluid load, lb | Peak, lb | Minimum, lb | Produced, bbl/d |
| --- | --- | --- | --- | --- |
| 1.2500 | 2393.010029 | 17041.875221 | 3387.340512 | 171.610889 |
| 1.5000 | 3445.934442 | 18214.446551 | 2676.609973 | 240.265058 |
| 1.7500 | 4690.299657 | 19545.877783 | 2625.472706 | 316.565396 |
| 2.0000 | 6126.105675 | 21110.431299 | 2605.335024 | 396.784160 |
| 2.2500 | 7753.352494 | 22756.352510 | 3489.805977 | 468.819923 |

Worst section loading walks 71.721589, 77.942485, 82.873308, 89.702671 and 102.235377 percent down those rows, and the last one raises `rodOverstressed`. The minimum load falls across the first four rows and turns back up on the fifth: bigger is not simply worse at both ends of the card.

## Fluid gravity, which moves both loads and nothing else

Going from a specific gravity of 0.7500 to 1.0500 on ODUMA-4 walks the buoyancy factor from 0.904458599 to 0.866242038 and the buoyed weight from 9670.652229 lb to 9262.033121 lb. The peak follows it down from 19750.187337 lb to 19341.568229 lb and the minimum from 2829.782260 lb to 2421.163152 lb.

The plunger stroke reads 98.526653 in on every one of those seven rows. Fluid changes the weight the rod carries, not how far the string stretches under a given load.

## The mistake

Tuning the damping ratio until the loads look right. It is the one input here with no measurement behind it, and the largest unearned authority.

## Exercise

Write the peak and the minimum at damping ratios of 0.0800 and 0.2000, and name the three rows of the full sweep that report `notPeriodic`.

Then say what the gravity sweep leaves unchanged and why.
