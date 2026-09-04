# What the march computes

The march runs thousands of steps a cycle, keeps two different samples of them, and returns both in one object.

{{panel:pd-card-explorer}}

## The step is set by the wave

`predictCard` advances displacement on a collocated grid with an explicit central difference, at a step short enough to keep the wave inside one cell. On the published taper that is 1.023192e-3 s at 5 spm and 1.023123e-3 s at 9 spm, which gives 11728 marched steps in a cycle at the slower speed and 6516 at the faster one. ODUMA-4 at 10 spm marches 6110 steps at 9.819967e-4 s.

The march repeats whole cycles until the stroke stops changing. The published runs settle after 3 cycles, ODUMA-4 after 4, and all three report converged with no warnings. A run that never settles raises `notPeriodic` rather than failing.

## Two samples of one march

| Case | Marched steps | Card points | Stride |
| --- | --- | --- | --- |
| published taper, 5 spm | 11728 | 181 | 65 |
| published taper, 9 spm | 6516 | 181 | 36 |
| ODUMA-4, 10 spm | 6110 | 186 | 33 |

The card is a decimation. Every stride-th recorded step survives and the rest are discarded, so the ODUMA-4 card keeps 3.044190 percent of the steps the march computed.

The tension envelope is not decimated. It is accumulated over all 6110 of those steps at all 120 interior nodes, and it carries a maximum and a minimum tension for each node. Node spacing on the default grid is 40.000000000 ft, so the shallowest envelope sample sits at half a node, 20.000000000 ft, and the deepest at 4780.000000 ft.

## What comes back

The plunger stroke is the peak to trough travel of the pump end node over one settled cycle: 98.526653100 in on ODUMA-4. The surface card and the pump card come back as point lists. The peak and minimum polished rod loads come back as single numbers read off the decimated card, 19545.877783339 lb and 2625.472705679 lb.

Two samplings of the same march, in one return object, and only one of them is the card.

## What the caller cannot ask for

`predictCard` accepts `cardSamples`, default 180, and `nodes`, default 120, along with `maxCycles` default 20 and `tol` default 0.0001. `runRodPumpDesign` forwards none of them. A studio user gets the loads that came off the default decimation and has no way to request a finer one.

That is worth holding in mind whenever a load looks suspiciously round or a card looks suspiciously smooth. The resolution of the answer was chosen for you, and the function does not report it.

## Exercise

Write the marched steps, card points and stride for the published taper at 5 and at 9 spm, and say why the slower run marches more steps for the same string.

Then state how many steps the ODUMA-4 envelope is accumulated over, how many the card keeps, and what percentage that is.
