# A carry and its recovery

{{panel:joa-recovery-calculator}}

A carry is a carried party's cost share paid by its carriers. At Associate you met it as a change of paying interests. This module follows the money: the carriers pay the carried cost, and get it back later from the carried party's share of production, with or without an uplift, and sometimes only up to a cap.

## A financing arrangement

The IMF working paper WP/24/89 (April 2024, read from its Wayback capture of 14 August 2025 on 2026-09-26) describes the idea in one sentence:

> "The parties may establish a financing arrangement to cover (“carry”) the state’s proportional share of development spending." (IMF WP/24/89 (April 2024))

The engine computes that arrangement from stated terms only. Its rule, verbatim from its basis on the Ekene carry:

> carried cost = cost x participating interest x carriedPct / 10,000, paid by the carriers in their carry shares; due = opening + uplift + carried cost; recovered = min(carried party's entitlement share x recoverFromPct / 100, due, cap left)

## The Ekene carry

NOC holds a participating interest of 20.000000 and is carried for 100.000000 percent of it, pro rata. Its beneficial interest stays 20.000000 and its paying interest is 0.000000; EKO carries 10.000000 points of it, PA 6.250000 and PB 3.750000. Two years of spend give NOC a carried cost:

| year | carried cost | who pays it |
| --- | --- | --- |
| 2027 | 16400000.000000 | EKO, PA and PB, in their carry shares |
| 2028 | 12000000.000000 | EKO, PA and PB, in their carry shares |

The carried cost totals 28400000.000000. NOC's share of entitlement is 0.000000 until 2030, so nothing is recovered in the first three years.

## The terms a carry needs

A recovery ledger cannot be written until the contract states four things: the uplift (none, a compound rate or a multiple), the share of the carried party's entitlement that the recovery may take, the basis (a contract's terms or PIA 2021 s.85(4)), and any cap. The engine holds none of them. A carry with no uplift stated is refused by name:

> uplift must be an object { type } with type "none", "compound" or "multiple" (no default); got nothing

So is a carry recovery that names a party no carry covers:

> carried must be the carried party of one of the carries (NOC); got "PA"

## Reading the ledger

Each year's row runs from left to right: the opening balance, the uplift on it, the year's carried cost, the amount due, the carried party's share of entitlement, the part of it available to the recovery, the amount recovered, the closing balance, anything written off, and what the carried party keeps. The cash flow by party and each party's NPV sit below the ledger; discounting belongs to the cash flow course, and this course quotes an NPV only with its rate and base year.

## Exercise

Work in the course's own recovery calculator, view "A carry and its recovery".

1. Start from "The Ekene carry, compound uplift". Read the carried cost in the 2027 and 2028 rows and the tile "Carried cost", and check them against the table above.
2. In the table of cash flows by year and party, check that NOC's cost paid is 0.000000 in 2027 and 2028, while EKO, PA and PB pay the whole of each year's cost between them.
3. With the control "Uplift (stated)", choose "not stated" and read the refusal. Restore the compound uplift.
4. In the box, change `carried` to `"PA"` and read the refusal.
