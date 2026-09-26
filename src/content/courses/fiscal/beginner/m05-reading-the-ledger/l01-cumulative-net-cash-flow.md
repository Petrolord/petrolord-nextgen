# Cumulative net cash flow

The running sum of the contractor's line is the only column in the ledger that remembers, and it remembers at face value.

{{panel:ec-regime-explorer}}

## The column

`cumulativeNCF` is contractor net cash flow added up from year 1. Under "USA - Gulf of Mexico" on the Designer's default project it opens at -310.0117, which is year 1's own line, then climbs.

| year | contractorNCF | cumulativeNCF |
| --- | --- | --- |
| 1 | -310.0117 | -310.0117 |
| 2 | 169.7780 | -140.2337 |
| 3 | 149.2243 | 8.9905 |
| 4 | 106.8784 | 115.8689 |
| 5 | 104.0304 | 219.8993 |
| 6 | 92.7163 | 312.6156 |
| 10 | 62.9112 | 596.6807 |
| 25 | 6.4592 | 980.9313 |

The last value of the column and the life total of the contractor's line are the same number, 980.9313. That is the first check to run on any ledger: if the closing cumulative and the total disagree, one of them was built from a different column.

## The deepest point

The trough is year 1 at -310.0117, and it is worth knowing why it is not 500.0000. The capex is 500.0000, but the same year recovered 220.9910 of cost oil and paid opex of 31.0027, so the exposure the ledger actually records is smaller than the spend. Under "Angola - Deepwater PSC" the same project troughs at -323.6112 in year 1 instead, because a 50 percent recovery limit returned less of the spend in the year it happened.

## Every year counts the same

Nothing in this column has a clock. Year 25's 6.4592 is added to year 2's 169.7780 at face value, and money nineteen years apart is treated as the same money. The engine's net present value for exactly this ledger, at the project's 10 percent, is 382.0660 against a closing cumulative of 980.9313. Both are readings of the same 25 rows.

## The mistake

The error that costs most is to read the closing cumulative as a verdict. On the teaching field ODIDI at a discount rate of 12 percent, every template closes its cumulative in the black and five of the six return a negative net present value: "Brazil - Concession" ends the life with 192.9896 of contractor cash and a value of -5.8662, and "Angola - Deepwater PSC" with 109.1947 and -58.1813. Only "Nigeria - PIA (2021)" returns a positive value, 1.7389, on 229.9586 of contractor cash, and that is close to nothing on 420.0000 of capex. A field can pay back all of its money and still not be worth building.

The second error is to assume the column only rises. It rises while the contractor's line is positive, and a declining field can turn it back down late in life, when revenue after royalty no longer covers the year's opex. ODIDI's own year 25 sells 6.9081 of gross revenue and pays 12.3405 of opex under the Gulf of Mexico terms, and the ledger mode of the panel will show you which of its late years bend the curve.

## What it refuses

A running sum has no discount rate, no reinvestment assumption and no partial years. It also carries no abandonment cost, so the curve ends where the data ends, at the top of the field's life rather than at the bottom of its liabilities.

## Exercise

Write the cumulative for years 1 to 6 and say which year it crosses zero. Then say what the closing value should equal, and name two readings of the same ledger that disagree with it about whether the field is worth building.
