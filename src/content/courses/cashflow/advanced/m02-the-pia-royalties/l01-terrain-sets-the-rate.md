# Terrain sets the rate

The PIA production royalty is a rate on the year's liquids revenue chosen by where the field sits and how much it produces a day, and in three of the four terrains the daily rate moves it.

{{panel:ec-fiscal-explorer}}

## The oil table

deriveOilRoyaltyRate by terrain, read at five daily rates:

| terrain | 1000 bopd | 10000 bopd | 50000 bopd | 60000 bopd | 120000 bopd |
| --- | --- | --- | --- | --- | --- |
| onshore | 0.050000 | 0.062500 | 0.132500 | 0.135417 | 0.142708 |
| shallow_water | 0.050000 | 0.062500 | 0.112500 | 0.114583 | 0.119792 |
| deep_offshore | 0.050000 | 0.050000 | 0.050000 | 0.054167 | 0.064583 |
| frontier | 0.075000 | 0.075000 | 0.075000 | 0.075000 | 0.075000 |

Onshore and shallow water price the day's barrels in tranches: the first 5000 bopd at 5 percent, the next 5000 at 7.5 percent, everything above 10000 bopd at the terrain's own rate, 15 percent onshore and 12.5 percent in shallow water. Deep offshore pays 5 percent up to and including 50000 bopd and 7.5 percent on the share above. Each terrain then charges ONE weighted average rate on the whole year's volume. Frontier is the only flat terrain, 0.075000 at every rate.

Gas and NGL pay 0.050000 in every terrain, falling to 0.025000 on the share used in-country. A marginal field is not a terrain of its own: it sits onshore or in shallow water and pays that terrain's tranches.

## The same rows, three terrains

AKATA under the PIA is shallow water, lifting 2200000 bbl in 2029, 6027.40 bopd. Its 2029 production royalty is 10070350.00 on 186032000.00 of gross revenue: the liquids at 0.054261 and 281600.00 of gas royalty at 5 percent. Change the terrain string and nothing else:

| terrain | 2029 production royalty | total royalties | NPV |
| --- | --- | --- | --- |
| onshore | 10070350.00 | 60324870.87 | 59766796.57 |
| shallow_water | 10070350.00 | 60324870.87 | 59766796.57 |
| deep_offshore, conservative_zero | 9301600.00 | 59503845.87 | 136554243.51 |
| deep_offshore, aggressive_pml_30 | 9301600.00 | 59503845.87 | 60060654.75 |

Onshore and shallow water only part company above 10000 bopd, so at AKATA's rate they print the same ledger. Deep offshore saves a little royalty, because its 5 percent tranche runs to 50000 bopd. The large NPV move is the hydrocarbon tax: the texts leave the deep offshore rate in a Nigeria Tax Act year to a stated reading, and the two readings above differ by more than the whole royalty line.

## The weighted step

pia_deep_offshore_full produces 21900000 bbl in 2025, 60000 bopd. Its production royalty is 94900000.00 on 1752000000.00 of gross revenue, 0.054167 of every barrel: 50000 bopd at 5 percent and the 10000 above at 7.5 percent, averaged. pia_deep_offshore_naive_30k halves the volume to 10950000 bbl, under the threshold, and pays 43800000.00 on 876000000.00, 0.050000.

## The mistake

Applying the top tranche to the whole volume. A reader who charges pia_deep_offshore_full 7.5 percent on every barrel, or the published worked example (shallow water, 50000 bopd) 12.5 percent, overstates the royalty and understates every tax base below it; the worked example's weighted rate is 0.112500. pia_onshore_new_lease, at 10000 bopd, prints 18250000.00 on 292000000.00, the 0.062500 in the table, where pia_frontier_exempt, with the same revenue, prints 21900000.00.

## What it refuses

The rate reads the terrain string and the daily rate. It does not read the water depth: the worked example and pia_deep_offshore_full both carry pia_water_depth_m 100, and one pays 0.112500 while the other pays 0.054167 because their strings differ. It reads no licence type, no lease status and no price; the price royalty is a separate charge, and the licence type moves the hydrocarbon tax rate. The terrain string "marginal_field" is refused with a message naming the flag to set instead.

## Exercise

Run AKATA at onshore, shallow water and deep offshore and write the 2029 production royalty for each. Then say how much of the deep offshore NPV move is royalty and how much depends on the stated tax reading.
