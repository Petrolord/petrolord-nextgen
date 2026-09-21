# A run in one direction

{{panel:supply-tank-explorer}}

## One day is not a pattern

A single day's gap, inside its tolerance, says little. The AKODO day read a loss of -8.648 m3, within a band of 12.365 m3. What a single day cannot show is a slow, steady loss that stays inside the band every day and adds up across many.

trendUnaccounted reads the days together. It keeps a running total of the daily unaccounted figures, and it counts the run of days in one direction that ends on the latest day.

## Nine days

| day | unaccounted m3 | throughput m3 | cumulative m3 |
| --- | --- | --- | --- |
| day 1 | 4.200 | 6105.000 | 4.200 |
| day 2 | -3.600 | 5870.000 | 0.600 |
| day 3 | 1.900 | 6240.000 | 2.500 |
| day 4 | -2.400 | 6010.000 | 0.100 |
| day 5 | -5.300 | 6395.000 | -5.200 |
| day 6 | -4.100 | 5925.000 | -9.300 |
| day 7 | -6.800 | 6180.000 | -16.100 |
| day 8 | -3.900 | 6050.000 | -20.000 |
| day 9 | -7.200 | 6310.000 | -27.200 |

Read the unaccounted column first. The first three days alternate: a gain of 4.200 m3, a loss of -3.600 m3, a gain of 1.900 m3. The cumulative column reads 0.100 m3 at day 4. From day 4 onward every day is a loss, and the cumulative column falls with each, to -27.200 m3 by day 9.

The engine's summary of the nine days:

cumulative unaccounted: -27.200 m3; cumulative as a percent of cumulative throughput: -0.0494

run ending on the latest day: 6 days of loss

prompt: 6 days of loss in a row. One day is noise; a run in one direction is worth investigating: a drifting meter, a passing valve, or a temperature effect not being corrected.

## Reading the prompt

The prompt names three causes: a drifting meter, a passing valve, or a temperature effect not being corrected. It names them as places to look and does not say which one is at work.

The cumulative percent, -0.0494, states the nine days' total gap on the nine days' total throughput. The engine prints that denominator as 55085.000 m3.

## Where the run starts and stops

The engine counts only the run that ends on the latest day. The same record cut at day 6 gives:

The first six days alone: run 3 days of loss; prompt: none.

The lab reads the threshold off the engine by trimming the history one day at a time:

| days kept | run ending on the last kept day | prompt printed |
| --- | --- | --- |
| 5 | 2 days of loss | none |
| 6 | 3 days of loss | none |
| 7 | 4 days of loss | yes |
| 8 | 5 days of loss | yes |
| 9 | 6 days of loss | yes |

Read down the last column. At a run of 2 or 3 days of loss the engine prints no prompt. At a run of 4, 5 or 6 days it prints one. These five cuts are the whole evidence, so the lesson states the threshold as that reading of the table.

With no days at all, the engine reports cumulative 0.000 m3, run 0 and mean percent none. An empty record has nothing to average, so the mean is none. It is not a zero.

In the panel, step through the nine days and watch the cumulative total and the run counter.

## Exercise

Read the run and the prompt for the full nine days and for the first six days alone. Say what differs between the two cases and why the engine treats a run differently from one day.

Self check: at nine days the run is 6 days of loss and the engine prompts; at six days the run is 3 days of loss and the prompt is none. One day is noise; a run in one direction points at a drifting meter, a passing valve or an uncorrected temperature effect.
