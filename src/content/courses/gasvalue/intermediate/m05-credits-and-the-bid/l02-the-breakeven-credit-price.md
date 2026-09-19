# The breakeven credit price

The breakeven is the price at which the route just clears its hurdle, in closed form. creditSensitivity prints it as breakevenCreditPrice, in dollars per tonne of net abatement.

{{panel:gasvalue-route-explorer}}

## The formula the field carries

The field's own label states the rule: breakevenCreditPrice is (hurdle minus margin) over net tonnes. Three figures go in:

| input | EGBEMA CNG against diesel |
| --- | --- |
| hurdle margin, dollars a year | 24500000 |
| gross margin, dollars a year | 21008150.00 |
| net abatement, t/yr | 218032.865 |

| field | value |
| --- | --- |
| breakevenCreditPrice ((hurdle minus margin) over net tonnes) | 16.0152 |

The breakeven prints 16.0152 dollars per tonne, to four decimals. The course prints the three inputs and the result. It prints no row for the hurdle minus the margin on its own, so this lesson quotes the inputs and the breakeven and computes nothing between them.

## Closed form

The breakeven is a closed form, read from the three figures. The formula carries no typed credit price. The study typed 40, 8, 20 and 12, and the breakeven prints 16.0152, a figure that is none of the four.

The verdict quotes the same figure at a coarser precision: "Needs a credit price of 16.02 per tonne to clear the hurdle. This is a bet on the credit price." The field prints 16.0152. The verdict's sentence prints 16.02. Quote the field when the figure is asked for, and the verdict when the verdict is asked for.

## The three terms

Each term in the formula comes from the study's own figures.

**The hurdle.** At a hurdle of 20000000 the route stands alone: standsAloneWithoutCredits true, breakevenCreditPrice 0.0000, and the verdict "Clears the hurdle on its own. Credits are upside; the case stands without them." In that case the breakeven prints 0.0000.

**The margin.** The margin is the route's year from module 3, 21008150.00 for CNG. With no margin for the route, the breakeven is null and the engine says: "No margin for this route, so whether it needs credits cannot be said. Supply its price and costs."

**The net tonnes.** The net abatement is the counterfactual's answer from module 4, 218032.865 against diesel. The breakeven divides by the net tonnes. With no net abatement, the counterfactual undeclared, creditSensitivity refuses: "No net abatement to sell. Declare the counterfactual first: a credit computed from a gross flare figure is a credit that cannot be issued."

## A price that is a case input

Credit prices are case inputs; the engine ships none. The breakeven is a price the route needs, computed from the study's own figures. This course does not say whether 16.0152 is a price a market will pay. The verdict's second sentence reads: "This is a bet on the credit price."

## What the breakeven is not

The breakeven is one of three prices this module prints on the same case:

| figure | value |
| --- | --- |
| breakevenCreditPrice | 16.0152 |
| lowestTestedClearingPrice | 20 |
| the first price in the order typed that clears | 40 |

The breakeven is the price at which the route just clears. The lowest tested price that clears is reported beside it. The first price in the order typed that clears is a third figure again, and it is neither. The next lesson reads the other two.

In the panel, move the hurdle between 20000000 and 24500000 and read the breakeven and the verdict. Then clear the price on the route and read the breakeven go to null.

## Exercise

State the rule the breakeven follows, and give the three EGBEMA inputs it is built from. Quote the breakeven as the field prints it and as the verdict prints it. Then give the breakeven at a hurdle of 20000000 and quote the verdict that goes with it.
