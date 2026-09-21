# The rare event warning and the refusal

{{panel:lp-proof-test}}

The Annex B forms assume that dangerous failures are rare over an interval, and they stop being trustworthy when that assumption is strained. The engine handles the strain in two stages. A warning is returned WITH a result: the engine answers and tells the analyst the answer is generous. A refusal replaces the result entirely: the engine has nothing defensible to return, so it returns none. Knowing which stage a call landed in is part of reading the output honestly.

## The warnings the verification half returns

| call | PFDavg | warning, verbatim |
| --- | --- | --- |
| 1oo1, lambdaDU 2e-5, T1 8760 | 0.087600000000 | lambdaDU x T = 0.1752 exceeds 0.1: the linearised (rare-event) equations overstate PFDavg noticeably here |
| 1oo1 with a beta factor of 0.1 typed | 0.004380000000 | beta does not apply to 1oo1 and was ignored |
| 2oo2 with a beta factor typed | 0.010576000000 | beta does not apply to 2oo2 and was ignored |

The first is the rare event warning. The other two say that an input the analyst supplied did nothing, which is worth just as much: a common cause fraction typed against a single channel or a 2oo2 has been read, discarded and reported as discarded.

## Where the warning threshold sits

The warning fires when the undetected failure rate times the interval goes above 0.1 on a perfectly tested subsystem; below full coverage the engine uses the lifetime in place of the interval. That is not a boundary between right and wrong; it is where the overstatement becomes large enough to mention. The golden's longest interval case shows the size of it. Its failure rate times interval is 0.438000, and its engine PFDavg of 0.219000000000 sits 15.12 percent above the time dependent value of 0.190241513373. Past the threshold the answer is still an answer, and it is still the number a site is assessed against, but a verification note should carry the warning text with it so a reader knows the conservatism was flagged by the tool before anyone had to discover it.

## Past the warning is the refusal

Push the interval far enough and the linearised value stops being a probability at all. At that point there is nothing to warn about, and the engine declines:

> proofTestIntervalHours: the simplified equations give 4.38 here, which is not a probability: lambda x T is far outside the rare-event range they assume; use an exact (Markov) model

The field named is the proof test interval, the message says what went wrong, and it says what to do about it. The refusal carries no number of its own and no partial result. The boundary is a computed PFDavg of one or more, so between a warning and a refusal the engine keeps answering and keeps saying the answer overstates.

## What this pair of behaviours is for

Together they draw the edge of the model in a place a learner can see. Inside the edge the forms are conservative by a fraction of a percent. Near the edge they are conservative by a noticeable amount and say so. Outside it they produce something that looks like a probability and is not, and the engine refuses the output and keeps it out of a report.

## Exercise

Take the warned case at 0.087600000000, whose failure rate times interval is 0.1752, and the refused case whose linearised value reaches 4.38. Work out roughly how many times longer the refused interval is than the warned one, holding the failure rate the same. Then write the two sentences you would put in a verification note for the warned case, one giving the result and one giving the warning.
