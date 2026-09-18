# Inherent and residual

A risk register asks two questions about every hazard. How big is the risk if nothing is done about it? And how big is it with the controls the facility actually has? The first answer is the inherent score. The second is the residual score. Both are scored by the same rule, on the same grid, with the same bands.

{{panel:rc-risk-explorer}}

## Two scores from four levels

The inherent score is the risk before any control. It is the product of the likelihood level and the impact level. The residual score is the risk with its controls in place, scored from the residual likelihood and the residual impact. So a fully assessed risk carries four levels and two scores, and each score has its own band.

Here is one risk with both residual axes assessed: an inherent likelihood of 4 and an inherent impact of 5, with a residual likelihood of 2 and a residual impact of 3.

| score | likelihood | impact | score | band |
| --- | --- | --- | --- | --- |
| inherent | 4 | 5 | 20 | "Critical" |
| residual | 2 | 3 | 6 | "Medium" |

The inherent 20 is 4 times 5. The residual 6 is 2 times 3. The controls on this risk are assessed as lowering both how likely it is and how bad it would be.

## A risk from the OBODO register

OB-01, a floating roof seal failure on crude tank T-104, is "Open". Its inherent levels are 3 and 5, which score 15, "Critical". Its residual levels are 2 and 5, which score 10, "High". Here the controls are assessed as lowering the likelihood and leaving the impact where it was. That is a common pattern: many controls make an event less likely without making it any less severe if it does happen.

## Which score the register keeps

The register stores a column called `rating`, and `rating` is the INHERENT band. It is written from the engine on every save, so it always matches the inherent levels on the record. When a list of risks shows a single rating, it is showing the inherent band, and the residual band has to be read separately.

## Which score appetite reads

Appetite, which a later lesson in this module covers, compares the RESIDUAL score with the risk's target. That makes sense: an organisation decides whether it can live with a risk as it actually stands, with its controls working. So inherent and residual answer different questions, and each has a job. The inherent score says how much depends on the controls. The residual score says what is left.

## The mistake

The mistake is to read the rating column as the current risk. On OB-01 the rating is "Critical" while the residual band is "High". Both are right, because they answer different questions. Always ask which of the two scores a figure is before you act on it.

## Exercise

Record OB-01's four levels, its inherent score and band, and its residual score and band. State which of the two the register stores as `rating`, and which of the two appetite compares with the target.
