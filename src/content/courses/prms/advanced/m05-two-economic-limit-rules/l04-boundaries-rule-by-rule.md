# Boundaries, rule by rule

{{panel:prms-aggregation-calculator}}

Every rule in this engine has a boundary, and no boundary is global. Some are inclusive: the value at the line passes. Some are strict: the value at the line fails. A learner who assumes one convention everywhere will misread at least one of them. This lesson collects them, each with the golden cases that sit on either side.

## The table

| rule | at the boundary | one past it |
| --- | --- | --- |
| the five-year benchmark | 5 years: met (Reserves) | 6 years: not met (Contingent) |
| the economic test | undiscounted net cash flow exactly 0: not economic | above 0: economic |
| the trailing trim | last year exactly 0: kept | one barrel less: cut |
| the two limit rules | agree: a result | late dip not offset: refused |
| the licence | the expiry year kept | later years beyond the licence |
| retention, PIA 2021 s.78(9) | 10 years: inside | 11 years: ended |
| the field development plan, s.79(1) | 2 years: inside | later: passed |
| a chance of geologic discovery of 0 | Pc 0, still Prospective | |
| equal estimates | one value; a constant in aggregation | |
| correlation | 0.999 accepted | 1 refused |
| the reconciliation tolerance | a difference equal to the tolerance: closes | above it: does not close |

## Inclusive and strict

The five-year benchmark of PRMS 2.1.2.3 is a recommended benchmark in SPE-PRMS 2018 (June 2018; CC BY-NC-ND 4.0), and the engine reads it as met at five years exactly. That is a stated reading, verbatim:

> time-frame: development starts within 5 years against the 5-year benchmark: met (PRMS 2.1.2.3)

The economic test is strict. An undiscounted net cash flow of exactly 0 is not economic, and the engine's basis states the test as above 0:

> SPE-PRMS 2018 (June 2018, v1.03 with the 2022 errata; CC BY-NC-ND 4.0, cited by section): 3.1.2.1 (undiscounted cumulative net cash flow above 0, ADR included), 3.1.2.8

The trailing trim is inclusive at 0: a last year whose revenue less royalty less opex is exactly 0 is kept. The reconciliation tolerance is inclusive too: a difference equal to the tolerance closes. Each of those is a reading the engine states, and each has an alternative it names, taught in the lessons that own it.

## Legal boundaries

Two boundaries come from Nigerian law, cited by section. The Petroleum Industry Act 2021 (Official Gazette No. 142, Vol. 108, 27 August 2021) lets a licensee retain a significant discovery area for at most 10 years from the declaration (s.78(9)), and asks for a field development plan within 2 years of a commercial discovery declaration (s.79(1)). The engine prints these as notes beside the PRMS class. They never change the class.

## Refusals at the edge

The correlation boundary is a refusal: 0.999 is accepted, and 1 is refused because the canonical sampler takes a correlation strictly between -1 and 1. A matrix that is not positive semidefinite is refused as well. The two limit rules have a boundary of their own: where they agree the engine answers, and where a late dip is not offset it refuses and names both years.

## Why they differ

No text fixes all of these boundaries one way. Where a text fixes the side of the line, the engine follows it. Where it leaves room, the engine states its choice and the alternative. A figure that sits exactly on a boundary is therefore quoted with the rule that placed it, and no graded figure in this course sits on a boundary whose reading is contested.

## Exercise

Open the aggregation calculator on the view "The economic limit: the two rules" and start from "A last year at exactly 0", then "A last year one barrel short", and read each limit year. Switch to the view "Reconciliation" and open "A difference equal to the tolerance" and "A difference above the tolerance", reading the Closes tile on each. Then open the view "The readings the engine states" and match each reading on it to a row of the table above.
