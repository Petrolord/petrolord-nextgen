# The field derating for engineering controls

{{panel:hy-protection-chemicals}}

The OSHA Technical Manual worked example gives 98 dBA with an NRR of 25 as 89.000000 dBA under the field derating and 80.000000 dBA under Appendix B. Same protector, same noise exposure, two answers to two questions. On this tier's teaching case, 97.600000 dBA with an NRR of 27.000000 dB, the field derating gives 87.600000 dBA and Appendix B gives 77.600000 dBA.

| NRR, dB | Appendix B, dBA | field derating, dBA |
| --- | --- | --- |
| 10.000000 | 94.600000 | 96.100000 |
| 20.000000 | 84.600000 | 91.100000 |
| 27.000000 | 77.600000 | 87.600000 |
| 30.000000 | 74.600000 | 86.100000 |

## The rule

The method `OSHA_FIELD_50` is the OSHA Technical Manual Appendix E field derating. It applies to A-weighted data only. The estimate is the level minus (NRR - 7) x 50 percent. The engine measures the fraction as 0.500000000000 by dividing the attenuation by (NRR less 7) at an NRR of 27. On the teaching case that is 27 less 7, halved, an attenuation of 10.000000 dB.

## Why a second derating

Laboratory ratings are measured on fitted protectors under ideal conditions. In the field, protectors are worn loosely, removed for part of the shift, or worn with glasses or hair under the seal. The manual halves the credit when the question is whether the employer may lean on protectors instead of reducing the sound at source. It is a deliberate conservatism aimed at one decision: engineering controls come first, and a protector is credited only with what it reliably delivers.

## Reading the two columns together

At every NRR in the table the field derating estimate sits above the Appendix B estimate, because it credits half the attenuation. The gap widens as the NRR rises, as the rows at 10.000000 and 30.000000 dB show, because every decibel added to the label adds one decibel of credit under Appendix B and only half a decibel under the field derating. A high label is worth much less under the field derating than it looks. That is the property that decides engineering control questions in practice, and it is why the two estimates must never be quoted as one.

## C-weighted data is refused

The source publishes the field derating for A-weighted noise exposures only, so the engine refuses a C-weighted level for this method rather than invent a rule the manual never wrote. The judgement call J5 covers it, and the refusal on field `weighting` reads:

> the OSHA 50 percent field derating is published for A-weighted exposures only

## The evidence, and what to write

This method is published and reproduced. The OSHA Technical Manual prints 89.000000 dBA for its own worked example, and the engine returns 89.000000 dBA. A misreading of the fraction or of the seven would miss that printed value, which is what makes the evidence for this method strong.

In a report, name the method beside the number. "Estimated 87.600000 dBA under the OSHA field derating, for the engineering controls question" is a finding. "Protected level 87.600000 dBA" is not, because the reader cannot tell which question it answers.

## Exercise

Open the protection panel's protector view and set the A-weighted teaching case. Record the field derating and Appendix B estimates at NRR values of 20.000000 and 30.000000 dB. For each NRR, state the gap between the two estimates using the printed figures. Then work the OSHA Technical Manual example by hand, 98 dBA with an NRR of 25, and check your answer against 89.000000 dBA.
