# Insurance quoted on CIF

Marine insurance is usually quoted as a percent of CIF, and CIF includes the insurance. The premium is part of the value it is charged on. That circle is the one piece of algebra in the landed cost walk, and the engine settles it exactly.

{{panel:supply-price-explorer}}

## The closed form

Write CIF as C&F plus the insurance, and the insurance as a rate times CIF. CIF then appears on both sides. The engine solves it in one step:

CIF = (C&F + any other insurance) / (1 - the sum of the CIF rates)

"Any other insurance" is insurance quoted on a base the walk has already frozen, such as a percent of C&F, which is simply added. "The sum of the CIF rates" is every insurance rate quoted on CIF, as a fraction. One division gives the CIF that already contains its own premium.

On BADAGRY, with the course's invented insurance of 0.16 percent of CIF, C&F is 24293000.00 USD, the insurance line prints 38931.09 USD and CIF prints 24331931.09 USD. The course's invented import duty and financing rate are both quoted on that CIF.

## The same rate on the other base

The template ships the insurance line with the basis percent_of_cf. BADAGRY quotes it on CIF, as the usual marine quote does. The course prices the cargo both ways with every other invented rate unchanged:

| item | insurance on CIF | insurance on C&F |
| --- | --- | --- |
| insurance USD | 38931.09 | 38868.80 |
| CIF USD | 24331931.09 | 24331868.80 |
| import duty USD | 1399086.04 | 1399082.46 |
| landed total USD | 26513943.86 | 26513877.12 |

Read the table column by column. On C&F the insurance is a rate on a frozen base, so it is computed directly and prints 38868.80 USD. On CIF it prints 38931.09 USD. The two CIF figures follow, and because the invented duty and financing lines bite on CIF, both move with it. The duty prints 1399086.04 USD on the first CIF and 1399082.46 USD on the second. The landed totals are 26513943.86 USD and 26513877.12 USD.

One line's basis changes the value every later percentage line bites on. A reader who changes the insurance basis and checks only the insurance line has checked one row of four.

The basis in a real build-up is whatever the policy states. The template's percent_of_cf is a label on an empty line, and BADAGRY's percent_of_cif is an invented record's choice. Neither is advice about which to use.

## The limit of the formula

The denominator is one less the sum of the CIF rates. If those rates add up to 100 percent, there is no CIF that contains its own premium, and above that the formula returns a negative value. The engine refuses the call:

> REFUSED: The insurance rates on CIF add up to 100 percent or more.

The closed form divides by 1 less the sum of the CIF rates, and at 100 percent or more that divisor is zero or negative. The engine refuses there and prints no CIF.

## Two methods agreeing

The engine uses the closed form. The course's independent oracle reaches the same CIF by iterating the fixed point, guessing a CIF, charging the premium on it and repeating until it stops moving. The final module of this tier reads what that agreement proves.

## Exercise

Record C&F, the insurance line and CIF for BADAGRY with insurance on CIF, then the insurance line, CIF, the import duty and the landed total with insurance on C&F. Say what the two duty lines, read against the two CIF figures, show about how far one line's basis travels through the walk.
