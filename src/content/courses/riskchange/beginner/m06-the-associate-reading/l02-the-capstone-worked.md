# The capstone worked

The Associate capstone hands you a risk register you have not seen. It rewards running this tier's rules in the same order on new rows. This lesson sets out that order and works it on OBODO rows, so that the method is what you carry into the capstone.

{{panel:rc-risk-explorer}}

## Step one: write down the as-of date

Before you read a single row, write the as-of date at the top of your working. Every dated answer you give is true on that date. A status you cannot date is a status nobody can check.

## Step two: score the inherent levels

For each risk, check both levels are whole levels from 1 to 5; a whole number written as text still counts. A fraction, a 6, a blank or a negative is off the scale: inherent score 0, "None". Otherwise multiply, then find the band by its lower edge: 15 "Critical", 10 "High", 5 "Medium", 1 "Low". OB-05 has levels 2 and 5, a product of 10, "High".

## Step three: score the residual one axis at a time

Look at each residual axis separately. A blank, a null or a missing value has not been assessed and falls back to the inherent level on that axis alone. An assessed value off the scale does not fall back, and it leaves the residual unscored. OB-02 has a residual likelihood of 2 and a blank impact, so its residual is 2 times its inherent impact of 4, which is 8, "Medium". OB-08 has a residual likelihood of 2.5, so its residual is 0, "None".

For every residual, say which axis fell back, or why none could.

## Step four: read appetite against the target

Compare the residual score with the risk's own target. Below or equal is "Within appetite". Above is "Above appetite". No target, a target of zero or an unscored residual is "Not set". OB-12 has a residual of 3 and a target of 3, "Within appetite".

## Step five: read the status, then the date

Ask whether the risk is live: "Open", "Under Review", "Mitigated" or "Realized". Only a live risk can be review-overdue, and only when its days until is below zero. A review due on the as-of date is not overdue. OB-05 is "Open" with its review on 2026-09-15, -16 days from 2026-10-01, so it is overdue on that date.

## Step six: name the population before you count

When a question asks for a band count, decide from its wording which risks it means, every risk or live risks, and which score, inherent or residual. On OBODO those choices give Critical counts of 5, 1, 4 and 1. Write the population beside your count.

## What not to do

Do not reuse an OBODO number because a capstone row looks similar. OB-01 and OB-08 share their inherent levels inside one register and differ in their residual and appetite answers. And do not round a fraction to rescue a band.

## Exercise

Choose OB-03 and work all six steps on it: the as-of date, the inherent score and band, the residual with the axis that fell back, the appetite, the review overdue answer on 2026-10-01, and the populations of the band count in which OB-03 is counted as "Critical". Name the rule at each step.
