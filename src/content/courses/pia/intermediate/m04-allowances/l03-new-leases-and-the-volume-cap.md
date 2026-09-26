# New leases and the volume cap

{{panel:pia-hct-calculator}}

A lease granted after the Act out of new acreage earns a larger production allowance than a converted lease, for a while. The Sixth Schedule sets a higher rate per barrel up to a cumulative volume per field, and a lower one after. This lesson reads the first tier and the cap that ends it.

## The text

The Petroleum Industry Act 2021, Sixth Schedule para 1(2): "(2) There shall be a production allowance per field for crude oil production by a company for leases granted after the commencement of this Act and determined as follows: ". Then, by terrain:

- (a) onshore: the "lower of US $8.00 per barrel and 20% of the fiscal oil price per barrel up to a cumulative maximum production of 50 million barrels from commencement of production and the lower of US $4.00 per barrel and 20% of the fiscal oil price thereafter"
- (b) shallow water: the same first tier "up to a cumulative maximum production of 100 million barrels from commencement of production"
- (c) "(c) for deep offshore areas and frontier basins: the lower of US $8.00 per barrel and 20% of the fiscal oil price, up to a cumulative maximum production of 500 million barrels"

The cap is per field and counted from the start of production. The engine reads the barrels produced before the ledger from a stated input, `pia_prior_cumulative_oil_bbl`, and adds each year's crude oil and condensate as it goes.

## The first tier on the engine

On 1000000 barrels of a new lease:

| terrain | oil price (stated) | produced before (bbl) | framework | allowance | below the cap bbl | after the cap bbl |
| --- | --- | --- | --- | --- | --- | --- |
| onshore | 75.000000 | 0 | nta_2025 | 8000000.000000 | 1000000 | 0 |
| onshore | 30.000000 | 0 | nta_2025 | 6000000.000000 | 1000000 | 0 |
| onshore | 75.000000 | 49500000 | nta_2025 | 6000000.000000 | 500000 | 500000 |
| shallow_water | 75.000000 | 99500000 | pia_only | 6000000.000000 | 500000 | 500000 |
| deep_offshore | 75.000000 | 0 | pia_only | 8000000.000000 | 1000000 | 0 |

At 30 USD/bbl the price leg, 20 percent of 30, is lower than 8.00 and applies. A year that crosses the cap is split at the cap: the onshore row with 49500000 bbl produced before puts half its barrels on each side.

## The edge of the cap

A year that ends exactly on the cap has no barrel after it. On 1000000 onshore barrels at 75 USD/bbl, a year ending on the cap returns 8000000.000000; one barrel further and the last barrel drops to the lower tier, giving 7999996.000000. The edge belongs to the first tier.

## Which texts give it, in which years

For onshore and shallow water the new-lease allowance is the same in a year under the Act alone and in a year under the Nigeria Tax Act 2025, which re-enacts it for those two terrains. What that Act does for deep offshore and frontier is a transition question, and the Expert tier reads it; every deep offshore figure in this lesson is in a year under the Act alone.

## Exercise

Work in the course's own hydrocarbon tax calculator, which runs the same engine.

1. Open "The production allowance". Set new, onshore, 1000000 bbl, 75 USD/bbl, nothing produced before. Read 8000000.000000. Change the price to 30 and read 6000000.000000.
2. Back at 75, type 49500000 as produced before and read the split. Then type 49000000. Why is every barrel now below the cap?
3. Change the terrain to shallow_water and put the produced-before figure just short of 100 million. Where does the split fall now?
4. In one sentence, name the paragraph that makes the cap per field and the input that tells the engine where a field stands.
