# The threshold decides what counts

{{panel:hy-noise-dosimeter}}

On the OBEN record the OSHA PEL setup integrates 2 of the 6 periods. The OSHA action level integrates 5, and so does the NIOSH noise REL. The record is the same in all three cases. What changes is the threshold, the sound level below which a period is left out of the noise dose altogether.

The engine measures each threshold by bisecting on its `belowThreshold` flag. The OSHA PEL threshold is 90.000000000000 dBA. The OSHA action level threshold and the NIOSH noise REL threshold are both 80.000000000000 dBA.

## What falls below the line

A period under the threshold contributes nothing, however long it lasts. On the OBEN record that decides most of the PEL answer.

| period | sound level, dBA | OSHA PEL | OSHA action level | NIOSH noise REL |
| --- | --- | --- | --- | --- |
| 1 | 84.300000 | not integrated | 14.747186 | 27.646683 |
| 2 | 89.800000 | not integrated | 23.100555 | 71.996537 |
| 3 | 94.600000 | 18.921153 | 18.921153 | 91.895868 |
| 4 | 81.200000 | not integrated | 6.458554 | 9.091664 |
| 5 | 99.100000 | 8.827030 | 8.827030 | 64.980192 |
| 6 | 76.500000 | not integrated | not integrated | not integrated |

The second period, 1.900000 h at 89.800000 dBA, sits just under the PEL threshold of 90. It adds nothing to the PEL noise dose and 23.100555 percent to the action level noise dose. The sixth period, at 76.500000 dBA, is below every threshold in this tier and counts nowhere.

## The threshold is inclusive

A source that says "at or above" and a source that says "above" give different answers for a period sitting exactly on the line, so the engine has to choose. Judgement J2 is the choice: **the threshold is inclusive.** A period exactly at the threshold is integrated. The engine's own measurement of it: 80 dBA under the action level gives `belowThreshold` false and a reference duration of 32.000000 h.

The ORONI record was built to show it. It places one period exactly on each threshold and one just under.

| sound level, dBA | hours | OSHA PEL | OSHA action level | NIOSH noise REL |
| --- | --- | --- | --- | --- |
| 80.000000 | 3.000000 | not integrated | 9.375000 | 11.811760 |
| 90.000000 | 2.000000 | 25.000000 | 25.000000 | 79.370053 |
| 79.900000 | 3.000000 | not integrated | not integrated | not integrated |

The 90.000000 dBA period is integrated by the PEL because it sits on the PEL threshold. The 80.000000 dBA period is integrated by the action level and the NIOSH noise REL for the same reason. The 79.900000 dBA period, a tenth of a decibel lower, counts nowhere.

## The totals

For ORONI the PEL noise dose is 25.000000 percent with a TWA of 79.999784 dBA. The action level noise dose is 34.375000 percent with a TWA of 82.296991 dBA. The NIOSH noise REL noise dose is 91.181812 percent with a TWA of 84.599082 dBA. Three hours of the record are invisible to all three criteria, and three more are invisible to the PEL alone.

## Why a threshold exists at all

A threshold says that quiet periods are no part of the question a criterion asks. The PEL sets it at its own criterion level, which makes it a measure of how much of the day was spent at levels a regulation limits. The action level and the NIOSH noise REL set it ten decibels lower, at 80, so that a long quiet stretch still adds to the total. Neither choice is wrong. They answer different questions, and the threshold is where the question is written.

## Exercise

Take the ORONI period of 3.000000 h at 80.000000 dBA and its action level reference duration of 32.000000 h. Divide the hours by the reference duration, write the result in percent and check it against the 9.375000 percent in the table. Then say what that period would contribute if the engine had chosen an exclusive threshold, and which of the three ORONI totals would change.
