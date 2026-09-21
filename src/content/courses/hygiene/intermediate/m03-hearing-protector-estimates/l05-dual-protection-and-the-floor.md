# Dual protection and the floor at zero

{{panel:hy-protection-chemicals}}

A plug and a muff worn together, the higher NRR 27.000000 dB, on the A-weighted teaching case of 97.600000 dBA, give 72.600000 dBA by the OSHA dual-protection rule: an attenuation of 25.000000 dB. On the C-weighted level of 103.200000 dBC the same rule gives 71.200000 dBA. The dual-protection 5 dB is oracle only, and it is never graded.

| NRR, dB | Appendix B, dBA | dual, dBA |
| --- | --- | --- |
| 0.000000 | 97.600000 | 97.600000 |
| 5.000000 | 97.600000 | 94.600000 |
| 7.000000 | 97.600000 | 92.600000 |
| 27.000000 | 77.600000 | 72.600000 |

## The dual-protection rule

The method `OSHA_DUAL` takes the higher of the two NRRs, subtracts 7 if the level is A-weighted, and adds 5. The engine measures the addition as 5.000000000000 dB, the attenuation less (NRR less 7) at an NRR of 30. The second protector is credited with five decibels whatever its own label says. The digest prints that rule and no physical reason for it, so take what follows as background: two protectors do not add their ratings, because sound reaches the ear by paths the second protector does not block.

## How strong the evidence is

The engine and an independent oracle agree on the rule, and no printed value is known to set against it. That makes it oracle only, like the NIOSH derating by type. It is taught so you can read a dual-protection estimate when you meet one, and no graded field in this course passes through it.

## The floor at zero

On A-weighted data a label of 7 dB or less leaves nothing to credit under Appendix B. A label below 7 would give a negative attenuation and raise the estimate above the sound level, which no protector does. The engine credits zero and warns, and the judgement call J5 records the choice: protector credit is floored at 0 with a warning. An NRR of 5 on 92 dBA gives an attenuation of 0.000000 dB, and the warning reads, in the engine's own words:

> the method gives -2 dB of attenuation; a protector cannot raise the exposure, so the credit is zero

The sweep shows the floor holding on the teaching case: at an NRR of 0.000000 and of 5.000000 dB the Appendix B estimate is 97.600000 dBA, the unprotected level.

## Where the dual column meets the floor

The dual rule subtracts seven and adds five, so on A-weighted data its credit is the label less 2. At an NRR of 5.000000 dB the credit is positive and the estimate is 94.600000 dBA. At 0.000000 dB the credit would be negative, the floor holds it at zero, and the estimate is 97.600000 dBA, the unprotected level. A warning on a result is part of the result. When the engine floors a credit, a report that quotes the estimate without the warning hides the fact that the label was too small to help.

## Exercise

Open the protection panel's protector view with the A-weighted teaching case. Record the dual-protection estimate at NRR values of 5.000000, 7.000000 and 27.000000 dB. Compute the estimate at 27.000000 dB by hand from 97.600000 dBA and check it against 72.600000 dBA. Then set an NRR below 7 under Appendix B and copy the warning the engine gives, stating the attenuation it credits.
