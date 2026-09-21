# A negative cost pays for itself

A cost per tonne can print below zero. The course says what that means in one line: "A negative cost per tonne means the measure pays for itself and abates carbon as a side effect." This lesson reads the six invented AGBOR measures by the sign of their cost, at the invented discount rate of 0.1, with every figure in US dollars.

{{panel:carbon-abatement-explorer}}

## Three below zero and three above

| measure | annualised capital USD | net annual cost USD | cost per tonne USD | pays for itself |
| --- | --- | --- | --- | --- |
| Tune the fired heaters | 4748.35 | -127251.65 | -167.4364 | true |
| Repair failed steam traps | 18095.17 | -179904.83 | -156.4390 | true |
| Heat integration project | 361552.89 | -48447.11 | -14.2492 | true |
| Flare gas recovery | 644221.51 | 484221.51 | 78.1002 | false |
| Solar for purchased power | 217300.31 | 96300.31 | 45.8573 | false |
| Vapour recovery on the storage tanks | 89525.62 | 65525.62 | 35.4193 | false |

Read down the table. Every row whose net annual cost carries a minus sign carries a minus sign on its cost per tonne as well, and its pays-for-itself flag is true. Every row whose net annual cost is positive is flagged false. The cost per tonne is the net annual cost over the tonnes abated a year, and the tonnes are positive, so the sign of the cost follows the sign of the net annual cost.

## A capital project can still pay

The Heat integration project carries 2750000 USD of capital, annualised at 361552.89 USD over 15 years, against 410000 USD of annual savings and an annual cost of 0. Its net annual cost is -48447.11 USD and its cost per tonne -14.2492 USD. The net annual cost is the annualised capital plus the annual cost less the savings, so the minus sign records that the savings of 410000 USD cover the annualised capital. The flag reads true.

Flare gas recovery carries 4900000 USD of capital, annualised at 644221.51 USD, with 265000 USD of annual savings and a running cost of 105000 USD. Its net annual cost is 484221.51 USD and its cost per tonne 78.1002 USD. What the recovered gas is worth as a product is the subject of the sibling course, Flare Gas to Value & LPG/CNG. Here Flare gas recovery is one measure with an invented saving.

## A negative abatement is refused

The flag is read from the sign of the cost, and the tonnes are the divisor. The lab prints the call with an abatement of -500 t a year on the Heat integration project. It is refused, and the engine says why:

REFUSED: Measure "Heat integration project" has a negative abatement. A measure that adds emissions is not an abatement, and its cost per tonne would change sign.

The refusal states two things. A measure that adds emissions is not an abatement at all, and dividing by a negative tonnage would change the sign of the cost per tonne. The course lists the refusal of a negative abatement among the rules in force.

## A zero abatement has no cost per tonne

An abatement of 0 is accepted. The lab prints what comes back: costPerTonne none, paysForItself false. There is no tonne to divide by, so the engine returns no cost per tonne, and it does not flag the measure as paying for itself. A missing cost is printed as none.

## Exercise

Read the net annual cost, the cost per tonne and the pays-for-itself flag for the Heat integration project and for Flare gas recovery. Say what the sign of each net annual cost, read against the flag beside it, shows about how the engine decides that a measure pays for itself.
