# When there is no answer

Appetite has a third answer, and it is the one that is easiest to misread. "Not set" is the engine declining to report a pass or a fail because it has nothing to compare.

{{panel:rc-risk-explorer}}

## Three ways to reach "Not set"

| appetite probe | residual score | target | appetite |
| --- | --- | --- | --- |
| no target set | 6 | null | "Not set" |
| a target of zero | 6 | 0 | "Not set" |
| a residual that cannot be scored | 0 | 8 | "Not set" |

With no target, or a target of zero, or a residual that cannot be scored, the answer is "Not set". The engine declines to report a pass it has no basis for.

The first two rows are missing the target side of the comparison. A target of null means nobody has set one. A target of zero reads the same way. The third row is missing the other side: the residual is 0, the score that means the residual could not be scored.

## On the OBODO register

Three live risks on the OBODO register read "Not set", and each gets there by a different route.

| risk | residual | residual band | target | appetite |
| --- | --- | --- | --- | --- |
| OB-06 | 4 | "Low" | null | "Not set" |
| OB-08 | 0 | "None" | 5 | "Not set" |
| OB-11 | 0 | "None" | 6 | "Not set" |

OB-06 has a perfectly good residual of 4, "Low", and no target. It could well be acceptable, and the engine will not say so, because nobody has decided what acceptable means for this hazard.

OB-08 has a target of 5, and its residual likelihood of 2.5 is off the scale, so its residual is unscored.

OB-11 has a target of 6, and its inherent impact of 6 is off the scale. Its inherent score is 0, "None". Neither of its residual axes is assessed, and its residual is 0, "None", as well. Neither of its scores exists.

## Why declining is the right answer

It would be easy to count OB-06 as within appetite, since a residual of 4 is small. That would be the engine inventing a target. It would be just as easy to count OB-08 as above appetite, since its inherent score is 15. That would be the engine inventing a residual. Either guess would move a risk into a count where it does not belong. "Not set" keeps it out of both counts and says exactly what is missing.

## What to do with a "Not set"

Each route has its own fix on the record. OB-06 needs a target. OB-08 needs a residual likelihood that is a whole level from 1 to 5. OB-11 needs an impact on the scale. Until those are fixed, each of these risks sits outside every appetite count, and a register report should list them by name so they are seen.

## The mistake

The mistake is to treat "Not set" as a neutral middle answer between pass and fail. It is a gap in the record, and the gap is different for each risk that shows it.

## Exercise

Record the appetite answer for a residual of 6 with no target, with a target of 0, and for a residual of 0 against a target of 8. For OB-06, OB-08 and OB-11, record the residual, the target and the appetite, and state which side of the comparison is missing for each.
