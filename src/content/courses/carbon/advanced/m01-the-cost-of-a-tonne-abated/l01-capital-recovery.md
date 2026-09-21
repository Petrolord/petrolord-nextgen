# Capital recovery

A tonne of CO2e saved is priced over the life of the measure that saves it. The Expert tier opens with the rule that does the pricing. `carbonAbatement.abatementCost` spreads a one-off capital cost over the measure's life with a capital recovery factor, then sets the yearly figure against the tonnes the measure abates each year, here and in module five.

{{panel:carbon-abatement-explorer}}

## The factor and its two inputs

The engine computes the factor as r(1 + r)^n / ((1 + r)^n - 1), with r the discount rate and n the life in years. At a rate of 0 it is 1/n, straight line. Two inputs set the factor: the rate and the life. The capital cost is multiplied by the factor to give the annualised capital.

## The Agbor measures at a rate of 0.1

AGBOR is the course's invented gas processing and distribution complex. Every figure on its six measures is invented for this course, and the money is in US dollars. At a discount rate of 0.1, typed as a fraction, the engine prints these factors:

| measure | capital USD | life years | capital recovery factor | annualised capital USD |
| --- | --- | --- | --- | --- |
| Tune the fired heaters | 18000 | 5 | 0.26379748 | 4748.35 |
| Repair failed steam traps | 45000 | 3 | 0.40211480 | 18095.17 |
| Heat integration project | 2750000 | 15 | 0.13147378 | 361552.89 |
| Flare gas recovery | 4900000 | 15 | 0.13147378 | 644221.51 |
| Solar for purchased power | 1850000 | 20 | 0.11745962 | 217300.31 |
| Vapour recovery on the storage tanks | 610000 | 12 | 0.14676332 | 89525.62 |

Read the Heat integration project and Flare gas recovery rows together. Both carry a life of 15 years at the same rate, and both print the factor 0.13147378. Their capital costs are 2750000 and 4900000 USD, and their annualised capital is 361552.89 and 644221.51 USD. The factor comes from the rate and the life; the annualised capital comes from the factor and the measure's own capital.

## One measure worked through

Tune the fired heaters carries 18000 USD of capital, 132000 USD of annual savings, an annual cost of 0 and 760 tonnes abated a year, over a life of 5 years. The engine prints a capital recovery factor of 0.26379748, annualised capital of 4748.35 USD, a net annual cost of -127251.65 USD and a cost per tonne of -167.4364 USD.

The course states the arithmetic that joins those figures. The net annual cost is the annualised capital plus the annual cost less the annual savings. The cost per tonne is the net annual cost over the tonnes abated a year. Every figure in that chain is printed, so the chain can be read end to end without working anything out on paper.

## Precision travels with the figure

The course prints capital recovery factors to eight decimals, money to two and US dollars per tonne to four. Quote each at the precision it prints: 0.26379748, 4748.35 USD and -167.4364 USD a tonne are three different kinds of figure, and each carries its own unit.

## What the factor carries into the curve

Every cost per tonne in this tier, and every step of the curve in the next module, rests on a factor built from a rate and a life. The lab also prints the six measures at a rate of 0, and every cost per tonne in that column differs from its value at 0.1. Lesson four reads that column. The next two lessons take the sign of the cost and the blank box.

## Exercise

Read the life, the capital recovery factor, the capital cost and the annualised capital for the Heat integration project and for Flare gas recovery. Say what the two rows, read together, show about which inputs set the factor and which input sets the annualised capital.
