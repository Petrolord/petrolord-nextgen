# The IMF schedule, year by year

{{panel:joa-recovery-calculator}}

A one-year example checks the order of the lines. It cannot check the pool, because the pool only matters when cost is carried forward from one year to the next. The third published check does that: an eleven-year schedule from the same IMF methodology, FARI TNM/16/01 (February 2016, read on 2026-09-26 from the Wayback capture of 12 October 2025), in its Tables 12 and 13.

## What the tables state

Table 12 prints cost petroleum by year, and Table 13 the sharing of profit petroleum. The golden input states their terms: eleven years in USD million, no royalty, a cost recovery ceiling of 80.000000 percent of revenue after royalty, and the government's share of profit petroleum for each year as Table 13 prints it. Those yearly shares come from a daily-rate scale that the tables compute outside this engine; they are typed into the input year by year, as a year's own contractor profit share.

The printed figures are whole numbers taken from an unrounded model, so they are compared at the precision they are printed.

## The engine beside the tables

| year | ceiling printed | ceiling engine | cost petroleum printed | cost recovered engine | closing printed | pool out engine | profit printed | profit oil engine |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2001 | 0 | 0.000000 | 0 | 0.000000 | 250 | 250.000000 | 0 | 0.000000 |
| 2002 | 0 | 0.000000 | 0 | 0.000000 | 250 | 250.000000 | 0 | 0.000000 |
| 2003 | 170 | 170.400000 | 170 | 170.400000 | 299 | 298.600000 | 43 | 42.600000 |
| 2004 | 434 | 433.600000 | 434 | 433.600000 | 264 | 264.000000 | 108 | 108.400000 |
| 2005 | 1327 | 1327.200000 | 1264 | 1265.000000 | 0 | 0.000000 | 395 | 394.000000 |
| 2006 | 1083 | 1083.200000 | 840 | 840.000000 | 0 | 0.000000 | 514 | 514.000000 |
| 2007 | 884 | 884.000000 | 778 | 778.000000 | 0 | 0.000000 | 326 | 327.000000 |
| 2008 | 721 | 721.600000 | 552 | 552.000000 | 0 | 0.000000 | 349 | 350.000000 |
| 2009 | 589 | 588.800000 | 451 | 451.000000 | 0 | 0.000000 | 285 | 285.000000 |
| 2010 | 480 | 480.000000 | 368 | 369.000000 | 0 | 0.000000 | 232 | 231.000000 |
| 2011 | 392 | 392.000000 | 303 | 302.000000 | 0 | 0.000000 | 187 | 188.000000 |

## Reading the schedule

The pool opens with 250 of cost in the first year and carries it through two years with no revenue. In 2003 and 2004 the ceiling binds, so cost recovered equals the ceiling and the rest of the pool is carried forward: 298.600000 closes 2003 and 264.000000 closes 2004. In 2005 the ceiling is large enough to take the whole pool and the year's cost, the pool empties, and from then on each year recovers its own cost inside the ceiling. That is the same path the Ekene pool took, on a published schedule.

## How close is close enough

A printed whole number can sit up to half a unit from the value it rounds, and a line made of at most three printed whole numbers can carry 1.5 between them. The largest difference on a cost line (ceiling, cost petroleum, closing balance, profit) is 1.000000, inside that. The largest on the profit split between the two sides is 1.560000, inside 1.5 plus half a per cent of the year's profit petroleum, because Table 13 prints the government share as a whole per cent. The carry of 250 through the first two years and the ceilings that bind in the third and fourth years are reproduced exactly.

Agreement at the printed precision is the claim, and the only one. A figure the text prints as a whole number is quoted as printed and said to be the text's; a lesson reasons with the engine's.

## Exercise

Work in the course's own recovery calculator, view "PSC cost recovery", starting from "IMF FARI Tables 12 and 13".

1. Follow the pool out column from 2001 to 2005 and check it against the engine column above.
2. Find the years in which cost recovered equals the ceiling, and the first year in which it falls below.
3. In the box, find the contractor profit share each year states. Read the 2006 contractor and government profit oil, and say why each year has its own share.
4. With the control "Cost oil limit, percent (stated)", set 60. Read the pool out column and the tile "Unrecovered at the end", and say what the lower ceiling does to the pool.
