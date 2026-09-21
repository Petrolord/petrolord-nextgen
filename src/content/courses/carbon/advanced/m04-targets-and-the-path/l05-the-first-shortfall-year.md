# The first shortfall year

The path returns two summary figures: finalGapTonnes and firstShortfallYear. They answer different questions, and on the invented AGBOR records they do not tell the same story. The lab prints both, on the course's set, IPCC AR6 GWP100, fossil methane, and this lesson reads them together.

{{panel:carbon-abatement-explorer}}

## The two figures

The lab prints firstShortfallYear 2027 and finalGapTonnes 1370.083. The first is the first year the gap column prints a gap. The second is the gap in the end year, 2033.

| year | target t | emissions t | unabated gap t | measures live |
| --- | --- | --- | --- | --- |
| 2026 | 56100.276 | 56100.276 | 0.000 | none |
| 2027 | 53695.978 | 54190.276 | 494.298 | Tune the fired heaters; Repair failed steam traps |
| 2028 | 51291.681 | 52090.276 | 798.595 | Tune the fired heaters; Repair failed steam traps; Solar for purchased power |
| 2029 | 48887.383 | 48690.276 | 0.000 | Tune the fired heaters; Repair failed steam traps; Heat integration project; Solar for purchased power |

In 2026 nothing is live and the emissions and the target both print the baseline, 56100.276 t. In 2027 the target has fallen to 53695.978 t, two measures are live, the emissions stand at 54190.276 t, and the gap is 494.298 t. That is the first shortfall. In 2028 the gap is 798.595 t. In 2029, with the Heat integration project live, it is 0.000, and it stays 0.000 to 2032 before 1370.083 t in 2033.

## Why a path needs both

A path read only by its final gap would miss 2027 and 2028. A path read only by its first shortfall would miss that the gap closes for four years and opens again in the end year. Together the two figures describe the start and the end of the path, and the year-by-year column shows what lies between.

## On a partial inventory

The lab prints the same two figures on the partial inventory, with the electricity factor blank: firstShortfallYear 2027 and finalGapTonnes 0.000. On the full inventory they are 2027 and 1370.083. The first shortfall year is the same on both baselines. The final gap is not. A reader who took only the final gap from the partial path would read the programme as closing its gap in 2033.

## What the start years do

The path is set by start years. In 2027 the two measures live are Tune the fired heaters, 760 t a year, and Repair failed steam traps, 1150 t a year. The Heat integration project, 3400 t a year, goes live in 2029, and Flare gas recovery, 6200 t a year, in 2030. The curve's ranking by cost plays no part in the path. A reader who wants to know why a given year falls short reads the measures-live column for that year, beside its target and its emissions.

## The oracle's route

This course names how the path is recomputed: the carbonAbatement oracle builds it as a year ledger, a second route beside the engine's, and its goldens are asserted by the engine test suites. The path is one of the outputs the oracles check. The curve's residual to target and paysForItselfTonnes are not, and module six lists those separately as taught from the engine and never graded.

## Exercise

Read firstShortfallYear and finalGapTonnes on the full inventory and on the partial inventory, and the gap column from 2026 to 2029 with the measures live. Say what the two summary figures, read with the column, show about why a path needs both.
