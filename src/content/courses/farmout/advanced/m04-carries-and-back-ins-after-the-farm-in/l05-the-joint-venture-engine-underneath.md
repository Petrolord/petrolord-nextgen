# The joint venture engine underneath

{{panel:farmout-valuation-calculator}}

The development carry and the back-in in this module are computed by the joint venture engine. The farm-out engine's part is to build the interests after the farm-in correctly and to hand them over. This lesson reads that seam and the results the joint venture engine returns at its edges.

## Five imports and nothing else

The farm-out engine imports applyJV and npv from cashflow.ts, rollback, evpi and evii from decisionTree.js, portfolioRiskMetrics from portfolio.js, calculatePartnerCosts from afe.js, and carryRecovery and backIn from jointVenture.js. It carries no NPV, decision tree or Monte Carlo code of its own. When a carry is recovered or a back-in refunded, the arithmetic is the same code the joint ventures course teaches, run on the interests this course's farm-in produced.

## Each party's NPV under the carry

When a discount rate and a base year are stated, the carry call returns each party's cash flow and NPV. On the Ekene carry (synthetic), at 0.100000 to 2027 (engine):

| golden case | party | NPV at 0.100000 to 2027 |
| --- | --- | --- |
| devcarry-ekene | EKO | 115507461.937032 |
| devcarry-ekene | PA | 81375101.112542 |
| devcarry-ekene | FIN | 74367773.992233 |

Each NPV is quoted with its rate and base year, and the discounting is the canonical npv the cash flow course teaches. EKO's figure includes the production it gives up to repay the carry and the development costs it never paid; FIN's includes the costs it carried and the recovery with its uplift.

## A cap on the recovery

A carry may cap what is recovered. The golden case devcarry-ekene-none-capped states no uplift and a cap of 100000000.000000 (engine): 100000000.000000 is recovered and 44000000.000000 written off. The reason names the year the cap binds:

> 2033: the stated cap 100000000 is reached with 50000000 recovered this year; the rest, 44000000, is written off

A write-off is a result. The carrying party bears it, and the carried party's production is free of the carry from then on.

## Recovered exactly

On devcarry-recovered-exactly the balance due equals the amount available in the year, and the engine reports the edge in words:

> 2031: the balance 400 is recovered exactly by the 400 available; the carried party receives 0 of its share 400

The carry is recovered that year and the closing balance is 0.000000.

## Why the seam matters

Reusing the joint venture engine means one set of carry and back-in rules across the platform. A carry in this course and a carry in the joint ventures course give the same figures on the same terms. The farm-out engine adds only what a farm-in changes: who holds what after the farm-in, and who is carried by whom.

## Exercise

Open the valuation calculator on the view "A development carry after the farm-in" and start from "No uplift, a cap". Read the written-off column and the "Written off" tile. Raise "Cap on the recovery (optional)" and find where nothing is written off. Then start from "The Ekene carry, compound uplift", read the NPV table, and change "Discount rate, a fraction (optional)"; say which party's NPV moves most and why.
