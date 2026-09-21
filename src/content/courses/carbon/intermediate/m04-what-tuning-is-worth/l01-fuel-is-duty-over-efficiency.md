# Fuel is duty over efficiency

Module three gave the invented Isiokpo heater two efficiencies on LHV: 86.4029 percent at its current stack oxygen of 5.5 percent and 87.8476 percent at a target of 2.8 percent. This module asks what the move from one to the other is worth in fuel. The first lesson reads the rule the engine uses to answer.

{{panel:carbon-efficiency-explorer}}

## The engine's method

SECTION 14 prints the method, verbatim: "Fuel scales inversely with efficiency at the same duty, so the saving is (target - current) / target. Subtracting the efficiency percentages divides by a hundred instead of by the target efficiency, and understates the saving."

The first sentence is the rule this lesson teaches. The second is the trap lesson two reads.

The rule starts from the duty, and the method's words hold it fixed: at the same duty. In practice, a heater's duty is the heat its process needs, and the fuel it burns to deliver that heat is the duty divided by its efficiency, which is what "scales inversely" means here.

The method then gives the saving as one ratio, (target - current) / target, with the target efficiency on the bottom. SECTION 14 adds how the ratio is used: the engine multiplies a saving fraction by the annual fuel it is given. The fraction is therefore a fraction of that annual fuel figure.

## The Isiokpo heater, tuned

SECTION 14 prints the result for the heater, with the current reading of 5.5 percent oxygen, a target of 2.8 percent, a declared minimum safe stack oxygen of 2 percent and 410000 GJ of fuel a year on LHV. The floor and the fuel figure are both invented for this course.

| output | value |
| --- | --- |
| basis | LHV |
| currentEfficiencyPercent | 86.4029 |
| targetEfficiencyPercent | 87.8476 |
| fuelSavingFraction | 0.0164448058 |
| fuelSavingPercent | 1.6445 |
| annualEnergySavedGJ | 6742.370 |

The two efficiencies are the LHV figures of SECTION 13. The saving fraction is the engine's (target - current) / target on those two efficiencies, printed to ten decimals, and the saving percent is the same figure as a percent to four. The annual saving is the fraction applied to the 410000 GJ a year, which lesson four reads.

## Reading the fraction to its printed decimals

The efficiencies print to four decimals and the fraction to ten. The fraction is the engine's own, taken from its own efficiencies, and the course quotes it as the lab prints it and does not rework it from the rounded percents. Where a lesson needs the saving, it reads fuelSavingFraction or fuelSavingPercent off the table.

## The basis is on the output

The first row of the output is basis LHV. The saving is a saving on the LHV basis because both efficiencies were on LHV, and the SECTION 14 refusal that module three's last lesson read stops a pair on mixed bases from reaching this rule at all. The 410000 GJ a year is stated on LHV too, so the fuel figure and the fraction share a basis.

## Exercise

Read the SECTION 14 output table and the engine's method sentence. Say which of the two efficiencies sits on the bottom of the engine's ratio, what the duty has to do with that choice, and what fuelSavingFraction 0.0164448058 is a fraction of.
