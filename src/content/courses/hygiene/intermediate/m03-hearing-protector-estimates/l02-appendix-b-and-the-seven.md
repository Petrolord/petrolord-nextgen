# Appendix B and the seven

{{panel:hy-protection-chemicals}}

An A-weighted TWA of 97.600000 dBA under a protector with an NRR of 27.000000 dB gives 77.600000 dBA by Appendix B, an attenuation of 20.000000 dB. A C-weighted level of 103.200000 dBC under the same protector gives 76.200000 dBA, an attenuation of 27.000000 dB. The seven is the difference.

| weighting | level | credited NRR, dB | attenuation, dB | estimated level, dBA |
| --- | --- | --- | --- | --- |
| A | 97.600000 | 27.000000 | 20.000000 | 77.600000 |
| C | 103.200000 | 27.000000 | 27.000000 | 76.200000 |

## The rule

The method `OSHA_APPENDIX_B` is the adequacy test of 29 CFR 1910.95 Appendix B. On C-weighted data the estimate is the level minus the NRR. On A-weighted data it is the level minus (NRR - 7). The engine measures the subtraction as 7.000000000000 dB, by taking 30 less the attenuation it gives at an NRR of 30.

## Why the seven

What the course prints is the rule and its measurement: on A-weighted data the credit is (NRR - 7), and the engine's subtraction measures 7.000000000000 dB. No printed line gives the appendix's reason for the seven, so take the rest of this section as background. The NRR is stated against C-weighted sound, and an A-weighted reading of the same sound is a different number, so subtracting the full label from an A-weighted level would mix the two weightings in one sum. The appendix allows for that with a flat seven decibels taken off the label before it is credited, a single-number allowance for a spectral effect.

## Reproduced against a printed value

The OSHA Technical Manual worked example gives 98 dBA with an NRR of 25 as 80.000000 dBA under Appendix B. That is 98 less (25 less 7), and the engine reproduces it. So this method is published and reproduced: a value a source prints is matched at the precision printed, and a shared misreading of the rule would be caught by it.

## What the estimate is for

Appendix B answers one question: does the protector bring the employee's noise exposure down far enough for the hearing conservation programme. It does not answer whether the employer may rely on protectors in place of engineering controls. That is a different question with a different derating, which the next lesson takes. The same label and the same TWA give two different estimates, and the question decides which one you quote.

## Small labels

On A-weighted data an NRR of 7 or less leaves nothing to credit. The sweep shows it: at an NRR of 7.000000 the Appendix B estimate is 97.600000 dBA, unchanged, and at 10.000000 it is 94.600000 dBA. Below seven the rule would give a negative attenuation, and the engine floors the credit at zero with a warning. The last lesson of this module reads that warning.

The door refuses a weighting it does not know:

> weighting must be 'A' or 'C'

## Exercise

From the table, compute the Appendix B estimate for the A-weighted teaching case by hand, starting from 97.600000 dBA and 27.000000 dB, and check it against 77.600000 dBA. Then do the same for the OSHA Technical Manual example, starting from 98 dBA and an NRR of 25, and check it against 80.000000 dBA. Finally, state the attenuation in each case and say which weighting each level was measured in.
