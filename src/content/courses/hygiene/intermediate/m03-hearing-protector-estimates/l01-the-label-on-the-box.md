# The label on the box

{{panel:hy-protection-chemicals}}

One protector with a label NRR of 27.000000 dB, worn against an A-weighted TWA of 97.600000 dBA, gives four different estimated levels by four named methods: 77.600000, 87.600000, 72.600000 and, for an earmuff, 84.350000 dBA. The label is one number. What it is worth depends on the question you ask of it.

| method | the question | estimated level, dBA |
| --- | --- | --- |
| OSHA_APPENDIX_B | is the protector adequate for hearing conservation | 77.600000 |
| OSHA_FIELD_50 | are engineering controls needed | 87.600000 |
| OSHA_DUAL | what do two protectors worn together give | 72.600000 |
| NIOSH_TYPE, earmuff | what does NIOSH credit this type with | 84.350000 |

## The noise reduction rating

The NRR is a single-number rating printed on the package. It is measured in a laboratory and, as background rather than as anything the digest prints, it is stated against C-weighted sound levels, while a workplace survey is usually A-weighted. What the digest does print is that the engine's Appendix B subtraction on A-weighted data measures 7.000000000000 dB. So every method starts by deciding how much of the label to credit and whether to allow for the difference between the two weightings. That is why the door `hearingProtectorEstimate` takes four things: a level, its weighting, the NRR and a method.

## Four methods, four questions

Appendix B of 29 CFR 1910.95 asks whether a protector reduces an employee's noise exposure enough for the hearing conservation programme. The OSHA Technical Manual field derating asks whether the employer must turn to engineering controls. The dual-protection rule asks what a plug and a muff together are worth. The NIOSH derating by type asks what the label is worth given how that kind of protector performs when people wear it. Each lesson in this module takes one of them.

## How strong each method's evidence is

Two methods are published and reproduced. The OSHA Technical Manual worked example gives 98 dBA with an NRR of 25 as 89.000000 dBA under the field derating and 80.000000 dBA under Appendix B, and the engine reproduces both. The NIOSH derating by type and the OSHA dual-protection 5 dB are oracle only: the engine and an independent oracle agree, and no printed value is known to set against either. Neither is ever graded in this course. They are taught so you can recognise them and say what they rest on.

## A method the door does not know

Every call names its method, and the engine refuses one it does not recognise, in its own words:

> method must be one of OSHA_APPENDIX_B, OSHA_FIELD_50, OSHA_DUAL, NIOSH_TYPE

The engine has no door for spectral, octave-band protector methods. A label NRR is the only protector input it takes.

## Exercise

Open the protection panel's protector view with the A-weighted teaching case. Record the estimated level under each of the four methods. Then state which two methods the OSHA Technical Manual worked example reproduces, and give the two levels it prints. Finally, write one sentence saying which method you would use to decide whether engineering controls are needed.
