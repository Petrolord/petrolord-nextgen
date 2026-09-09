# Terrain sets the rate

The PIA production royalty is a rate on gross revenue chosen by where the field sits, and only one flat terrain lets the daily rate change it.

{{panel:ec-fiscal-explorer}}

## The oil table

deriveOilRoyaltyRate by terrain, read across daily rates from 1000 to 120000 bopd:

| terrain | 1000 to 50000 bopd | 50001 bopd and above |
| --- | --- | --- |
| onshore | 0.150000 | 0.150000 |
| shallow_water | 0.125000 | 0.125000 |
| deep_offshore | 0.050000 | 0.075000 |
| frontier | 0.075000 | 0.075000 |

Gas royalty is 0.070000 onshore, shallow water and marginal, 0.050000 deep offshore and frontier. Only two terrains carry a rate dependence: deep offshore steps once at 50000 bopd, and marginal fields blend, which is a separate rule with its own table. Onshore is the highest flat rate: pia_onshore_new_lease prints 43800000.00 of production royalty on 292000000.00 of gross revenue, 0.150000 of every barrel, where the frontier field with the same revenue prints 21900000.00.

## The same rows, three terrains

AKATA under the PIA is shallow water, and its 2029 production royalty on 186032000.00 of gross revenue is 22944240.00: 0.125000 on the oil and 0.070000 on the gas. Change the terrain string and nothing else:

| terrain | 2029 production royalty | total royalties | NPV |
| --- | --- | --- | --- |
| onshore | 27454240.00 | 143184623.40 | 36246417.05 |
| shallow_water | 22944240.00 | 122393644.64 | 42943268.01 |
| deep_offshore, conservative | 9301600.00 | 59501441.00 | 141623594.88 |

Deep offshore's NPV gain is not only royalty; the conservative reading also zeroes the hydrocarbon tax, and the aggressive reading leaves NPV at 61725382.46 with the same 59501441.00 of royalties. But the royalty alone moves from 143184623.40 to 59501441.00 across one string in a config, and no other single input on this field does that.

## The step is a step, not a blend

pia_deep_offshore_full produces 21900000 bbl in 2025, 60000 bopd, above the 50000 threshold. Its production royalty is 131400000.00 on 1752000000.00 of gross revenue, 0.075000 of every barrel. pia_deep_offshore_naive_30k halves the volume to 10950000 bbl, half the daily rate and under the threshold, and the royalty is 43800000.00 on 876000000.00, 0.050000 of every barrel. The rate that applies to the year applies to the whole year.

## The mistake

The careful reader who has met the marginal blend applies it here: 0.050000 on the first 50000 bopd and 0.075000 only on the barrels above. On pia_deep_offshore_full that gives a royalty below 131400000.00 and every tax base downstream too high. The blend exists in one terrain. frontier's 0.075000 does not move at any rate, and pia_frontier_exempt prints 21900000.00 of production royalty on 292000000.00 of gross revenue with a price royalty of 0.000000.

## What it refuses

The rate is chosen by the terrain string and the daily rate. It does not read the water depth: the worked example and pia_deep_offshore_full both carry pia_water_depth_m 100, and one pays 0.125000 while the other pays 0.075000 because their strings differ. It reads no licence type, no lease status and no price; the price component is a separate royalty with its own anchors, and the licence type moves the hydrocarbon tax rate, not this one.

## Exercise

Run AKATA at onshore, shallow water and deep offshore and write the 2029 production royalty for each. Then say which of the three NPV moves is due to royalty alone and which one is not.
