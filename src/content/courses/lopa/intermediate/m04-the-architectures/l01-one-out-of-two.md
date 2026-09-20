# One out of two

{{panel:lp-sif-builder}}

A one out of two subsystem acts when either of its two channels calls for action. It is the workhorse redundant architecture of process safety, because it fails to act only when both channels are dangerously failed at the same moment. This lesson puts it on the same channel as every other architecture in this module so the comparison is honest, and then reads its two terms.

## The five architectures on one channel

The EKULAMA channel with diagnostics, the same stated inputs throughout, run in all five architectures the engine knows and ranked by PFDavg.

| architecture | PFDavg | RRF | SIL | over the 1oo1 |
| --- | --- | --- | --- | --- |
| 1oo3 | 0.000264001209 | 3787.861448 | 3 | 0.049925 |
| 1oo2 | 0.000298987176 | 3344.625055 | 3 | 0.056541 |
| 2oo3 | 0.000369505528 | 2706.319458 | 3 | 0.069876 |
| 1oo1 | 0.005288000000 | 189.107413 | 2 | 1.000000 |
| 2oo2 | 0.010576000000 | 94.553707 | 1 | 2.000000 |

The one out of two returns 0.000298987176, which is 0.056541 of the single channel figure, and it moves the subsystem from band 2 to band 3 on this channel with no change to the device, the interval or the restoration times.

## Reading the ranking

Three of the five architectures land in band 3 and their PFDavg values sit between 0.000264001209 and 0.000369505528, a range of well under half a division. The two single channel outcomes sit a factor of nearly eighteen or more away. The first decision on a subsystem is therefore whether it is redundant at all, and the choice among redundant arrangements is a much smaller lever on PFDavg than it looks from the formulas.

## Its two terms

The one out of two carries a coefficient of two on its independent term, because either of the two channels may be the one that failed first. That term is the independent dangerous rate squared, multiplied by the channel equivalent down time and the group equivalent down time, which on this channel are 1322.000000 and 884.000000 hours. Alongside it sit the two common cause terms, which carry no equivalent down time at all.

| term | value |
| --- | --- |
| independent | 0.000035259176 |
| common cause, undetected | 0.000263280000 |
| common cause, detected | 0.000000448000 |
| PFDavg | 0.000298987176 |

## What is really being bought

Read the table of terms and the picture is clear. The independent term of 0.000035259176 is what redundancy earned. The rest of the answer, roughly seven eighths of it, is common cause. A one out of two on this channel is a good design, and the gain it delivers is capped by a beta factor of 0.05, which no second channel improves.

## The price of the second channel

A one out of two costs a second set of everything: a second transmitter, a second process connection, a second input card, a second calibration, a second entry in the test schedule. It also doubles the rate at which a channel spuriously calls for a trip, because either channel acting is enough to act. That trade is what the two out of two and the two out of three exist to manage, and the last two lessons of this module take it up.

## Exercise

Using the table of terms, compute the share of the one out of two PFDavg of 0.000298987176 that the independent term of 0.000035259176 accounts for. Then say what would have to change about this subsystem for that share to rise above half, and name which input you would attack first.
