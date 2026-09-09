# The same field on two bases

Real and nominal are two ways to write one ledger. They agree on the value and disagree on the total, and a reader has to know which figure is which.

{{panel:ec-time-explorer}}

## What agrees

On AKATA with end-year discounting the nominal basis and the real basis give the same NPV, 72534830.66 USD, and the same discounted cash flow in every row: minus 121123680.00 in 2029, 28860006.55 in 2030, 53279541.38 in 2031, 40540595.37 in 2032, 30649858.46 in 2033, 23167486.48 in 2034 and 17161022.43 in 2035. The IRR is 29.2361 percent on both. The discounted payback is 3.961607 years on both.

That agreement is the Fisher relation at work, and it is exact. The nominal route discounts 44874457.77 at 10.000000 percent; the real route deflates it to 39870374.51 and discounts at 6.796117 percent; both land on 30649858.46.

## What disagrees

| figure | nominal basis | real basis |
| --- | --- | --- |
| applied rate, percent | 10.000000 | 6.796117 |
| total net cash flow | 141637829.18 | 117362408.71 |
| NPV, end_year | 72534830.66 | 72534830.66 |
| NPV, mid_year | 69159247.46 | 70188970.32 |

The undiscounted total is the number that changes. 141637829.18 is the cash that will pass through the account, in the money of each year it arrives. 117362408.71 is the same cash restated in 2029 purchasing power. The second is smaller by exactly the deflation, and neither is wrong. The NPV profile is built on whichever column the basis selects, which is why AKATA's profile starts at 117362408.71 at 0 percent rather than at 141637829.18.

The mid-year row is the one exception to agreement. Under mid-year the half-year shift is a division by the square root of one plus the applied rate, and the applied rates differ, so the shift is smaller on the real basis. The two bases part by about a million USD: 69159247.46 against 70188970.32. Basis does not move NPV under end-year; under mid-year it does.

## The mistake

A field is presented with its total net cash flow, 117362408.71, taken from a real basis run, beside a competitor's 141637829.18 taken from a nominal run of the same rows. A careful reader who does not know the bases concludes that the second field makes more money. It is the same field. The undiscounted total is the one headline that the basis changes, so it is the one headline that must never travel without its basis attached.

The reverse mistake is subtler: reading the real total 117362408.71 as the amount that will be banked. It will not be. The account will receive 141637829.18 in the money of the day; 117362408.71 is what that would buy in 2029.

## What the basis refuses

It refuses to change the ledger. Revenue, royalty, opex, capex, tax and net cash flow are printed in money of the day on both bases; only real_net_cash_flow and the discounted column respond, and the totals of revenue 857602518.80, capex 255000000.00, opex 183899092.34 and tax 148425219.46 are nominal even on the real basis run. It refuses to make inflation matter to value: the inflation sweep holds NPV at 72534830.66 from 0 to 8 percent while the real total falls to 83912631.29. And it refuses to choose for you. AKATA is configured real; the published discounting cases are configured nominal; each is a statement the reader of the result has to be given.

## Exercise

Read the NPV on both bases under end-year and confirm they match to the cent. Then read the total net cash flow on both bases and say which one is money that arrives.
