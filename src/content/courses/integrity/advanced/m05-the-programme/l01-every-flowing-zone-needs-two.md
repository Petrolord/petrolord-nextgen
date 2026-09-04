# Every flowing zone needs two

The programme counts barriers per zone, and it only counts them for zones you said could flow.

{{panel:wi-pa-explorer}}

## The requirement

The engine header states the rule it builds the programme around: "every zone with flow potential needs TWO independent permanent barriers". Not two plugs in the well. Two for each zone, and each zone is assessed on its own.

The two are not interchangeable. One of them has to be a PRIMARY that covers the source, and the other backs it up from above. Every zone row the engine returns carries `required: 2`, and it passes only when at least one primary qualifies and the primary and secondary counts together reach two. A zone with three secondaries and no primary still fails. That asymmetry is the whole point of the next two lessons.

## Zones without flow potential are not in the list at all

Before anything is checked, the engine filters the zone list down to those with `flowPotential` set, then sorts them deepest first so the programme reads in the order the work happens.

A zone you did not flag never appears in `zoneCompliance`. It generates no requirement, it cannot fail, and it leaves no trace in the verdict. That flag is an input, which means it is an engineering judgement you made before the checklist ran. The checklist inherits it without question. A depleted sand you decided was not a source, and a shallow water flow nobody logged, are both invisible here for the same reason.

## The published case

The published well carries two flowing zones.

| Zone | Top, m MD | Bottom, m MD |
| --- | --- | --- |
| Reservoir sand | 2500 | 2600 |
| Intermediate gas stringer | 1800 | 1850 |

Four plugs are proposed against them: P1 reservoir primary at 2380 to 2520 m MD on a mechanical foundation, P2 reservoir secondary at 2350 to 2510, P3 intermediate at 1700 to 1810, and S1 surface plug at 0 to 60. Each of the two zones now needs its own answer to the same question, and the plugs are free to serve more than one zone.

## Exercise

1. Load the published case in the panel and read `zoneCompliance`. Confirm that both rows show `required: 2`, and note which plug names sit in each list.
2. Clear the flow potential flag on the intermediate gas stringer and re-run. Watch the row disappear rather than fail.
3. Write down, before the next lesson, which of the four plugs you expect to cover the reservoir sand and why.
