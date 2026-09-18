# Falling back one axis at a time

Residual levels are not always assessed together. An assessor may know how a control changes the likelihood of an event before anyone has judged its effect on the impact. The engine needs a rule for a residual that is only half filled in, and the rule it uses works one axis at a time.

{{panel:rc-risk-explorer}}

## The rule

A residual axis that has not been assessed FALLS BACK to the inherent level on that axis alone. Null, an absent key and a blank form field all mean "not assessed". So a missing residual likelihood is read as the inherent likelihood, and a missing residual impact is read as the inherent impact, and each decision is made separately.

## The probes

Every row below is the same risk, with an inherent likelihood of 4 and an inherent impact of 5, which scores 20, "Critical". Only the residual inputs change.

| residual probe | residual likelihood given | residual impact given | residual score | residual band |
| --- | --- | --- | --- | --- |
| both residual axes assessed | 2 | 3 | 6 | "Medium" |
| neither residual axis assessed | null | null | 20 | "Critical" |
| residual likelihood only, impact left blank | 2 | "" | 10 | "High" |
| residual impact only, likelihood left blank | "" | 3 | 12 | "High" |
| both residual axes left blank | "" | "" | 20 | "Critical" |

## Working each row

With both axes assessed the residual is 2 times 3, which is 6, "Medium".

With the impact left blank, the residual likelihood of 2 is used and the blank impact falls back to the inherent impact of 5. The residual is 2 times 5, which is 10, "High".

With the likelihood left blank, the blank likelihood falls back to the inherent 4 and the residual impact of 3 is used. The residual is 4 times 3, which is 12, "High".

With both left blank, or both null, each axis falls back to its inherent level. The residual is 4 times 5, which is 20, "Critical", the same as the inherent score. That is the honest reading: a risk whose controls have not been assessed at all is carried at its inherent level.

## Why one axis at a time

A blank on one axis says nothing about the other. If the assessor has recorded a residual likelihood of 2, that judgement is on the record and should be used. Falling back on the blank axis alone keeps every assessed level and fills only the gap. The result is conservative on the unassessed axis, because it assumes the control does nothing there until somebody says otherwise.

## On the OBODO register

OB-02, a fatigue crack in a jetty loading arm, is "Open" with inherent levels of 4 and 4, which score 16, "Critical". Its residual likelihood is 2 and its residual impact is blank. The blank impact falls back to the inherent 4, so the residual is 2 times 4, which is 8, "Medium".

OB-03 is "Under Review" with inherent levels of 5 and 4, which score 20, "Critical". Both of its residual axes are null. Both fall back, and its residual is 20, "Critical".

## The mistake

The mistake is to read a blank residual axis as a zero. A zero would make the whole residual unscored and hide a risk that has only been half assessed. The engine reads a blank as "not assessed" and uses the inherent level on that axis.

## Exercise

For a risk with inherent likelihood 4 and impact 5, record the residual score and band when the residual likelihood is 2 and the impact is blank, and when the likelihood is blank and the impact is 3. Record OB-02's residual score and band. State the rule that produced each one.
