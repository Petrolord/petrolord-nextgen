# A stated policy for every figure

{{panel:materials-register-calculator}}

A register says what is on the shelves. A policy says what to do about it: which items matter most, where one class ends and the next begins, what an order costs, when stock counts as slow. The engine behind this course decides none of that for you. Every criterion, weight, score scale, class minimum, cut-off, boundary rule, demand, cost, holding rate, rounding rule, band, write-down and cover limit is an input with no default, and a call without one is refused by name.

## The Ekene policy, as stated

The Ekene register comes with its own stated policy. It is one company's choice, written down so it can be computed and argued with.

| part of the policy | what the register states |
| --- | --- |
| criticality criteria and weights | safety 40, production 30, leadTime 20, redundancy 10 |
| score scale | scores out of 5 |
| criticality classes | V from 70, E from 44, D from 0 |
| override | a maximum score on safety places an item in class V |
| ABC cut-offs and rule | A to 80 percent of annual usage value, B to 95 percent, the rule at-or-below |
| slow-moving bands | active from 0 months, slow from 12, very slow from 24, obsolete from 36 |
| write-downs | 0, 25, 50 and 100 percent, band by band |
| excess | above 24 months of cover |

The baryte order is a stated case of its own: demand 300 a year, order cost 1800, unit cost 260, holding rate 0.22, rounded up to a multiple of 10. The register's note on the order cost, verbatim:

> order cost covers the purchase order, the marine freight booking and receiving at the Ekene shore base

That note is part of the policy too: writing down what an order cost covers lets someone else check it.

## What the engine does hold

The engine holds 12 figures of its own, and it exports them for anyone to read. One is its tie convention: two figures that agree to 12 significant digits tie. One is the sum the criticality weights must reach, 100, and one how far they may miss it. The rest are caps on the size of a call, such as 5000 items in one criticality, ABC or slow-moving call and 20 criteria in one criticality call. None of them is a cost, a weight, a cut-off or a band.

## A misspelt key is refused

The engine also refuses any input key it does not read, at every level, and names the key, its path and the keys it accepts. A key typed as `holdingrate` in an EOQ call is refused with this message, verbatim:

> holdingrate is not an accepted key; the accepted keys at the top level are annualDemand, orderCost, holdingCostPerUnitYear, unitCost, holdingRate, rounding

A key dropped in silence would leave an input unstated with nobody the wiser.

## A figure travels with its inputs

Because every figure depends on stated inputs, the course quotes each figure with them: a class with its criteria, weights and minimums; an ABC class with its cut-offs and rule; an EOQ with its costs; a quantity ordered with its rounding rule; a write-down with its band.

## Exercise

Open the register calculator and write the Ekene policy out from the controls alone. In "Criticality classes", on the Ekene start, read each criterion's id and weight, the score scale, each class and its minimum, and the override criteria. In "ABC by annual usage value", read the two cut-offs and the Boundary rule control. In "Slow-moving and obsolete stock", read every band and the Cover limit control. In "The economic order quantity", on "Baryte on the Ekene register", read its cost and rounding controls. Check your list against the table above, then change the Cover limit control from 24 to 12 and note which items the engine now reports as excess.
