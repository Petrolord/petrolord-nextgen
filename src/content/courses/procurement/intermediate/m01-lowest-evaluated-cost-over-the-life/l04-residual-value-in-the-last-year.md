# Residual value in the last year

{{panel:pr-award-calculator}}

Some purchases are still worth something when the evaluated life ends. A compressor can be sold, a spare can be returned, a vessel keeps a resale value. When a bid states a residual value, the engine credits it in the last year of the life cycle, before discounting. This lesson shows the credit on two stated bids that differ in that one respect.

## Two bids, one difference

The course states two bids, R1 and R2, identical in every term: the same price, a life cycle of 3 years at a discount rate of 0.08, and annual costs of 1500 a year. R1 also states a residual value of 4000. R2 states none.

| bid | life-cycle cost | evaluated cost |
| --- | --- | --- |
| R1 | 690.316517 | 20690.316517 |
| R2 | 3865.645481 | 23865.645481 |

The difference between the two life-cycle costs is 3175.328964. That is 4000 / 1.08^3: the residual value is taken off year 3's cost and then discounted with it. The price both bids share is the evaluated cost less the life-cycle cost, the same on both rows.

## Why the last year

The residual value arrives when the asset leaves service, which is the end of the evaluated life. Crediting it in year 3 discounts it at the year 3 factor, the smallest of the three. A credit taken at the award date would be worth the full 4000 and would favour R1 far more than the timing supports. The engine's basis states the rule once for every call: "residual value credited in the last year".

Year 3 of R1 is therefore a net figure: 1500 of cost less 4000 of residual value, a credit of 2500 in that year before discounting. A year can be negative. The engine does not clip it at zero, because clipping would throw away part of the value the bidder offered.

## Where residual value belongs

A residual value is a promise about the future, and it can be inflated as easily as a maintenance cost can be understated. The engine credits whatever figure it is handed. Whether a bidder's residual value is credible is a question for the evaluation committee, and a report names the figure, its source and the year it was credited.

A residual value given as text is refused by the field it names:

> bids[0].residualValue must be a finite number when given

## Exercise

Open the award calculator on the view "Evaluated cost with a life-cycle cost". Replace the bids with two of your own called R1 and R2: copy MS1 twice, which omits nothing, and give each copy a single bill line with id price, quantity 1, unit rate 20000 and quoted amount 20000, set completionWeeks to 8 so no schedule adjustment is added, and give both annualCosts of 1500, 1500 and 1500. Add a residualValue of 4000 to R1 only, and set the years to 3 and the rate to 0.08. Check the two life-cycle costs against the table. Then move the residual value to R2 as well and explain why the two evaluated costs now tie, and which rule of the Associate tier decides their order.
