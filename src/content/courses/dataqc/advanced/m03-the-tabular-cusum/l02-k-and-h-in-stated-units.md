# The reference value and the decision interval

{{panel:dq-monitor-explorer}}

k, the reference value, is the allowance each reading must exceed before it adds to a sum. h, the decision interval, is the height a sum must pass to signal. Both are numbers, and a number means nothing until its unit is stated. On EKENE-3, k 0.5 and h 4 read in sigma units, with sigma 3.774063 psi from phase one, are k 1.887031 psi and h 15.096251 psi. The same k 0.5 and h 4 read as psi give a first upper signal on day 4, a first lower signal on day 11, and 45 flags against 28.

| k 0.5, h 4, read as | k, psi | h, psi | first upper signal day | first lower signal day | flags |
| --- | --- | --- | --- | --- | --- |
| multiples of sigma | 1.887031 | 15.096251 | 8 | 21 | 28 |
| psi, the data's own units | 0.5 | 4 | 4 | 11 | 45 |

## The refusal

The engine will not guess the unit. Call it without one and it refuses, naming the field. Its own words:

> units is required: 'sigma' (k and h in multiples of sigma, rule of thumb k = 0.5, h = 4 or 5) or 'data' (k and h in the data's own units)

The rule of thumb it quotes is written in sigma units, and that is the trap it guards against: copied into a CUSUM whose inputs are read in psi, it silently becomes a tighter chart, and on EKENE-3 that chart signals on day 4, a day with no planted event at all.

## Sigma units

With `units: 'sigma'` the engine needs a sigma and converts: k in data units is k times sigma, and h likewise. The panel shows both converted figures, 1.887031 and 15.096251 psi on EKENE-3. The sigma is the one from history, MRbar / 1.128 from phase one here, and the monitoring note names it, because a different sigma gives a different k and h in psi and a different chart.

## Data units

With `units: 'data'`, k and h are taken as written, in the data's own units, and no sigma is needed. That suits an allowance set from something other than the process scatter, such as a shift the operation cares about in psi. The NIST/SEMATECH 6.3.2.3 table works this way: a target of 325 with k 0.317500 and h 4.195900 in the data's units.

## Choosing k and h

k decides how far above or below target a reading must sit before it counts as evidence; the refusal's rule of thumb puts it at 0.5 in sigma units. h trades speed against false alarms. A larger h waits for more evidence; a smaller h signals sooner and more often. Neither appears among the engine's defaults: the engine takes k and h as inputs with a stated unit, and has no helper that designs them. Lesson four reads the design formula NIST prints.

## One setting, three parts

The same two numbers, read in two units, give charts that disagree on both first signals and on the number of flags, with nothing in the data changed. A monitoring plan writes k, h and the unit together.

## Exercise

In the panel's CUSUM view, run EKENE-3's forty days with k 0.5, h 4 and units set to multiples of sigma, and confirm the first signals on days 8 and 21. Switch the units to the data's own and confirm days 4 and 11. Then enter k 1.887031 and h 15.096251 in data units, and compare that run with the sigma run. Write one sentence on what you found.
