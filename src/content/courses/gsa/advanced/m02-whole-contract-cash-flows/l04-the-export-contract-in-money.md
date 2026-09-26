# The export contract in money

{{panel:gsa-ledger-calculator}}

{{panel:gsa-contract-calculator}}

This lesson puts the whole Ekene export feed agreement (synthetic) into money, from the oil index to the NPV. Every figure is a return value of the engine on the fixture's stated terms.

## The chain

The export feed's money is built in four steps, each a function the course has already run:

1. `priceSeries` prices every month from 2027-01 to 2036-12 on 0.5 + 0.12 x the oil index averaged over 6 months ending 1 month before the priced month, reset every 3 months, with the S-curve at 55 and 90 and the model agreement's four-decimal rounding.
2. Each year's contract price and take-or-pay price is the annual average of those monthly prices, the model agreement's Article 15.2.6 Alternative 1; the make-up price is 10 percent of it.
3. `takeOrPay` runs the ledger: take-or-pay 90 percent, make-up for 5 contract years after the take-or-pay quantity, carry-forward for 3 contract years capped at 50 percent of a year's deficiency, refund at the end of the term.
4. `gsaCashFlows` splits each year into its lines, charges the gas royalty at 0.050000 on the value of gas delivered and discounts at 0.1 to 2026.

## The ten years in totals

| total (engine) | value |
| --- | --- |
| regular revenue | 1,837,552,860.055000 |
| make-up revenue | 4242052.824500 |
| deficiency payment | 45129551.627500 |
| refund | 3700831.335000 |
| net to the seller | 1,883,223,633.172000 |
| NPV of the seller revenue, 0.1 to 2026 | 1,157,367,784.116539 |
| NPV of the net after royalty, 0.1 to 2026 | 1,099,781,259.486489 |

Regular gas carries the contract. The deficiency payments come from three deficiency years, and make-up revenue is small because make-up is taken at 10 percent of the price. Net to the seller is regular revenue plus make-up revenue plus deficiency payments, less the refund.

## Where the deficiency money comes from

The deficiency years are 2029, 2032 and 2035. In 2029 a train outage leaves a deficiency of 6438500.000000; the carry-forward credit of 3219250.000000, at the 50 percent cap, leaves 3219250.000000 to pay at 9.808450, a deficiency payment of 31575852.662500. The 2032 payment is 4472628.540000 and the 2035 payment 9081070.425000. The make-up opened in 2029 and 2032 is fully taken in later years; of the 2035 entry, 691800.000000 is taken in 2036 and the seller refunds the rest at the end of the term, 3700831.335000.

## Price and quantity together

The contract's money moves with both its price and its takes. 2034 has the highest regular revenue, 236145898.000000, at an annual average of 10.373200. 2029, the outage year, has the lowest, 139839071.650000, though its price of 9.808450 is higher than six of the other years; its deficiency payment recovers only part of the gap. The take-or-pay clause guarantees a quantity to be paid for. It does not guarantee a price, which the oil index sets.

## Reading the account

Every line traces to a clause: the regular line to the price formula and the take, the deficiency line to the take-or-pay percentage and the carry-forward cap, the refund to the end-of-term rule.

## Exercise

Open the ledger calculator on "Contract prices month by month" and read the ten annual rows of the export feed price; confirm each is the contract price the ledger uses. Then open the contract calculator on "The whole contract in money", which starts on the export feed. Confirm the 2029 deficiency payment from its credit and price, add the ten seller revenue rows and compare with the net to the seller above. Finally set the carry-forward capPct to 100 and state which years' lines move, and in which direction the NPV of the seller revenue moves.
