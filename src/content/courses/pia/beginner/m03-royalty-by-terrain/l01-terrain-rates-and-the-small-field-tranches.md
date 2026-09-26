# Terrain rates and the small field tranches

{{panel:pia-royalty-calculator}}

The terrain rates of 15, 12.5 and 7.5 percent are the top of the royalty scale. The Act gives every field a lower rate on its first barrels a day, and the Regulations turn that into one weighted rate for the whole volume.

## The tranches in the text

For onshore and shallow water, the Seventh Schedule para 10(4) sets two tranches:

> "on tranched basis as follows: (a) for the first 5,000 bopd 5% ; and (b) for the next 5,000 bopd, for the share of production over 5000 bopd 7.5% :"

and its proviso sends everything above 10,000 bopd to the terrain rate:

> "Provided that fields with crude oil and condensate production more than 10,000 bopd during a month, the share of the production over 10,000 bopd per month shall be at the royalty rates specified under subparagraph (2)."

Deep offshore has one tier, Seventh Schedule para 10(3):

> "(3) For deep offshore fields with a production during a month of not more than 50,000 bopd, the royalty rate shall be 5% and the share of the production above 50,000 bopd shall be at the royalty rate specified in subparagraph (2)."

Frontier has no sliding scale: "(3) For frontier basin, the sliding scale shall not apply and the applicable rate shall be 7.5%." (Regulations r.13(3)).

## One rate on the whole volume

The Regulations express each band as a weighted average: the barrels in each tranche at that tranche's rate, divided by the total daily production. The engine returns that one rate, and it applies to the value of all the crude oil and condensate.

| liquids bopd (stated) | onshore | shallow_water | deep_offshore | frontier |
| --- | --- | --- | --- | --- |
| 5000 | 0.050000 | 0.050000 | 0.050000 | 0.075000 |
| 5001 | 0.050005 | 0.050005 | 0.050000 | 0.075000 |
| 10000 | 0.062500 | 0.062500 | 0.050000 | 0.075000 |
| 10001 | 0.062509 | 0.062506 | 0.050000 | 0.075000 |
| 50000 | 0.132500 | 0.112500 | 0.050000 | 0.075000 |
| 60000 | 0.135417 | 0.114583 | 0.054167 | 0.075000 |
| 120000 | 0.142708 | 0.119792 | 0.064583 | 0.075000 |

## Reading the edges

Each edge belongs to the tranche below it. At 5,000 bopd onshore and shallow water pay exactly 5.000000 percent, because the first tranche includes its edge. At 10,000 bopd both pay exactly 6.250000 percent, the average of the two small-field tranches. Deep offshore pays exactly 5.000000 percent at 50,000 bopd, and above it only the barrels past 50,000 pay 7.5 percent. Just past the onshore and shallow water edges the rate moves only in the sixth decimal, because one extra barrel a day is at the higher rate.

Onshore and shallow water pay the same rate at or below 10,000 bopd. Above it the terrain rate enters, and onshore climbs toward 15 percent while shallow water climbs toward 12.5 percent.

## A gap the Regulations leave

The Regulations' middle band opens "(b) for production greater than 5,000bopd but less than 10,000bopd," and the onshore upper band opens "(c) for onshore areas where production is greater than 10,000bopd, the". Neither covers exactly 10,000 bopd. At that rate both formulas give 0.062500, which is what the engine returns, so the gap moves no figure.

## Exercise

Open the royalty calculator and choose "Royalty by terrain and daily rate". The table under the tiles prints the engine's rates at the tranche edges. Enter 7500 bopd onshore and read the weighted rate, then enter 4999, 5000 and 5001 and watch the edge. Do the same around 10,000 for onshore and shallow water, and around 50,000 for deep_offshore. For one daily rate of your own above 10,000, explain from the tranches why onshore and shallow water differ.
