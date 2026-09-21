# A straight line to the end year

`carbonAbatement.decarbonisationPath` sets a year-by-year target against the emissions the measures leave. The lab prints it for the invented AGBOR records: the target falls in a straight line from the baseline in 2026 to 30 percent below it in 2033, as the Carbon Studio draws it, and each measure counts in full from its start year.

{{panel:carbon-abatement-explorer}}

## The target line

| year | target t |
| --- | --- |
| 2026 | 56100.276 |
| 2027 | 53695.978 |
| 2028 | 51291.681 |
| 2029 | 48887.383 |
| 2030 | 46483.086 |
| 2031 | 44078.788 |
| 2032 | 41674.491 |
| 2033 | 39270.193 |

The line starts at the baseline, 56100.276 tCO2e, the Agbor inventory total on IPCC AR6 GWP100, fossil methane. It ends at 39270.193 t in 2033, 30 percent below the baseline. The years between are the straight line the Carbon Studio draws: the target falls by the same step each year.

## The emissions against it

| year | abated t | emissions t | target t |
| --- | --- | --- | --- |
| 2026 | 0.000 | 56100.276 | 56100.276 |
| 2027 | 1910.000 | 54190.276 | 53695.978 |
| 2028 | 4010.000 | 52090.276 | 51291.681 |
| 2029 | 7410.000 | 48690.276 | 48887.383 |
| 2030 | 13610.000 | 42490.276 | 46483.086 |
| 2031 | 15460.000 | 40640.276 | 44078.788 |
| 2032 | 15460.000 | 40640.276 | 41674.491 |
| 2033 | 15460.000 | 40640.276 | 39270.193 |

The emissions line does not fall in a straight line. It falls in steps, one each time a measure goes live, because each measure counts in full from its start year. In 2026 nothing is live and the emissions equal the baseline. By 2031 all six measures are live, the abated column reads 15460.000 t, and the emissions stay at 40640.276 t through 2033.

## Which measures are live when

The lab prints the start years as inputs, invented for this course, and the measures-live column follows them. Tune the fired heaters and Repair failed steam traps are live from 2027. Solar for purchased power joins in 2028, the Heat integration project in 2029, Flare gas recovery in 2030, and Vapour recovery on the storage tanks in 2031. The path follows the start years. It does not follow the cheapest-first rank of the curve: Solar for purchased power, fifth on the curve, is live a year before the Heat integration project, third.

## A step line against a straight line

The target keeps falling after 2031, and the emissions do not, because no new measure starts after 2031. The two lines are read year by year. The next lesson reads the column that records where emissions sit above the target.

## Where the tonnes come from

The abated figure in 2031, 15460.000 t, is the same figure as the curve's totalAbatementTonnes. The path counts every measure in full from its start year, including the two heater measures that module two names as acting on one source, whose abatements the interaction note calls not additive. The path is recomputed by the carbonAbatement oracle as a year ledger, and its goldens are asserted by the engine test suites (module six).

## Reading a year

Take 2030. Five measures are live: the two from 2027, Solar for purchased power, the Heat integration project, and Flare gas recovery, which starts that year. The abated column reads 13610.000 t, the emissions 42490.276 t and the target 46483.086 t. Each figure is the engine's. The year is read across its row, and no figure in it is worked out on paper.

## The end year and the baseline year

Both ends of the line are inputs: the baseline year, 2026, and the end year, 2033, with the target 30 percent below the baseline in the end year. The engine refuses a path without them, in its own words: "A baseline and a valid year range are required." The fourth lesson of this module reads that refusal.

## Exercise

Read the target and the emissions for 2030 and for 2033, with the measures live in each year. Say what the two pairs, read together, show about a straight-line target set against emissions that fall only when a measure starts.
