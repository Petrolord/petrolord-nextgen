# The deleted deep offshore allowance

{{panel:pia-ledger-calculator}}

The Nigeria Tax Act 2025 re-enacts the Sixth Schedule production allowance, and in doing so it leaves one terrain out of the list. A lease granted out of new acreage in deep offshore or frontier acreage earns the allowance in a year under the Act alone and none in a year under the new Act. This change is written plainly, so the engine computes it and the course grades it.

## The two lists

The Petroleum Industry Act 2021 gives leases granted after its commencement an allowance per field, terrain by terrain. Sixth Schedule para 1(2) opens: "(2) There shall be a production allowance per field for crude oil production by a company for leases granted after the commencement of this Act and determined as follows: " and its paragraph (c) covers deep water: "(c) for deep offshore areas and frontier basins: the lower of US $8.00 per barrel and 20% of the fiscal oil price, up to a cumulative maximum production of 500 million barrels".

The Nigeria Tax Act 2025 re-enacts the same allowance in its own Sixth Schedule para 1(2), and its list stops at shallow water: "and the lower of US $4.00 per barrel and 20% of the fiscal oil price thereafter; and (b) for shallow water areas, the lower of US $8.00 per barrel and 20% of the fiscal oil price, up to a cumulative maximum production of 100". There is no paragraph (c) for deep offshore and frontier.

The converted-lease allowance survives unchanged. NTA Sixth Schedule para 1(1) repeats the Act's words: "1. (1) There shall be a production allowance for crude oil production by leases which are converted oil mining leases based on a conversion contract and their renewals, which shall be the lower of US $2.50 per barrel and 20% of the fiscal oil price."

## What the engine returns

For one stated year of one million barrels at 75 USD/bbl and no earlier production:

| lease (stated) | terrain | framework | allowance |
| --- | --- | --- | --- |
| new | deep_offshore | pia_only | 8000000.000000 |
| new | deep_offshore | nta_2025 | 0.000000 |
| new | frontier | nta_2025 | 0.000000 |
| converted | shallow_water | nta_2025 | 2500000.000000 |

On the Ekene deep offshore lease (synthetic; new acreage, 21,900,000 barrels a year, 2025 to 2027) the production allowance is 175200000.000000 in 2025 and 0.000000 in 2026. The switch is the whole explanation: the barrels and the price are the same in both years.

## Why the allowance barely shows under one reading

Under the conservative reading, a deep offshore lease pays no hydrocarbon tax in any year, so losing an allowance against that tax changes nothing it pays. Under the aggressive reading or a stated custom rate, the lost allowance raises the chargeable profit that the stated rate then charges. The deletion is certain and graded; what it costs depends on the open reading of the rate.

## Exercise

Open the ledger calculator on "The whole ledger, year by year" and load ekene_deep_new_60k_aggressive. Read the hydrocarbon tax in 2025, 2026 and 2027, and explain the 2025 figure from PIA s.260(3). Switch to "Which provision moved", load the same case and enter {"pia_lease_status": "converted"} as the change. Explain from the two Sixth Schedules which years the change can touch and why the sign of the hydrocarbon tax difference is what it is. Then repeat with ekene_deep_new_60k_conservative and explain the difference you see.
