# Reading the interests table

{{panel:joa-account-calculator}}

The interests view prints one table, two totals tiles, the engine's reasons, its basis and its source. Each piece answers a different question. This lesson reads all of them on the hardest worked case, two carries at once, and shows where the six decimals of a field differ from the digits in a reason.

## The five columns

| column | what it holds |
| --- | --- |
| party | the party's id |
| beneficial interest | its share of production |
| paying interest | its share of cost |
| carried percent | the percentage of its own cost share that is carried |
| carry points it pays | for a carrier, the points of each carry it pays, named by the carried party |

## Two carries

The worked case `int-two-carries` carries two parties. NOC is carried in full, pro rata. PB is carried in full, by EKO and PA in stated shares of half each. The engine returns:

| party | beneficial interest | paying interest | carried percent | carry points it pays |
| --- | --- | --- | --- | --- |
| EKO | 40.000000 | 59.807692 | 0.000000 | NOC 12.307692; PB 7.500000 |
| PA | 25.000000 | 40.192308 | 0.000000 | NOC 7.692308; PB 7.500000 |
| PB | 15.000000 | 0.000000 | 100.000000 | none |
| NOC | 20.000000 | 0.000000 | 100.000000 | none |

Read NOC's carry first, because it shows the one subtle point of the pro rata rule. Pro rata counts only the parties no carry names as carried. PB is carried, so the carriers of NOC's twenty points are EKO and PA alone, in the ratio of 40 to 25. EKO's part is 12.307692 and PA's 7.692308. PB's fifteen points are shared in the stated halves, 7.500000 each. EKO's paying interest is 40 plus both its carry points, 59.807692; PA's is 40.192308. Together they pay the whole.

## A reason and a field

The engine explains NOC's carry in a reason:

> NOC: 100% of its 20% cost share is carried (20 points), paid by EKO 12.307692307692308, PA 7.6923076923076925 (pro rata to their participating interests); its share of production stays 20%

Inside a reason the engine prints a figure as the shortest decimal that reads back to the number it holds, so a share that does not end prints every digit. The table prints the same figure as a field at six decimals: 12.307692. The course quotes the field whenever it reasons with a figure, and quotes a reason only whole, as the engine's own words.

## The totals tiles

Under the table two tiles print the total beneficial interest and the total paying interest. Both read 100.000000 on every accepted case. If you are checking your own terms and a column of your own arithmetic does not reach the whole, the tiles tell you the engine's view at a glance.

## Basis and source

Under the reasons, the engine prints its rule and its carriers' rule, so you can check any row of the table against them by hand. Then comes the Source block, which cites Art. 8.1 of the Norwegian joint operating agreement (an unofficial English translation of the 2007 text, read from its Wayback Machine capture of 26 May 2024) for contribution by participating interest, and s.85(4) of the Petroleum Industry Act 2021 (Official Gazette No. 142, Vol. 108, 27 August 2021) for the carried interest provision.

## Exercise

Open the account calculator, the course's own calculator panel, and choose "Participating, paying and beneficial interests". Choose the start "Two carries" and run it. Check EKO's paying interest by adding its participating interest and both of its carry points. Then change the second carry so that NOC is named as one of PB's carriers, run it, and read the refusal. Restore the case and write down the digits the reason prints for EKO's part of NOC's carry beside the six decimals the table prints.
