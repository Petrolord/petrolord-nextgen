# Reading the steps

Each step of the efficient frontier is the value one best set gains over the best set at the point before, the capex it adds, and the ratio of the two. On OKONO those ratios rise and fall, from 0.108333 to 1.616667 and back, because a step is a change of set and never a single project bought.

{{panel:ec-capital-explorer}}

## The steps to 450.0000

| point | capex | EMV | EMV gained | capex added | EMV per extra million USD |
| --- | --- | --- | --- | --- | --- |
| 1 | 60.0000 | 38.0000 | 38.0000 | 60.0000 | 0.633333 |
| 2 | 90.0000 | 41.2500 | 3.2500 | 30.0000 | 0.108333 |
| 3 | 120.0000 | 89.7500 | 48.5000 | 30.0000 | 1.616667 |
| 4 | 180.0000 | 127.7500 | 38.0000 | 60.0000 | 0.633333 |
| 5 | 210.0000 | 131.0000 | 3.2500 | 30.0000 | 0.108333 |
| 6 | 240.0000 | 160.0000 | 29.0000 | 30.0000 | 0.966667 |
| 7 | 270.0000 | 169.0000 | 9.0000 | 30.0000 | 0.300000 |
| 8 | 300.0000 | 204.7500 | 35.7500 | 30.0000 | 1.191667 |
| 9 | 360.0000 | 249.7500 | 45.0000 | 60.0000 | 0.750000 |
| 10 | 420.0000 | 287.7500 | 38.0000 | 60.0000 | 0.633333 |
| 11 | 450.0000 | 291.0000 | 3.2500 | 30.0000 | 0.108333 |

The last three columns are derived from consecutive rows. Step 3 is 89.7500 less 41.2500, which is 48.5000, over 120.0000 less 90.0000, which is 30.0000, giving 1.616667 per extra million USD.

## A step is a swap

Name the sets and the steps explain themselves. Step 3 replaces OK-3 with OK-1: it gives up 41.2500 and gains 89.7500. Step 6 goes from OK-1 and OK-3 at 131.0000 to OK-4 alone at 160.0000, dropping two projects to fund one. Step 7 goes to OK-1, OK-3 and OK-5 at 169.0000, and OK-4 is out again. Step 9 trades OK-2 for OK-4: 160.0000 less 115.0000 is 45.0000, for 240.0000 less 180.0000, which is 60.0000 of capex.

The step of 3.2500 appears three times, at points 2, 5 and 11, and it is the same swap each time: OK-5 out and OK-3 in. OK-3 adds 41.2500 for 90.0000 and OK-5 takes away 38.0000 for 60.0000, a net 3.2500 for a net 30.0000. Step 8 is another swap, OK-3 and OK-5 out and OK-2 in, and it gains 35.7500 because OK-2's 115.0000 beats 41.2500 and 38.0000 together for 30.0000 more capex.

Only the steps that add a project on top of the set before read as that project's own ratio. Step 4 adds OK-5 to OK-1, and step 10 adds OK-5 to OK-1 and OK-4; both show 0.633333, which is OK-5's risked EMV per million USD of capex.

## The mistake

The mistake is to read a step ratio as a project's quality. Step 3's 1.616667 is not OK-1's worth: OK-1 earns 0.747917 per million USD of its own capex. The 1.616667 belongs to the trade of OK-3 for OK-1. The reverse error reads step 11's 0.108333 as proof that the last 30.0000 was badly spent. That step is what turns the greedy set's 287.7500 into the optimum's 291.0000, and nothing else at 450.0000 does better.

The second mistake is to expect the ratios to fall as the budget grows. On a frontier of whole projects they need not: 0.108333 is followed by 1.616667, and 0.300000 by 1.191667.

## What it refuses

A step reports capex and value only. The frontier names no set, so every swap is inferred from the inventory, and it says nothing about the risk a swap adds or removes. Nor can it say whether a swap is practical: a project already under way cannot simply be traded for another when the budget moves.

## Exercise

For steps 6, 7 and 8, name the set at each end and show the EMV gained and the capex added. Then explain why step 3 shows 1.616667 when OK-1 alone earns 0.747917 per million USD.
