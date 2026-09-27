# The equivalent working interest

{{panel:farmout-earning-calculator}}

A deal with a promote, a bonus and a reimbursement is hard to compare with another deal on its terms alone. The engine turns the farminee's whole outlay into one figure: the heads-up working interest that would cost the farminee the same money. This course calls it the equivalent working interest, and it sets a ratio beside it.

## The rule

The engine states it in the basis of every earning result:

> equivalent working interest = (farminee pays + cash bonus + past-cost reimbursement) / gross cost of the completed events x 100: the heads-up interest that would cost the farminee the same; promote-adjusted ratio = that / the vested interest

The numerator is the farminee's outlay: its well payment, the bonus and the reimbursement. Dividing by the gross cost of the completed events turns that money into a percentage of the well. Dividing the result by the participating interest vested gives the promote-adjusted ratio.

## The worked cases

| worked case | farminee pays | cash bonus | reimbursement | farminee outlay | equivalent working interest | promote-adjusted ratio |
| --- | --- | --- | --- | --- | --- | --- |
| earn-ekene-single | 18200000.000000 | 2000000.000000 | 3600000.000000 | 23800000.000000 | 51.739130 | 1.724638 |
| earn-bonus-and-reimbursement | 16000000.000000 | 1500000.000000 | 2700000.000000 | 20200000.000000 | 50.500000 | 1.683333 |
| earn-cap-gross-below | 16000000.000000 | 0.000000 | 0.000000 | 16000000.000000 | 40.000000 | 1.333333 |
| earn-heads-up | 12000000.000000 | 0.000000 | 0.000000 | 12000000.000000 | 30.000000 | 1.000000 |

## Reading the Ekene figure

FIN's outlay is 23800000.000000: the well payment of 18200000.000000 plus the bonus and the reimbursement. Paid as a heads-up share of the 46000000.000000 well, that money would buy 51.739130 percent. FIN actually vests 30.000000 percent, so the promote-adjusted ratio is 1.724638.

Compare it with the plain promote ratio of the same deal, 1.333333, and with the share of the gross cost FIN pays, 39.565217 percent. The promote ratio looks at the well terms alone. The equivalent working interest adds the cash, so it shows the whole price.

## When the cash is zero

On `earn-cap-gross-below` there is no bonus and no reimbursement. The equivalent working interest is 40.000000, the share of the gross cost FIN pays, and the promote-adjusted ratio is 1.333333, the plain promote ratio. On the heads-up deal both collapse further: 30.000000 and 1.000000. The more cash a deal carries, the further the equivalent working interest moves above the share paid.

## What it is, and what it is not

The equivalent working interest is arithmetic on stated terms. It says what share of the well the farminee's money would buy heads up. It is no market price, no value and no forecast of what another party would pay. The Expert tier prices a participating interest with a separate engine function, on a stated value basis.

## Only completed events

The denominator is the gross cost of the completed events, so the figure exists only once an event is done. On a case with nothing completed there is no gross cost to divide by, and the tile reads accordingly.

## Exercise

Open the earning calculator, the course's own calculator panel, in the view "The earning obligation, the promote and the consideration", and start from "A cash bonus and a reimbursement". Read the "Farminee outlay", "Equivalent working interest" and "Promote-adjusted ratio" tiles and check them against the table above. Then set the "Cash bonus (stated, 0 for none)" control to 0 and the "Past costs reimbursed, percent (stated)" control to 0, run it, and compare the new equivalent working interest with the share of the gross cost the farminee pays.
