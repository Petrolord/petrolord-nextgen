# One out of three

{{panel:lp-sif-builder}}

A one out of three subsystem acts when any one of its three channels calls for action, and it fails to act only when all three are dangerously failed together. It is the lowest PFDavg the engine will return on a given channel, and it is also the architecture this course asks you to treat with the most care, because the evidence behind it is thinner than for the others.

## Three failures, three down times

Failing a one out of three needs three failures to accumulate inside one proof test interval, so its independent term carries the independent dangerous rate cubed. Three time constants enter it. The first failure waits the channel equivalent down time. The second uses a third of the interval and the group uses a quarter, and the engine returns those as the second group time and the group time.

> PFD = 6((1-bD) lDD + (1-b) lDU)^3 tCE tG2E tGE + bD lDD MTTR + b lDU (T1/2 + MRT)

## On the teaching channel

The EKULAMA channel with diagnostics, the same stated inputs as every other architecture in this module.

| quantity | value |
| --- | --- |
| tCE, hours | 1322.000000 |
| tG2E, hours | 884.000000 |
| tGE, hours | 665.000000 |
| independent term | 0.000000273209 |
| PFDavg | 0.000264001209 |
| RRF | 3787.861448 |
| SIL | 3 |

The independent term has collapsed to 0.000000273209, which is about one thousandth of the total. Practically the whole answer is the common cause term, and the one out of three sits at 0.000264001209 against the one out of two at 0.000298987176. Three channels have bought roughly a tenth off the two channel figure, because both are already common cause dominated at a beta factor of 0.05.

## Be careful with this one

The engine computes the one out of three from the published Annex B form in the same way it computes every other architecture. Its evidence is weaker all the same. The engine's validation record checks the one out of three against the time dependent route to first order only, and there is no published worked row for it anywhere in this wave's golden. The other four architectures are checked against published worked values. Treat a one out of three figure as the engine's honest arithmetic on a form it believes, and say so in a verification note.

## When it is worth considering

A one out of three is worth its cost when the common cause term is genuinely small, which means diverse channels, separate connections and separate procedures. On a channel like this one, where common cause dominates from a low beta factor, a third identical channel is close to wasted money. The table is the argument: the gain from two channels to three is far smaller than the gain from one to two.

## Exercise

Compare the one out of three PFDavg of 0.000264001209 with the one out of two at 0.000298987176 and with the one out of one at 0.005288000000. Compute both ratios to six decimals, then state, from the size of the independent term of 0.000000273209, what would have to change before a third channel earned its place.
