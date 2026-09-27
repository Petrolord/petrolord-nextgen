# A development carry

{{panel:farmout-valuation-calculator}}

The exploration well is paid under the earning obligation. If it succeeds, a development follows, and a farmor with a small company behind it may not be able to fund its share. A development carry is one answer: the farminee pays the farmor's development costs and recovers them later from the farmor's production.

## What the texts say

HMRC's Oil Taxation Manual (Open Government Licence v3.0; OT30022 updated 19 July 2023, read on 2026-09-27) describes the arrangement:

> "The Farmer in may therefore agree to “carry” the Farmer out by meeting the subsequent development costs relating to the farmer out’s retained interest." (HMRC Oil Taxation Manual OT30022)

> "Those costs, probably with an interest element, will normally be recovered from the proceeds of the proportion of the production accruing to the Farmer out’s retained interest." (HMRC Oil Taxation Manual OT30022)

The manual's words are Farmer in and Farmer out. The engine's are farminee and farmor, and the course uses the engine's names outside a quotation.

## The joint venture engine does the work

Carries as an instrument belong to the joint ventures course. The farm-out engine builds the interests after the farm-in and hands them to carryRecovery of the joint venture engine, which computes every figure. The basis says so, and states the arithmetic:

> carryRecovery from engines/economics/jointVenture.js on the post-deal interests (the farmor carried by the farminee alone), basis "contract"
> carried cost = cost x participating interest x carriedPct / 10,000, paid by the carriers in their carry shares; due = opening + uplift + carried cost; recovered = min(carried party's entitlement share x recoverFromPct / 100, due, cap left)

## The Ekene Deep carry

On the Ekene fixture (synthetic), after the farm-in the participating interests are EKO 40.000000, PA 30.000000 and FIN 30.000000. FIN carries 50.000000 percent of EKO's cost share, a carried interest of 20.000000 points, and recovers from 50.000000 percent of EKO's share of production. The first three years of the ledger add the carried cost (engine):

| year | opening | carried cost added | due | recovered | closing |
| --- | --- | --- | --- | --- | --- |
| 2029 | 0.000000 | 48000000.000000 | 48000000.000000 | 0.000000 | 48000000.000000 |
| 2030 | 48000000.000000 | 72000000.000000 | 123840000.000000 | 0.000000 | 123840000.000000 |
| 2031 | 123840000.000000 | 24000000.000000 | 157747200.000000 | 0.000000 | 157747200.000000 |

The carried cost adds up to 144000000.000000 (engine). The due in 2030 and 2031 exceeds the opening plus the carried cost because of the uplift, which the next lesson takes apart.

## What the engine refuses

A development carry needs a farmor that keeps a share to be carried. A farm-in that earns the farmor's whole interest is refused:

> earnedPct must be below the farmor's interest 70 (the farmor keeps a carried interest); got 70

A carry of nothing is no carry:

> carriedPct must be a number above 0 and at most 100; got 0

And the recovery share is a stated term with no default; a call without it is refused:

> recoverFromPct must be a number above 0 and at most 100; got nothing

## Exercise

Open the valuation calculator on the view "A development carry after the farm-in" and start from "The Ekene carry, compound uplift". Read the table of participating interests after the farm-in, then the first three ledger rows. Change "Carried, percent of the farmor's cost share (stated)" and read how the carried cost added in 2029 moves. Set "Participating interest earned in the farm-in, percent (stated)" to the farmor's whole interest before the deal and read the refusal. Clear "Recovered from, percent of the farmor's share (stated)" and read that refusal too.
