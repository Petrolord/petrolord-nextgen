# Mid-year discounting

The screening engine discounts every year of the ledger as if its cash arrived halfway through that year, so year index i is divided by (1 + rate/100)^(i + 0.5). On ISIALA at 12 percent the first year is divided by 1.058301, and that one convention is the whole difference between a value of 81.0464 and 76.5817 million USD.

{{panel:ec-screening-explorer}}

## The factors on ISIALA

ISIALA's first year is 2027, index 0. Its factor is (1.12)^0.5, the square root of 1.12, which prints as 1.058301. Each later year multiplies the factor by 1.12 once more.

| year | ncf | factor | discounted ncf (derived) |
| --- | --- | --- | --- |
| 2027 | -17.8210 | 1.058301 | -16.8393 |
| 2028 | -26.7825 | 1.185297 | -22.5956 |
| 2029 | 35.9654 | 1.327532 | 27.0919 |
| 2030 | 31.4546 | 1.486836 | 21.1554 |
| 2031 | 27.4850 | 1.665256 | 16.5050 |
| 2032 | 23.9918 | 1.865087 | 12.8636 |

Read the 2029 row as the pattern for all twenty: net cash flow of 35.9654 divided by 1.327532 is worth 27.0919 today. Nothing else happens to the row. Capex, royalty and tax have already been taken out of the net cash flow before the factor touches it.

## Why half a year

Oil is sold and costs are paid all through a year, so the cash of year one does not arrive on the first of January or on the last day of December. The engine picks the middle. The capex year 2027 is therefore discounted too: its -17.8210 counts as -16.8393, less painful than the raw number because the spend is assumed to happen in the middle of 2027 rather than at its start.

## The same rows at year end

Discount the same twenty net cash flows at year end, dividing the first year by 1.12, and ISIALA is worth 76.5817 instead of 81.0464. The ratio of the two is 1.058301, exactly the first factor. That is no coincidence: moving every flow half a year earlier multiplies every discounted value by the same (1.12)^0.5, so the whole NPV scales by it. The published hand case shows the same form at 10 percent: net cash flows of 10 and 35 give an NPV of 10/1.1^0.5 + 35/1.1^1.5, which the engine prints as 39.8721.

## The mistake

The careful mistake is to check the engine with a spreadsheet's NPV function. Those discount the first cell by a full year, so a correct engine appears to overstate ISIALA by the ratio 1.058301, and a reader "fixes" the right number down to 76.5817. The opposite slip is to leave 2027 undiscounted with a factor of 1, which treats the first capex year as if it were spent today. Before comparing two values, write down the convention each one used.

## What it refuses

The quick form offers no switch. There is no year-end option and no start-of-year option, and the half-year shift is applied to every year, including a capex year where the money may really leave on day one. EC1's Petroleum Economics Studio discounts at year end on its own ledger, so its numbers for one field are a different quantity and are never converted into this engine's.

## Exercise

Write the factors for 2027 and 2030 on ISIALA and the discounted net cash flow of 2030. Then state ISIALA's NPV mid-year and at year end, and show that their ratio equals the 2027 factor.
