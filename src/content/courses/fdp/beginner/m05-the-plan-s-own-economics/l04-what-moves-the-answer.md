# What moves the answer

The sweep moves one driver at a time by 30 percent either way, re-runs the whole case, and reports what the value did, and on the plan's own case the four drivers move it by wildly different amounts.

{{panel:ec-plan-explorer}}

## The four drivers

| driver | NPV at minus 30 percent | NPV at plus 30 percent | base NPV | swing |
| --- | --- | --- | --- | --- |
| Oil Price | 501.5628 | 3593.5679 | 2047.5653 | 3092.0051 |
| CAPEX | 2691.1526 | 1403.9781 | 2047.5653 | 1287.1745 |
| OPEX | 2209.5067 | 1885.6239 | 2047.5653 | 323.8828 |
| Production | 627.7671 | 3467.3636 | 2047.5653 | 2839.5965 |

Ranked by swing, the order is oil price, production, capex, operating cost. Oil price moves the value by 3092.0051 million USD across its range and operating cost by 323.8828, so the driver at the top of the list is worth nearly ten of the one at the bottom. Measured against the base value itself, the oil price swing is 1.510089 of it, production 1.386816, capex 0.628637 and operating cost 0.158179. The first two are each larger than the value they are moving.

## Why price beats production

Both price and production scale revenue, so a first guess is that they swing the value equally. They do not: 3092.0051 against 2839.5965. The reason is in the cost side. A barrel carries its own variable operating cost of 5.0000 USD, so 30 percent more barrels brings 30 percent more revenue and more cost with it. A dollar of price brings revenue and no cost at all. Price is therefore the stronger driver on every case where barrels cost money to lift.

## The capex bar runs backwards

More capex is less value, so the capex row reads high on the left and low on the right: 2691.1526 at minus 30 percent and 1403.9781 at plus 30 percent. Read the columns rather than the picture. A reader who assumes every bar grows to the right has the sign of the capex sensitivity backwards, and will report that overspending improves the plan. The magnitude is worth holding too: a capex overrun of 30 percent takes this case from 2047.5653 down to 1403.9781, and the whole capex swing of 1287.1745 is smaller than either of the two revenue drivers.

## The mistake

Calling the plus 30 percent case a P10 and the minus 30 percent case a P90. Those labels belong to a reserves distribution, one fluid at a time, and nothing in this sweep is a distribution. The sweep says what happens if a driver moves by 30 percent. It says nothing whatever about how likely that move is, and 30 percent on the oil price and 30 percent on the operating cost are not equally likely events. Two drivers also never move together here: each row is one driver moved alone with the other three held at the base case.

## What it refuses

The sweep will not rank the drivers by importance in the world, only by what they did to this case. It will not tell you a swing is acceptable. It carries no probabilities, no correlations and no combinations, and the base column of 2047.5653 is the same screening value in every row, conditional on the same price and the same shape as the case it came from.

## Exercise

List the four drivers in order of swing with each swing's value. Then explain, using the variable operating cost, why the oil price swing of 3092.0051 is larger than the production swing of 2839.5965, and say why neither of the two capex figures should be called a P-case.
