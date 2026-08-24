# The shift panel map

This lesson is the map of the tier. It names what the shift panel shows, says which module owns each part of it, and puts the six graded numbers in front of you now rather than at the end. Knowing what you are being asked to produce changes how you read everything between here and the capstone.

## What the panel shows

The panel runs the real pipeline, the same code the capstone is graded against, and reports three things.

**The scan and its answer.** It builds the 25 Hz synthetic from the teaching well, constructs the observed trace as that synthetic arriving 8 ms late in TWT, then slides the synthetic across every lag in the search window and scores the agreement at each one. It reports the winning lag as a bulk shift in ms of TWT and the correlation achieved there. Module 2 owns this: what the correlation measures, how the lags are stepped, and how to read the winning peak including its sign.

**The correlation curve.** Every lag tested is plotted against the correlation it scored, so you see the whole scan rather than only its winner. Module 3 owns this. The curve is where the tier's most useful caution lives, because the value at zero lag, meaning a tie you never shifted at all, is not a number that looks broken.

**The wavelet frequency control.** You set the dominant frequency of the Ricker wavelet and the panel rebuilds the synthetic, so you can watch the peak move: both the peak of the correlation curve and, more importantly, the strongest event on the synthetic itself, which changes size and position as the frequency changes. Modules 4 and 5 own the second of those. Module 4 handles the amplitude, module 5 the time.

Module 6 puts all three together as a workflow and walks the capstone.

## The six graded numbers

The tolerances are part of the fact, so learn them alongside the values.

| reading | value | tolerance |
|---|---|---|
| suggested bulk shift | 8 ms of TWT | 0.5 |
| correlation at that shift | 1 | 0.01 |
| strongest synthetic amplitude at 15 Hz | 0.1573149710893631 | 0.002 |
| strongest synthetic amplitude at 40 Hz | 0.0362229160964489 | 0.001 |
| TWT of the 15 Hz peak | 1580 ms | 2 |
| TWT of the 40 Hz peak | 1646 ms | 2 |

Read the table as three pairs rather than six items.

The first pair is the tie. The shift is 8 ms of TWT with a tolerance of 0.5, which is well inside one sample of the 2 ms grid, so the answer is effectively exact and the tolerance exists only to accept a rounded write-up. The correlation is 1 with a tolerance of 0.01. That value of 1 is the most interesting number in the tier and the most misleading one, and module 2 spends a whole lesson on why it is exactly 1 here and why you should never expect it on real data.

The second pair is amplitude at two frequencies. Both are dimensionless, both are the largest absolute value anywhere on the synthetic trace, and the only difference between the two runs is the dominant frequency of the wavelet. The lower frequency gives the larger amplitude, 0.1573149710893631 at 15 Hz against 0.0362229160964489 at 40 Hz, which is more than a factor of four. That direction is backwards from the common expectation that a sharper wavelet gives a bigger event, and module 4 explains why the expectation is wrong.

The third pair is the TWT at which each of those peaks sits, 1580 ms at 15 Hz and 1646 ms at 40 Hz, a swing of 66 ms of TWT from changing nothing but the wavelet. The tolerance is 2 ms, which is one sample, so the answer has to be the right sample and not a nearby one. Module 5 is built on this pair, and on the fact that the strongest reflection coefficient stays where it is throughout, at 0.017688043415546417 at a TWT of 1582 ms, because reflectivity is a property of the rock rather than of the wavelet.

## How to use the panel

Use it to check yourself rather than to find out. The productive loop is to predict a reading from what you understand of the mechanism, write the prediction down, then open the panel and compare. A prediction that lands confirms the rule you used. A prediction that misses tells you which rule is wrong, and the curve and the trace give you enough detail to work out which.

Two habits are worth starting now. Always write a shift with its unit and say that it is TWT, because a bare 8 in a notebook could be metres, milliseconds of one-way time or milliseconds of two-way time, and only the label separates them. And whenever you write down an amplitude or a peak time, write the wavelet frequency beside it, because both of those numbers belong to the wavelet as much as to the rock, which is the single hardest idea in this tier.

The panel below runs the correlation scan on the planted case, plots the correlation against every lag it tested, and rebuilds the synthetic at any wavelet frequency you choose.

{{panel:sl-shift-explorer}}

## Exercise

Open the panel and locate all six of the graded readings, three of them by changing the wavelet frequency. For each one write a sentence naming the module that will explain it and a sentence saying what you would have to believe to get it wrong. Then answer without looking: which four of the six are readings about the wavelet, and which two are readings about the tie.

Self-check: the four wavelet readings are the two amplitudes and the two peak times, which is the whole point of modules 4 and 5, and each of them has to be quoted with the frequency it belongs to. The two tie readings are the shift of 8 ms of TWT and the correlation of 1, both graded on the capstone's 25 Hz construction. To get the amplitudes wrong you have to believe a sharper wavelet gives a bigger peak. To get the peak times wrong you have to believe the strongest event on a trace marks the strongest interface, which would put both of them at the reflection coefficient at 1582 ms of TWT rather than at 1580 ms and 1646 ms.
