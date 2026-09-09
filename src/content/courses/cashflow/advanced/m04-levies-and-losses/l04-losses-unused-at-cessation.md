# Losses unused at cessation

A pool that nothing ever spends is worth nothing, and the engine says so in a memo line rather than in the NPV.

{{panel:ec-fiscal-explorer}}

## One row, no second act

The published jv_loss_unused_at_cessation case is a single year, 2030, with capex of 50000000.00, no production, depreciation of 5000000.00 and taxable income of -5000000.00. Tax is 0.00 and loss_carryforward reads 5000000.00.

The KPI line reports tax losses unused at cessation of 5000000.00. It also reports NPV -50000000.00, IRR null, DPI -1.000000 and take null. The NPV is the whole capex, and the banked loss appears nowhere in it.

Give the same capex one more year of production, as jv_loss_carryforward does, and the 5000000.00 is spent in 2031, the tax falls from 32500000.00 to 30000000.00, and the memo line disappears.

## What the memo is worth

The unused pool is a tax shield with nothing to shield. At the 50 percent rate a 5000000.00 loss is worth 2500000.00 of tax in a year with income to absorb it, the distance between 32500000.00 and 30000000.00 on the two-year case, and 0.00 on the one-year case. Adding the shield back as an asset counts a year the ledger does not contain.

## The same evaporation under other names

Each regime names the value the horizon left behind differently.

Under joint venture terms it is the tax loss. Under the PIA it is the cost price ratio pool: cpr_forfeiture claims 52000000.00 against its cap, defers 8000000.00, and the ledger ends: CPR forfeited at cessation 8000000.00. On pia_cpr_carry_two_years the cap at 30 percent binds for three years and 66000000.00 is forfeited. Under production sharing there is no line at all: unrecovered cost at cessation not reported, and the pool can only be read by marching the cost recovery function over the rows.

Depreciation the horizon never reaches goes the same way: AKATA's ten-year default straight line claims 174000000.00 of 255000000.00 capex in seven years, and the rest is neither banked, forfeited nor reported.

## The kept tail banks a loss too

With the economic limit off, its default, an uneconomic final year banks a loss with no year after it: elt_off_tail_kept ends on a 2032 row with 10000.00 bbl, revenue 1000000.00, opex 10000000.00, taxable income -14200000.00 and a loss_carryforward of 14200000.00 that nothing will spend.

## The mistake

The careful mistake is treating take null as a data error. Take is the government share of a pre-take value, and with no revenue there is nothing to share, so the engine returns null rather than a percentage of nothing. DPI -1.000000 is the honest reading: every unit of capital was lost.

## What the engine refuses

It refuses to value the unused pool or to extend the ledger to spend it. It refuses to report the PSC pool at all. And it refuses to carry what the two-thirds CIT restriction disallows, so a restriction that binds is a permanent loss, not a deferral.

## Exercise

Write the three memo lines this engine can print at cessation and the regime each belongs to. Then say why doubling the 5000000.00 loss on jv_loss_unused_at_cessation would leave its NPV unchanged, and what it would change.
