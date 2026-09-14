# Net cash flow

Net cash flow is what the contractor keeps in a year: gross revenue less royalty, capex, opex and tax. Depreciation does not appear in it, because depreciation only ever changed the tax.

{{panel:ec-screening-explorer}}

## The row that closes

Every ISIALA row closes the same way.

| year | grossRevenue | royalty | capex | opex | tax | ncf | cumulativeNCF |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 2027 | 112.4200 | 16.8630 | 90.0000 | 23.3780 | 0.0000 | -17.8210 | -17.8210 |
| 2028 | 98.9296 | 14.8394 | 90.0000 | 20.8726 | 0.0000 | -26.7825 | -44.6035 |
| 2029 | 87.0580 | 13.0587 | 0.0000 | 18.6679 | 19.3660 | 35.9654 | -8.6381 |
| 2030 | 76.6111 | 11.4917 | 0.0000 | 16.7278 | 16.9371 | 31.4546 | 22.8165 |
| 2046 | 9.9086 | 1.4863 | 0.0000 | 4.3402 | 1.4288 | 2.6534 | 208.0250 |

In 2029, 87.0580 minus 13.0587 minus 18.6679 minus 19.3660 is 35.9654. The lifetime totals close the same way: totalRevenue 864.1699 minus totalRoyalty 129.6255, totalCapex 180.0000, totalOpex 210.4887 and totalTax 136.0307 leaves 208.0250, the final cumulative.

## Two sides of one row

The same row also gives the government's side. `govTake` is royalty plus tax, 16.8630 in 2027 and 32.4247 in 2029, and totalGovTake is 265.6562 million USD. Over the life the government collects 265.6562 and the contractor keeps 208.0250 after paying 180.0000 of capex and 210.4887 of opex. Neither side carries a working interest or a partner.

## What the column feeds

Every value the engine reports is read from this one column. The NPV discounts it mid-year at 12 percent. The IRR is the rate that takes that NPV to zero. The cumulative falls to -44.6035 in 2028, which is maxExposure, and first reaches zero during 2030, where it ends the year at 22.8165. The engine's payback of 3.2746 years sits inside that crossing. A wrong net cash flow in any row is wrong in all four.

## The mistake

The careful mistake is to subtract the depreciation column as well as capex. Depreciation is 90.0000 in 2027 and 2028, and capex is 90.0000 too. A reader who takes both off charges each 90.0000 twice, and every cumulative from 2027 onwards is wrong by the double count. The ledger would then show ISIALA deeper under water than the -44.6035 the engine reports, and paying back later than 3.2746 years, for a cost that was only ever spent once.

The second mistake is to read the final cumulative as the project's value. 208.0250 is undiscounted. The engine's NPV of the same net cash flows is 81.0464. The cumulative says how much money came back and says nothing about when.

## What net cash flow refuses

It refuses an economic limit. Every year is kept, including a year that loses money. OKPOMA's 2046 row has a net cash flow of -0.5576, on gross revenue of 4.4603 and opex of 4.5718, and that loss is inside its NPV of 167.4389. It also refuses an abandonment cost in the quick form: ISIALA's 2046 capex is 0.0000, and nothing is spent to close the field.

## Exercise

Close ISIALA's 2030 row from its gross revenue, royalty, opex and tax, and show that the lifetime totals leave the final cumulative of 208.0250. Then say why 208.0250 and 81.0464 are both correct and are not the same quantity.
