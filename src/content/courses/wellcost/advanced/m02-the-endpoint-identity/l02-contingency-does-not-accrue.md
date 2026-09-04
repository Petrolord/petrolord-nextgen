# Contingency does not accrue

The identity is exact, it is exact everywhere it was tested, and an exact result is worth working through in full rather than quoting.

{{panel:wc-risk-explorer}}

## The identity on the golden case

The final point of the cost time curve is 5,380,000 USD. The AFE base subtotal is 5,380,000 USD.

The absolute error between them is 0 USD. The relative error is 0. The comparison is strict equality, not equality within a tolerance. The amount of contingency sitting on the curve is 0 USD.

The gap from the curve endpoint to the AFE total is therefore the contingency and nothing else: 5,918,000 USD less 5,380,000 USD is the 538,000 USD provision.

## It holds across the whole sweep

One case proving exactly could be a coincidence of round numbers. The check was run across twenty combinations, five non-productive fractions of 0, 0.05, 0.125, 0.25 and 0.5 crossed with four contingency fractions of 0, 0.1, 0.25 and 0.5.

The maximum absolute error across all twenty is 0 USD, and in all twenty the gap from curve to total equals the contingency exactly.

| NPT frac | Cont. frac | Curve final USD | Base USD | Total USD | Gap USD |
|---|---|---|---|---|---|
| 0 | 0 | 5,060,000 | 5,060,000 | 5,060,000 | 0 |
| 0.125 | 0.1 | 5,380,000 | 5,380,000 | 5,918,000 | 538,000 |
| 0.125 | 0.5 | 5,380,000 | 5,380,000 | 8,070,000 | 2,690,000 |
| 0.25 | 0.25 | 5,700,000 | 5,700,000 | 7,125,000 | 1,425,000 |
| 0.5 | 0 | 6,340,000 | 6,340,000 | 6,340,000 | 0 |

## Read the table two ways

Down a column of fixed non-productive fraction, the curve endpoint does not move at all when the contingency fraction changes. Rows two and three share a curve endpoint of 5,380,000 USD while their totals differ by more than two million. The contingency fraction is invisible to the curve.

Across the non-productive fractions the endpoint does move, from 5,060,000 USD at 0 to 6,340,000 USD at 0.5, because more elapsed days means more per day billing. Time is on the curve. Provision is not.

## Exercise

Reproduce the golden row: read the curve endpoint off the panel, read the base off the AFE, and write down the absolute error.

Then set the contingency fraction to 0.5 without touching anything else, and confirm the curve endpoint has not moved by a single dollar.

Finally, take any row of the table and recover the contingency by subtraction alone.
