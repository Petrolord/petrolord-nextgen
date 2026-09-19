# The action level is half a noise dose

{{panel:hy-noise-dosimeter}}

On the OSHA action level setup the OBEN day is a noise dose of 72.054478 percent against a limit of 50, and a TWA of 87.635749 dBA against 85. The engine reports `exceedsLimit` true. The same record gave 27.748183 percent on the PEL setup, and the two OSHA figures differ because the action level lets three more periods in.

The action level is the trigger for OSHA's hearing conservation programme. Section 1910.95(c)(1) sets it at a TWA of 85 dBA "or, equivalently, a dose of fifty percent". That phrase is the whole idea of this lesson: the action level is half a noise dose on the PEL scale.

## The four numbers of the criterion

| part of the criterion | OSHA PEL | OSHA action level |
| --- | --- | --- |
| criterion level, dBA | 90.000000000000 | 90.000000000000 |
| decibel exchange rate, dB | 5.000000000000 | 5.000000000000 |
| threshold, dBA | 90.000000000000 | 80.000000000000 |
| limit noise dose, percent | 100.000000000000 | 50.000000000000 |

Two numbers change. The threshold drops to 80.000000000000 dBA, so quieter periods count, and the limit noise dose halves to 50.000000000000 percent. The criterion level and the decibel exchange rate stay where they were, so a period that both setups integrate carries the same contribution under each. The third OBEN period is 18.921153 percent under both.

## Five periods out of six

The action level integrates 5 of the 6 OBEN periods. Its contributions are 14.747186, 23.100555, 18.921153, 6.458554 and 8.827030 percent. Only the sixth period, at 76.500000 dBA, stays out. The second period alone, 1.900000 h at 89.800000 dBA, carries 23.100555 percent here and nothing on the PEL.

## Why 85 and fifty are the same statement

A TWA of 85 on the OSHA scale is a noise dose of 50.000750 percent, measured by `noiseDoseFromTwaPct`. Going the other way, OSHA Table A-1 turns a noise dose of 50.000000 percent into 84.999892 dBA. The tiny departures from 50 and 85 come from the printed coefficient 16.61, as the previous module showed, and at the precision the regulation writes they are the same point.

So the OBEN day can be read against the action level either way. Its TWA of 87.635749 dBA is above 85, and its noise dose of 72.054478 percent is above 50. The two comparisons always agree, because one is the restatement of the other.

## A different metric with a similar name

The European and UK rules use "action values", which are daily noise exposure levels and a different metric; the Professional tier teaches them. In this tier "action level" always means the OSHA hearing conservation trigger, and it should be written that way in a report.

## Exercise

Add the five action level contributions listed above and check your total against 72.054478 percent. Then take the OSHA figure for a TWA of 85, a noise dose of 50.000750 percent, and divide the OBEN action level noise dose by it. Say what your ratio tells you about how far over the action level the OBEN day sits, and why the PEL setup could never have shown it.
