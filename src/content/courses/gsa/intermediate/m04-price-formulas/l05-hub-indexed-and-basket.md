# Hub-indexed and basket formulas

{{panel:gsa-ledger-calculator}}

Two more formula types complete the set the engine computes. A hub-indexed price follows a traded gas price with a multiplier and an adder. A basket price blends several indices, each against its own base value. The averaging, lag, reset and rounding of the previous lessons apply to both unchanged.

## Hub-indexed

OIES Paper NG 175, International Gas Contracts (A. Ason, 2022, read 2026-09-26), writes a hub-indexed contract sales price as CSP = 1.15 x HH + Xy: the Henry Hub price times 1.15, plus an adder. The engine takes `{ type: "hub-indexed", index, multiplier, adder }`, with an optional floor and ceiling, and prices P = multiplier x X + adder. The golden case states an adder of 2.25:

| month | HH | price |
| --- | --- | --- |
| 2026-01 | 2.500000 | 5.125000 |
| 2026-02 | 3.000000 | 5.700000 |
| 2026-03 | 3.500000 | 6.275000 |
| 2026-04 | 4.000000 | 6.850000 |

The multiplier scales every hub movement and the adder shifts the whole line by a fixed sum; what each is meant to cover is for the contract to say.

## Basket

The Commonwealth model gas sales agreement (2025, Creative Commons Attribution 4.0, read 2026-09-26) builds its price in Article 15.1 from weighted indices, each divided by a base value. The engine takes `{ type: "basket", basePrice, weights, baseValues }` and prices P = basePrice x the sum of weight x index / base over the indices. The weights are decimals and must sum to 1:

> formula.weights must sum to 1 (weights stated as decimals, CW GSA Article 15.1); got a sum of 1.1

The golden case weights fuel oil (fo) at 0.6 on a base of 400 and a consumer price index (cpi) at 0.4 on a base of 100, with a base price of 5, averaging 2 months lagged 1. For 2025-12 the window is 2025-10 to 2025-11, fo averages 410.000000 and cpi 100.500000, and the price is 5.085000. A base value for an index the weights do not name is refused:

> formula.baseValues.gdp is not a weighted index; the accepted keys of formula.baseValues are fo, cpi

## Index floors and ceilings

The model agreement's Article 15.8, in its first alternative, holds each index inside its own floor and ceiling before the basket is computed. The engine does the same with `indexFloors` and `indexCeilings`. With a floor of 410 on fo, and ceilings of 450 on fo and 102.5 on cpi:

| month | fo average | cpi average | fo held | cpi held | price |
| --- | --- | --- | --- | --- | --- |
| 2025-12 | 410.000000 | 100.500000 | 410.000000 | 100.500000 | 5.085000 |
| 2026-01 | 400.000000 | 101.500000 | 410.000000 | 101.500000 | 5.105000 |
| 2026-03 | 480.000000 | 103.500000 | 450.000000 | 102.500000 | 5.425000 |

In 2026-01 fo is lifted to its floor, and in 2026-03 both indices are cut to their ceilings. The band acts on each index, so one index can be held while another moves freely.

## Exercise

Work in the course's own ledger calculator, on the view "Contract prices month by month".

1. Replace the inputs with the hub case: four months from 2026-01 with an `hh` index of 2.5, 3, 3.5 and 4, `formula` hub-indexed on `hh` with `multiplier` 1.15 and `adder` 2.25, `averagingMonths` 1, `lagMonths` 0, `resetMonths` 1, `rounding` "none". Check the table.
2. Add a `ceiling` of 6 and write which months are clamped.
3. Build the basket case over six months from 2025-10, with fo 400, 420, 380, 500, 460 and 300 and cpi 100 to 105, priced 2025-12 to 2026-03. Check 5.085000 for 2025-12.
4. Change the fo weight so that the weights sum to 1.1 and read the refusal.
