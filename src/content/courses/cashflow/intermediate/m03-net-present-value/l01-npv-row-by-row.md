# NPV row by row

NPV is the sum of one column. Everything a reader needs to check it is printed in the ledger, row by row.

{{panel:ec-time-explorer}}

## The column

| year | real_net_cash_flow | discounted_cash_flow |
| --- | --- | --- |
| 2029 | -121123680.00 | -121123680.00 |
| 2030 | 30821366.21 | 28860006.55 |
| 2031 | 60767504.07 | 53279541.38 |
| 2032 | 49380616.06 | 40540595.37 |
| 2033 | 39870374.51 | 30649858.46 |
| 2034 | 32185200.62 | 23167486.48 |
| 2035 | 25461027.24 | 17161022.43 |

AKATA on the real basis, end-year, at the applied real rate of 6.796117 percent. The discounted column sums to 72534830.66 USD, and that is the NPV. There is no other step. The first row is the valuation year and is not discounted; each later row is the real flow divided by one more year at the applied rate.

Follow one row to see where the real flow comes from. In 2031 oil of 1550000.00 bbl at 85.312800 USD/bbl and gas of 1240000.00 Mscf at 3.329280 USD/Mscf give gross revenue of 136363147.20. Royalty at 15 percent takes 20454472.08. Opex is 25461600.00, depreciation 25500000.00, taxable income 64947075.12, tax at 40 percent 25978830.05. Net cash flow 64468245.07, real 60767504.07, discounted 53279541.38.

## Three totals

The ledger offers three answers to how much AKATA makes, and they differ by design. The nominal total is 141637829.18. The real total is 117362408.71. The NPV is 72534830.66. The first counts the cash as it arrives, the second restates it in 2029 purchasing power, the third charges each year's real cash for the wait at 6.796117 percent. The profile confirms the second: at a rate of 0 percent the NPV reads 117362408.71, the plain sum of the real column.

## The running sum

Summing the discounted column as you go shows where value is made. After 2029 the sum is minus 121123680.00. Through 2032 it has only just turned positive. The last three rows, 30649858.46, 23167486.48 and 17161022.43, then supply almost all of the 72534830.66. AKATA's value lives in its late years, the rows that a higher rate punishes most, which is why its profile falls as steeply as it does.

## The mistake

The careful mistake is to discount the nominal column at the real rate, or the real column at the nominal rate. Both columns look internally consistent, and the wrong pairing gives a wrong sum with no row visibly at fault. The pairing is fixed by the basis: real flows at 6.796117 percent, nominal flows at 10.000000 percent, and either pairing lands every row on the same discounted value, 30649858.46 for 2033 by both routes.

The second mistake is to discount the total. 117362408.71 divided once by anything is not an NPV. The discount is applied per row, with a different exponent for each, and the sum comes afterwards.

## What NPV refuses

It refuses to say how big the field is: 72534830.66 on a 255000000.00 capex and 21590909.09 on a 50000000.00 capex are not ranked by NPV alone, which is DPI's work. It refuses to say when the money comes back, which is payback's. And it refuses to state itself without a rate, a basis, a convention and a valuation year; the same rows give 70188970.32 under mid-year and 77464382.26 valued a year later.

## Exercise

Sum the discounted column by hand for 2029 through 2032 and confirm the running total has only just turned positive. Then say, in words rather than a number, what share of the final NPV the three tail years supply.
