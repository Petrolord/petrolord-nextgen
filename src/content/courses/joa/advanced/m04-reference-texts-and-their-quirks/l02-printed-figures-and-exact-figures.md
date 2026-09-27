# Printed figures and exact figures

{{panel:joa-recovery-calculator}}

{{panel:joa-agreement-calculator}}

A published worked example prints its figures to the precision its authors chose. The engine returns every field in full. When the two sit side by side, a reader has to know which differences are rounding and which would be an error. This lesson reads three cases.

## The World Bank's whole dollars

The World Bank's Petroleum Sector Briefing Note No. 8 (November 2007, read on 2026-09-26) ends its two-barrel example in whole dollars:

> "The end result is that the contractor retains US$43 and the government takes $57." (World Bank Petroleum Sector Briefing Note No. 8 (November 2007))

The engine, on the example's own terms (gross 100.000000, costs 25.000000, royalty 10.000000 percent, limit 60.000000 percent of gross, contractor share 40.000000 percent, tax 30.000000 percent), returns:

| line | printed (text) | engine |
| --- | --- | --- |
| profit oil | 65 | 65.000000 |
| contractor profit oil | 26 | 26.000000 |
| income tax | 7.8 | 7.800000 |
| contractor retains | 43 | 43.200000 |
| government takes | 57 | 56.800000 |

The note prints the income tax as 7.8, so its own lines already add to the engine's 43.200000 for the contractor; only its totals are rounded to whole dollars. The engine's 43.200000 and 56.800000 round to 43 and 57. Nothing disagrees.

## The IMF's whole numbers of an unrounded model

IMF FARI TNM/16/01 (February 2016) prints Tables 12 and 13 in whole USD million from a model that carries more digits. On the same terms the engine agrees within the printed precision: the largest difference on a cost line is 1.000000, inside the 1.5 a line built from at most three printed whole numbers can carry; the largest on the profit split is 1.560000, because Table 13 prints the government share as a whole percent. A reader who expects exact agreement with a table of rounded figures would call that a defect. It is the printing.

## The engine's own reasons round to the cent

The engine prints money in a reason rounded to the cent, half away from zero, with trailing zeros dropped. The fields keep full precision. On the Ekene carry the payout year reads:

> 2033: the balance 7267760.62 is recovered with 7267760.62 of the 9400000 available; the carried party receives 11532239.38 of its share 18800000

The field behind the balance is 7267760.617882, and the course quotes and reasons with the field. A figure copied from a reason line into a further calculation carries the rounding with it.

## The rule for a report

Quote a printed figure as printed, and say that it is the text's. Quote an engine figure at six decimals, as the field. When the two differ within the printed precision, say so in one sentence and move on. When they differ by more, the next lesson shows what to do.

## Exercise

Open the recovery calculator on the view "PSC cost recovery" and start from "World Bank Briefing Note 8, the two-barrel example". Read the 2007 row line by line against the printed column of the table above, then read the government take tile. Start from "IMF FARI Tables 12 and 13" and compare the 2005 row with the printed row: ceiling 1327, cost petroleum 1264, profit 395. Then open the agreement calculator on the view "A carry, its recovery and the NPV", which starts on the Ekene carry with its compound uplift, and read the 2033 recovered cell beside the 2033 reason line.
