# Loss relief

A loss year pays no tax and banks the loss. The bank is a pool per tax base, and the row's taxable income column does not show it being spent. PIA figures here use the Regulations (2021) price-royalty base, the engine default.

{{panel:ec-fiscal-explorer}}

## The joint venture pool

The published jv_loss_carryforward case spends 50000000.00 of capex in 2030 with no production. Depreciation of 5000000.00 is charged against no revenue, so taxable income is -5000000.00, tax is 0.00 and loss_carryforward reads 5000000.00. In 2031 the field sells 1000000.00 bbl at 100.000000 USD, pays royalty of 20000000.00 and opex of 10000000.00, takes another 5000000.00 of depreciation and reports taxable income of 65000000.00.

The tax is 30000000.00, where 50 percent of that column would give 32500000.00. The pool is applied after the taxable income column: loss_offset_used reads 5000000.00, loss_carryforward falls to 0.00, and 50 percent is charged on the remainder. Net cash flow is 40000000.00, NPV -13636363.64, IRR -20.0000 percent.

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

The published pia_loss_relief case runs a 2025 year with 500000.00 bbl against opex of 60000000.00 and capex of 100000000.00. Both bases go negative. The HCT base reads hct_chargeable_profit -10306393.20, HCT 0.00 and hct_loss_carryforward 10306393.20. The CIT base reads cit_assessable_profit -43056393.20, cit_tax 0.00 and cit_loss_carryforward 43056393.20.

In 2026 both pools are spent, each against its own base: hct_loss_offset_used 10306393.20 takes the HCT to 61697429.87 against 64789347.83 with the clamp on, and cit_loss_offset_used 43056393.20 takes the CIT to 65822429.87 against 78739347.83. The 2026 row is an NTA year with TET 0.00, and its development levy of 12098579.71 is identical in both runs. NPV moves from -9568013.75 clamped to 4985473.45 relieved: the relief turns the sign.

## The mistake

The careful mistake is reading taxable_income as the base the tax was charged on. On the 2031 row it reads 65000000.00 and the tax is 30000000.00, which is not 50 percent of it, so a reader checking the rate against that column concludes the rate is wrong. The base is taxable income less the offset, and the offset has its own column.

## What the engine refuses

It refuses to let one base relieve another: an HCT profit cannot absorb a CIT loss, and the pools are reported apart as hct_loss_carryforward and cit_loss_carryforward. It refuses to relieve the levies: the TET and development levy base, the assessable profit, is untouched by either pool. With the clamp on it carries nothing.

## Exercise

From the drain table, give the tax and the pool after for a year with taxable income of 10000000.00 and a pool of 15000000.00. Then explain why the 2026 HCT and CIT on pia_loss_relief both fall when relief is on, while the development levy does not move.
