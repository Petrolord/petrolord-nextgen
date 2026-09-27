# Incremental discounts

{{panel:materials-stock-calculator}}

Under an incremental discount each unit is priced by its own band. On the casing schedule the first 60 joints of a lot cost 1450 each, the next 60 cost 1400, and every joint from the 120th on costs 1360, so a lot of 141 joints pays three prices.

## The fixed cost of a band

The engine writes the cost of a lot in band i as a fixed amount plus the band price times the whole lot. The fixed amount, Fi, collects what the earlier, dearer units cost above the band price. The engine's basis, verbatim:

    Incremental: lot cost Fi + vi Q in band i, Fi = Fi-1 + (vi-1 - vi) Qi; TC(Q) = D (Fi + vi Q) / Q + A D / Q + r (Fi + vi Q) / 2.

Here Qi is the quantity the band starts from and vi its price. On the casing, band 1 starts at 60 and costs 50 less than band 0, so F1 is 3000.000000; band 2 starts at 120 and costs 40 less than band 1, which lifts F2 to 7800.000000.

The fixed cost behaves like an extra order cost: each order pays it once, so the band's EOQ uses A plus Fi at the band's own price. A band offers its EOQ only when that EOQ lies inside the band; there is no jump to a break, because a break saves nothing on the units below it.

## The casing, incremental

On CSG-958 with the same demand, order cost, holding rate and rounding:

| band | price | fixed cost Fi | EOQ | candidate | total cost a year |
| --- | --- | --- | --- | --- | --- |
| 0 | 1450 | 0.000000 | 76.112440 | none | none |
| 1 | 1400 | 3000.000000 | 105.559733 | 106.000000 | 365856.981132 |
| 2 | 1360 | 7800.000000 | 141.213231 | 141.000000 | 365590.042553 |

The engine orders 141.000000 joints in band 2 at 365590.042553 a year, a saving of 4482.564905 against the no-discount baseline. Its reason for band 2, verbatim:

> band 2 at 1360: EOQ 141.213231 lies in the band from 120 upward; candidate 141, total cost 365590.04 a year

The reason prints money to the cent, and the lesson reasons with the field, 365590.042553.

## The published check

Caplice, MIT ESD.260J Logistics Systems, Fall 2006, lecture 8 slides 13 to 15 (MIT OpenCourseWare, CC BY-NC-SA 4.0, read 2026-09-27) work an incremental schedule: a price of 50 below 500 units, 45 from 500 and 40 from 1000, on a demand of 2000 a year, an order cost of 500 and a holding rate of 0.25, rounded to the nearest whole unit. The course cites the figures by slide and reproduces none of the text.

| band | fixed cost Fi (engine) | printed | EOQ (engine) | printed | candidate |
| --- | --- | --- | --- | --- | --- |
| 0 | 0.000000 | 0 | 400.000000 | 400 | 400.000000 |
| 1 | 2500.000000 | 2,500 | 1032.795559 | 1,033 | none |
| 2 | 7500.000000 | 7,500 | 1788.854382 | 1,789 | 1789.000000 |

Band 1's EOQ lies above its band, so it offers nothing. At 1789.000000 the engine gives an effective unit price of 44.192286 and a total of 98826.043879 a year, against 105000.000000 for band 0. The slides print a total of 98,825: they round each cost line and add the rounded lines, so the print sits just below the total the engine sums from unrounded lines.

## Exercise

Open the stock calculator, choose the view "Quantity discounts" and start from "The casing, incremental". Confirm the fixed costs 3000.000000 and 7800.000000, the three EOQs and the order of 141.000000 at 365590.042553.

Then start from "Lecture 8 slides 13 to 15, incremental". Confirm the band 1 row offers no candidate and read its reason. Find the order of 1789.000000 and its total, and place the slide's printed 98,825 beside it. Finally, on the casing, set the control "Discount type" to all-units and watch the order move to 120.000000.
