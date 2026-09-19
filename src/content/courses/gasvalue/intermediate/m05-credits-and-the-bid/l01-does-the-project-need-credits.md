# Does the project need credits

creditSensitivity answers one question from the studio's question table: does the project need carbon credits to clear its hurdle. It reads a route's gross margin, a hurdle margin the study types, and the route's net abatement.

{{panel:gasvalue-route-explorer}}

## The case

The case is EGBEMA's CNG route against the diesel counterfactual:

| input | value |
| --- | --- |
| net abatement, t/yr | 218032.865 |
| gross margin, dollars a year | 21008150.00 |
| hurdle margin, dollars a year | 24500000 |
| credit prices typed, dollars per tonne, in this order | 40, 8, 20, 12 |

The net abatement is the one lesson 4 of module 4 read on the diesel row. The gross margin is the CNG route's year from module 3. The hurdle margin is the study's input. Credit prices are case inputs; the engine ships none. Every one of these figures is invented and illustrative.

## The answer

| field | value |
| --- | --- |
| standsAloneWithoutCredits | false |
| breakevenCreditPrice ((hurdle minus margin) over net tonnes) | 16.0152 |
| lowestTestedClearingPrice | 20 |
| the first price in the order typed that clears | 40 |
| verdict | Needs a credit price of 16.02 per tonne to clear the hurdle. This is a bet on the credit price. |

standsAloneWithoutCredits reads false: at a gross margin of 21008150.00 and a hurdle of 24500000, the route does not clear on its own. The verdict names the price it needs and closes on a sentence of its own: "This is a bet on the credit price."

The four prices typed each print a clearsHurdle. creditRevenuePerYear is the credit price times the net abatement in tonnes; totalMarginPerYear is the route's gross margin plus that; a point clears when its total margin reaches the hurdle. At 40 it reads true, at 8 false, at 20 true and at 12 false. Two of the four typed prices clear the hurdle and two do not.

| credit price (input, in the order typed) | creditRevenuePerYear | totalMarginPerYear | clearsHurdle |
| --- | --- | --- | --- |
| 40 | 8721314.60 | 29729464.60 | true |
| 8 | 1744262.92 | 22752412.92 | false |
| 20 | 4360657.30 | 25368807.30 | true |
| 12 | 2616394.38 | 23624544.38 | false |

Credit prices sit with the methane GWP among the stated limits of the Associate tier: the methane GWP and any credit price are case inputs; the engine ships neither. This course never tells a study what a credit will sell for.

The next two lessons read the breakeven and the lowest tested price that clears. This lesson reads the question and the two verdicts the engine gives.

## A route that stands alone

At a hurdle of 20000000 the same route stands alone:

| field | value |
| --- | --- |
| standsAloneWithoutCredits | true |
| breakevenCreditPrice | 0.0000 |
| verdict | Clears the hurdle on its own. Credits are upside; the case stands without them. |

The gross margin is the same 21008150.00. Only the hurdle changed. The breakeven prints 0.0000, and the verdict reads: "Clears the hurdle on its own. Credits are upside; the case stands without them."

## Two verdicts, one question

The two verdicts answer the same question with the same margin and the same net abatement. They differ in the hurdle the study typed: 24500000 in the first case and 20000000 in the second. The hurdle is the study's figure, and this course does not set it.

The hurdle is a margin in dollars a year, set beside the gross margin in dollars a year. The route's cash flow is handed to the sanctioned economics engine undiscounted, and flareToValue's valuation note reads: "A second discounted cash flow in this module would be a second answer." The breakeven credit price is this module's figure. A discounted figure is the economics engine's.

## Where the question cannot be answered

creditSensitivity answers with no verdict when it lacks a margin or a hurdle:

| probe | engine |
| --- | --- |
| no margin for the route (price missing) | answers with no verdict: breakevenCreditPrice null; "No margin for this route, so whether it needs credits cannot be said. Supply its price and costs." |
| hurdle left blank ('') | answers with no verdict: breakevenCreditPrice null; "No hurdle margin, so whether it needs credits cannot be said." |

Lesson 4 of this module reads what it refuses outright.

In the panel, type the hurdle at 24500000 and then at 20000000, and read standsAloneWithoutCredits, the breakeven and the verdict each time.

## Exercise

Read both cases. Give standsAloneWithoutCredits, the breakeven credit price and the verdict for each, and say which input differs between the two. Then quote what creditSensitivity answers when the hurdle is left blank.
