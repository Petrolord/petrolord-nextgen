# The time-depth record every app reads

A tie ends as a time-depth record, and every step after it reads depth in time through that record: the top picked on the gathers, the top read off the angle stacks, the modelled interface set against the seismic one. The record has two parts, and only one of them changes when a tie is accepted.

## What the record holds

The first part is the checkshots, depth against one-way time, as they were imported. The second appears once a tie is accepted: rows derived from its anchors through the same time-depth line (`warpToCheckshots` in tieWarp.js), kept as a new set beside the imported checkshots. The imported set stays as it was, so the accepted tie and the measurement it started from can always be compared. QI Studio reads the tie each well has in Seismolord, with its QC record, so a well is tied once and every app reads the same tie.

## Ekene-1 checkshots round the Ekene Sand

| depth ft | one-way time ms | two-way time ms |
| --- | --- | --- |
| 4687.500000 | 585.055000 | 1170.110000 |
| 5079.002625 | 644.438000 | 1288.876000 |
| 5136.515748 | 650.478000 | 1300.956000 |
| 5183.989501 | 655.543000 | 1311.086000 |
| 5585.498688 | 715.018000 | 1430.036000 |
| 5872.998688 | 758.273000 | 1516.546000 |

## The time-depth line

Two-way time is 2 x the one-way time, linear between checkshot levels. The top of the Ekene Sand at Ekene-1, 5078.740157 ft, sits just above the level at 5079.002625 ft, so its two-way time of 1288.796378 ms sits just above that level's 1288.876000 ms. Three levels fall inside or at the edge of the sand: at 5079.002625, 5136.515748 and 5183.989501 ft, the last of them next to the base at 5183.727034 ft.

## The top in time at every well

| well | top ft | two-way time ms |
| --- | --- | --- |
| Ekene-1 | 5078.740157 | 1288.796378 |
| Ekene-2 | 5134.514436 | 1305.746335 |
| Ekene-3 | 5055.774278 | 1282.159191 |
| Ekene-4 | 5216.535433 | 1329.290304 |

The order in time follows the order in depth: Ekene-3 is shallowest and earliest, Ekene-4 deepest and latest. These are checkshot times, the times the later modules search about on the gathers and the stacks.

## Where the bulk shift goes

With a bulk shift of zero, as at Ekene-1 and Ekene-3, the committed time is the checkshot time. A non-zero shift moves every committed time by that same amount. Ekene-2 and Ekene-4 tied best at -4.000000 ms, so a study that accepts those ties commits times one sample earlier than the table above, and states that it did.

## What a study records

For each well: the checkshot set it used, the wavelet, the phase (assumed or measured), the bulk shift or the anchors, and the correlation. Without them the record is a set of times that nobody can check.

{{panel:qi-prestack-explorer}}

## Exercise

In the prestack explorer, set Data to "Ekene teaching pack" and View to "The tie and the time-depth record", with Well at Ekene-1. In the checkshot table, confirm that each two-way time is twice its one-way time, and find the two levels either side of the top. Read the top's two-way time at every well from the table of tops. Then set Well to Ekene-2 and read Bulk shift. Set Checkshot times moved by to -4 ms, a designed teaching case, read the bulk shift again, and note that both time-depth tables stay as imported.
