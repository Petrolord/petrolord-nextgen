# The additive index

{{panel:hy-protection-chemicals}}

The teaching mixture is toluene at 72.500000 ppm, xylene at 31.200000 ppm and acetone at 385.000000 ppm. Each is under its own limit, and the largest single term is 0.385000. The mixture index is 1.059500, and the mixture exceeds.

| substance | concentration, ppm | limit, ppm | term |
| --- | --- | --- | --- |
| toluene | 72.500000 | 200.000000 | 0.362500 |
| xylene | 31.200000 | 100.000000 | 0.312000 |
| acetone | 385.000000 | 1000.000000 | 0.385000 |

## The rule

29 CFR 1910.1000(d)(2) sets the index for a mixture as the sum of each component's concentration over its own limit: E_m = C_1/L_1 + C_2/L_2 + ... + C_n/L_n. The regulation says the index "shall not exceed unity". The door is `mixtureExposureIndex`, and it takes components of concentration and limit and returns each term, the index, and whether it exceeds 1.

## Every term under one, the sum over

Read the term column. Toluene uses 0.362500 of its limit, xylene 0.312000 and acetone 0.385000. No single substance is anywhere near its own limit, and a report that checked each one alone would find nothing. Added together, the three terms reach 1.059500. The index treats the three solvents as one combined chemical exposure acting on the body the same way, and on that reading the mixture has used more than its whole allowance.

That is the point of the index. It exists for mixtures where several substances each look acceptable and together are not. It also changes how you read a survey sheet: a column of concentrations each checked against its own limit is half the analysis, and the sum of the terms is the other half. Whether the sum is the right model at all is the question the last lesson of this module takes.

## The limits are inputs

The limits in the table are public OSHA values, typed into the engine as inputs. The engine embeds no limit table and never looks one up. This course types only public OSHA or NIOSH values and never quotes a licensed limit. Whatever limits you use, the index is only as good as them: change a limit and every term that divides by it changes with it.

## Keep the units together

Each term is a ratio, so the concentration and its limit must be in the same unit. This course uses ppm for both. A term built from a concentration in one unit and a limit in another is a wrong number that looks like a right one, and nothing in the arithmetic will warn you.

## Exercise

From the table, compute each term by dividing the concentration by its limit, and check the three against 0.362500, 0.312000 and 0.385000. Add them and check the sum against 1.059500. Then name the component with the largest term and state whether any single component exceeds its own limit.
