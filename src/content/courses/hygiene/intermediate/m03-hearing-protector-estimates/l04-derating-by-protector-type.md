# Derating by protector type

{{panel:hy-protection-chemicals}}

A label NRR of 27.000000 dB is credited as 20.250000 dB for an earmuff, 13.500000 dB for a formable earplug and 8.100000 dB for any other earplug under the NIOSH derating by type. On the A-weighted teaching case of 97.600000 dBA the earmuff estimate is 84.350000 dBA and the formable earplug estimate 91.100000 dBA. This method is oracle only, and it is never graded.

| protector type | derating | credited NRR, dB | attenuation, A-weighted, dB | estimate, C-weighted, dBA |
| --- | --- | --- | --- | --- |
| earmuff | 0.750000000000 | 20.250000 | 13.250000 | 82.950000 |
| formableEarplug | 0.500000000000 | 13.500000 | 6.500000 | 89.700000 |
| otherEarplug | 0.300000000000 | 8.100000 | 1.100000 | 95.100000 |

## The rule

The method `NIOSH_TYPE` first derates the label by protector type, then applies the Appendix B subtraction: minus 7 if the level is A-weighted, and nothing further if it is C-weighted. The engine measures each derating by crediting an NRR of 40 on C-weighted data: 0.750000000000 for earmuffs, 0.500000000000 for formable earplugs and 0.300000000000 for other earplugs. The C-weighted teaching level of 103.200000 dBC less the earmuff's credited 20.250000 dB gives 82.950000 dBA.

## What the derating expresses

The three factors say that a protector type delivers a fraction of its label in use, and that the fraction depends on the type. Earmuffs keep three quarters of their rating. Formable earplugs keep half. Other earplugs keep less than a third. The ordering is the point: the same printed label is worth a different amount on a different kind of protector. The derating is NIOSH's recommendation for how to read a label, and it answers a question about the protector itself, whatever regulation the site reports under.

## How strong the evidence is

The engine and an independent oracle agree on every row above, and no printed value is known to set against either. That is the evidence class this course calls oracle only. The oracle is written independently, so its agreement is a real check on the arithmetic, and what is missing is any published figure to set against the two of them. An answer that nothing outside the code checks is not graded on evidence, so the NIOSH derating by type is taught here and never graded. The separate class where two readers copy one page wrongly and nothing catches it is transcription only, which this course reserves for the heat stress constants. The estimates in the table are the engine's arithmetic on the factors it holds, and you should report them that way.

## What the table does show

Read the A-weighted attenuation column against the label. An otherEarplug labelled NRR 27.000000 dB is credited with 8.100000 dB, and after the seven the attenuation is 1.100000 dB, barely a decibel off a sound level of 97.600000 dBA. The label suggests a large reduction and the type derating suggests almost none. Whatever evidence class the factors carry, that spread is the reason a hygienist asks what kind of protector is in use before crediting any number printed on a box.

The method needs the type, and refuses without it:

> protectorType must be one of earmuff, formableEarplug, otherEarplug for the NIOSH method

## Exercise

Open the protection panel's protector view with the A-weighted teaching case and select the NIOSH method. Record the credited NRR and the estimated level for each of the three protector types. Then compute the earmuff estimate by hand from 97.600000 dBA, the derating 0.750000000000 and the label 27.000000 dB, and check it against 84.350000 dBA. Finally, state the evidence class of this method and say whether any figure it produces is graded.
