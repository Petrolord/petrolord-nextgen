# Three lots from a trade magazine

{{panel:materials-register-calculator}}

A formula earns trust when it reproduces figures someone else printed. Harris printed three worked lots in his 1913 article, and a lecture of the MIT logistics course cited earlier prints a fourth check. This lesson runs all four through the engine, sets each printed figure beside the engine's, and shows how the course reads the difference.

## Harris's three lots

The course reads each of Harris's examples as an annual demand of 12 times his monthly movement, an order cost equal to his set-up cost, his unit cost, and a holding rate of 0.1 for his ten per cent a year.

| example | annual demand | order cost | unit cost | holding rate | EOQ (engine) | Harris prints |
| --- | --- | --- | --- | --- | --- | --- |
| his first example | 12000 | 2 | 0.1 | 0.1 | 2190.890230 | 2,190 |
| the connector of his Figure II | 14760 | 2.15 | 0.0135 | 0.1 | 6856.626965 | 6,850 |
| the stud of his Figure III | 360 | 1.85 | 5.65 | 0.1 | 48.554321 | 48.5 |

His first example is a movement of 1,000 units a month, a set-up cost of two dollars and a unit cost of ten cents, and he states the result plainly:

> "Applying the formula, it is found that the theoretical economical size of lot is 2,190 units." (Harris (1913), Factory 10(2), read in the 1990 reprint p. 948)

## Printed short of the formula

In all three cases Harris prints a figure a little short of the formula's: 2,190 for 2190.890230, 6,850 for 6856.626965 and 48.5 for 48.554321. The course keeps both figures in view: the engine's EOQ, to six decimals, and Harris's print, as printed. Printed alike is one thing and equal is another, and here the gap is small and in one direction.

## The stud, rounded in words

For the stud, Harris goes one step further and states a rounding rule in words:

> "The correct quantity is 48.5 or, say, 49." (Harris (1913), Factory 10(2), read in the 1990 reprint p. 949)

"Or, say, 49" is a rounding to the nearest whole unit. State that rule to the engine, the nearest multiple of 1, and the stud is ordered as 49.000000. The engine's reason, verbatim:

> EOQ = sqrt(2 x 1.85 x 360 / 0.565) = 48.554321; ordered as 49 (the nearest multiple of 1 (halves upward)), a relevant cost of 27.43 a year against 27.43 at the EOQ

The two costs agree to the cent: the flat bottom that module 5 explores.

## A check from a lecture

Lecture 8 slide 9 of the MIT course states an order cost of 500, a demand of 2000 a year, a holding rate of 0.25 and a unit cost of 50, and prints an order size of 400, an ordering cost of 2,500, a holding cost of 2,500 and a total of 5,000. The engine returns an EOQ of 400.000000, an ordering cost of 2500.000000, a holding cost of 2500.000000 and a relevant cost of 5000.000000. Here print and engine agree exactly.

## Exercise

Open the register calculator in "The economic order quantity". Start from "Harris 1913, his first lot" and read the EOQ; set the Rounding rule control to down and the Rounding multiple control to 10, and see whether the quantity ordered matches his 2,190. Start from "Harris 1913, the stud to the nearest whole number" and copy the reason. Then start from "Lecture 8 slide 9 of the ESD.260J check" and confirm that the ordering and holding costs are equal. Last, type the connector's four inputs into the blank case, with the rounding rule none, and check its EOQ against the table.
