# Cover, reorder and ullage

At Kano the plant draws LPG every day and receives it in deliveries. Beside the usable stock, `lpgStorageSizing` prints a cover, a safety stock, a reorder level, the ullage at the reorder and a verdict on whether a delivery fits. This lesson reads those fields on both of KANO's illustrative fill limits.

{{panel:gasvalue-rollout-explorer}}

## KANO's inputs

Vessel 150 m3, demand 8 t/day, delivery 20 t, lead time 3 days, safety stock 2 days, liquid density the blend's 557.4000 kg/m3. Every one of these figures is invented for the course, and so are the two fill limits. Neither limit is a code value, and the course does not say which a site should use.

## What the engine returns

| fill limit (input) | fillRatioBasis | usableTonnes | coverDays | safetyStockTonnes | reorderAtTonnes | ullageAtReorderTonnes | deliveryFitsUllage | deliveriesPerMonth |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 0.85 | liquid_volume | 71.0685 | 8.8840 | 16.0000 | 40.0000 | 31.0685 | true | 12.0000 |
| 0.42 | water_capacity_mass | 62.9433 | 7.8680 | 16.0000 | 40.0000 | 22.9433 | true | 12.0000 |

## Reading across one row

Take the 0.85 liquid_volume row. usableTonnes is 71.0685. coverDays is 8.8840. safetyStockTonnes is 16.0000. reorderAtTonnes is 40.0000. ullageAtReorderTonnes is 31.0685. deliveryFitsUllage is true, and deliveriesPerMonth is 12.0000.

The field names carry their units. The cover is in days. The safety stock, the reorder level and the ullage at the reorder are in tonnes. The delivery verdict is true or false, and it is reached against the 20 t delivery KANO types.

## The rules behind the columns

The course prints the rule behind each column, checked on both rows: coverDays is usableTonnes over the demand; safetyStockTonnes is the demand times the safety days; reorderAtTonnes is the demand times the lead time plus the safety stock; ullageAtReorderTonnes is usableTonnes less reorderAtTonnes; deliveriesPerMonth is the demand times 30 over the delivery.

| fill limit (input) | usableTonnes over demand | demand x safety days | demand x lead + safety stock | usableTonnes less reorder | the engine's cover, safety, reorder, ullage |
| --- | --- | --- | --- | --- | --- |
| 0.85 | 8.8836 | 16.0000 | 40.0000 | 31.0685 | 8.8840, 16.0000, 40.0000, 31.0685 |
| 0.42 | 7.8679 | 16.0000 | 40.0000 | 22.9433 | 7.8680, 16.0000, 40.0000, 22.9433 |

The engine reports coverDays to three decimals, so its cover prints with a final 0 at four decimals and can differ in the fourth decimal from usableTonnes over the demand.

## Reading down the columns

Now read down, from the liquid volume row to the water capacity row.

Three fields change: usableTonnes from 71.0685 to 62.9433 t, coverDays from 8.8840 to 7.8680 days, and ullageAtReorderTonnes from 31.0685 to 22.9433 t.

Three fields print the same figure in both rows: safetyStockTonnes 16.0000, reorderAtTonnes 40.0000 and deliveriesPerMonth 12.0000. Across these two rows, moving the fill limit and its basis moves the stock, the cover and the ullage, and leaves the safety stock, the reorder level and the deliveries a month where they were.

deliveryFitsUllage reads true on both rows. On both bases, the engine's verdict is that KANO's 20 t delivery fits the ullage at the reorder.

## A verdict and its figure

The delivery verdict is a word, and the ullage beside it is a figure. Read both together. On the liquid volume row the verdict true sits beside an ullage of 31.0685 t. On the water capacity row the same verdict sits beside 22.9433 t. The verdict alone does not show the ullage it was reached on; the column beside it does.

The next lesson clears one input, the lead time, and reads what the engine then prints in these fields.

## In the explorer

Set KANO's vessel at 0.85 on liquid_volume and read the six fields to the right of usableTonnes. Change to 0.42 on water_capacity_mass and read them again, noting which fields move and which stay at 16.0000, 40.0000 and 12.0000.

## Exercise

Read the two rows of KANO's vessel from coverDays to deliveriesPerMonth. Say which fields change between the 0.85 liquid_volume row and the 0.42 water_capacity_mass row, which print the same figure in both, and what deliveryFitsUllage reports on each. Quote the ullage printed beside each verdict.
