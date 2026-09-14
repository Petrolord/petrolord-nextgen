# A half percent threshold

The implied-prior check calls typed inputs consistent when every implied outcome chance sits within 0.005 of the stated one. The boundary is inclusive, and it is a cliff: on one side the Analyzer prints a value of information, on the other it withholds it.

{{panel:ec-judgement-explorer}}

## Either side of the line

Both published boundary cases state 0.300000 / 0.700000.

| case | implied | delta | consistent |
| --- | --- | --- | --- |
| justInsideTolerance | 0.305000 / 0.695000 | 5.000000e-3 / -5.000000e-3 | true |
| justOutsideTolerance | 0.306000 / 0.694000 | 6.000000e-3 / -6.000000e-3 | false |

The threshold is absolute on the probability. It is half a percentage point for an outcome stated at 0.300000 and the same half point for one stated at 0.700000, never half a percent of the stated chance.

## The Analyzer at the boundary

| case | implied Success | EMV with information | voi | netVoi | evpi |
| --- | --- | --- | --- | --- | --- |
| consistentAtHalfPercent | 0.305000 | 39.75 | 34.75 | 24.75 | 63.00 |
| withheldPastHalfPercent | 0.306000 | withheld | withheld | withheld | 63.00 |

Both show EMV without information 15.00. The first draws its tree, root emv 39.7500. The second draws none. Before the repair the Analyzer printed a gross voi of 35.10 and a netVoi card of 25.10 for the second case, below the 63.00 ceiling, and nothing on the screen looked wrong.

## A consistent value still drifts

The Analyzer's own defaults are exactly consistent: implied success 0.300000, voi 33.00, netVoi 23.00. Move the implied chance to 0.305000 and the gross voi reads 34.75, accepted. Move it to 0.306000 and the value that would have printed, 35.10, is withheld. Across that small step the value climbed with the contradiction, because part of what the typed posteriors add is extra success the stated chances never granted. The half point is an allowance for posteriors copied to a few places. It does not certify that an accepted value is right.

## The binary allowance

In binary floating point 0.305 - 0.3 evaluates to 0.0050000000000000044, above 0.005 by 4.3e-18. The engine compares against 0.005 plus a 1e-12 representation allowance and reports consistent true; against 0.005 alone the same deltas would read false. Before the EC4-0 repair there was no allowance and the published boundary case was called inconsistent (finding D1, now resolved). The allowance is far too small to admit any contradiction a person could type. It exists only to keep the stated boundary inclusive.

## The mistake

The first mistake is to nudge typed posteriors until the check passes and report the result. Landing at 0.305000 produces a printed 34.75 that carries the same contradiction as the withheld 35.10, only less of it. The inputs should agree, and squeezing under the line does not make them agree.

The second is to read 5.000000e-3 as relative and expect a tighter allowance on a small chance. The check grades nothing either: 0.300000 and 0.305000 both read consistent true, with no mark to say one sits on the boundary.

## Exercise

State the implied success chance, the delta and the consistency result for justInsideTolerance and justOutsideTolerance. Then give the gross voi the Analyzer shows for each today, and the card it printed for the outside case before the repair.
