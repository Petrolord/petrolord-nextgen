# Loss relief

A loss year pays no tax and banks the loss. The bank is a pool per tax base, and the row's taxable income column does not show it being spent.

{{panel:ec-fiscal-explorer}}

## The joint venture pool

The published jv_loss_carryforward case spends 50000000.00 of capex in 2030 with no production. Depreciation of 5000000.00 is charged against no revenue, so taxable income is -5000000.00, tax is 0.00 and loss_carryforward reads 5000000.00. In 2031 the field sells 1000000.00 bbl at 100.000000 USD, pays royalty of 20000000.00 and opex of 10000000.00, takes another 5000000.00 of depreciation and reports taxable income of 65000000.00.

The tax is 30000000.00, not 32500000.00. The pool is applied after the taxable income column: loss_offset_used reads 5000000.00, loss_carryforward falls to 0.00, and 50 percent is charged on the remainder. Net cash flow is 40000000.00, NPV -13636363.64, IRR -20.0000 percent.

## The clamp

With apply_loss_carryforward false the 2030 row banks nothing: loss_carryforward 0.00. The 2031 row pays 32500000.00, keeps 37500000.00, and NPV falls to -15909090.91 with IRR -25.0000 percent. The clamp does not defer the loss. It deletes it.

## How the pool drains

The engine's own single-year function, applied to a year with taxable income of 10000000.00 at the 50 percent rate:

| Pool brought forward | Offset used | Tax | Pool after |
| --- | --- | --- | --- |
| 0.00 | 0.00 | 5000000.00 | 0.00 |
| 5000000.00 | 5000000.00 | 2500000.00 | 0.00 |
| 15000000.00 | 10000000.00 | 0.00 | 5000000.00 |
| 40000000.00 | 10000000.00 | 0.00 | 30000000.00 |

The offset is capped at the year's taxable income, so tax bottoms at 0.00 and the rest of the pool waits. With relief off the tax is 5000000.00 and the pool after is 0.00 on every line.

## Two pools under the PIA

The published pia_loss_relief case runs a 2025 year with 500000.00 bbl against opex of 60000000.00 and capex of 100000000.00. The HCT base stays positive: hct_chargeable_profit 1693694.64 and HCT 508108.39. The CIT base does not: cit_assessable_profit -12056305.36, cit_tax 0.00 and cit_loss_carryforward 12056305.36. One year, one tax paid, one loss banked.

In 2026 the CIT pool is spent: cit_loss_offset_used 12056305.36 and CIT of 59448092.62, against 63064984.23 with the clamp on. The HCT of 63814984.23 and the TET of 5755415.35 are identical in both runs. NPV moves from -8763295.32 clamped to -5475212.04 relieved.

## The mistake

The careful mistake is reading taxable_income as the base the tax was charged on. On the 2031 row it reads 65000000.00 and the tax is 30000000.00, which is not 50 percent of it, so a reader checking the rate against that column concludes the rate is wrong. The base is taxable income less the offset, and the offset has its own column.

## What the engine refuses

It refuses to let one base relieve another: an HCT profit cannot absorb a CIT loss, and the pools are reported apart as hct_loss_carryforward and cit_loss_carryforward. It refuses to relieve the levies: the TET base is untouched by the pool. And with the clamp on it carries nothing, so a project whose losses arrive before its revenue pays as if they never happened.

## Exercise

From the drain table, give the tax and the pool after for a year with taxable income of 10000000.00 and a pool of 15000000.00. Then explain why the 2026 HCT on pia_loss_relief is the same with relief on and off, while the CIT is not.
