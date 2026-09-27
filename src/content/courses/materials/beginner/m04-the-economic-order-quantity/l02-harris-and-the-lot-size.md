# Harris and the lot size

{{panel:materials-register-calculator}}

The economic order quantity is more than a century old. F. W. Harris set it out in February 1913 in a short article in Factory, The Magazine of Management, titled "How Many Parts to Make at Once". He wrote about parts made in one set-up; the arithmetic is the same for a store buying in one order. His 1913 words are in the public domain, and the course read them in the reprint in Operations Research 38(6), 1990, pp. 947-950.

## His formula, in his words

Harris writes the lot size that keeps the combined set-up and carrying cost lowest as a square root. His letters are M for the monthly movement (how many parts are used a month), S for the set-up cost, and C for the unit cost. In his words:

> "the value for X that will give the minimum value to Y, reduces to the square root of (240MS divided by C)." (Harris (1913), Factory 10(2), read in the 1990 reprint p. 948)

The 240 is not a mystery. It folds together the twelve months of a year and his allowance of ten per cent a year for interest and depreciation. Written with an annual demand in place of a monthly one and a holding rate in place of the ten per cent, it is the same formula the engine applies, which the next lesson writes out.

## How the course reads his figures

The course reads his inputs as an annual demand of 12 times M, an order cost of S, a unit cost of C and a holding rate of 0.1. Nothing else is assumed. The engine's basis for every EOQ names him first, verbatim:

`Harris (1913), How Many Parts to Make at Once, Factory 10(2) pp. 135-136, 152; Caplice, MIT ESD.260J (2006) lecture 7 and lecture 8 slide 3`

## The square root has a consequence

A lot that grows with the square root of demand grows slowly. Harris saw the practical point and printed it:

> "it is of value to know that this consumption must increase four fold to warrant doubling the manufacturing quantities." (Harris (1913), Factory 10(2), read in the 1990 reprint p. 950)

The Ekene baryte shows it. At a demand of 300 tonnes a year its EOQ is 137.408584. Change only the demand, to 1200, four times over, and the EOQ is 274.817167: exactly twice as large. A store whose demand doubles needs lots about four tenths larger, and places more orders.

## Why this still matters

Harris showed that once an order cost, a demand and a holding cost are written down, the best lot size is a calculation. A lot picked by habit is a cost decision made without seeing it.

## Exercise

Open the register calculator in "The economic order quantity" and start from "Baryte on the Ekene register". Set the Rounding rule control to none, so the quantity ordered is the EOQ itself, and note the EOQ. Change the Annual demand control to 1200 and check that the EOQ doubles. Predict the EOQ when the demand is sixteen times the stated figure, then test your prediction in the panel. Last, restore the demand and halve the Holding rate control: by what factor does the EOQ change, and why?
