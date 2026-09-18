# The OBODO register end to end

This lesson reads three OBODO risks from levels to review dates, then the register as a whole. Every dated status in it is true on 2026-10-01.

{{panel:rc-risk-explorer}}

## OB-02, a fatigue crack in a jetty loading arm

OB-02 is "Open", so it is live. Its inherent levels are 4 by 4, which score 16, "Critical". Its residual likelihood is 2 and its residual impact is blank. The blank impact falls back to the inherent 4, so the residual is 8, "Medium". Its target is 6, and 8 is above 6: "Above appetite". Its next review is 2026-09-30, which is -1 days from the as-of date, so on 2026-10-01 its review is overdue.

Three rules decided this row: the product and lower edges for the bands, the per-axis fallback, and a live status with a passed review date.

## OB-08, a fall from height during tank inspection

OB-08 is "Open". Its inherent levels are 3 by 5, which score 15, "Critical". Its residual likelihood is 2.5 and its residual impact is 5. A fraction is off the scale and an assessed value does not fall back, so the residual is 0, "None". Its target is 5, and with a residual that cannot be scored the appetite is "Not set". Its next review is 2026-11-30, 60 days from the as-of date, so on 2026-10-01 its review is not overdue.

## OB-01, a floating roof seal failure on crude tank T-104

OB-01 is "Open". Its inherent levels are 3 by 5, which score 15, "Critical". Its residual levels are 2 and 5, which score 10, "High". Its target is 10, and a residual equal to its target is "Within appetite". Its next review is 2026-10-01, 0 days from the as-of date, so on 2026-10-01 it is due and not overdue.

OB-08 and OB-01 share their inherent levels and their inherent score. Their residual inputs differ, and so do their residuals and appetite answers.

## The register as a whole

| live risks, on 2026-10-01 | count | risks |
| --- | --- | --- |
| "Above appetite" | 3 | OB-02, OB-03, OB-05 |
| "Within appetite" | 4 | OB-01, OB-04, OB-07, OB-12 |
| "Not set" | 3 | OB-06, OB-08, OB-11 |
| review overdue | 2 | OB-02, OB-05 |

The three appetite counts add to the 10 live risks: 3 plus 4 plus 3. OB-01 is due on the as-of date itself and is not among the overdue.

## Inherent minus residual

A tempting summary is inherent minus residual, the reduction each risk's controls achieve. For the live risks, subtracting the two engine scores gives:

| risk | OB-01 | OB-02 | OB-03 | OB-04 | OB-05 | OB-06 | OB-07 | OB-08 | OB-11 | OB-12 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| inherent minus residual | 5 | 8 | 0 | 3 | 5 | 5 | 4 | 15 | 0 | 2 |

Three of those numbers describe no control at all. OB-08 shows its whole inherent score as a reduction only because its residual is unscored. OB-11 shows zero because neither of its scores exists. OB-03 shows zero because its residual has not been assessed. A subtraction over an unscored or unassessed value describes no control, so read the two scores before the difference.

## The mistake

The mistake is to present OB-08's 15 as a measure of how well its controls work. It is the size of a gap in the record. Every derived number on this register is only as sound as the rule and the inputs behind it.

## Exercise

For OB-02, OB-08 and OB-01, record the inherent score and band, the residual score and band, the appetite and the review overdue answer on 2026-10-01. Record how many live risks read "Above appetite", "Within appetite" and "Not set", and how many are review-overdue on that date. State the rule that makes OB-08's inherent minus residual meaningless.
