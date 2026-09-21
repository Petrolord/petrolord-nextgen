# Two out of three and its six

{{panel:lp-sif-builder}}

A two out of three subsystem acts when any two of its three channels call for action. It fails to act when any two of the three are dangerously failed at the same time, and that phrase is the whole of its arithmetic. Three channels make three pairs, and either member of a pair may be the one that failed first, so the independent term carries a coefficient of six where the one out of two carries two.

## Where the six comes from

Count the ways the subsystem can be in the failed state. Pick the two channels that are down: there are three such pairs. For each pair, either channel could have failed first and the other second, which is two orders. Three pairs at two orders each gives six. The engine's printed formula for the two out of three carries that six in front of the squared independent rate, and everything else in the equation matches the one out of two exactly.

> PFD = 6((1-bD) lDD + (1-b) lDU)^2 tCE tGE + bD lDD MTTR + b lDU (T1/2 + MRT)

## The cost against a one out of two

The EKULAMA channel with diagnostics in both architectures, the same stated inputs.

| architecture | independent term | common cause, undetected | common cause, detected | PFDavg | RRF | SIL |
| --- | --- | --- | --- | --- | --- | --- |
| 1oo2 | 0.000035259176 | 0.000263280000 | 0.000000448000 | 0.000298987176 | 3344.625055 | 3 |
| 2oo3 | 0.000105777528 | 0.000263280000 | 0.000000448000 | 0.000369505528 | 2706.319458 | 3 |

The independent term is three times larger, which is the six against the two. The common cause terms are identical, because a cause that takes every channel at once fails both arrangements equally. The totals therefore sit much closer together than the independent terms do: the two out of three over the one out of two on this channel is 1.235857.

## What the extra PFDavg buys

The two out of three demands agreement from two channels before it acts, so a single channel failing in the direction of a spurious trip does not shut the plant down. That is its whole purpose, and it is bought with a PFDavg roughly a quarter higher than the one out of two on the same hardware. This engine computes no spurious trip rate at all, so the benefit does not appear in any number it returns. The analyst weighs it outside the calculation and records the reasoning.

## Why the comparison must be on one channel

Architectures are only comparable when every other input is held. The table above moves one thing, the voting arrangement, and holds the rates, the proof test interval, the restoration times, the beta factor and betaD. A comparison that also changed the device changed two things at once and can support no conclusion about voting. The engine makes holding everything easy, because the architecture is one named input among many, and a verification note that compares architectures says plainly which inputs were held and which was moved.

## Exercise

Compute the ratio of the two out of three total of 0.000369505528 to the one out of two total of 0.000298987176 to six decimals and check it against the 1.235857 above. Then compute the ratio of their independent terms and explain in one sentence why the two ratios differ so much.
