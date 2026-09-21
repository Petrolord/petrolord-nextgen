# The channel equivalent down time

{{panel:lp-sif-builder}}

The full Annex B equations replace the plain half interval of the simplified forms with a quantity the engine calls tCE, the channel equivalent down time. It is a single number, in hours, that says how long one channel is unavailable on average once both failure populations are accounted for. Every architecture in the engine uses it, and the one out of one case uses nothing else.

## The definition, in the engine's words

The engine states the channel equivalent down time verbatim as `lDU/lD (T1/2 + MRT) + lDD/lD MTTR`. Read it as a weighted average of two down times. The undetected share of the dangerous rate waits half the proof test interval plus the repair time after the test that reveals it. The detected share waits only the restoration time. The weights are the two rates divided by their sum.

## Computed on one channel

The EKULAMA channel with diagnostics, at lambdaDU 1.2e-6 and lambdaDD 2.8e-6 per hour, a proof test interval of 8760 hours, an MTTR of 8 hours and a mean repair time after a test of 8 hours.

| term | value |
| --- | --- |
| lambdaD, per hour | 4e-6 |
| T1 divided by two, hours | 4380.000000 |
| MTTR, hours | 8 |
| tCE, hours | 1322.000000 |
| PFDavg, one out of one | 0.005288000000 |

The undetected share here is 1.2e-6 over 4e-6, which is three tenths, and it carries a down time of 4380.000000 hours plus the 8 hour repair time. The detected share carries seven tenths of the weight and a down time of only 8 hours. The weighted result is 1322.000000 hours, well under a third of half the interval.

## The one out of one formula

For a single channel the engine's formula is short, and it prints it with every call.

> PFD = lD tCE

Multiply the total dangerous rate by the channel equivalent down time and the answer is the PFDavg. On these inputs, 4e-6 per hour times 1322.000000 hours gives 0.005288000000. Nothing else enters, because a single channel has no second channel to fail with it and no common cause term.

## Why a single equivalent time is enough

The engine could have carried the two failure populations separately through every architecture. It folds them into one equivalent down time because that is the form Annex B states, and because the same tCE then serves every architecture without a second set of equations. The price is that tCE hides the split: a channel with a short tCE may owe it to good diagnostics or to a short proof test interval, and the basis block is where the analyst reads which.

## Hours, and only hours

Every time the verification half takes is in hours, including the proof test interval, the MTTR, the mean repair time after a test and the lifetime. The engine converts nothing on your behalf. A year is 8760 hours at the engine constant HOURS_PER_YEAR, and an interval typed in years is simply a wrong answer expressed in the right units.

## Exercise

Recompute tCE for this channel with the MTTR raised to 24 hours, keeping every other input as stated. Give your figure to six decimals, compare it with the 1322.000000 hours above, and multiply it by lambdaD of 4e-6 per hour to say what the one out of one PFDavg becomes.
