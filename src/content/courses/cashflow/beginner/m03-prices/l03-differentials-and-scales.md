# Differentials and scales

After the deck or the flat price has produced a year's price, two adjustments can still move it: a differential added in USD per bbl, and a scale multiplied through.

{{panel:ec-ledger-explorer}}

## The differential

oil_price_differential_usd_bbl is added to the resolved price, and a negative value is a discount off the benchmark. deck_differential sets a deck with one entry, 100 in 2030, an escalator of 10 and a differential of -5. The ledger applies 95.000000 in 2030 and 105.000000 in 2031, with gross revenue 95000000.00 then 105000000.00 on 1000000.00 bbl a year, total revenue 200000000.00.

Read the order in that second number. With the deck ending in 2030, 2031 is escalated from the last entry, 100 to 110, and the differential comes off after: 105. It is not 95 escalated, and the case's own note says so: differential -5 after deck resolution.

## The scale

oil_price_scale multiplies the resolved price. deck_scale uses the same one-entry deck at 100 with oil_price_scale=1.2, and the ledger applies 120.000000 in 2030, revenue 120000000.00 on the same 1000000.00 bbl. The note is again explicit: scale multiplies the resolved deck price. The scale does not rewrite the deck entries; it is applied to what the resolver hands back.

## What each is for

A differential is a quality or location adjustment. A crude trading a fixed number of USD under the benchmark keeps that gap whatever the benchmark does, so 95 and 105 sit the same distance under 100 and 110. A scale is proportional: a crude trading at a fixed fraction of the benchmark keeps the ratio, so 1.2 turns 100 into 120 and a higher benchmark into proportionally more. The differential is worth the same in a low year and a high year; the scale is worth more the higher the price.

## Together

The published cases exercise them one at a time; none sets a differential and a scale together. So the order between them, differential first or scale first, is not something this lesson can state, and it matters: a scale applied to a price already carrying a -5 differential moves the differential too. Run both together in the explorer and read the applied price before assuming either order.

## What the engine refuses

It refuses to distinguish a differential from a price. The applied_oil_price column holds the final number, 95.000000, with no column for the benchmark: a ledger read cold cannot tell a 100 benchmark with a -5 differential from a flat 95, and the configuration is the only record. The same for the scale: 120.000000 in the row, and 100 with 1.2 only in the config.

## The mistake

The careful mistake is applying the differential to the benchmark and then escalating, so that the gap escalates with it. That reader expects 2031 to read 95 escalated by 10 percent and finds 105.000000 instead. The gap grows every year after, and a reader who built the spreadsheet the other way disagrees with the engine by a little more each row and never by enough to look like a bug. The order is fixed: resolve, then adjust. A second mistake is entering a percentage as a scale: 20 where 1.2 was meant multiplies the price by twenty, and nothing refuses it.

## Exercise

Read the 2030 applied price and gross revenue for deck_differential and deck_scale in the explorer. Then set both the -5 differential and the 1.2 scale on the same one-entry deck, read the 2030 price, and write which order the engine used.
