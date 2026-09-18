# A blank and an off-scale level

Two residual inputs can look equally incomplete on a form: an empty field and a value that does not belong on the scale. The engine treats them in opposite ways, and the difference decides whether a risk keeps a residual score at all.

{{panel:rc-risk-explorer}}

## Two kinds of missing

A blank residual axis has not been assessed. Null, an absent key and a blank form field all mean "not assessed", and an axis that has not been assessed falls back to the inherent level on that axis alone.

A residual axis that WAS assessed with a value off the scale does not fall back. It leaves the residual unscored. Somebody wrote a value into the field. The engine cannot read it as a level, and it will not replace a value somebody chose with a level they did not choose.

## The probes

The same risk as before: inherent likelihood 4, inherent impact 5.

| residual probe | residual likelihood given | residual impact given | residual score | residual band |
| --- | --- | --- | --- | --- |
| residual impact only, likelihood left blank | "" | 3 | 12 | "High" |
| a residual likelihood of 2.5 | 2.5 | 3 | 0 | "None" |
| a residual likelihood of 7 | 7 | 3 | 0 | "None" |

The first row falls back: the blank likelihood becomes the inherent 4, and 4 times 3 is 12, "High". The other two rows carry an assessed value that is off the scale. A likelihood of 2.5 is a fraction, and a likelihood of 7 is above the top level of 5. Neither falls back. The residual score is 0 and the band is "None", the one band that means no score.

## Why the rule is built this way

A blank means nobody has looked yet, so the inherent level is a fair stand-in until they do. An off-scale value means somebody did look and wrote down something the scale cannot hold. Falling back to the inherent level would throw that person's judgement away without telling anyone. Leaving the residual unscored keeps the problem visible on the record, where the person who owns the risk can see it and correct it to a whole level.

## On the OBODO register

OB-08, a fall from height during tank inspection, is "Open". Its inherent levels are 3 and 5, which score 15, "Critical". Its residual likelihood is 2.5 and its residual impact is 5. The residual is 0, "None". Its target is 5, and its appetite reads "Not set", because a residual that cannot be scored gives the engine no basis for an appetite answer.

OB-08 also shows why a subtraction over an unscored value misleads. Inherent minus residual on OB-08 is 15, its whole inherent score. That number describes no control at all. It appears only because the residual is unscored.

## The mistake

The mistake is to assume the engine will round 2.5 to a level, or cap 7 at 5, so that the risk still gets a residual band. It does neither. A fraction and a value above the scale leave the residual unscored, and the fix belongs on the record.

## Exercise

For a risk with inherent likelihood 4 and impact 5, record the residual score and band when the residual likelihood is blank with impact 3, when it is 2.5 with impact 3, and when it is 7 with impact 3. Record OB-08's residual score, residual band and appetite, and state the rule behind each answer.
