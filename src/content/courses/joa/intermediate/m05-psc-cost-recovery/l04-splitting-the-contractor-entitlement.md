# Splitting the contractor entitlement between partners

{{panel:joa-recovery-calculator}}

A production sharing contract names one contractor, but the contractor is often a group of partners under a joint operating agreement. The PSC decides what the group receives; the joint operating agreement decides how the group shares it and its costs. This lesson joins the two on the Ekene PSC variant.

## The split, in the engine's words

The engine's basis, verbatim:

> the contractor entitlement and the costs are split by participating interest with calculatePartnerCosts from engines/economics/afe.js

It is the same canonical function that splits every joint account amount in this course. The Ekene PSC variant states no carry, so each partner's paying interest equals its participating interest here: EKO 40.000000, PA 25.000000, PB 15.000000 and NOC 20.000000. Each partner's net in a year is its share of the contractor entitlement less its share of the year's capex and opex.

## The Ekene partners, year by year

| year | EKO net | PA net | PB net | NOC net |
| --- | --- | --- | --- | --- |
| 2029 | -112000000.000000 | -70000000.000000 | -42000000.000000 | -56000000.000000 |
| 2030 | 18677800.000000 | 11673625.000000 | 7004175.000000 | 9338900.000000 |
| 2031 | 44010020.000000 | 27506262.500000 | 16503757.500000 | 22005010.000000 |
| 2037 | 10861809.000000 | 6788630.625000 | 4073178.375000 | 5430904.500000 |

In 2029 there is no revenue and 280000000.000000 of capex, so every partner's net is its share of that cost: EKO's is 40.000000 percent of it, -112000000.000000. In 2030 the contractor entitlement of 156694500.000000 less the year's capex and opex leaves the group a positive net, and EKO's share of it is 18677800.000000. Each column is the same fraction of the group's net in every year, because the split never changes.

## What each partner's stream is worth

The engine discounts each partner's stream with the canonical npv of the cash flow engine. At a discount rate of 0.100000 to a base year of 2029:

| partner | NPV |
| --- | --- |
| EKO | 53034092.139510 |
| PA | 33146307.587194 |
| PB | 19887784.552316 |
| NOC | 26517046.069755 |

Each NPV is quoted with its rate and base year, because both are stated inputs. Discounting itself is the cash flow course's subject, and this course does not re-derive it.

## A year's own profit share

The contractor's profit share applies to every year unless a year states its own. The engine's basis, verbatim:

> contractorProfitSharePct applies to every year that does not state its own (a year's own figure carries a sliding scale, e.g. by daily rate or R-factor, computed outside)

A sliding scale is computed outside the engine and typed in year by year; the published IMF schedule in the next module states its shares that way. A year's figure must be a percentage:

> years[0].contractorProfitSharePct must be a number from 0 to 100; got 120

## Exercise

Work in the course's own recovery calculator, view "PSC cost recovery", starting from "The Ekene PSC variant".

1. Find the partner table under the year table and check the 2029, 2030 and 2031 rows against the table above.
2. Check that EKO's 2030 net is 40.000000 percent of the group's 2030 entitlement less its capex and opex.
3. Read each partner's NPV. Then lower `discountRate` in the box to a rate of your own and say which way every NPV moved.
4. In the box, add `"contractorProfitSharePct": 50` to the 2031 year. Read the 2031 row and check that no other year changed its share. Then add `"contractorProfitSharePct": 120` to the 2029 year and read the refusal.
